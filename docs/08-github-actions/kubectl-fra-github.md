# Kubectl fra GitHub Actions

Det kan være nyttig å kunne kjøre kubectl fra Github Actions når for eksempel man ønsker å restarte et deployment eller kjøre en jobb on demand. 

Vi har laget en GitHub Workflow som gjør det enkelt å kjøre kubectl kommandoer fra GitHub Actions, denne heter `run-kubectl` og den kan du finne [her](https://github.com/kartverket/github-workflows/blob/main/.github/workflows/run-kubectl.yaml).

## Oppsett

Før du kan bruke denne actionen må du gjøre noen endringer i [`gcp-service-accounts`](https://github.com/kartverket/gcp-service-accounts/) og i ditt teams apps-repo.

### 1. Legg til ekstra permissions til deploy service accounten
run-kubectl tar i bruk Workload Identity Federation som du kan lese mer om [her](https://skip.kartverket.no/docs/github-actions/autentisering-med-workload-identity-federation), 
men den krever også ekstra tilganger for å kunne koble til clusteret.
I `gcp-service-accounts` har du sannsynligvis definert opp ditt gcp project for å kunne bruke det i GitHub Actions, 
og dermed fått laget en deploy service account og et workload identity pool.
Da må du bare legge til en ekstra rolle i modul-definisjonen slik:

```hcl
module "utviklerportal" {
  source    = "./project_team"
  team_name = "utviklerportal"
  repositories = [
    "kartverket/kartverket.dev",
  ]
  env                   = var.env
  project_id            = var.utviklerportal_project_id
  kubernetes_project_id = var.kubernetes_project_id
  extra_kubernetes_sa_roles = [        
    "roles/container.clusterViewer",  # <--- Legg til denne linjen i extra_kubernetes_sa_roles
  ]
}
```
Nå skal deploy kontoen kunne koble seg til clusteret.

### 2. Legg til role og rolebinding i ditt apps-repo

For at man skal kunne f.eks restarte et deployment, så må vi legge til en kubernetes rbac rolle som gir kontoen tilgang til dette.

I apps repoet, legg til:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: deployment-restart-role
rules:
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "patch"]

---

kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: deploy-sa-rolebinding
subjects:
  - kind: User
    name: your-project-deploy@your-project-id.iam.gserviceaccount.com
roleRef:
  kind: Role
  name: deployment-restart-role
  apiGroup: rbac.authorization.k8s.io
```

navn på service accounten er `"modulnavn"-deploy`, hvor modulnavn finnes i `gcp-service-accounts`. 
du kan også finne den med `gcloud config set project <projectid> && gcloud iam service-accounts list | grep deploy`

### 3. Legg til GitHub workflow
Nå skal alt være konfigurert og du kan legge til en GitHub workflow som kjører `run-kubectl` workflow.

eksempel: 
```yaml
name: Get pods
on: push

jobs:
  sandbox:
    name: get pods
    uses: kartverket/github-workflows/.github/workflows/run-kubectl.yaml@4.2.2
    with:
      cluster_name: atgcp1-sandbox
      service_account: test-deploy@test-sandbox-5cx6.iam.gserviceaccount.com
      kubernetes_project_id: kube-sandbox-6e32
      project_number: 833464945837
      command: get pods
      namespace: default
```

Forklaring:
- `cluster_name`: navnet på clusteret du vil koble til, dette kan du finne med `gcloud container fleet memberships list`. mer [her](https://skip.kartverket.no/docs/kubernetes/logge-inn-p%C3%A5-cluster)
- `service_account`: navnet på service accounten som skal brukes. denne blir opprettet i gcp-service-accounts, og slutter på `-deploy`
- `kubernetes_project_id`: id til prosjektet som clusteret ligger i, finnes med `gcloud projects list | grep kubernetes`
- `project_number`: nummeret til prosjektet som service accounten ligger i, dette er produkt prosjektet, finnes med `gcloud projects list | grep produkt`
- `command`: kubectl kommandoen du vil kjøre, uten kubectl foran
- `namespace`: namespace du vil kjøre kommandoen i
- `kubectl_version`: versjonen av kubectl du vil bruke, default er latest stable. format: v1.30.0
