# Hente hemmeligheter fra hemmelighetshvelv

![Secrets](images/556138500.png)
De aller fleste applikasjoner har hemmeligheter den trenger å få tilgang til. Dette kan for eksempel være API-nøkler og passord til databaser. Disse skal lagres på en forsvarlig måte i et hemmelighetshvelv, og dette er beskrevet i sikkerhetshåndboka under [Hemmeligheter](https://kartverket.atlassian.net/wiki/spaces/SIK/pages/499351621/Hemmeligheter) . Når hemmelighetene da ligger i hvelvet kommer spørsmålet om hvordan applikasjonen skal få tak i dem, og det er der ExternalSecrets kommer inn.

External Secrets Operator (ESO) er en operator som kjører i clusteret og har evnen til å hente hemmeligheter fra hvelv som Vault og Google Secret Manager (GSM). Disse blir synkronisert fra hvelvet til kubernetes secrets som kan mountes inn i podder. Synkroniseringen beskrives som en “fra-til” konfigurasjon hvor man sier hvor hemmelighetene ligger og hvordan de skal se ut når de er synkronisert til Kubernetes.

:::info
Merk at External Secrets brukes til **deploy-time** uthenting av hemmeligheter. Hvis du har en applikasjon som kjører og skal bruke hemmeligheter **runtime** bør du ikke bruke External Secrets og heller bruke biblioteker som [https://spring.io/projects/spring-cloud-gcp](https://spring.io/projects/spring-cloud-gcp). Se [Oppsett og bruk av Secret Manager](/docs/gcp/oppsett-og-bruk-av-secret-manager).
:::

Mer om external secrets finnes på [https://external-secrets.io/v0.7.2/](https://external-secrets.io/v0.7.2/) .

## Hvordan bruke External Secrets

ESO lytter i clusteret etter [ExternalSecret](https://external-secrets.io/v0.7.2/api/externalsecret/) - og [SecretStore](https://external-secrets.io/v0.7.2/api/secretstore/) -manifester. I det øyeblikket disse blir plukket opp blir de lest som konfigurasjon for ESO og en synk mot hvelvet starter som vil ende opp med å opprette en Kubernetes Secret. Kubernetes Secreten vil også synkroniseres regelmessig slik at man kan f.eks. rullere hemmeligheter ved å endre dem i hvelvet.

## SecretStore

SecretStore-manifestet definerer et hvelv, slik som Vault eller GSM, og må settes opp først. Denne konfigurasjonen vil også inneholde hvordan ESO skal autentisere seg og kan gjenbrukes av flere ExternalSecret-manifester. Disse settes typisk opp av et produktteam for deres namespace for å definere hvor de har lagret sine hemmeligheter.

Se [GCPSMProvider](https://external-secrets.io/v0.7.2/api/spec/#external-secrets.io/v1beta1.GCPSMProvider) for alle gyldige verdier.

```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: gsm
spec:
  provider:
    gcpsm:
      projectID: <YOUR_PROJECT_ID>
```

For at det skal være lov å hente ut secrets må i tillegg følgende gjøres:

1. Man må gå inn på secreten som skal eksponeres til ESO og gi rollen `roles/secretmanager.secretAccessor` til servicekontoen:

    - Dev - `eso-secret-accessor@skip-dev-7d22.iam.gserviceaccount.com`
    - Prod - `eso-secret-accessor@skip-prod-bda1.iam.gserviceaccount.com`

2. Namespacene dere oppretter må allowlistes for å kunne hente ut fra prosjektene deres, kontakt SKIP så setter vi `skip.kartverket.no/gcpProject` på prosjektene deres og synkroniserer Argo på nytt

### ExternalSecret

Når man har definert et hemmelighetshvelv med SecretStore kan man definere hvilke hemmeligheter som skal hentes ut. Dette gjøres med ExternalSecret-manifestet. ExternalSecret-manifestet vil referere til et SecretStore for å definere backenden og bruker autentiseringen derfra. ESO vil bruke dette manifestet til å hente ut de definerte feltene fra den gitte hemmeligheten og putte dem inn i en Kubernetes Secret i det formatet som blir spesifisert. Det betyr at man kan mappe om verdier fra et felt til et annet, for eksempel om man skal uppercase navnene når man bruke dem som miljøvariabler.

I eksempelet under vises hvordan man synker inn enkeltverdier til Kubernetes. Det er også mulig å synke alle nøklene i en secret som dokumentert i [All keys, One secret](https://external-secrets.io/v0.7.2/guides/all-keys-one-secret/) .

Det er også mulig å bruke templates som dokumentert i [Advanced Templating](https://external-secrets.io/v0.7.2/guides/templating/) .

Se [ExternalSecret](https://external-secrets.io/v0.7.2/api/spec/#external-secrets.io/v1beta1.ExternalSecret) for alle gyldige verdier.

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: dbpass
spec:
  # A list of the remote secrets to sync
  data:
  - remoteRef:
      # The name of the secret in the GCP project
      key: db-pass
    # Will be written into the Kubernetes secret under this key
    secretKey: DB_PASSWORD

  # Refresh the secret every hour
  refreshInterval: 1h

  # Uses the gsm secret backend
  secretStoreRef:
    kind: SecretStore
    name: gsm

  # Creates a kubernetes secret named dbpass
  target:
    name: dbpass
```

Se også [Get all keys from one GSM secret](https://external-secrets.io/v0.8.1/guides/all-keys-one-secret/)

### Mounting av hemmelighet

Når ESO har synkronisert inn hemmeligheten og opprettet en Kubernetes Secret er det ofte slik at man ønsker å bruke dette i en Pod. Vanligvis gjennom å mounte dette som miljøvariabler eller som en fil på filsystemet, eksempelvis for sertfikater. Bruker man Skiperator er dette veldig rett frem.

Se også [Using Secrets as files from a Pod](https://kubernetes.io/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod) og [Using Secrets as environment variables](https://kubernetes.io/docs/concepts/configuration/secret/#using-secrets-as-environment-variables) , men merk at spec er annerledes med Skiperator.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: teamname-frontend
spec:
  # Each key will be set as an env var with its value as the value
  envFrom:
  - secret: dbpass

  # Each key will be created as a file with the key as filename and value as content
  filesFrom:
  - secret: dbpass
    mountPath: /var/run/secret
```

### Hva hindrer andre å hente min hemmelighet?

Med External Secrets gis en sentral servicekonto tilgang til å hente ut hemmelighetene i GSM. Man skulle derfor tro at det var mulig for andre som bruker den samme servicekontoen å hente ut hemmeligheten. Det er ikke tilfellet og er løst med andre policies i clusteret.

Ditt team oppretter en SecretStore, og det finnes policies i clusteret som sørger for at kun prosjekter som dere eier kan knyttes opp her. SecretStore-en er det som brukes for å hente fra GCP. Dermed er det kun prosjektet som ligger her som kan hentes fra, og kun ditt team som kan hente fra ditt prosjekt.
