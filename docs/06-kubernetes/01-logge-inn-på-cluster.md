# Logge inn på cluster
## CLI (kubectl)

Først installer [gcloud](https://cloud.google.com/sdk/docs/install) og [kubectl](https://cloud.google.com/sdk/docs/components#managing_components) .

For å logge inn med kubectl gjør følgende:

```bash
# Login med gcloud hvis du ikke har gjort det allerede
$ gcloud auth login

# Sørg for at du står i riktig gcp-prosjekt
# Hvis du ikke vet hele navnet på prosjektet kan du finne dette vet å liste prosjekter
$ gcloud projects list

# GCP-prosjektet vil være et kubernetes-prosjekt med format kubernetes-<env>-xxxx
# Jobber du f.eks. i dsa-dev-e32c velger du kubernetes-dev-94b9
$ gcloud config set project kubernetes-dev-94b9

# Finn riktig clusternavn
$ gcloud container hub memberships list

# Clusternavn er alltid på formatet <cluster>-<env>, f.eks. atkv3-dev for on-prem og atgcp1-dev for GCP
# Logg inn, generer kubeconfig og sett som aktiv context
$ gcloud container hub memberships get-credentials atkv3-dev

# Forrige kommando oppretter en ny context, som kan autentisere deg mot clusteret
# Contexten som blir opprettet her ser noe a la slik ut:
# connectgateway_kubernetes-<env>-xxxx_global_atkv3-<env>
# Eksempel: connectgateway_kubernetes-dev-94b9_atkv3-dev

# Har du lastet ned kubectx kan du bytte til contexten slik:
$ kubectx connectgateway_kubernetes-dev-94b9_atkv3-dev

# Om ikke kan du gjøre det med følgende kommando i kubectl:
$ kubectl config use-context connectgateway_kubernetes-dev-94b9_atkv3-dev

# Du kan også rename disse contextene til noe litt mer spiselig med følgende kommando
# Her er navn 2 vilkårlig
$ kubectl config rename-context connectgateway_kubernetes-dev-94b9_atkv3-dev atkv1-dev
```

Se også [https://cloud.google.com/anthos/multicluster-management/gateway/using](https://cloud.google.com/anthos/multicluster-management/gateway/using) .

For å ha adgang til å logge på clusteret må du være medlem av en en `AAD - TF - TEAM` EntraID-gruppe som er synket med GCP.

Du kan sjekke om teamet ditt er lagt til i [entra-id-config](https://github.com/kartverket/entra-id-config/blob/main/org.yaml) 
hvis du er usikker.
