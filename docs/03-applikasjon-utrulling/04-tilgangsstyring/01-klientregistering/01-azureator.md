# 🤖 Azureator

Azurerator er en Kubernetes-operator utviklet av [NAIS](https://nais.io/) for å automatisere registrering og forvaltning av Microsoft Entra ID applikasjoner. Azureator forenkler prosessen med å opprette og administrere app-registreringer i Microsoft Entra ID, og muliggjør sømløs integrasjon mellom Kubernetes-administrerte applikasjoner på SKIP og applikasjoner i Entra ID.

## Introduksjon

Azurerator introduserer en ny Kubernetes Custom Resource Definition (CRD) kalt `AzureAdApplication` (`azureapp`). Ved å definere ressurser av denne typen kan brukere deklarativt administrere Entra ID applikasjoner direkte fra SKIP. Azureator overvåker disse ressursene og sikrer at de tilsvarende Entra ID app-registreringene blir opprettet, oppdatert eller slettet i henhold til manifestet.

## Feltene i `AzureAdApplication`

Nedenfor er en detaljert oversikt over strukturen i `azureapp`-spesifikasjonen, inkludert felt, deres typer og beskrivelser:

- **spec** (object) Spesifikasjonen til `azureapp`.
  - **allowAllUsers**: *(bool, påkrevd)* Angir om alle brukere i Entra ID-tenanten skal ha tilgang til applikasjonen.
    - **claims**: *(object, optional)* Definerer ­konfigurasjon av claims som inkluderes i tokenene som returneres til Entra ID applikasjonen.
      - **groups**: *([]object)* En liste over Entra ID gruppe ID-er som skal inkluderes i `groups`-claimet i tokenene utstedt av Entra ID. Dette tildeler også grupper til app-registreringen brukt for tilgangskontroll. Kun direkte medlemmer av gruppene får tilgang.
        - **id**: *(string)* Objekt ID-en (OID) til en Entra ID-gruppe.
    - **logoutUrl**: *(string, optional)* URL-en brukere blir omdirigert til når de logger ut av applikasjonen.
    - **preAuthorizedApplications**: *([]object, optional)* Definerer andre app-registreringer som er forhåndsautorisert til å få tilgang til denne applikasjonen. Her refereres det til tilsvarende `azureapp`.
      - **application**: *(string)* Navnet på `azureapp`.
      - **namespace**: *(string)* Namespacet der `azureapp` hører hjemme.
      - **cluster**: *(streng)* Clusteret der `azureapp` hører hjemme.
      - **permissions**: *(object, optional)* Spesifiserer hvilke claims den forhåndsautoriserte applikasjonen har.
        - **scopes**: *([]string)* Liste med egendefinerte tilgangs-scopes tildelt til den forhåndsautoriserte appliaksjonen.
          - **roles**: *([]string)* Liste med egendefinerte tilgangs-roller tildelt til den forhåndsautoriserte appliaksjonen.
  - **replyUrls**: *([]object, optional)* URL-er som applikasjonen godtar som svaradresser etter autentisering.
    - **url**: *(string)* En godkjent svaradresse (reply URL) for applikasjonen.
  - **secretName**: *(string, optional)* Navnet på Kubernetes-hemmeligheten der hemmeligheter og annen informasjon for Entra ID applikasjonen lagres.
  - **secretKeyPrefix**: *(string, optional)* Et valgfritt brukerdefinert prefiks som brukes på nøklene i den genererte hemmeligheten, og erstatter standardprefikset (AZURE).
  - **secretProtected**: *(bool, optional)* Angir om hemmeligheten skal tilbaketrekkes selv når den ikke er i bruk.
  - **singlePageApplication**: *(bool, optional)* **A**ngir om denne Entra ID-applikasjonen skal registreres som en single-page-application for bruk i klient-side-applikasjoner uten tilgang til hemmeligheter.

### 🚨NB🚨 - tenant

Feltet **tenant** støttes også av `azureapp`-spesifikasjonen, men ikke på SKIP. Det er fordi Azurerator på SKIP er hardkodet til å gå mot default-tenanten til Kartverket.

## Eksempel

App-registreringer opprettet med Azureator følger følgende navnekonvensjon basert på `AzureAdApplication`-manifestet: `cluster:namespace:name`.

Følgende eksempel er et YAML-manifest som oppretter app-registreringen `atgcp1-prod:test-namespace:test-app`:

```yaml
apiVersion: nais.io/v1
kind: AzureAdApplication
metadata:
  name: test-app
  namespace: test-namespace
spec:
  allowAllUsers: true
  claims:
  groups:
    - id: 2720e397-081d-4d9b-852e-0d81f45a304f
    - id: c3c94454-aefc-44f9-9076-58ea47547941
  logoutUrl: https://test-app.atgcp1-prod.kartverket-intern.cloud/logout
  preAuthorizedApplications:
    - application: other-app
      namespace: other-namespace
      cluster: other-cluster
      permissions:
        scopes:
          - scope1
        roles:
          - appRole1
  replyUrls:
    - url: https://test-app.atgcp1-prod.kartverket-intern.cloud/oauth2/callback
  secretName: azuread-secret
  secretKeyPrefix: "RANDOM"
  secretProtected: false
  singlePageApplication: false
```

Resultatet er følgende Kubernetes-hemmelighet som holder på informasjon som kan brukes for autentisering og autorisering opp mot den registrerte Entra ID-applikasjonen:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: azuread-secret
  namespace: test-namespace
data:
  RANDOM_APP_CERTIFICATE_KEY_ID: ++++++++
  RANDOM_APP_CLIENT_ID: ++++++++
  RANDOM_APP_CLIENT_SECRET: ++++++++
  RANDOM_APP_JWK: ++++++++
  RANDOM_APP_JWKS: ++++++++
  RANDOM_APP_NEXT_CERTIFICATE_KEY_ID: ++++++++
  RANDOM_APP_NEXT_CLIENT_SECRET: ++++++++
  RANDOM_APP_NEXT_JWK: ++++++++
  RANDOM_APP_NEXT_PASSWORD_KEY_ID: ++++++++
  RANDOM_APP_PASSWORD_KEY_ID: ++++++++
  RANDOM_APP_PRE_AUTHORIZED_APPS: ++++++++
  RANDOM_APP_TENANT_ID: ++++++++
  RANDOM_APP_WELL_KNOWN_URL: ++++++++
  RANDOM_OPENID_CONFIG_ISSUER: ++++++++
  RANDOM_OPENID_CONFIG_JWKS_URI: ++++++++
  RANDOM_OPENID_CONFIG_TOKEN_ENDPOINT: ++++++++
type: Opaque
```
