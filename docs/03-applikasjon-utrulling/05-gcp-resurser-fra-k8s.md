# Autentisering mot GCP fra applikasjon i Kubernetes

Hvis applikasjonen din trenger tilgang til GCP-tjenester (for eksempel en GCS bucket), må du konfigurere en [Service Account](https://docs.cloud.google.com/iam/docs/service-account-overview) med riktige [IAM](https://docs.cloud.google.com/iam/docs/overview)-rettigheter og koble den til applikasjonen i Skiperator.

## 1) Opprett en Service Account i GCP

Opprett en dedikert Service Account i GCP-prosjektet der ressursene ligger, og gi den minst mulig tilgang (least privilege).

Service Account bør opprettes med Terraform eller via `gcp-service-accounts`-repoet til SKIP.

## 2) Gi Workload Identity Federation-tilgang

For at en [Kubernetes Service Account](https://kubernetes.io/docs/concepts/security/service-accounts/) (KSA) skal kunne opptre som GCP Service Account, må du gi rollen `roles/iam.workloadIdentityUser` på Service Accounten du opprettet  i GCP.

### Variabler

- `GCP_SA_NAME`: navn på GCP Service Account
- `GCP_SA_PROJECT_ID`: GCP-prosjektet der `service account` ligger
- `KUBERNETES_PROJECT_ID`: GCP-prosjektet for Kubernetes-clusteret (f.eks. `kubernetes-dev-94b9`)
- `KUBERNETES_NAMESPACE`: namespace der poden kjøres
- `KUBERNETES_SA_NAME`: `Kubernetes service account` som poden bruker (ofte samme navn som `Application`, og med `-skipjob`-suffix for `SKIPJob`)

### Med gcloud CLI

```bash
gcloud iam service-accounts add-iam-policy-binding \
  GCP_SA_NAME@GCP_SA_PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="serviceAccount:KUBERNETES_PROJECT_ID.svc.id.goog[KUBERNETES_NAMESPACE/KUBERNETES_SA_NAME]"
```

### Tilsvarende med Terraform

```hcl
resource "google_service_account_iam_member" "workload_identity_user" {
  service_account_id = "projects/${var.gcp_sa_project_id}/serviceAccounts/${var.gcp_sa_name}@${var.gcp_sa_project_id}.iam.gserviceaccount.com"
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:${var.kubernetes_project_id}.svc.id.goog[${var.kubernetes_namespace}/${var.kubernetes_sa_name}]"
}
```

Dette er Terraform-ekvivalenten til `gcloud iam service-accounts add-iam-policy-binding`-kommandoen over.

## 3) Legg inn config i Skiperator-manifest

Til slutt legger du inn GCP-config i `Application`-manifestet, slik at poden kan autentisere mot GCP ved runtime.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: myapp
spec:
  image: ghcr.io/kartverket/myapp
  port: 8080
  gcp:
    auth:
      serviceAccount: GCP_SA_NAME@GCP_SA_PROJECT_ID.iam.gserviceaccount.com
```

Når dette er satt opp, kan applikasjonen autentisere mot GCP med standardbiblioteker (Application Default Credentials).
