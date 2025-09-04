# Logge inn på cluster

På denne siden går vi gjennom hvordan du logger inn på et cluster og får tilgang til det i terminalen. 

Denne guiden krever at du har [gcloud](https://cloud.google.com/sdk/docs/install) og [kubectl](https://cloud.google.com/sdk/docs/components#managing_components) installert. 

I tillegg til gcloud cli trenger du også `gke-gcloud-auth-plugin` for å kunne logge inn på et cluster. 
```bash
gcloud components install gke-gcloud-auth-plugin
```

### 1. Logg inn med gcloud

Hvis du ikke har logget inn med gcloud allerede må du logge inn

```bash
gcloud auth login
```

### 2. Finn og velg riktig GCP-prosjekt

Først, list opp tilgjengelige prosjekter for å finne riktig ett:

```bash
gcloud projects list
```

GCP-prosjektet vil være et kubernetes-prosjekt med format `kubernetes-<env>-xxxx`. Jobber du f.eks. i `dsa-dev-e32c` velger du `kubernetes-dev-94b9` (samme env). 

Sett riktig prosjekt:

```bash
gcloud config set project kubernetes-dev-94b9
```

### 3. Finn riktig clusternavn

List opp tilgjengelige clusters:

```bash
gcloud container hub memberships list
```

**Clusternavn-format:**
- **On-prem**: `<cluster>-<env>-user-cluster` (f.eks. `atkv3-dev-user-cluster`)
- **GCP**: `<cluster>-<env>` (f.eks. `atgcp1-dev`)

### 4. Logg inn på clusteret

Generer kubeconfig og sett som aktiv context:

```bash
gcloud container hub memberships get-credentials atkv3-dev-user-cluster
```

Denne kommandoen oppretter en ny context som kan autentisere deg mot clusteret.

**Context-format som opprettes:**
- **For GCP**: `connectgateway_kubernetes-<env>-xxxx_global_<clusternavn>`
- **For on-prem**: `connectgateway_kubernetes-<env>-xxxx_europe-north1_<clusternavn>`

**Eksempel**: `connectgateway_kubernetes-dev-94b9_europe-north1_atkv3-dev-user-cluster`

### 5. Bytte til riktig context

Hvis du har `kubectx` installert:

```bash
kubectx connectgateway_kubernetes-dev-94b9_europe-north1_atkv3-dev-user-cluster
```

Eller bruk kubectl direkte:

```bash
kubectl config use-context connectgateway_kubernetes-dev-94b9_europe-north1_atkv3-dev-user-cluster
```

### 6. (Valgfritt) Gi contexten et enklere navn

Du kan gi contexten et mer lesbart navn:

```bash
kubectl config rename-context connectgateway_kubernetes-dev-94b9_europe-north1_atkv3-dev-user-cluster atkv3-dev
```

## Eksterne ressurser

Se også [https://cloud.google.com/anthos/multicluster-management/gateway/using](https://cloud.google.com/anthos/multicluster-management/gateway/using).

## Tilgangskrav

For å ha adgang til å logge på clusteret må du være medlem av en `AAD - TF - TEAM` EntraID-gruppe som er synket med GCP.

Du kan sjekke om teamet ditt er lagt til i [entra-id-config](https://github.com/kartverket/entra-id-config/blob/main/org.yaml) hvis du er usikker.
