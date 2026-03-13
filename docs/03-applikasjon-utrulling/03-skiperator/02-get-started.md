# Kom i gang

Dette er en rask introduksjon til hvordan du konfigurerer en enkel Application, SKIPJob og Routing ved hjelp av Skiperator.
Før du starter her bør du ha gått gjennom siden for [Krav](01-requirements.md).

Dette er bare enkle eksempler. Team bruker vanligvis libsonnet for å generere yaml-filene for CRDene.
For mer detaljert informasjon om hvordan du konfigurerer CRDene, se [konfigurering](03-configuring.md) for vanlige brukstilfeller og [API-dokumentasjon](04-api-docs.md) for komplett dokumentasjon.

## Application

En Application er vår abstraksjon av en deployment. Skiperator vil opprette alle nødvendige ressurser for deg.
Opprett en fil med navn `app.yaml` i `env/atkv3-dev/myapp` med følgende innhold:

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: myapp
spec:
  image: ghcr.io/kartverket/myapp:latest
  port: 8080
  ingresses:
    - myapp.atkv3-dev.kartverket-intern.cloud
  redirectToHTTPS: true
  accessPolicy:
    inbound: 
      rules:
        - application: myjob-skipjob
```

Du kan deretter gå inn i [argo](https://argo-dev.kartverket.dev), søke etter `myapp` og synkronisere applikasjonen.
Skiperator vil da lese Application-ressursen og opprette en rekke ressurser for deg, som en deployment, service, ingress og nettverkspolicy (network policy).
Appen din bør nå være tilgjengelig på domenet `myapp.atkv3-dev.kartverket-intern.cloud`.

## SKIPJob

En SKIPJob er vår abstraksjon av en jobb eller en cron-jobb. Skiperator vil opprette alle nødvendige ressurser for deg.
Opprett en fil med navn `job.yaml` i `env/atkv3-dev/myjob` med følgende innhold:

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: SKIPJob
metadata:
  name: myjob
spec:
  container:
    image: ghcr.io/kartverket/myjob:latest
    command:
      - "sleep 10"
    accessPolicy:
      outbound:
        rules:
          - application: myapp

  cron:
    schedule: "* * * * *"
```

Dette oppretter en cron-jobb som kjører hvert minutt. Den har også en access policy som tillater den å koble til `myapp`.
Skiperator vil opprette nettverkspolicyer som tillater SKIPJob-en å koble til applikasjonen. Hvis du ser på applikasjonen over, kan du se at den har en access policy som tillater `myjob` å koble til den.
SKIPJob-er må ha suffikset `-skipjob` i access policy-en. Du kan også koble til applikasjoner i andre namespaces, se mer i [konfigurering](03-configuring.md) eller [api-dokumentasjonen](04-api-docs.md).

## Routing

En Routing er en valgfri ressurs som du kan bruke for å forenkle sti-basert ruting (path based routing), slik at flere mikrotjenester kan dele samme vertsnavn (hostname). Under panseret brukes Istio for å videresende (proxy) forespørsler basert på http-stien. Ved å bruke Routing bør du fjerne feltet `ingresses` i Application-manifestet ditt.
For eksempel, hvis du har to applikasjoner, frontend og backend, kan du opprette en ruteringsregel som ruter forespørsler til `/api` til backend-appen og alt annet til frontend-appen.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Routing
metadata:
  name: myrouting
spec:
  hostname: kartverket.com
  routes:
    - pathPrefix: /api
      targetApp: backend-app
    - pathPrefix: /
      targetApp: frontend-app
```
