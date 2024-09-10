# 🤖 Skiperator

Skiperator is an operator intended to make the setup of applications simple from the users' point of view. 
You can look at it as a replacement of Helm, but with a more Kubernetes-native approach.
Skiperator is developed by SKIP for the Kubernetes platform and is based on the Operator SDK, which is a framework that uses the controller-runtime library to make writing operators easier.

The operator is designed to be used by application developers to deploy their applications and jobs into a Kubernetes cluster.
It will create all the necessary resources for the application to run, such as deployments, services, and ingress resources, 
and also handle security aspects like setting up network policies and service accounts so you as a developer don't have to worry about it.

Logs and metrics will be automatically available on https://monitoring.kartverket.cloud

Skiperator offers three CRDs (Custom Resource Definitions) to make it easy to deploy applications and jobs into a Kubernetes cluster:
- `Application` - for deploying applications
- `SKIPJob` - for running jobs and cron jobs
- `Routing` - for setting up routing rules, for example frontend and backend services under the same domain

To get started check out the [Requirements](01-requirements.md) and [Getting started](02-get-started.md) pages.
