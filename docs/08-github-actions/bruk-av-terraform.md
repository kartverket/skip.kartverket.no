# Bruk av Terraform

:::tip
For nye applikasjoner anbefaler vi å bruke [Argo CD](../09-argo-cd/index.md) til utrulling av containere til Kubernetes
:::

```hcl
provider "vault" {
  address         = var.vault_addr
  skip_tls_verify = var.vault_skip_verify
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}
```

Det som gjør Terraform så fleksibelt er dens mange providere som fungerer som interface/API mot den tjenesten den ønsker å styre. I eksemplet over er noen av våre mest brukte så langt. Vi bruker [Vault](https://registry.terraform.io/providers/hashicorp/vault/latest/docs) provideren for å kommunisere mot Vault sitt API og til slutt [Kubernetes](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs) provideren som gir deg mulighet til å lage alle standard kubernetes ressurser med Terraform syntax.

Legg merke til at mange av providerene ser etter miljøvariabler med spesifikke navn, i den offentlige dokumentasjonen for provideren kan man finne ut hvilke navn den bruker. Hvis man setter riktige miljøvariabler så slipper man å ha disse i koden, som samtidig gjør det lettere å deployere til flere miljøer.

## Deploye applikasjoner med Terraform

På SKIP har vi laget en enkel måte å deploye applikasjoner ved hjelp av [Skiperator](https://github.com/kartverket/skiperator-poc) . Dette er en operator som setter opp alt av nettverking, sikkerhetsmekanismer, autoskalering, liveness- og readiness probes for deg så lenge man fyller ut en kort config-fil kalt en Application Custom Resource (CR). Man finner dokumentasjonen for hvorden denne Application CR-en ser ut på skiperator sin GitHub-side, og man kan se et eksempel på dette i Terraform-syntaks under.

```hcl
resource "kubernetes_manifest" "frontend_application" {
  manifest = {
    apiVersion = "skiperator.kartverket.no/v1alpha1"
    kind       = "Application"
    metadata = {
      name      = local.app_name
      namespace = local.namespace
    }
    spec = {
      image = "ghcr.io/kartverket/${local.app_name}:${var.image_version}"
      port  = 8080
      ingresses = [
        var.gateway_host
      ]
      replicas = {
        cpuThresholdPercentage = 80
        max                    = 5
        min                    = 3
      }
      env = [
        {
          name  = "BACKEND_URL"
          value = var.backend-url
        },
      ]
      liveness = {
        path = "/"
        port = 8080
      }
      readiness = {
        path = "/"
        port = 8080
      }
      resources = {
        limits = {
          cpu    = "1000m"
          memory = "1Gi"
        }
        requests = {
          cpu    = "100m"
          memory = "100M"
        }
      }
      accessPolicy = {
        outbound = {
          rules = [
            {
              application = "backend"
            }
          ]
        }
      }
    }
  }
}
```

## Hente hemmeligheter med Vault

Hvis man trenger å bruke hemmeligheter deploy-time, for eksempel for å deploye sertfikater eller passord til Kubernetes som secrets, så må man hente ut disse med [vault_generic_secret](https://registry.terraform.io/providers/hashicorp/vault/latest/docs/data-sources/generic_secret) . Eksempelet under gjør dette for å generere en docker pull secret som lar en pulle fra [ghcr.io](http://ghcr.io/) . Innholdet i hemmeligheten blir generert av en JSON template-fil som ikke er en del av eksempelet.

```hcl
data "vault_generic_secret" "github_token_ghcr_read" {
  path = "dsa/github_token_ghcr_read"
}

data "template_file" "docker_config_script" {
  template = file("${path.module}/config.json")
  vars = {
    docker-server = data.vault_generic_secret.github_token_ghcr_read.data["server"]
    auth          = base64encode("${data.vault_generic_secret.github_token_ghcr_read.data["username"]}:${data.vault_generic_secret.github_token_ghcr_read.data["token"]}")
  }
}

resource "kubernetes_secret" "github-auth" {
  metadata {
    name      = "github-auth"
    namespace = local.namespace
  }
  data = {
    ".dockerconfigjson" = data.template_file.docker_config_script.rendered
  }
  type = "kubernetes.io/dockerconfigjson"
}

```

## Lagre passord til Vault

Noen ganger ønsker man å skrive til vault, for eksempel når man genrerer passord. Eksempelet under gjør dette.

```hcl
resource "random_password" "generated-password" {
  length  = 29
  special = true
  lower   = true
  upper   = true
  number  = true
}

resource "vault_generic_secret" "password-for-vault-storage" {
  path = "skip/skipet"

  data_json = <<EOT
{
  "username":   "${skip-bruker}",
  "password":   "${random_password.generated-password.result}",
  "connection_string": "jdbc:postgresql://${kubernetes_service.skip-db-service.metadata.0.name}:${local.skip-db-port}/${local.skip-db-database-name}"
}
EOT
}
```

## Lagring av state

Terraform bruker state for å kontrollere og sammenlikne den nåværende konfigurasjonen mot det som kjører, staten må lagres lokalt eller ekstern. På SKIP bruker vi Google Cloud Storage til å lagre state, og oppsettet for dette kan man se under.

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
