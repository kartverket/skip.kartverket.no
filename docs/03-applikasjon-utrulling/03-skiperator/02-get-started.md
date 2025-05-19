# Getting started

Dette er en rask intro til konfigurasjon av en enkel Application, SKIPJob og Routing med skiperator. Før du begynner bør du ha vært igjennom [Krav](01-requirements.md) siden.

Dette er bare eksempel, og de fleste team bruker [templates]() for å gjøre det lettere
These are just simple examples. Teams usually use libsonnet to generate the yaml files for the CRDs.
For more detailed information on how to configure the CRDs see the [configuring](03-configuring.md) for more common use cases and [API docs](04-api-docs.md) for complete documentation.

## Application

An Application is our abstraction of a deployment. Skiperator will create all the necessary resources for you.
Create a file named `app.yaml` in `env/atkv3-dev/myapp` with the following content:

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: myapp
spec:
  image: ghrc.io/kartverket/myapp:latest
  port: 8080
  ingresses:
    - myapp.atkv3-dev.kartverket-intern.cloud
  redirectToHTTPS: true
  accessPolicy:
    inbound: 
      rules:
        - application: myjob-skipjob
```

You can then go into [argo](https://argo-dev.kartverket.dev) search for `myapp`and sync the application.
Skiperator will then read the Application resource and create a bunch of resources for you, like a deployment, service, ingress and network policy.
Your app should be reachable from the domain `myapp.atkv3-dev.kartverket-intern.cloud`.

## SKIPJob

A SKIPJob is our abstraction of a job or a cron job. Skiperator will create all the necessary resources for you.
Create a file named `job.yaml` in `env/atkv3-dev/myjob` with the following content:

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: SKIPJob
metadata:
  name: myjob
spec:
  container:
    image: ghrc.io/kartverket/myjob:latest
    command:
      - "sleep 10"
    accessPolicy:
      outbound:
        rules:
          - application: myapp

  cron:
    schedule: "* * * * *"
```

This creates a cron job that executes every minute. It also has an access policy that allows it to connect to `myapp`.
Skiperator will create network policies that allow the SKIPJob to connect to the Application. If you look at the application above you can see that it has an access policy that allows `myjob` to connect to it.
SKIPJobs must be postfixed with `-skipjob` in the access policy. You can also connect to applications in other namespaces, see more in [configuring](03-configuring.md) or the [api docs](04-api-docs.md).

## Routing

A Routing is an optional resource that you can use to facilitate path based routing, allowing multiple microservices to share the same hostname. Under the hood it's using Istio to proxy requests based on the http path. By using Routing you should remove the `ingresses` field in you Application manifest.
For example if you have two applications, frontend and backend, you can create a routing rule that routes requests to `/api` to the backend and everything else to the frontend.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Routing
metadata:
  name: myrouting
spec:
  hostname: kartverket.com
  routes:
    - pathPrefix: /api
      targetApp: backend-app
    - pathPrefix: /
      targetApp: frontend-app
```
