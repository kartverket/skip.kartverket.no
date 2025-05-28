# Cloud SQL for PostgreSQL

## Oppsett av instanser med terraform

SKIP har laget to terraform-moduler ([cloud_sql](https://github.com/kartverket/terraform-modules/tree/main/cloud_sql) og
[cloud_sql_config](https://github.com/kartverket/terraform-modules/tree/main/cloud_sql_config)) for å gjøre det enkelt å
sette opp nye Cloud SQL-instanser i GCP.

Dokumentasjon for hvordan modulene brukes finnes på wiki-siden til [terraform-modules](https://github.com/kartverket/terraform-modules/wiki)
Spesielt guiden for [hvordan bruke terraform-modules repoet](https://github.com/kartverket/terraform-modules/wiki/Hvordan-bruke-dette-repoet) er relevant.

## Bruke instansen fra SKIP

Når du skal bruke instansen fra SKIP så må du gjøre noen få modifikasjoner til applikasjonsmanifestet ditt.

Det første du må gjøre er å hente ut secrets.

Terraform modulen vil generere opp og legge inn alle secrets du trenger for å
koble til databasen i Google Secret Manager i prosjektet du har valgt.

Kjenner du ikke til GSM og ExternalSecrets anbefaler vi å lese [Hente hemmeligheter fra hemmelighetshvelv](../03-applikasjon-utrulling/09-argo-cd/04-hente-hemmeligheter-fra-hemmelighetsvelv.md) først.

For å hente ut disse så må du lage to `ExternalSecret`, en for sertifikater og en for passord/brukernavn, her er et eksempel:

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: minapp-hemmligheter
spec:
  secretStoreRef:
    kind: SecretStore
    name: gsm
  data:
    - secretKey: db_password
      remoteRef:
        key: cloudsql-<instansnavn>-<bruker>-password

--- 

apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: database-certs
spec:
  secretStoreRef:
    kind: SecretStore
    name: gsm
  data:
    - secretKey: server.crt
      remoteRef:
        key: cloudsql-<instansnavn>-ca-certificate
    - secretKey: client.crt
      remoteRef:
        key: cloudsql-<instansnavn>-<bruker>-client-certificate
    - secretKey: client.key
      remoteRef:
        key: cloudsql-<instansnavn>-<bruker>-client-key
```

Nå har du hentet alle hemmelighetene du trenger, og kan bruke disse i skiperator manifestet ditt:

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: minapp
spec:
  image: ghcr.io/kartverket/minapp
  port: 8080
  replicas: 2
  accessPolicy:
    outbound:
      external:
      - host: <instansnavn>-db-<env>  # Velg selv hva du vil kalle denne, så lenge den er unik
        ip: 10.x.x.x # Privat IP-adresse til databasen, den finner du i GCP
        ports:
          - name: sql
            port: 5432
            protocol: TCP
  env:  ## DISSE env VERDIENE ER EKSEMPLER, OG MÅ JUSTERES FOR HVER APPLIKASJON
    - name: POSTGRES_DB
      value: minapp
    - name: POSTGRES_USER
      value: minappbrukernavn
    - name: POSTGRES_PASSWORD
      valueFrom:
        secretKeyRef:
          key: db_password
          name: minapp-hemmligheter
    - name: PGSSLCA
      value: /app/db-certs/server.crt
    - name: PGSSLKEY
      value: /app/db-certs/client.key
    - name: PGSSLCERT
      value: /app/db-certs/client.crt
  filesFrom:
  - mountPath: /app/db-certs
    secret: database-certs
```

Skiperator vil nå:

- lage en `NetworkPolicy` som gir applikasjonen tilgang til databasen
- 'mounte' sertifikatene inn i filsystemet til poden, slik applikasjonen kan bruke de til å koble til databasen
- laste inn passord hemmeligheten som en env variabel inn i poden, slik applikasjonen kan koble til databasen

## Monitorering og alarmering

> Fungerer bare dersom dere bruker høyere versjon enn 0.9.1 av [cloud_sql](https://github.com/kartverket/terraform-modules/wiki/cloud_sql) modulen.

Vi har laget et dashboard, sammen med DBAene, for monitorering av CloudSQL databasene, som kan finne [her](https://monitoring.kartverket.cloud/d/aek9kpwgzv280f/dba-cloudsql?orgId=1&from=now-30m&to=now&timezone=browser&var-Env=prod&var-ProjectID=utviklerportal-prod-ba53&var-Instance=backstage-prod).
I tillegg så finnes også Googles standard dashboard og metrikker som man kan finne inne på CloudSQL ressursen i GCP consolen.

For alarmering så brukes [grafana-alerts](https://github.com/kartverket/grafana-alerts) repoet som for alle andre type alerts.
Her har vi utviklet en [cloud_sql_alerts](https://github.com/kartverket/grafana-alerts/tree/main/modules/cloud_sql_alerts) modul som gir dere et sett med standard alarmer.
Metrikker vi baserer oss på blir hentet ut ved hjelp av [sql_exporter](https://github.com/justwatchcom/sql_exporter), disse metrikkene er hentet ut på grunnlag av SQL-spørringer som DBAene har predefinert.
Ønskes det andre metrikker så ta kontakt med dem.

Det er også tilgjengelig et sett med standardmetrikker fra Google gjennom grafana, for å bruke disse så gå inn i [explore view i grafana](https://monitoring.kartverket.cloud/explore).
Velg `Google Cloud Monitoring` som datasource, og velg prosjektet ditt og Cloudsql som service. Se på `cloud_sql_alerts` modulen dersom du ønsker å se hvordan de kan brukes i en alert.

## Backup og katastrofehåndtering

### Backup

CloudSQL er en google managed løsning av postgres, og det betyr også at det har et innebygd backup system, og håndteres i gcp console.
Dette systemet tar automatisk backup av databasen din, og lagrer disse i 7 dager som standard.  Hvis du har behov for å bevare backups lengre enn dette kan det konfigureres med en variabel til terraform-modulen, ref: [input_retained_backups](https://github.com/kartverket/terraform-modules/wiki/cloud_sql#input_retained_backups)
Backupen er inkrementel og man har `Point-in-time` recovery tilgjengelig.
Vi anbefaler at du leser gjennom [Google sin dokumentasjon](https://cloud.google.com/sql/docs/postgres/backup-recovery/backups) for å forstå hvordan backup fungerer i CloudSQL.

### Katastrofehåndtering

Google Cloud SQL har innebygd failover, og det betyr at dersom primærinstansen din går ned, så vil en av de tilgjengelige replicaene ta over.
Dette må konfigureres i terraform, ved bruk av `availability_type` [variabelen](https://github.com/kartverket/terraform-modules/wiki/cloud_sql#input_availability_type), default på denne er `ZONAL` som betyr at du ikke får en secondary instans.
I produksjon er det anbefalt å ha en secondary instans, og da må `availability_type` settes til `REGIONAL` i terraform.
Les mer her: [Google sin dokumentasjon](https://cloud.google.com/sql/docs/postgres/high-availability)
