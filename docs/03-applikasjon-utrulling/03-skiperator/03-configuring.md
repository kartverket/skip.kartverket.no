# Vanlig Skiperator-konfigurering

Dette er en rask referanse for de vanligste konfigureringene i Skiperator.
For en komplett referanse, se [API-dokumentasjonen](04-api-docs.md).

## Application

### Ingress

En ingress er en måte å eksponere applikasjonen din for omverdenen på. Det er en Kubernetes-ressurs som administrerer ekstern tilgang til tjenester i et cluster, vanligvis via HTTP.
Dette setter opp all nødvendig konfigurasjon i bakgrunnen for å rute trafikk til applikasjonen din, og setter også opp et Let's Encrypt-sertifikat for applikasjonen.

Enkelt eksempel på en ingress:

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: ingressapp
spec:
  image: image
  port: 8080
  routingProvider: Standard
  ingresses:
    - ingressapp.atkv3-dev.kartverket-intern.cloud
  redirectToHTTPS: true
```

Dette setter opp en ingress for applikasjonen din som kan nås fra Kartverkets interne nettverk. Feltet `redirectToHTTPS` er valgfritt og vil videresende all innkommende trafikk til HTTPS.
For å gjøre den offentlig tilgjengelig kan du fjerne `-intern`-delen av domenenavnet.

Hvis du ønsker, eller allerede har et annet domenenavn for applikasjonen din, må vi mest sannsynlig sette opp en CNAME-oppføring i DNS. Du kan lese mer om domenenavn [her](../../02-kom-i-gang/06-praktisk-intro/06-kubernetes/07-urler-og-sertifikat-for-tjenester-på-skip.md).

#### Velg routing-API

Feltet `spec.routingProvider` styrer hvilket API Skiperator bruker for ingressene. `Legacy` bruker Istio `Gateway` og `VirtualService`, `Standard` bruker Kubernetes Gateway API. Standardverdien er `Legacy`, men den blir fjernet senere, så bruk `Standard` i nye applikasjoner.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: ingressapp
spec:
  image: image
  port: 8080
  routingProvider: Standard
  ingresses:
    - ingressapp.atkv3-dev.kartverket-intern.cloud
```

Se [Migrering av ekstern trafikk](05-routing.md) for hva som skjer når du bytter, og hvilke begrensninger `Standard` har.

#### Eget sertifikat på et hostname

Skiperator utsteder Let's Encrypt-sertifikater automatisk. Trenger du et sertifikat vi ikke kan utstede, skriver du hostnamet som `hostname+secret-navn`. Secreten må ligge i namespacet `istio-gateways` og provisjoneres på forhånd. Ta kontakt med SKIP.

```yaml
  ingresses:
    - minapp.kartverket.no+minapp-tls
```

Se [Sertifikater utenfor ACME](../../02-kom-i-gang/06-praktisk-intro/06-kubernetes/08-certificates-outside-acme.md).

### Access policy (tilgangspolicy)

