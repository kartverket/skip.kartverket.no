---
sidebar_position: 3
---

# Grunnleggende BotKube-kommandoer
## Hva er BotKube?

For å få tilgang til logger og å kjøre kommandoer mot clusteret har SKIP en
bot-integrasjon for ChatOps som heter [BotKube](https://botkube.io). Gjennom
BotKube kan man kan gjøre de fleste kommandoer man ville kunne gjort med
kubectl.

BotKube blir satt opp som en kanal i Slack hvor bot-integrasjonen leverer
meldinger og man kan be den om å hente ut diverse informasjon om clusteret. Man
kan også be BotKube abbonere på hendelser i clusteret slik at man får varsling
om dette i kanalen.

For mer info om bokube kan du se på [BotKubes
dokumentasjon](https://www.botkube.io/usage/).

## Kommandoer

### Vise lovlige kommandoer
```text title="@BotKube commands list"
allowed verbs:
  - cluster-info
  - explain
  - auth
  - api-resources
  - describe
  - diff
  - get
  - logs
  - top
  - api-versions
allowed resources:
  - deployments
  - pods
  - namespaces
  - daemonsets
  - statefulsets
  - storageclasses
  - nodes
```

### Slå opp Kubernetes namespaces
```text title="@BotKube get namespaces"
Cluster: ntp-test-cluster
NAME                           STATUS   AGE
botkube                        Active   2d20h
default                        Active   39d
elk                            Active   6d23h
fluentd                        Active   6d
ingress-nginx                  Active   18d
ingress-test                   Active   18d
kibana                         Active   6d2h
kube-node-lease                Active   39d
kube-public                    Active   39d
kube-system                    Active   39d
vault-test                     Active   38d
velero                         Active   27d
vmware-system-auth             Active   39d
vmware-system-cloud-provider   Active   39d
vmware-system-csi              Active   39d
```

### Slå opp pods på et namespace
```text title="@BotKube get pods -n botkube"
Cluster: ntp-test-cluster
NAME                       READY   STATUS    RESTARTS   AGE
botkube-57d46bcfcc-v2vms   1/1     Running   0          2d20h
```

### Hente ut logger
```text title="@BotKube logs -n botkube botkube-57d46bcfcc-v2vms"
File – Click to download
```
