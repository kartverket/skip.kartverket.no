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

# Per 14.02.2023 er clusternavn alltid på formatet atkv1-<env> (on-premise)
# Logg inn, generer kubeconfig og sett som aktiv context
$ gcloud container hub memberships get-credentials atkv1-dev

# Forrige kommando oppretter en ny context, som kan autentisere deg mot clusteret
# Contexten som blir opprettet her ser noe a la slik ut:
# connectgateway_kubernetes-<env>-xxxx_global_atkv1-<env>
# Eksempel: connectgateway_kubernetes-dev-94b9_atkv1-dev

# Har du lastet ned kubectx kan du bytte til contexten slik:
$ kubectx connectgateway_kubernetes-dev-94b9_atkv1-dev

# Om ikke kan du gjøre det med følgende kommando i kubectl:
$ kubectl config use-context connectgateway_kubernetes-dev-94b9_atkv1-dev

# Du kan også rename disse contextene til noe litt mer spiselig med følgende kommando
# Her er navn 2 vilkårlig
$ kubectl config rename-context connectgateway_kubernetes-dev-94b9_atkv1-dev atkv1-dev
```

Se også [https://cloud.google.com/anthos/multicluster-management/gateway/using](https://cloud.google.com/anthos/multicluster-management/gateway/using) .

For å ha adgang til å logge på clusteret må du være lagt inn i en `CLOUD_SK_TEAM` AD-gruppe som er synket med GCP.
