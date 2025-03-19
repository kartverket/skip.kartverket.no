# Autentisering mot GCP fra applikasjon

## 1. Opprett Servicekonto

Dersom man ønsker å få tilgang til GCP-tjenester fra Kubernetes gjøres dette med å først opprette en servicekonto i GCP og å gi den IAM-rettigheter til det man ønsker at den skal gjøre.

Servicekontoer bør enten opprettes med terraform eller via [gcp-service-accounts](https://github.com/kartverket/gcp-service-accounts) repoet til SKIP.

## 2. Gi WIF IAM Policy til Servicekonto

For å autentisere som denne GCP servicekontoen fra kubernetes må kubernetes service kontoen gis tilganger til det. Dette gjøres ved å gi rollen `iam.workloadIdentityUser`. 

Gitt variablene:

```
GCP_SA_NAME - Navnet på GCP servicekontoen
GCP_SA_PROJECT_ID - GCP Project ID til prosjektet GCP SA ligger i
KUBERNETES_PROJECT_ID - GCP Project ID for Kubernetes-cluster (for eksempel `kubernetes-dev-94b9` for dev-clusteret)
KUBERNETES_NAMESPACE - The Kubernetes namespace hvor servicekontoen er opprettet
KUBERNETES_SA_NAME - The Kubernetes service account som brukes av Pod (Vanligvis samme som applikasjonsnavnet, men med et suffix -skipjob for SKIPJob'er)
```

Kjør følgende kommando med `gcloud` CLI:

```bash
gcloud iam service-accounts add-iam-policy-binding \
  GCP_SA_NAME@GCP_SA_PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/iam.workloadIdentityUser \
  --member="serviceAccount:KUBERNETES_PROJECT_ID.svc.id.goog[KUBERNETES_NAMESPACE/KUBERNETES_SA_NAME]"
```

## 3. Legg inn config i Skiperatormanifest

Til slutt legger man til `gcp` config i sin skiperator Application for å lage kubernetes-config slik at podden kan autentisere mot GCP.

```yaml
//yaml format
spec:
  gcp:
    auth:
      serviceAccount: GCP_SA_NAME@GCP_SA_PROJECT_ID.iam.gserviceaccount.com
```

Nå kan man følge “Authenticate from your code” under [https://cloud.google.com/anthos/fleet-management/docs/use-workload-identity#-python](https://cloud.google.com/anthos/fleet-management/docs/use-workload-identity#-python) for å autentisere mot GCP fra koden sin.

Når dette er gjort kan applikasjonen snakke med GCP under runtime.

## Alternativ til 1 / 2

Dersom man ikke ønsker å legge til roller manuelt har SKIP lagt til en ny måte å legge til Workload Identity User på en service account, ved hjelp av Crossplane.

```yaml
apiVersion: 'skip.kartverket.no/v1alpha1'
kind: 'WorkloadIdentityInstance'
metadata:
  name: 'service-account-wi'
spec:
  parameters:
    gcpKubernetesProject: 'some-kubernetes-project' #eks: 'kubernetes-dev-94b9'
    gcpProject: 'gcp-project-where-service-account-is' #eks: 'dsa-dev-e32c'
    gcpServiceAccount: 'name-of-service-account-in-gcp' #eks: 'dsa-runtime@dsa-dev-e32c.iam.gserviceaccount.com'
    serviceAccount: 'name-of-service-account-in-kubernetes' #eks 'dsa-backend', typically same name as your Application
```

Se [Provisjonere infrastruktur med Crossplane](../09-argo-cd/05-provisjonere-infrastruktur-med-crossplane.md) om du ikke har brukt Crossplane tidligere.
