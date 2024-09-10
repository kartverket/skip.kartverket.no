# Common Skiperator configuration

This is just a quick reference for the most common configurations in Skiperator. 
For a complete reference see the [API docs](04-api-docs.md).
## Application

### Ingress
An ingress is a way to expose your application to the outside world. It is a Kubernetes resource that manages external access to services in a cluster, typically HTTP. 
This sets up all the necessary configuration behind the scenes to route traffic to your application, and also sets up a lets encrypt certificate for your application.

Simple example of an ingress:

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: ingressapp
spec:
  image: image
  port: 8080
  ingresses:
    - ingressapp.atkv3-dev.kartverket-intern.cloud
  redirectToHTTPS: true
```
This sets up an ingress to your application that can be reached from Kartverkets internal network. The `redirectToHTTPS` field is optional and will redirect all incoming traffic to HTTPS.
To make it publicly available you can remove the `-intern` part of the domain name.

If you want, or already have a different domain name for your application then we most likely need to set up a CNAME record in DNS. You can read more about domain names [here](../06-kubernetes/07-urler-og-sertifikat-for-tjenester-på-skip.md).

### Access policy
In SKIP we run istio as a service mesh. This means that all traffic between services is encrypted by default.
All traffic is also blocked with network policies or istio policies by default.
To allow traffic between services you need to set up an access policy.
This is done by specifying `spec.accessPolicy` in your application.

### allowing communication between two applications in the same namespace:
creates rules to allow traffic between application `app1` and `app2` in the same namespace on service ports
```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: app1
spec:
  image: image
  port: 8080
  accessPolicy:
    inbound:
      rules:
        - application: app2
    outbound:
      rules:
        - application: app2
---
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: app2
spec:
  image: image
  port: 8080
  accessPolicy:
    inbound:
      rules:
        - application: app1
    outbound:
      rules:
        - application: app1
```

#### allowing in and outbound traffic to an application in a different namespace
creates network policy rules to allow inbound and outbound traffic on service port to application `app2` in namespace `namespace2`
```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: app1
spec:
  image: image
  port: 8080
  accessPolicy:
    inbound:
      rules:
        - application: app2
          namespace: namespace2
    outbound:
      rules:
        - application: app2
          namespace: namespace2
```

#### allowing outbound traffic to a job in namespaces with label
creates outbound rules to allow traffic to the skipjob `job2` in all namespaces with label `team: someteam` on service port for `app2`
Note that all skipjobs must have the postfix `-skipjob` in the name when defining the application name in the access policy.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: app1
spec:
  image: image
  port: 8080
  accessPolicy:
    outbound:
      rules:
        - application: job2-skipjob
          namespaceByLabel: 
            team: someteam
```
#### access policy to allow traffic to a public domain
creates istio policies to allow traffic to a public domain on port 443, and different public domain on port 80

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: app1
spec:
  image: image
  port: 8080
  accessPolicy:
    outbound:
      external:
        - host: kartverket.no
        - host: google.com
          ports:
            - name: http
              port: 80  
              protocol: HTTP
```

### Replicas
you can either specify a fixed number of replicas or let the autoscaler handle it for you. 

if not specified skiperator uses autoscaler by default: 
```yaml
minReplicas: 2
maxReplicas: 5
```
static:
```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: static-replicas
spec:
  image: image
  port: 8080
  replicas: 2

```

autoscaler:
```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: auto-replicas
spec:
  image: image
  port: 8080
  replicas:
    min: 3
    max: 6
    targetCpuUtilization: 60
```
This will always have minimum 3 pods running, and scale up to more pods (max 6) if cpu utilization hits 60%.
Only minimum value is required.

### Environment variables
Environment values can be set directly in the application spec with `spec.env` or by using a secret or config map with `spec.envFrom`.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: auto-replicas
spec:
  image: image
  port: 8080
  env: 
    - name: ENV_VAR
      value: "value"
  envFrom:
    - configMap: config-map-name
    - configMap: config-map-name2
    - secret: secret-name
```
### GCP 
If your application needs to read a gcp bucket for example you need to set up a service account with the correct permissions and add it to the application spec.
Best practice here is to create a service account with the same name as the application, for example `myapp@some-project-id.iam.gserviceaccount.com`, then give this service account minimal permissions in GCP Console.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: auto-replicas
spec:
  image: image
  port: 8080
  gcp:
    auth: 
      serviceAccount: myapp@some-project-id.iam.gserviceaccount.com
```

## SKIPJob

### Cron
basic cron job that executes every minute
```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: SKIPJob
metadata:
  name: myjob
spec:
  container:
    image: image:latest
  cron:
    schedule: "* * * * *"
```

### Commands
a job that uses a command with a docker image
```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: SKIPJob
metadata:
  name: myjob
spec:
  container:
    image: "perl:5.34.0"
    command:
      - "perl"
      - "-Mbignum=bpi"
      - "-wle"
      - "print bpi(2000)"
```
### Access policy
This is the same as for applications, except we don't define inbound policies for jobs.

## Routing

### Frontend and backend services under the same domain

One thing that is important to remember with routes is that the order of the routes matters.
The route that is defined first will be the one that is matched first.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Routing
metadata:
    name: myrouting
spec:
    hostname: kartverket.com
    routes:
        - pathPrefix: /api          # Highest priority
          targetApp: backend-app
        - pathPrefix: /             # Lowest priority
          targetApp: frontend-app
```

