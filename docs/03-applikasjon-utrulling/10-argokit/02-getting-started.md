# Kom i gang med ArgoKit

### Installer ArgoKit i ditt apps reop
Om du ikke har installert argokit enda, ser du hvordan [her](./01-installation-guide.md)!


### Importer ArgoKit V2
Import path er relativ til hvord du befinner deg i koden.
```jsonnet
local argokit = import '../argokit/v2/jsonnet/argokit.libsonnet';
```

### Definer en applikasjon

Lag en ny Skiperator-applikasjon med ArgoKit `appAndObjects`-abstraksjonen:

*Tips! Lag en ny variabel for application for å få kortere uttrykk.*
```jsonnet
local application = argokit.appAndObjects.application;

application.new('app-name', 'test-image', 3000)
```

🎉 Sånn! Der har du en minimal applikasjon som kan kjøres på SKIP!

🤔 Lurer du på om manifestet ditt er gyldig? [Installer skipctl](https://skip.kartverket.no/docs/applikasjon-utrulling/skipctl/get-started) og kjør:
```shell
skipctl manifests validate --path=<ditt-manifest.jsonnet>
```
så slipper du å lure. 😎


---
## Bygge spec-en
### Miljøvariabler
Med ArgoKit kan du legge til variabler med `withEnvironmentVariable` funksjonen
```jsonnet
application.new('app-name', 'test-image', 3000)
+ application.withEnvironmentVariable('NAME', value)
```

Du kan også legge til miljøvariabler fra secrets:
```jsonnet
application.new('app-name', 'test-image', 3000)
+ application.withEnvironmentVariablesFromSecret('API_KEY', 'secretRef')
```


### Access Policies
Det finnes en rekke funksjoner for å sette access policies i ArgoKit,
her kan vi sette opp tilgang til en Postgres-database fra en SKIP-app:

```jsonnet
application.new('app-name', 'test-image', 3000)
+ application.withOutboundPostgres(host='database-host.com', ip='10.0.0.1')
+ application.withInboundSkipApp(appname='other-app', namespace='other-namespace')
```

### Ingress
Konfigurering av ingress gjøres slik:
```jsonnet
application.new('app-name', 'test-image', 3000)
+ application.forHostnames('public-api-url.com')
```


### Replicas
Replicas settes enkelt opp slik:
```jsonnet
application.new('app-name', 'test-image', 3000)
+ application.withReplicas(initial=2, max=10)
```

### Probes
Probes for startup, liveness og readiness legges til slik:
```jsonnet
local livenessProbe = application.probe(
  path='/health',
  port=8080,
  failureThreshold=5,
  timeout=0,
  initialDelay=5
);

local readinessProbe = application.probe(path='/health', port=8080);

application.new('app-name', 'test-image', 3000)
+ application.withLiveness(livenessProbe)
+ application.withStartup(livenessProbe)
+ application.withReadiness(readinessProbe)
```

---
## Legge til flere ressursser

### Azure AD Application
Azure AD kan legges til slik, dette vil
legge AzureAdApplication til som en kubernetes ressurss i manifestet
ditt, i tillegg til å legge til access policies og en secret i applikasjonen din.
```jsonnet
application.new('app-name', 'test-image', 3000)
+ application.withAzureAdApplication(
  name='app-name-ad',
  namespace='team-namespace',
  groups=['12345-12345-12345-12345'],
  logoutUrl='some-url.com',
)
```
