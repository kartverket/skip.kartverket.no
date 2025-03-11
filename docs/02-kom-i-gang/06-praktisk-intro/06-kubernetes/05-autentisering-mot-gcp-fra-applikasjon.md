# Autentisering mot GCP fra applikasjon

## 1. Opprett Servicekonto

Dersom man ønsker å få tilgang til GCP-tjenester fra Kubernetes gjøres dette med å først opprette en servicekonto i GCP og å gi den IAM-rettigheter til det man ønsker at den skal gjøre.

Servicekontoer bør enten opprettes med terraform eller via [gcp-service-accounts](https://github.com/kartverket/gcp-service-accounts) repoet til SKIP.

## 2. Gi WIF IAM Policy til Servicekonto

To authenticate this service account in GCP from Kubernetes, the service account in Kubernetes needs to be given permission to impersonate the GCP service account. This is done by giving the Kubernetes Service Account the role `iam.workloadIdentityUser` through a so called Workload Identity Pool.

Given the following variables:

```
GCP_SA_NAME - Name of the GCP service account
GCP_SA_PROJECT_ID - GCP Project ID where the service account resides
KUBERNETES_PROJECT_ID - GCP Project ID for the Kubernetes cluster (for example kubernetes-dev-94b9 for dev-cluster)
KUBERNETES_NAMESPACE - The Kubernetes namespace where the Pod will run
KUBERNETES_SA_NAME - The Kubernetes service account name that your Pod is using (typically same name as Application, and with the -skipjob suffix for SKIPJobs)
```

Run the following command using the `gcloud` CLI:

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
