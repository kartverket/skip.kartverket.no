# Google Cloud Storage (GCS)

Denne siden viser hvordan du kommer i gang med Google Cloud Storage-buckets for applikasjoner på SKIP.

## Nar passer GCS?

Bruk GCS når du trenger objektlagring for eksempel:

- filer og vedlegg
- eksport/import av data
- backupfiler

## Forutsetninger

Før du starter, sjekk at du har:

- Et GCP-prosjekt for miljøet ditt (dev/test/prod)
- [Tilgang til prosjektet ditt](../02-kom-i-gang/04-team/06-access-gcp.md)
- Aktivert riktig PAM-tilgang via [PAM Google Cloud](../02-kom-i-gang/04-team/09-pam-google-cloud.md)
- Et repo/oppsett for Terraform (anbefalt) via [Bruk av Terraform](../03-applikasjon-utrulling/08-github-actions/01-bruk-av-terraform.md)

## 1) Opprett bucket (anbefalt med Terraform)

Vi anbefaler at buckets opprettes med Terraform, ikke manuelt i konsollet. SKIP teamet har opprettet en terraform-modul for GCS som du kan bruke i ditt eget Terraform-oppsett. Se [Terraform-modulen for GCS](https://github.com/kartverket/terraform-modules/wiki/cloud_storage) for mer informasjon.


## 2) Gi applikasjonen minst mulig tilgang

Opprett en dedikert Service Account for applikasjonen, og gi kun nødvendige roller på bucket-nivå. (Dette bør gjøres med terraform, se forrige punkt).

Eksempel med lesetilgang:

```hcl
resource "google_service_account" "myapp" {
  account_id   = "myapp"
  display_name = "myapp on SKIP"
  project      = var.project_id
}

resource "google_storage_bucket_iam_member" "myapp_reader" {
  bucket = google_storage_bucket.app_data.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:${google_service_account.myapp.email}"
}
```

Vanlige roller:

- `roles/storage.objectViewer`: lese objekter
- `roles/storage.objectCreator`: laste opp nye objekter
- `roles/storage.objectAdmin`: lese/skrive/slette objekter

> Bruk laveste mulig rolle. Unnga brede prosjektroller nar bucket-niva holder.

## 3) Koble appen til GCP i Skiperator

Legg service account i applikasjonsmanifestet, som beskrevet i [Vanlig Skiperator-konfigurering](../03-applikasjon-utrulling/03-skiperator/03-configuring.md#gcp).

Da bruker applikasjonen Workload Identity-flyt i SKIP, og du slipper a håndtere JSON-nokler selv. Kubernetes servicekontoen må [gis tilgang til GCP servicekontoen](../03-applikasjon-utrulling/05-gcp-resurser-fra-k8s.md).
- bruk separate buckets per miljø og applikasjon

## Feilsøking

- `403` mot GCS
    - Sjekk IAM-rolle på bucket for Service Account
    - Sjekk at Kubernetes Service Account har tilgang til GCP Service Account
    - Sjekk at Kubernetes Service Account og namespace er riktig i IAM-bindingen for Workload Identity
- timeout/tilkoblingsfeil: sjekk `accessPolicy` for `storage.googleapis.com:443`
- feil miljø/prosjekt: sjekk at riktig Google Service Account brukes i manifestet

