# Cloud SQL for PostgreSQL

## Oppsett av instanser med terraform

SKIP har laget to terraform-moduler ([cloud_sql](https://github.com/kartverket/terraform-modules/tree/main/cloud_sql) og
[cloud_sql_config](https://github.com/kartverket/terraform-modules/tree/main/cloud_sql_config)) for å gjøre det enkelt å
sette opp nye Cloud SQL-instanser i GCP.

Dokumentasjon for hvordan modulene brukes finnes på wiki-siden til [terraform-modules](https://github.com/kartverket/terraform-modules/wiki)
Spesielt guiden for [hvordan bruke terraform-modules repoet](https://github.com/kartverket/terraform-modules/wiki/Hvordan-bruke-dette-repoet) er relevant.

### cloud_sql modulen
> For mer utfyllende dokumentasjon se [cloud_sql wiki](https://github.com/kartverket/terraform-modules/tree/main/cloud_sql)

```hcl
module "cloudsql_test" {
  source        = "git@github.com:kartverket/terraform-modules.git/?ref=cloud_sql/v0.10.0"
  env           = "sandbox"
  instance_name = "foo-db"
  project_id    = "skip-sandbox-37c2"
}
```

Du kan koble deg til på denne måten: 
1. JIT deg til cloudsql.admin
2. Last ned [cloudsql-proxy](https://cloud.google.com/sql/docs/postgres/connect-instance-auth-proxy#install-proxy)
3. `gcloud auth application-default login`
4. `./cloud-sql-proxy --private-ip <connection-name> --auto-iam-authn` -- connection name finner du på sql instansen i GCP
5. `psql -d admin -h localhost -U admin` eller fra applikasjon

Du må være på Kartverkets nettverk for å få tilgang, selv med cloud sql proxy. Man kan ikke koble til fra egen klient uten proxy.
Du trenger ikke å bruke SSL sertifikater når du kobler til via proxy.

### cloud_sql_config modulen og konfigurering av brukere
> For mer utfyllende dokumentasjon se [cloud_sql_config wiki](https://github.com/kartverket/terraform-modules/wiki/cloud_sql_config)

Denne modulen er laget for konfigurasjon av postgres instanser. Vi har laget denne for å gjøre konfigurering av databaser enklest mulig for dere,
og for å unngå "click-ops".   
Det er noen ting dere bør tenke over før dere tar denne i bruk:
1. Den burde bare brukes på en ny instans. Å importere eksisterende databaser, brukere og skjemaer er noe vi fraråder
2. Feil bruk av denne modulen kan slette brukere, secrets og hele databasen inkludert all data. Sjekk alltid PLAN før du applyer.
3. Vær sikker på at migreringene dine er kompatible med modulen mtp. privileges

Eksempel config: 
```hcl
module "cloudsql_config" {
  source            = "git@github.com:kartverket/terraform-modules.git/?ref=cloud_sql_config/v0.7.0"
  gcp_instance_name = module.cloudsql_test.cloud_sql_instance_name
  gcp_project_id    = module.cloudsql_test.gcp_project_id
  env               = "prod"
  databases = {
    "backstage" = {
      name            = "backstage"
      owner           = "backstage"
      extensions      = ["pgcrypto", "postgis"]
      prevent_destroy = true
      # Denne variabelen må IKKE endres uten at dere er klare til å migrere state manuelt.
      schemas = [
        {
          name = "backstage"
          migration_user = {
            name = "backstage_migrater" # migration_user blir eier av skjemaet som opprettes
          }
          application_user = {
            name = "backstage_app" # application user får CRUD privilegier
          }
          misc_users = [
            {
              name       = "readonly"
              privileges = ["SELECT"]
            }
          ]
        },
        {
          name         = "opencost"
          unified_user = true
          migration_user = {
            name = "opencost_migrater" # ignoreres, fordi vi har unified_user = true, men den må settes likevel
          }
          application_user = {
            name       = "opencost_app"
            privileges = ["SELECT", "UPDATE"] # ignoreres, app user blir owner av skjemaet fordi unified_user er true
          }
          misc_users = [
            {
              name       = "readonly"
              privileges = ["SELECT"]
            }
          ]
        }
      ]
    }
  }
}
```

For hver bruker så vil modulen generere opp et klient sertifikat og en privatnøkkel, disse legges i GSM.
Den private nøkkelen legges i to formater; PEM og PK8. Vi har erfart at JDBC ikke liker PEM, så i dette tilfellet 
så bør du bruke PK8 nøkkelen istedenfor.

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
  name: my-app-db-client-password # Denne brukes for å hente ut password fra json secreten i gsm.
  namespace: my-app-namespace
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: gsm
    kind: SecretStore
  target:
    name: my-app-db-user-password # Navnet på Kubernetes Secret som opprettes
    creationPolicy: Owner
  data:
    - remoteRef:
        conversionStrategy: Default
        decodingStrategy: None
        key: cloudsql-myinstance-myuser # Navnet på GSM secret
        metadataPolicy: None
        property: password
      secretKey: password

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
        
    ### client.key i PEM, fungerer for de fleste
    - secretKey: client.key
      remoteRef:
        key: cloudsql-<instansnavn>-<bruker>-client-key
    
    ### VISST DU TRENGER PK8 (JDBC kan kreve dette) - Bare ta med ÈN key, ikke begge
    - secretKey: client.pk8
      remoteRef:
        decodingStrategy: Base64 # Må være med for pk8
        key: cloudsql-<instansnavn>-<bruker>-client-key-pk8
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

### Bruke CloudSQL fra Java applikasjoner

Skal du bruke CloudSQL fra Java applikasjoner må du lage til ExternalSecrets og konfigurere skiperator som ovenfor, 
men bruk pk8 nøkkel istedenfor vanlig pem nøkkel. 
Det skal være nok å konfigurere en connection string som ser noe slik ut `postgresql://<privat-ip>:5432/<database-navn>?sslmode=require&sslrootcert=/app/db-certs/server.crt&sslcert=/app/db-certs/client.crt&sslkey=/app/db-certs/client.pk8`

Alternativt kan man også bruke en [Cloud Sql Auth Proxy connector](https://cloud.google.com/sql/docs/postgres/connect-auth-proxy#languages), men da vil man få litt dårligere ytelse.
Bruker man en connector så slipper man å bruke certs, men man må åpne for port 3307 mot databasen i access policies i skiperator manifestet.

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

## Viktig å huske på

### Max connections

I enkelte situasjoner kan hele CloudSQL-instansen bli utilgjengelig, og man vil motta følgende feilmelding:  
`HTTPError 409: Operation failed because another operation was already in progress. Try your request after the current operation is complete.`

Basert på erfaring skyldes dette som regel at det er åpnet for mange samtidige connections mot databasen.  
For eksempel, dersom `max_connections`-variabelen i Terraform-modulen er satt til `100`, og man har to applikasjoner som hver bruker `30` connections og kjører med to replikas, vil det totalt bli `120` connections – i tillegg til noen system-connections (typisk 2–3).

I slike tilfeller kan instansen bli utilgjengelig: man kan verken restarte den eller gjøre konfigurasjonsendringer.

**Løsning:**  
Skaler ned alle applikasjoner (sett `replicas` til `0`), og vent opptil én time. Når connections er frigjort, kan man justere `max_connections`-verdien.

**Anbefaling:**  
Implementer *connection pooling* i applikasjonene. Hver enkelt connection øker belastningen på databaseinstansen, og unødvendig høyt antall tilkoblinger er både ineffektivt og kostbart.  
Legg også til [denne alarmmodulen i grafana-alerts](https://github.com/kartverket/grafana-alerts/tree/main/modules/cloud_sql_alerts), da får dere alarmer når connections nærmer seg maks.