På SKIP kjører vi service meshet [Istio](https://istio.io/). Dette betyr at all trafikk mellom tjenester er kryptert med mTLS som standard.
All trafikk er også blokkert med nettverkspolicyer eller Istio-policyer som standard.
For å tillate trafikk mellom tjenester må du sette opp en `accessPolicy`.
Dette gjøres ved å spesifisere `spec.accessPolicy` i applikasjonen din.

#### Intern adressering mellom tjenester

Når du definerer en `Application`, får den en intern Kubernetes-adresse på formen `appnavn.namespace.svc.cluster.local`.
Du kan også bruke kortform: `appnavn.namespace`, eller bare `appnavn` hvis tjenesten ligger i samme namespace.

Når applikasjonen din kobler seg til en annen intern tjeneste i samme miljø, må du bruke riktig protokoll og porten tjenesten eksponerer (for eksempel `spec.port: 8080`).
Hvis tjenesten svarer på http, heter `my-app` og eksponerer port `8080`, kan den nås på:
- `http://my-app:8080` for en applikasjon i samme namespace.
- `http://my-app.namespace:8080` for en applikasjon i et annet namespace.

**NB**: Selv om kommunikasjonen går over `http` vil den fortsatt foregå kryptert internt mellom applikasjonene.

### Tillate kommunikasjon mellom to applikasjoner i samme namespace

Oppretter regler for å tillate trafikk mellom applikasjon `app1` og `app2` i samme namespace på tjeneste-porter.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: app1
spec:
  image: image
  port: 8080
  routingProvider: Standard
  accessPolicy:
    inbound:
      rules:
        - application: app2
    outbound:
      rules:
        - application: app2
---
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: app2
spec:
  image: image
  port: 8080
  routingProvider: Standard
  accessPolicy:
    inbound:
      rules:
        - application: app1
    outbound:
      rules:
        - application: app1
```

#### Tillate inn- og utgående trafikk til en applikasjon i et annet namespace

Oppretter nettverkspolicy-regler for å tillate innkommende og utgående trafikk på tjeneste-port til applikasjon `app2` i namespace `namespace2`.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: app1
spec:
  image: image
  port: 8080
  routingProvider: Standard
  accessPolicy:
    inbound:
      rules:
        - application: app2
          namespace: namespace2
    outbound:
      rules:
        - application: app2
          namespace: namespace2
```

#### Tillate utgående trafikk til en jobb i namespacer med en bestemt merkelapp (label)

Oppretter utgående regler for å tillate trafikk til SKIPJob-en `job2` i alle namespacer med merkelappen `team: someteam` på tjeneste-port for `app2`.
Merk at alle SKIPJob-er må ha suffikset `-skipjob` i navnet når du definerer applikasjonsnavnet i tilgangspolicyen.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: app1
spec:
  image: image
  port: 8080
  routingProvider: Standard
  accessPolicy:
    outbound:
      rules:
        - application: job2-skipjob
          namespaceByLabel: 
            team: someteam
```

#### Tilgangspolicy for å tillate trafikk til et offentlig domene

Oppretter Istio-policyer for å tillate trafikk til et offentlig domene på port 443, og et annet offentlig domene på port 80.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: app1
spec:
  image: image
  port: 8080
  routingProvider: Standard
  accessPolicy:
    outbound:
      external:
        - host: kartverket.no
        - host: google.com
          ports:
            - name: http
              port: 80  
              protocol: HTTP
```

#### Når målapplikasjonen ikke finnes

En intern `outbound`-regel henter portene fra Servicen til applikasjonen den peker på. Finnes ikke den applikasjonen ennå, får objektet ditt status `InvalidConfig` og blir ikke klart. Dette er vanlig når to team ruller ut uavhengig av hverandre.

Skiperator følger med på Servicen og kjører en ny reconcile med en gang målapplikasjonen dukker opp eller blir slettet. Du trenger ikke gjøre noe. Endrer Servicen porter, eller får et namespace en ny label som en regel velger på, oppdager Skiperator det innen fem minutter.

En `external`-regel avhenger bare av specen din, så det finnes ingenting å vente på. Da prøver ikke Skiperator på nytt, og du må rette regelen selv.

### Replicas (kopier)

Du kan enten spesifisere et fast antall replikaer (kopier) eller la autoskaleren håndtere det for deg.

Hvis det ikke er spesifisert, bruker Skiperator autoskalering som standard:

```yaml
minReplicas: 2
maxReplicas: 5
```

Statisk:

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: static-replicas
spec:
  image: image
  port: 8080
  routingProvider: Standard
  replicas: 2
```

Autoskalering:

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: auto-replicas
spec:
  image: image
  port: 8080
  routingProvider: Standard
  replicas:
    min: 3
    max: 6
    targetCpuUtilization: 60
```

Dette vil alltid ha minimum 3 pod-er kjørende, og skalere opp til flere (maks 6) hvis CPU-bruken når 60%.
Kun minimumsverdi er påkrevd.

### Stateful (StatefulSet)

Som standard genererer Skiperator en `Deployment` for hver `Application`. 
For apper som krever stabil identitet per pod og dedikert lagring per replika (for eksempel databaser, meldingskøer eller andre stateful systemer), kan du sette `spec.stateful.enabled: true`. 
Da genereres en `StatefulSet` istedenfor `Deployment` i tillegg til en headless `Service`.

Hver replika får sin egen PVC navngitt `<template-navn>-<app>-<ordinal>`, og pod-ene får stabile navn på formen `<app>-0`, `<app>-1`, ...

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: my-stateful-app
spec:
  image: image
  port: 8080
  routingProvider: Standard
  replicas: 3
  stateful:
    enabled: true
    volumeClaimTemplates:
      - name: data
        mountPath: /var/lib/data
        spec:
          accessModes: ["ReadWriteOnce"]
          resources:
            requests:
              storage: 10Gi
```

**Viktige begrensninger:**

- `spec.stateful.enabled` er **immutabel**. Du må slette og opprette `Application` på nytt for å bytte mellom `Deployment` og `StatefulSet`.
- `replicas` må være et statisk tall. Autoskalering (HPA-range med `min`/`max`) er ikke tillatt for stateful applikasjoner.
- `spec.strategy` kan sløyfes. Om den settes må `type` være `RollingUpdate` - `Recreate` er ikke tillatt.
- `volumeClaimTemplates` er påkrevd når stateful er aktivert.

Se [Kubernetes-dokumentasjonen for StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/) for mer info og [API reference](04-api-docs.md#applicationspecstateful) for tilgjengelig konfigurasjon. 

### Miljøvariabler (Environment variables)

Miljøvariabler kan settes direkte i `spec.env` eller ved å bruke en `Secret` eller `ConfigMap` med `spec.envFrom`.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: auto-replicas
spec:
  image: image
  port: 8080
  routingProvider: Standard
  env: 
    - name: ENV_VAR
      value: "value"
  envFrom:
    - configMap: config-map-name
    - configMap: config-map-name2
    - secret: secret-name
```

### GCP

Hvis applikasjonen din trenger å lese fra for eksempel en GCP-bøtte (bucket), må du sette opp en tjenestekonto (service account) med riktige rettigheter og legge den til i applikasjonsspesifikasjonen.
Beste praksis her er å opprette en tjenestekonto med samme navn som applikasjonen, for eksempel `myapp@some-project-id.iam.gserviceaccount.com`, og deretter gi denne tjenestekontoen minimale rettigheter i GCP-konsollen.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: auto-replicas
spec:
  image: image
  port: 8080
  routingProvider: Standard
  gcp:
    auth: 
      serviceAccount: myapp@some-project-id.iam.gserviceaccount.com
```

## SKIPJob

### Cron - SKIPJob

Grunnleggende cron-jobb som kjører hvert minutt.

```yaml
apiVersion: skiperator.kartverket.no/v1beta1
kind: SKIPJob
metadata:
  name: myjob
spec:
  image: image:latest
  cron:
    schedule: "* * * * *"
```

### Kommandoer - SKIPJob

En jobb som bruker en kommando med et Docker-image.

```yaml
apiVersion: skiperator.kartverket.no/v1beta1
kind: SKIPJob
metadata:
  name: myjob
spec:
  image: "perl:5.34.0"
  command:
    - "perl"
    - "-Mbignum=bpi"
    - "-wle"
    - "print bpi(2000)"
```

### Access policy - SKIPJob

Dette er det samme som for applikasjoner, bortsett fra at vi ikke definerer `inbound`-policyer for jobber.

## Routing

### Frontend- og backend-tjenester under samme domene

En ting som er viktig å huske med ruter er at rekkefølgen på rutene spiller en rolle.
Ruten som er definert først, vil være den som blir sjekket først.

Hvis backend-tjenesten din forventer forespørsler uten `pathPrefix`, kan du konfigurere `rewriteUri` til å fjerne prefikset før forespørselen når frem til backend.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Routing
metadata:
    name: myrouting
spec:
    routingProvider: Standard
    hostname: kartverket.com
    routes:
        - pathPrefix: /api          # Høyest prioritet
          rewriteUri: true
          targetApp: backend-app
        - pathPrefix: /             # Lavest prioritet
          targetApp: frontend-app
```

### Dele et hostname mellom team

Flere team kan legge hver sin path på det samme hostnamet, for eksempel `wms.example.com`. Hvert team lager ett `Routing`-objekt i sitt eget namespace, med `routingProvider: Standard` og `ownership: Shared`:

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Routing
metadata:
  name: wms
  namespace: team-a
spec:
  hostname: wms.example.com
  routingProvider: Standard
  ownership: Shared
  routes:
    - pathPrefix: /ortosat
      targetApp: ortosat
```

Standardverdien er `Standalone`, som betyr at objektet eier hele hostnamet alene.

Se [Dele et hostname mellom team](06-delt-hostname.md) for hele oppsettet: DNS, hva Skiperator lager selv, hvordan paths fordeles mellom team, og hva som skjer når et team slutter å bruke hostnamet.
