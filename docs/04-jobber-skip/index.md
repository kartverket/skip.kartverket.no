# 📅 Jobber på SKIP

Dette er en intro til jobber på SKIP. 
En jobb er en et program for forventes å terminere og kan enten kjøres en gang eller periodisk.
SKIP tilbyr abstraksjonen SKIPJob for å enkelt konfigurere og kjøre jobber. 


## Konfigurere en SKIPJob

En SKIPJob konfigureres i stor grad likt som applikasjoner. 
Inbound access policy og port skal derimot ikke konfigureres for jobber. 
Mer info om vanlig konfiguration av applikasjoner finner du [her](/docs/applikasjon-utrulling/skiperator/configuring).

### One-off jobb

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: SKIPJob
metadata:
  name: min-jobb
spec:
  container:
    image: "ghcr.io/kartverket/min-jobb:latest"
```
Denne vil kjøre docker imaget `min-jobb:latest` en gang. 
Den vil kjøre hver gang den blir syncet. 

### Cron jobb (periodisk)

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: SKIPJob
metadata:
  name: min-cron-jobb
spec:
  container:
    image: "ghcr.io/kartverket/min-jobb:latest"
  cron:
    schedule: "0 * * * *"
```

Denne vil kjøre docker imaget `min-jobb:latest` én gang hver time.

### Kompleks jobb

Cron jobb som laster hemmeligheter fra GCP og gjør en forspørsel til en annen tjeneste.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: SKIPJob
metadata:
  name: min-cron-jobb
spec:
  container:
    image: "ghcr.io/kartverket/min-jobb:latest"
  cron:
    schedule: "0 * * * *"
  gcp:
    auth:
      serviceAccount: "min-jobb@mitt-prosjekt.iam.gserviceaccount.com"
  accessPolicy:
    outbound:
      rules:
        - application: min-applikasjon
  env:
    - name: MIN_ENV_VAR
      value: "min-env-value"
  envFrom:
    - secret: secret-navn
```

## Trigge en jobb

Spesielt for one-off jobber er det aktuelt å trigge jobben manuelt uten at du har gjort endringer. 
Vi har ingen pen måte å trigge jobber på ennå, men du kan likevel trigge en jobb ved å gå inn i argo og slette "job" ressursen (ikke "skipjob"). 
![Trigge en jobb](images/slett_skipjob.png)
Trykk på "Delete", velg "Foreground Delete" (default) og trykk "Ok" så vil "job" ressursen opprettes på nytt og jobben kjøres. 

For å trigge cron jobber manuelt kan du trykke på kebab meny knappen på "cronjob" ressursen og velge "Create Job". 

Ved å sette [`.spec.job.cron.suspend = true`](/docs/applikasjon-utrulling/skiperator/api-docs#skipjobspeccron) kan du hindre en cron jobb fra å kjøre periodisk og den kan dermed trigges manuelt via kebab meny. 
SKIPJoben vil da oppføre seg som en one-off jobb, men den vil ikke kjøre når den synces. 
