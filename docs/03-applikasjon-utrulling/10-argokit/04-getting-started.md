# Kom i gang med Argokit

### Installer argokit i ditt apps reop
Argokit installeres som en submodul i apps-repo slik:
```shell
git submodule add https://github.com/kartverket/argokit.git
```

Dersom du har klonet et apps-repo med argokit allerede installert (med vanlig git clone),
må du kjøre følgende kommando for å få argokit koden:
```shell
git submodule update --init --recursive
```

### Importer argokit
Import path er relativ til hvord du befinner deg i koden.
```jsonnet
local argokit = import '../argokit/jsonnet/argokit.libsonnet';
```

### Definer en applikasjon

Lag en ny skiperator applikasjon med argokit appAndObjects:

*Tips! Lag en ny variabel for application for å få kortere uttrykk.*
```jsonnet
local application = argokit.appAndObjects.application;

application.new('app-name') {
  spec: {
    port: 3000,
    image: 'test-image'
  }
}
```

🎉 Sånn! Der har du en minimal applikasjon som kan kjøres på skip!

🤔 Lurer du på om manifestet ditt er gyldig? [Installer skipctl](https://skip.kartverket.no/docs/applikasjon-utrulling/skipctl/get-started) og kjør:
```shell
skipctl manifests validate --path=<ditt-manifest.jsonnet>
```
så slipper du å lure. 😎


---
## Bygge spec-en
### Miljøvariabler
Med argokit kan du legge til variabler med `withVariable` funksjonen
```jsonnet
application.new('app-name')
+ application.withVariable('NAME', value)
```

Du kan også legge til miljøvariabler fra secrets:
```jsonnet
application.new('app-name')
+ application.withVariableSecret('API_KEY', 'secretRef')
```


### Access Policies
Det finnes en rekke funksjoner for å sette access policies i argokit,
her kan vi sette tilgang ut til en postgres database og inn fra en
annen skip app slik.
Her finner du oversikt over disse funksjonene: // TODO link til referanse
```jsonnet
application.new('app-name')
+ application.withOutboundPostgres(host='database-host.com', ip='10.0.0.1')
+ application.withInboundSkipApp(appname='other-app', namespace='other-namespace')
```

### Ingress
Konfigurering av ingress gjøres slik:
```jsonnet
application.new('app-name')
+ application.forHostnames('public-api-url.com')
```


### Replicas
Replicas settes enkelt opp slik:
```jsonnet
application.new('app-name')
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

application.new('app-name')
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
application.new('app-name')
+ application.withAzureAdApplication(
  name='app-name-ad',
  namespace='team-namespace',
  groups=['12345-12345-12345-12345'],
  logoutUrl='some-url.com',
)
```
