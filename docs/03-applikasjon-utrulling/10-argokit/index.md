# 🦑 ArgoKit
_Verktøyet for å rulle ut applikasjoner på en enkel og smidig måte_

<div style={{ margin: '0 auto 2rem auto', maxWidth: '300px' }}>
  <img src="https://github.com/kartverket/argokit/raw/main/logo.png" alt="ArgoKit Logo" width="100%" />
</div>

## Introduksjon

Velkommen til ArgoKit! Her får du en introduksjon til hva ArgoKit er, og hvorfor det er nyttig ved utrulling av applikasjoner. Du bør helst allerede ha lest om utrulling til SKIP ved hjelp av Skiperator og Argo CD. Hvis ikke anbefales følgende ressurser først:

- [Argo CD-dokumentasjon](../09-argo-cd/index.md)
- [Skiperator](https://skip.kartverket.no/docs/applikasjon-utrulling/skiperator)
- [SKIP – kom i gang](https://skip.kartverket.no/docs/kom-i-gang)

Skiperator støtter både YAML og JSON. I Kartverket brukes ofte [Jsonnet](https://jsonnet.org), et konfigurasjonsspråk som utvider JSON med funksjoner, uttrykk og mulighet for gjenbruk. Jsonnet reduserer duplisering og gjør komplekse manifest enklere å vedlikeholde.

ArgoKit tilbyr et sett med gjenbrukbare Jsonnet-maler (bibliotek) som gjør det raskere og mer konsistent å definere Skiperator-applikasjoner. Under ser du to eksempler som genererer identisk manifest,først en «rå» Jsonnet-funksjon, deretter en som bruker ArgoKit sine byggesteiner.
## Eksempler
### Uten ArgoKit-maler

```jsonnet
function(name='foo-frontend', env, version, CLIENT_ID) [
  {
    apiVersion: 'skiperator.kartverket.no/v1alpha1',
    kind: 'Application',
    metadata: {
      name: name,
    },
    spec: {
      image: version,
      port: 3000,
      ingresses: ['foo.example-' + env + '.cloud.com'],
      accessPolicy: {
        outbound: {
          rules: [
            { application: 'foo-backend' },
          ],
          external: [
            { host: 'graph.microsoft.com' },
            { host: 'login.microsoftonline.com' },
          ],
        },
      },
      env: [
        { name: 'CLIENT_ID', value: CLIENT_ID },
        { name: 'AUTHORITY', value: 'https://login.microsoftonline.com/abcdefg' },
        { name: 'LOGIN_REDIRECT_URI', value: 'https://foo.example-' + env + '.cloud.com' },
        { name: 'BACKEND_URL', value: 'https://api.foo.example-' + env + '.cloud.com' },
        { name: 'FRONTEND_URL', value: 'https://frontend.example-' + env + '.cloud.com' },
        {
          name: 'SERVICE_CLIENT_ID',
          value:
            if env == 'dev' then 'abcdefg'
            else if env == 'prod' then 'hijklmnop',
        },
      ],
    },
  },
]
```

### Med ArgoKit-maler

```jsonnet
local argokit = import '../../jsonnet/argokit.libsonnet';
local app = argokit.appAndObjects.application;

function(name='foo-frontend', env, version, CLIENT_ID)
  app.new(name, version, 3000)
  + app.withOutboundSkipApp('foo-backend')
  + app.withOutboundHttp('graph.microsoft.com')
  + app.withOutboundHttp('login.microsoftonline.com')
  + app.forHostnames('foo.example-' + env + '.cloud.com')
  + app.withVariable('CLIENT_ID', CLIENT_ID)
  + app.withVariable('AUTHORITY', 'https://login.microsoftonline.com/abcdefg')
  + app.withVariable('LOGIN_REDIRECT_URI', 'https://foo.example-' + env + '.cloud.com')
  + app.withVariable('BACKEND_URL', 'https://api.foo.example-' + env + '.cloud.com')
  + app.withVariable('FRONTEND_URL', 'https://frontend.example-' + env + '.cloud.com')
  + app.withVariable(
      'SERVICE_CLIENT_ID',
      if env == 'dev' then 'abcdefg'
      else if env == 'prod' then 'hijklmnop'
    )
```

Begge disse eksemplene rendrer ut samme JSON-manifest som er godkjent av Skiperator. Den siste bruker ArgoKit sine gjenbrukbare maler i mye større grad enn det første. Dette gjør filen mere lesbar og lar deg lettere legge til flere spesifikasjoner og resursser.

## Oversikt over annen dokumentasjon du finner her

| **Tema** | **Side** | **Informasjon** |
|----------|----------|-----------------|
| Installasjon | [ArgoKit/Installasjon](./01-installation-guide.md) | Hvordan installere og oppdatere ArgoKit |
| Komme i gang med ArgoKit | [ArgoKit/komme-i-gang](./02-getting-started.md) | Hvordan komme i gang med ArgoKit, mend vanlige eksempler og bruk|
| AppAndObjects konseptet | [ArgoKit/AppAndObjects](./03-appAndObjects.md) | Informasjon om ArgoKit sin appAndObjects bruk|
| ArgoKit V1 API Reference  | [ArgoKit/ArgoKit V1](./08-argokit-v1.md) | Informasjon om ArgoKit V1 sine templates|
| ArgoKit V2 API Reference | [ArgoKit/ArgoKit V2](./09-argokit-v2.md) | Informasjon om ArgoKit V2 sine templates|
