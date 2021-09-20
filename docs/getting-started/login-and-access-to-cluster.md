---
sidebar_position: 6
---

# Login og tilgang til cluster miljøer

```bash
$ kubectl vsphere login --server=<ip/domene> -u <brukernavn> --tanzu-kubernetes-cluster-namespace <namespace> --tanzu-kubernetes-cluster-name <cluster>
```

NB! Du vil få beskjed om at du kan bytte context vha. `kubectl config use-context
contextname`, men det vil resultere i context bytte uten autorisering for
clusteret. Dvs. du vil ikke ha de rette tilgangene uten å logge inn på nytt ved
å spesifisere hvilket cluster du logger inn på.

