# Bruk av Terraform

For applikasjoner anbefaler vi å brukes [Argo CD](../09-argo-cd/index.md) til utrulling av containere til Kubernetes. Terraform kan brukes til annen infrastruktur i Google Cloud eller on-prem.


## Lagring av state

Terraform bruker state for å kontrollere og sammenlikne den nåværende konfigurasjonen mot det som kjører, staten må lagres lokalt eller ekstern. På SKIP bruker vi Google Cloud Storage til å lagre state, og oppsettet for dette kan man se under.

State bucket opprettes i repoet [https://github.com/kartverket/gcp-service-accounts](https://github.com/kartverket/gcp-service-accounts).

```hcl
terraform {
  backend "gcs" {
    bucket = "terraform_state_foobar_1e8e"
    prefix = "foobar-frontend"
  }
}
```

For at backenden over skal kunne nå denne bucketen må service-kontoen den kjører som være autentisert mot Google Cloud med riktige tilganger. Dette gjøres i byggeløypa før Terraform blir kjørt, se avsnittet under for hvordan man autentiserer med Google Cloud som en del av Github Actionen.

## Kjøre Terraform i GitHub Actions

Se [https://github.com/kartverket/github-workflows](https://github.com/kartverket/github-workflows) for hvordan man bruker Terraform som en del av GitHub Actions.
