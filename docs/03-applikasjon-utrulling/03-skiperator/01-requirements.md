# Requirements

In order to deploy your applications and jobs to SKIP, you and your team need to have some prerequisites in place.

## Application and job requirements

First of all your applications and jobs need to be containerized. This means that your application or job needs to be packaged in a linux container image that can be run in a Kubernetes cluster.
In SKIP we recommend to use the [scratch](https://hub.docker.com/_/scratch) image as a base image for your application or job. This is a minimal image that only contains the necessary files to run your application or job.

Next the image needs to be hosted in a container registry that is accessible from the Kubernetes cluster.
In SKIP we use [github](../../02-kom-i-gang/06-praktisk-intro/01-github/index.md) as our container registry. It doesn't matter if the image is publicly available or private, as long as the repository is under the Kartverket organization.

## CI CD requirements

In order to deploy your application you need to have set up a CI/CD pipeline that builds and pushes your container image to the container registry.
As previously mentioned, in SKIP we use github as the repository. You can read more about how to set up a CI/CD pipeline in the [github actions](../08-github-actions/index.md) documentation.

We also need to set up Argo CD for deployment of the application. You can read more about how to set up Argo CD in the [Argo CD](../09-argo-cd/index.md) documentation.

## Summary

So to summarize, in order to use Skiperator and run your applications in SKIP you need to have the following in place:

- Your application or job needs to be containerized
- The container image needs to be hosted in a container registry that is accessible from the Kubernetes cluster (github)
- A CI/CD pipeline that builds and pushes the container image to the container registry
- Argo CD set up for deployment of the application from a `team-apps` repository

Now that you have the prerequisites in place you can move on to the [Getting started](../../02-kom-i-gang/index.md) page to learn how to deploy your application or job to SKIP.
