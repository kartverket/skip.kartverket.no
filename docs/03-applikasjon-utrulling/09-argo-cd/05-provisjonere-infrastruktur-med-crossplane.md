# Provisjonere infrastruktur med Crossplane

:::note
Denne siden er et utkast og vil kunne forandre seg
:::

![Crossplane car](images/556630024.png)

Når man deployer en applikasjon til SKIP er det også tilfeller hvor man ønsker å provisjonere infrastruktur. For eksempel kan dette være å opprette servicekontoer i GCP, lage hemmeligheter i Secret Manager eller sette opp tjenester som PubSub. Dette er noe som tidligere har vært gjort med Terraform, og det er fremdeles mulig å gjøre, men med GitOps finnes det enklere måter å gjøre det på slik at man ikke trenger å kjøre en egen GitHub Action for terraform-jobben.

På SKIP har vi satt opp noe som heter [https://www.crossplane.io/](https://www.crossplane.io/) . Crossplane er kort sagt en måte å provisjonere infrastruktur på samme måte som man deployer applikasjoner, med deklarative manifest-filer. Med Crossplane kan man for eksempel opprette databaser, lagringsbøtter eller Servicekontoer i GCP ved å legge inn en fil i [apps-repoet](02-hva-er-et-apps-repo.md) sitt.

Se også [https://docs.crossplane.io/v1.11/getting-started/introduction/](https://docs.crossplane.io/v1.11/getting-started/introduction/) for et dypdykk i hvordan Crossplane fungerer og er nyttig lesestoff når man kommer i gang.

:::info
Crossplane er ganske nytt og å ta dette i bruk vil kreve samarbeid med SKIP-teamet
:::

![Crossplane diagram 01](images/556433430.png)

Crossplane er ganske fleksibelt. SKIP kan for eksempel lage komposisjoner av flere ressurser som gjør at ting som f.eks. brannveggregler kan settes opp automatisk når man lager en Cloud SQL-instans. Man kan også bruke de innebygde ressursene i [GCP provideren](https://marketplace.upbound.io/providers/upbound/provider-gcp/v0.28.0/crds) direkte, og det anbefales å bli kjent med den provideren.

## Hvordan komme i gang

La oss si vi har en applikasjon som er deployed med Argo CD og vi ønsker å sette opp en database for denne applikasjonen med Cloud SQL. Da vil vi ha en mappestruktur i vårt [apps-repo](02-hva-er-et-apps-repo.md) som ser slik ut:

```none
dev/
  namespace/
    app.yaml # Skiperator-manifest for applikasjonen
    db.yaml  # Crossplane-manifester for databasen på GCP
```

Det første steget er å få autentisert mot GCP slik at Crossplane får tilgang til å opprette ressurser i prosjektet deres. Dette gjøres ved å kontakte SKIP og få lagt inn mapping for prefikset deres i [skip-apps](https://github.com/kartverket/skip-apps/blob/main/lib/argocd/argocd.libsonnet) .

Deretter kan man opprette ressurser som er støttet av SKIP dokumentert lenger ned. Crossplane støtter mye mer, se CRD-er i [GCP provideren](https://marketplace.upbound.io/providers/upbound/provider-gcp/v0.28.0/crds) , men det må lages støtte for disse, se “Tilgang til ressurser”.

For å provisjonere opp ressurser oppretter produktteamet manifester på Kubernetes som blir lest av Crossplane. Et eksempel på å opprette lagring (bucket).

```yaml
apiVersion: skip.kartverket.no/v1alpha1
kind: BucketInstance
metadata:
  name: my-bucket
spec:
  parameters:
    bucket:
      name: dsa-test-bucket-123
    serviceAccount:
      name: crossplane-test
      displayName: Testing Crossplane Integration
```

Etter dette er lagt ut vil man kunne se status på crossplane ressursene som et hvilket som helst annen kubernetes-ressurs.

```bash
kubectl get bucketinstance
```

Man kan også bruke `kubectl describe` for å hente ut events på disse ressursene. Events sier mer om hva som skjer og er nyttig til feilsøking.

Mer om feilsøking finnes på [https://docs.crossplane.io/knowledge-base/guides/troubleshoot/](https://docs.crossplane.io/knowledge-base/guides/troubleshoot/) .

## Støttede ressurser

Følgende ressurser er støttet for å provisjoneres med Crossplane i dag:

- [Buckets (Lagring i Google Cloud Storage)](https://github.com/kartverket/skip-apps/blob/main/bases/universal-crossplane/resources/bucket-example.yml)
- [GCP Service Accounts](https://github.com/kartverket/skip-apps/blob/main/bases/universal-crossplane/resources/service-account-example.yml)
- [Bucket Access (Kubernetes SA to Bucket)](https://github.com/kartverket/skip-apps/blob/main/bases/universal-crossplane/resources/bucket-access-example.yml)
- [Workload Identity (Kubernetes SA to GCP SA)](https://github.com/kartverket/skip-apps/blob/main/bases/universal-crossplane/resources/workloadidentity-example.yml)

## Oppsett

For å komme i gang med Crossplane må du gjøre noe setup. Alle produktteam får automatisk opprettet en servicekonto på GCP som vil brukes av Crossplane til å autentisere mot GCP, og for at Crossplane skal få brukt denne må det ligge en secret i namespacet deres. For å få inn denne kan dere opprette en secret ved hjelp av en ExternalSecret (se [Hente hemmeligheter fra hemmelighetshvelv](04-hente-hemmeligheter-fra-hemmelighetsvelv.md)) som kopierer hemmeligheten fra Google Secret Manager inn i Kubernetes. Dette må dere sette opp for hvert prefiks i `<prefix>-main` mappen deres i apps-repoet:

```yaml
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: crossplane-secret
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: gsm
    kind: SecretStore
  target:
    name: crossplane-secret
  data:
  - secretKey: creds
    remoteRef:
      conversionStrategy: Default
      decodingStrategy: None
      key: crossplane-credentials
      metadataPolicy: None
```

SKIP setter automatisk opp en ProviderConfig når man får knyttet sitt prefix i Argo CD mot GCP. Denne forutsetter en secret i `-main` namespacet deres som heter `crossplane-secret` . Hvis ikke denne secreten blir plukket opp så hør med SKIP om knytningen til GCP mangler.

For øvrig må vi bruke JSON keys for GCP service kontoer her siden crossplane støtter ikke Workload Identity on-prem.

## Tilgang til ressurser

I utgangspunktet kan ikke produktteamene få tilgang til crossplane CRD-er direkte ettersom disse ikke er namespaced-ressurser og produktteamene kun har tilgang til å opprette ressurser i sitt eget namespace. Dette betyr at SKIP må opprette såkalte “Compositions” for hver ting som produktteamene skal kunne opprette gjennom Crossplane.

Dersom du som utvikler på et produktteam har et ønske om å f.eks. kunne opprette en database eller provisjonere andre ressurser gjennom Crossplane som ikke allerede er støttet må det bestilles en ny Composition fra SKIP.

For at SKIP skal opprette en ny composition må det lages en [XRD](https://github.com/kartverket/skip-apps/blob/main/bases/universal-crossplane/resources/bucket-access-xrd.yaml) og en [composition](https://github.com/kartverket/skip-apps/blob/main/bases/universal-crossplane/resources/bucket-composition.yaml) .

Se støttede ressurser over.
