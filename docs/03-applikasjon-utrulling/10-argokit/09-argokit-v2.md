# V2 API Reference

### jsonnet ArgoKit API

The following examples are available at [our github](https://github.com/kartverket/argokit/v2/examples)


| Template                    | Description                                                           | Example                                                                                    |
|-----------------------------|-----------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| `argokit.appAndObjects.application.new()` | Creates a Skiperator application, using the appAndObjects convention (this is default).| See above                                                                                  |

### ArgoKit's Replicas API
**NOTE!** It is not recommended to run with less than 2 replicas...
| Template                                | Description                                                     | Example                                                                                    |
|-----------------------------------------|-----------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| `argokit.appAndObjects.application.withReplicas`   | Create replicas for an application with sensible defaults  | [examples/replicas.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/replicas.jsonnet)               |
| `argokit.appAndObjects.application.withReplicas`   | Create replicas for an application with memory monitoring  | [examples/replicasets-with-memory.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/replicas-with-memory.jsonnet)   |
| `argokit.appAndObjects.application.withReplicas`   | Creates a static replica without cpu- and memory monitoring | [examples/replicasets-static.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/replicas-static.jsonnet) |


### ArgoKit's Environment API

| Template                                              | Description                                                    | Example                                                                  |
|-------------------------------------------------------|----------------------------------------------------------------|--------------------------------------------------------------------------|
| `argokit.appAndObjects.application.withEnvironmentVariable`         | Creates environment variables for an app                       | [examples/environment.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/environment.jsonnet) |
| `argokit.appAndObjects.application.withEnvironmentVariables`         | Creates mutliple environment variables for an app                       | [examples/environment.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/environment.jsonnet) |
| `argokit.appAndObjects.application.withEnvironmentVariableFromSecret`   | Creates environment variable from a secret                     | [examples/environment.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/environment.jsonnet) |
| `argokit.appAndObjects.application.withEnvironmentVariableFromSecret`   | Creates environment variable from a secret | [examples/environment.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/environment.jsonnet) |

---
### ArgoKit's Ingress API

| Template                                              | Description                                                    | Example                                                                  |
|-------------------------------------------------------|----------------------------------------------------------------|--------------------------------------------------------------------------|
| `argokit.appAndObjects.application.forHostname`         | Creates ingress for an app.                      | [examples/ingress.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/ingress.jsonnet) |


### ArgoKit's accessPolicies API

You can define what external services (hosts/IPs) and internal SKIP applications your app may communicate with.

| Template                                                          | Description                                                                 | Example |
|-------------------------------------------------------------------|-----------------------------------------------------------------------------|---------|
| `argokit.appAndObjects.application.withOutboundPostgres(host, ip)`   | Allow outbound traffic to a Postgres instance           | [examples/accessPolicies.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/accessPolicies.jsonnet) |
| `argokit.appAndObjects.application.withOutboundOracle(host, ip)`     | Allow outbound traffic to an Oracle DB                       | [examples/accessPolicies.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/accessPolicies.jsonnet) |
| `argokit.appAndObjects.application.withOutboundSsh(host, ip)`        | Allow outbound SSH                                    | [examples/accessPolicies.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/accessPolicies.jsonnet) |
| `argokit.appAndObjects.application.withOutboundLdaps(host, ip)`      | Allow outbound secure LDAP port                                   | [examples/accessPolicies.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/accessPolicies.jsonnet) |
| `argokit.appAndObjects.application.withOutboundHttp(host, portname='', port=443, protocol='')` | Allow outbound HTTPS/HTTP to a host | [examples/accessPolicies.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/accessPolicies.jsonnet) |
| `argokit.appAndObjects.application.withOutboundSkipApp(appname, namespace='')` | Allow outbound traffic to another SKIP application (outbound rule) | [examples/accessPolicies.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/accessPolicies.jsonnet) |
| `argokit.appAndObjects.application.withInboundSkipApp(appname, namespace='')`  | Allow another SKIP application to reach this one (inbound rule) | [examples/accessPolicies.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/accessPolicies.jsonnet) |
### ArgoKit's Probe API
Configure health probes for applications.

| Template                                                                 | Description                                                            | Example |
|--------------------------------------------------------------------------|------------------------------------------------------------------------|---------|
| `argokit.appAndObjects.application.probe(path, port, failureThreshold=3, timeout=1, initialDelay=0)` | Builds a probe object (path, port, thresholds)                         | - |
| `argokit.appAndObjects.application.withReadiness(probe)`                    | Adds a readiness probe (controls when traffic is sent to the pod)      |[examples/probes](https://github.com/kartverket/argokit/blob/main/v2/examples/probes.jsonnet)|
| `argokit.appAndObjects.application.withLiveness(probe)`                     | Adds a liveness probe (restarts container if failing)                  | [examples/probes](https://github.com/kartverket/argokit/blob/main/v2/examples/probes.jsonnet) |
| `argokit.appAndObjects.application.withStartup(probe)`                      | Adds a startup probe (gates other probes until it succeeds)            | [examples/probes](https://github.com/kartverket/argokit/blob/main/v2/examples/probes.jsonnet) |


### ArgoKit's routing API
Configure routing for applications on SKIP.

| Template                                                                 | Description                                                            | Example |
|--------------------------------------------------------------------------|------------------------------------------------------------------------|---------|
| `argokit.routing.new(name, hostname, redirectToHTTPS)` | Builds a route object                                                                    | [examples/routing.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/routing.jsonnet) |
| `argokit.routing.withRoute(pathPrefix, targetApp, rewriteUri, port)` | Add route to the routes object                                             | [examples/routing.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/routing.jsonnet) |


### ArgoKit's Rolebinding API
Configure rolebinding resources for applications on SKIP. Create the resource with the `new()` function, then add either users or a group as the subject.
| template | Description |Example |
|---|---|---|
|`argokit.k8s.rolebinding.new()`| Create a new rolebinding resource| [examples/rolebinding.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/rolebinding.jsonnet)|
|`argokit.k8s.rolebinding.withUsers(users)`| Add a list of users as subjects | [examples/rolebinding.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/rolebinding.jsonnet)|
|`argokit.k8s.rolebinding.withNamespaceAdminGroup(groupname)`| Add a namespace‑admin group as a subject | [examples/rolebinding.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/rolebinding.jsonnet)|

### ArgoKit's ExternalSecret API
Configure external secrets and stores.
| template | Description |Example |
|---|---|---|
|`argokit.externalSecrets.secret.new()`| Create a new external secret | [examples/externalSecrets.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/externalSecrets.jsonnet)|
|`argokit.externalSecrets.store.new()`| Create a new external store | [examples/externalSecrets.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/externalSecrets.jsonnet)|

### ArgoKit's ConfigMap API
Configure ConfigMap resources for applications on SKIP.
All methods have the `addHashToName` parameter to create the ConfigMap with a unique name (hashed suffix).
| template | Description |Example |
|---|---|---|
|`argokit.k8s.configMap.new(name, data, addHashToName)`| Create a new ConfigMap | [examples/configMap.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/configMap.jsonnet)|
|`argokit.appAndObjects.application.withConfigMapAsEnv(name, data, addHashToName)`| Create a new ConfigMap and add its content as env in the application | [examples/withConfigMap.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/withConfigMap.jsonnet)|
|`argokit.appAndObjects.application.withConfigMapAsMount(name, mountPath, data, addHashToName)`| Create a new ConfigMap and mount it as a file in the application's file system | [examples/withConfigMap.jsonnet](https://github.com/kartverket/argokit/blob/main/v2/examples/withConfigMap.jsonnet)|
