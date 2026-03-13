# Vanlig Skiperator-konfigurering

Dette er bare en rask oversikt over de vanligste konfigurasjonene i Skiperator.
For en komplett referanse, se [API-dokumentasjonen](04-api-docs.md).

## Application

### Ingress

En ingress er en måte å eksponere applikasjonen din for verden utenfor. Det er en Kubernetes-ressurs som administrerer ekstern tilgang til tjenester i et cluster, vanligvis via HTTP.
Dette setter opp all nødvendig konfigurasjon bak kulissene for å rute trafikk til applikasjonen din, og setter også opp et Let's Encrypt-sertifikat for applikasjonen din.

Enkelt eksempel på en ingress:

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: ingressapp
spec:
  image: image
  port: 8080
  ingresses:
    - ingressapp.atkv3-dev.kartverket-intern.cloud
  redirectToHTTPS: true
```

Dette setter opp en ingress til applikasjonen din som kan nås fra Kartverkets interne nettverk. Feltet `redirectToHTTPS` er valgfritt og vil omdirigere all innkommende trafikk til HTTPS.
For å gjøre den offentlig tilgjengelig kan du fjerne `-intern`-delen av domenenavnet.

Hvis du ønsker, eller allerede har et annet domenenavn for applikasjonen din, må vi mest sannsynlig sette opp en CNAME-oppføring i DNS. Du kan lese mer om domenenavn [her](../../02-kom-i-gang/06-praktisk-intro/06-kubernetes/07-urler-og-sertifikat-for-tjenester-på-skip.md).

### Access policy (tilgangspolicy)

I SKIP kjører vi Istio som et service mesh. Dette betyr at all trafikk mellom tjenester er kryptert som standard.
All trafikk er også blokkert med nettverkspolicyer (network policies) eller Istio-policyer som standard.
For å tillate trafikk mellom tjenester må du sette opp en access policy.
Dette gjøres ved å spesifisere `spec.accessPolicy` i applikasjonen din.

#### Tillate kommunikasjon mellom to applikasjoner i samme namespace

Oppretter regler for å tillate trafikk mellom applikasjon `app1` og `app2` i samme namespace på tjenesteporter.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: app1
spec:
  image: image
  port: 8080
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
  accessPolicy:
    inbound:
      rules:
        - application: app1
    outbound:
      rules:
        - application: app1
```

#### Tillate inn- og utgående trafikk til en applikasjon i et annet namespace

Oppretter nettverkspolicy-regler for å tillate innkommende og utgående trafikk på tjenesteport til applikasjon `app2` i namespace `namespace2`.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: app1
spec:
  image: image
  port: 8080
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

#### Tillate utgående trafikk til en jobb i namespaces med label

Oppretter utgående regler for å tillate trafikk til SKIPJob-en `job2` i alle namespaces med label `team: someteam` på tjenesteport for `app2`.
Merk at alle SKIPJob-er må ha suffikset `-skipjob` i navnet når man definerer applikasjonsnavnet i access policy-en.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: app1
spec:
  image: image
  port: 8080
  accessPolicy:
    outbound:
      rules:
        - application: job2-skipjob
          namespaceByLabel: 
            team: someteam
```

#### Access policy for å tillate trafikk til et offentlig domene

Oppretter Istio-policyer for å tillate trafikk til et offentlig domene på port 443, og et annet offentlig domene på port 80.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: app1
spec:
  image: image
  port: 8080
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

### Replicas (replikaer)

Du kan enten spesifisere et fast antall replikaer eller la autoskaleren håndtere det for deg.

Hvis ikke annet er spesifisert, bruker Skiperator autoskalering som standard:

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
  replicas:
    min: 3
    max: 6
    targetCpuUtilization: 60
```

Dette vil alltid ha minimum 3 pod-er kjørende, og skalere opp til flere pod-er (maks 6) hvis CPU-bruken når 60%.
Kun minimumsverdi er påkrevd.

### Miljøvariabler (environment variables)

Miljøverdier kan settes direkte i applikasjonsspesifikasjonen med `spec.env` eller ved å bruke en secret eller config map med `spec.envFrom`.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: auto-replicas
spec:
  image: image
  port: 8080
  env: 
    - name: ENV_VAR
      value: "value"
  envFrom:
    - configMap: config-map-name
    - configMap: config-map-name2
    - secret: secret-name
```

### GCP

Hvis applikasjonen din for eksempel trenger å lese fra en GCP-bucket, må du sette opp en tjenestekonto (service account) med de riktige tillatelsene og legge den til i applikasjonsspesifikasjonen.
Beste praksis her er å opprette en tjenestekonto med samme navn som applikasjonen, for eksempel `myapp@some-project-id.iam.gserviceaccount.com`, og deretter gi denne tjenestekontoen minimale tillatelser i GCP Console.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: auto-replicas
spec:
  image: image
  port: 8080
  gcp:
    auth: 
      serviceAccount: myapp@some-project-id.iam.gserviceaccount.com
```

## SKIPJob

### Cron - SKIPJob

Grunnleggende cron-jobb som kjører hvert minutt.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: SKIPJob
metadata:
  name: myjob
spec:
  container:
    image: image:latest
  cron:
    schedule: "* * * * *"
```

### Kommandoer - SKIPJob

En jobb som bruker en kommando med et docker-image.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: SKIPJob
metadata:
  name: myjob
spec:
  container:
    image: "perl:5.34.0"
    command:
      - "perl"
      - "-Mbignum=bpi"
      - "-wle"
      - "print bpi(2000)"
```

### Access policy - SKIPJob

Dette er det samme som for applikasjoner, bortsett fra at vi ikke definerer inbound-policyer for jobber.

## Routing

### Frontend- og backend-tjenester under samme domene

En ting som er viktig å huske med ruter (routes) er at rekkefølgen på rutene betyr noe.
Ruten som er definert først, vil være den som matches først.

Hvis backend-tjenesten din forventer forespørsler uten det ledende pathPrefix-et, kan du konfigurere `rewriteUri` til å fjerne prefikset før det ankommer backend-en.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Routing
metadata:
    name: myrouting
spec:
    hostname: kartverket.com
    routes:
        - pathPrefix: /api          # Høyest prioritet
          rewriteUri: true
          targetApp: backend-app
        - pathPrefix: /             # Lavest prioritet
          targetApp: frontend-app
```
