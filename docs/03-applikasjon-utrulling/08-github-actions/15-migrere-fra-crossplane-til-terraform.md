# Migrasjon fra Crossplane til Terraform


Crossplane er i ferd med å fases ut, men ta det med ro - det er ikke veldig komplisert å komme over til Terraform.
Du må bare bytte ut Crossplane-ressurser med tilsvarende Terraform-ressurser, og når dette er på plass må du huske på å importere de eksisterende Crossplane-opprettede ressursene inn i Terraform state.
Hashicorp selv [har noe dokumentasjon rundt dette](https://developer.hashicorp.com/terraform/language/import), men det kan også være lurt å spørre SKIP om bistand.

## En kjapp oversikt over Crossplane-ressurser og tilsvarende Terraform-ressurser:

### BucketInstance -> google_storage_bucket

```hcl

resource "google_storage_bucket" "example" {
  name     = "example_bucket"
  location = "EUROPE-NORTH1"
  project  = "your-google-project-1234"

  uniform_bucket_level_access = true
  versioning {
    enabled = true
  }
  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      num_newer_versions = 100
      age                = 30
    }
  }
  public_access_prevention = "enforced"
}

```

### ServiceAccountInstance -> google_service_account

```hcl

resource "google_service_account" "sa" {
  project     = "your_google_project_1234"
  account_id  = "your-service-account-name"
  description = "A nice and concise description of the purpose of the service account"
}

```

### BucketAccessInstance -> google_storage_iam_member

```hcl

resource "google_storage_bucket_iam_member" "sa_iam_bucket" {
  bucket = "your_storage_bucket"
  role   = "roles/storage.admin"
  member = "serviceAccount:${your_service_account_email}"
}

```

### WorkloadIdentityInstance -> google_service_account_iam_member

```hcl

resource "google_service_account_iam_member" "workload_identity_binding_example" {
  service_account_id = "google_service_account.sa.name"
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:kubernetes_project_id.svc.id.goog[your_namespace/your_app_name]"
}
```