# ArgoKit

<div style={{ margin: '0 auto 2rem auto', maxWidth: '300px' }}>
    <img src="https://github.com/kartverket/argokit/raw/main/logo.png" alt="ArgoKit Logo" width="100%" />
</div>

ArgoKit er et sett med gjenbrukbare jsonnet templates som gjør det enklere å rulle ut ArgoCD-applikasjoner på SKIP. 
Hvis du har spørsmål, ta kontakt med [#gen-argocd](https://kartverketgroup.slack.com/archives/C04KH6A4FNW) kanalen på Slack. 
Du finner koden [her](https://github.com/kartverket/argokit).

## Installasjon

Forutsatt at du har fulgt [Komme i gang](./01-komme-i-gang-med-argocd.md)-guiden, kan du bruke ArgoKit i ditt apps-repo. 
Første steg er å inkludere ArgoKit-biblioteket ved å kjøre følgende kommando:

```bash
$ git submodule add https://github.com/kartverket/argokit.git
```

Alternativt kan du bruke jsonnet-bundler hvis du foretrekker å bruke en package manager fremfor submoduler. 
For å gjøre dette, installer CLI-en ved å følge instruksjonene i [jsonnet-bundler](https://github.com/jsonnet-bundler/jsonnet-bundler) repoet og kjør følgende kommando:

```bash
$ jb install https://github.com/kartverket/argokit@main
```

### Automatiske versjonsoppdateringer

Det anbefales sterkt å bruke dependabot for å automatisk oppdatere ArgoKit-versjonen når en ny versjon blir utgitt. 
For å gjøre dette, legg til følgende i din `.github/dependabot.yml` fil:

```yaml
version: 2
updates:
  - package-ecosystem: git-submodules
    directory: /
    schedule:
      interval: daily
```

Med denne konfigurasjonen vil dependabot sjekke én gang om dagen om det finnes en ny versjon av ArgoKit. Hvis den finner en ny versjon, oppretter den automatisk en PR for å oppdatere versjonen.

## Bruk med jsonnet

For grunnleggende informasjon om jsonnet, se [Gjenbruke konfigurasjon](./02-hva-er-et-apps-repo.md#gjenbruke-konfigurasjon).

Hvis du bruker jsonnet i ditt apps-repo, kan du bruke ArgoKit-biblioteket til å rulle ut ArgoCD-applikasjoner ved å inkludere `argokit.libsonnet`-filen i din jsonnet-fil og kalle `argokit.Application`-funksjonen. 
For eksempel, for å rulle ut en applikasjon, kan du bruke følgende jsonnet-fil:

```jsonnet
local argokit = import 'argokit/jsonnet/argokit.libsonnet';

local Probe = {
    path: "/healthz",
    port: 8080,
    failureThreshold: 3,
    timeout: 1,
    initialDelay: 0,
};

local BaseApp = {
    spec: {
        port: 8080,
        replicas: {
            min: 2,
            max: 5,
            targetCPUUtilization: 80,
        },
        liveness: Probe,
        readiness: Probe,
    },
};

[
    BaseApp + argokit.Application("foo-backend") {
        spec+: {
            image: "hello-world",
            ingresses: ["foo.bar.com"],
            accessPolicy: {
                inbound: {
                    rules: [{
                        application: "foo-frontend",
                    }],
                },
            },
        },
    },
]
```

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
