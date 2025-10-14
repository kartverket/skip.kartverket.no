# V1 API Reference
### ⚠️ this API is depricated ⚠️

---

### jsonnet argokit API

Følgende templates er tilgjengelige for bruk i `argokit.libsonnet`-filen:

| Template                 | Beskrivelse                                                    | Eksempel                                                                              |
|--------------------------|----------------------------------------------------------------|--------------------------------------------------------------------------------------|
| `argokit.Application`    | Oppretter en Skiperator-applikasjon                           | Se ovenfor                                                                            |
| `argokit.GSMSecretStore` | Oppretter en Google Secret Manager External Secrets `SecretStore` | [examples/jsonnet/secretstore-gsm.jsonnet](https://github.com/kartverket/argokit/blob/main/examples/jsonnet/secretstore-gsm.jsonnet) |
| `argokit.GSMSecret`      | Oppretter en Google Secret Manager External Secrets `Secret`      | [examples/jsonnet/secretstore-gsm.jsonnet](https://github.com/kartverket/argokit/blob/main/examples/jsonnet/secretstore-gsm.jsonnet) |
| `argokit.Roles`          | Oppretter et sett med RBAC-roller for dette navnerommet           | [examples/jsonnet/roles.jsonnet](https://github.com/kartverket/argokit/blob/main/examples/jsonnet/roles.jsonnet)                     |

Følgende templates er tilgjengelige for bruk i `dbArchive.libsonnet`-filen:

| Template                 | Beskrivelse                                                   | Eksempel                                                                  |
|--------------------------|---------------------------------------------------------------|--------------------------------------------------------------------------|
| `dbArchive.dbArchiveJob` | Oppretter en SKIPJob som lager en sql-dump og lagrer den i S3 | [examples/jsonnet/dbArchive.jsonnet](https://github.com/kartverket/argokit/blob/main/examples/jsonnet/dbArchive.jsonnet) |

### Input parametre

#### dbArchiveJob

| Parameter                            | Type    | Standardverdi            | Beskrivelse                                                                                                                       |
|:-------------------------------------|:--------|:-------------------------|:----------------------------------------------------------------------------------------------------------------------------------|
| **`instanceName`**                   | String  | -                        | **Påkrevd.** Et unikt navn for jobben og relaterte ressurser. Dette navnet brukes som base for `SKIPJob` og hemmeligheter.             |
| **`schedule`**                       | String  | -                        | **Påkrevd.** En cron uttrykk som definerer når jobben skal kjøre (f.eks. `"0 2 * * *"` for å kjøre kl. 02:00 hver natt).                   |
| **`databaseIP`**                     | String  | -                        | **Påkrevd.** IP-adressen til PostgreSQL-databasen som skal arkiveres.                                                           |
| **`gcpS3CredentialsSecret`**         | String  | -                        | **Påkrevd.** Navn på hemmeligheten i GSM som inneholder S3-hemmeligheter (`AWS_ACCESS_KEY_ID` og `AWS_SECRET_ACCESS_KEY`).              |
| **`databaseName`**                   | String  | -                        | **Påkrevd.** Navn på databasen som skal arkiveres.                                                                                |
| **`archiveUser`**                    | String  | `'postgres'`             | Databasebrukeren jobben skal bruke for å koble til.                                                                                  |
| **`serviceAccount`**                 | String  | `'dummyaccount@gcp.iam'` | GCP Service Account som brukes av Kubernetes-jobben for å autentisere mot Google Cloud (f.eks. for å hente hemmeligheter fra GSM).            |
| **`cloudsqlInstanceConnectionName`** | String  | -                        | **Påkrevd.** Tilkoblingsnavnet til Cloud SQL-instansen (format: `project:region:instance`). Nødvendig for Cloud SQL Auth Proxy. |
| **`port`**                           | Integer | `5432`                   | Portnummeret til PostgreSQL-databasen.                                                                                       |
| **`S3Host`**                         | String  | `'s3-rin.statkart.no'`   | Hostnavnet til S3-endepunktet hvor arkivet skal lagres.                                                               |
| **`S3DestinationPath`**              | String  | -                        | **Påkrevd.** Full S3-sti hvor databasearkivet skal plasseres (f.eks. `s3://my-bucket/archive/database/`).                |
| **`fullDump`**                       | Bool    | false                    | Flagg for å inkludere databaseroller `uten passord` i dumpen.                                                                   |

## Bidrag

Bidrag er velkomne! Vennligst åpne et issue eller PR hvis du ønsker å
se noe endret eller lagt til.
