---
title: Apps Repositories
description: >
    TODO
slug: apps-repositories
authors:
  - name: Eline Henriksen
    title: Product Owner and Platform Developer
    url: https://eliine.dev
    image_url: https://github.com/eliihen.png
tags: []
image: https://logos.flamingtext.com/City-Logos/Todo-Logo.png
hide_table_of_contents: false
---

![TODO](https://logos.flamingtext.com/City-Logos/Todo-Logo.png)

Argo CD is an awesome tool. It helps teams de-mystify the deployment process on
Kubernetes by providing a visual representation of the deployments in the
cluster, and GitOps methodologies gives a consistent and understandable
structure to your configuration files.

But what's the best way to scale when adding more teams? How can we make sure
that we're building our GitOps in a way that facilitates for self service and
security? That's what we'll discuss in this blog post.

Kartverket has been using Argo CD and GitOps for several years, and we've built
an architecture that solves our needs for scale and self-service. Here we'll
share our learnings and discuss why our teams are so happy with our Argo setup.

<!--truncate-->

## What makes multi-tenancy in Argo CD hard?

So you've deployed Argo CD on your multi-tenant cluster and given your teams
access to the user interface. Let's imagine we now have tens of teams and
hundreds of applications in the Argo UI. When we start scaling out to more than
a handful of users we get into some issues with scale. Examples of these issues
can be:

- How do you organize your apps and projects?
- How do you make sure no two teams accidentally use the same namespace?
- How can we make sure teams clean up unused deployment resources?
- How do you seamlessly deploy to multiple clusters?

As a platform team we often find ourselves thinking that everyone loves 
infrastructure and Kubernetes as much as we do. This is not the case! Most
people have not had the joy of having their childhood ruined by installing
Linux on their school laptops and configuring WLAN drivers using ndiswrapper.
Believe it or not, most people just want tools to get out of their way and let
them do their job, be that programming, testing or anything else. Not every team
is going to be experts in Kubernetes and Argo. So should we expect all teams to
know what a deletion finalizer is? What about the intricacies of serverside
apply vs. clientside apply?

It's our responsibility as a platform team to make the user experience of
deploying to Kubernetes as user friendly as possible. After implementing an
architecture built with UX in mind we've had the joy of seeing people who are
extremely skeptical of Kubernetes and the cloud be won over by how easy it is
to get your workloads running on Kubernetes. This is thanks to the consistent
user experience and built-in best practices of the apps-repo architecture.
But we're getting ahead of ourselves, first we need to talk about a few
abstractions that make this possible.

## What are ApplicationSets?

In Argo CD there's an advanced feature that allows for the automation of
creating Argo CD Applications called
[ApplicationSets](https://argo-cd.readthedocs.io/en/stable/user-guide/application-set/).
Using an ApplicationSet we can essentially make a template that generates
Argo CD applications based on files or folders in a Git repository. Using
ApplicationSets we can build in features and assumptions and provide the teams
with a user experience that essentially boils down to "add a file to a repo and
it gets deployed to the cluster". The purest form of GitOps. No messing around
with Argo CD applications and projects.

You could have the teams put these manifest files into their source code
repositories, but this is [not considered best
practice](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/#separating-config-vs-source-code-repositories).
Usually you would put your manifests into a separate repo so that changes to the
manifests don't conflict with changes in the source code. We call this repo an
apps repo.

## Introducing apps repositories

The apps repo is where the product teams put their manifests. It has a consistent
structure and is designed to be read by an Argo CD ApplicationSet. It also has a
lot of nifty features that enable self-service which we'll get back to.

First, let's have a look at the structure of an apps repo.

```
teamname-apps/
  env/
    clustername/
      namespace/
        example.yaml
```

In the simplest of terms, this tree describes where to deploy a given manifest. By
using a directory tree it makes setting up an ApplicationSet for this repo trivial.

Consider this example ApplicationSet:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: exampleteam-apps
  namespace: argocd
spec:
  generators:
    - git:
        directories:
          - path: env/*/*
        repoURL: 'https://github.com/kartverket/exampleteam-apps.git'
        revision: HEAD
  goTemplate: true
  goTemplateOptions:
    - missingkey=error
  template:
    metadata:
      name: '{{.path.basename}}'
    spec:
      destination:
        namespace: '{{ index .path.segments 2 }}'
        server: '{{ index .path.segments 1 }}'
      project: exampleteam
      source:
        path: '{{.path.path}}'
        repoURL: 'https://github.com/kartverket/exampleteam-apps.git'
        targetRevision: HEAD
      syncPolicy:
        syncOptions:
          - CreateNamespace=true
```

With this ApplicationSet any directory within `env/*/*` will be picked up by
the ApplicationSet controller and a new Argo CD Application will be created
based on the template in the `template` object. This enables a product team
to create any number of applications for their products.

An example use for this is a product team wanting a namespace for each of
their products. Instead of having to order a new namespace from the platform
team when they create a new product, they can simply create it themselves by
adding a new directory with the same name as the namespace they want. A new
Kubernetes namespace will be automatically created thanks to the
`CreateNamespace=true` sync option.

Ephemeral namespaces, aka. preview namespaces, is another usecase. Say a team
wants to review a change before merging it to `main`. They could review the
change in the Pull Request, but this removes us from the end user's perspective
and is not suitable for non-technical people. With a preview environment the
team will automatically create a new directory in the apps repo when a PR is
created, and thus get a complete deployment with the change in question. This
enables end-to-end testing in a browser, and also allows non-technical people
to do QA before a change is merged. When it is merged another workflow can
automatically delete the directory, which cleans up and deletes the preview
environment.

Our convention is that namespaces are formatted with `productname-branch`. This
allows teams to have multiple deploys per product, and also multiple products 
per team. So when a new PR is created all a team needs to do to automate the
creation of a new directory using CI tools like GitHub actions to create a new 
commit in the apps-repo. This also enables the flexibility to create it as a PR
in the apps-repo, but for ephemeral namespaces, this is usually not necessary.

For example:

```
footeam-apps/
  env/
    foo-cluster/
      foo-main/
        app.yaml
      foo-feature-123/
        app.yaml
```

## Automating and avoiding duplication

Depending on the complexity of the apps repo, the amount of products and branches
and a subjective "ickyness" with duplicating files (can you spell DRY?), you have
several options on how to automate creating new namespaces.

Simple repos will probably be fine with directories containing simple yaml-files
that are synced to the cluster. Newer product teams especially appreciate the
simplicity of this approach. To optimize for this you may consider using a 
`template` directory at the base containing some example files that are copied
into the sub-directories. A psuedo-coded GitHub action that uses a
`frontend.yaml` template from the templates directory could look like the
following:

```yaml
jobs:
  build:
    # Build a container image and push it

  deploy:
    strategy:
      matrix:
        env: ['dev', 'test', 'prod']
    steps:
      # .. Checkout repo & other setup ..

      - name: Deploy to ${{ matrix.version }}
        run: |
          namespace="myapp-${{ github.ref_name }}"
          path="./env/atkv3-${{ matrix.env }}/$namespace"
          mkdir -p $path
          cp -r templates/frontend.yaml $path/frontend.yaml
          kubectl patch --local \
            -f $path/frontend.yaml \
            -p '{"spec":{"image":"${{needs.build.outputs.container_image_tag}}"}}' \
            -o yaml
          git config --global user.email "github-actions@github.com"
          git config --global user.name "GitHub Actions"
          git commit -am "Deploy ${{ matrix.env }} version ${{ github.ref_name }}"
          git push
```

This works for most simple apps. Our experience, however, is that as a team
matures and gets more experienced with Kubernetes and Argo CD, they add more
complexity and want more control. At this point most teams will migrate to using
[jsonnet](https://jsonnet.org) to enable referencing and extending a reusable
library shared between multiple components. SKIP also provides some common
manifests via [ArgoKit](https://github.com/kartverket/argokit), a jsonnet
library.

[Kustomize](https://kustomize.io) is also a common choice, widely used by SKIP
for our own infrastructure, but not really widespread with other teams.

## Security considerations

You may be wondering: "This seems great and all, but what about the security
implications of allowing teams to create and edit namespaces in a multi-tenant
cluster? That seems really dangerous!". 

First of all, I love you for thinking about security. We need more people like
you. Second, Argo CD has some great features we can leverage to make this work
without removing the self-service nature of the apps repo architecture.

### Prefixes

In order to make this work we need to give each team a set of prefixes. A
prefix will usually be the name of a product that a product team has
responsibility for maintaining. The only important part is that it is unique
and that no other teams have been allocated the same prefix. At Kartverket
this is done by the platform team as part of the onboarding checklist.

The prefix is used as part of all namespaces that are created by the teams. In
the example namespace `product-feature-123`, `product` is the prefix. By giving
each team a set of prefixes it helps them separate products into easily
identifiable namespaces and it ensures that a product team does not accidentally
use another team's namespace.

Since each product team has an apps repo with the ability to name their
directories as they wish, how can we enforce this? This is where Argo CD's
Projects come into play.

[Argo CD Projects](https://argo-cd.readthedocs.io/en/stable/user-guide/projects/)
provide a logical grouping of applications, which is useful when Argo CD is used
by multiple teams. It also contains a field that allows allowlisting which
clusters and namespaces are usable by a project.

Add the following to a Project to only allow this project to create and sync to
namespaces prefixed with `myprefix-`.

```
metadata:
  name: exampleteam
spec:
  destinations:
  - namespace: 'myprefix-*'
    server: '*'
```

If you scroll back up to the ApplicationSet example above, you will see that it
only creates applications with the project `exampleteam`. This will automatically
wire any applications created to the destination rules we've defined in this
project and therefore deny any attempts by a team to use prefixes that they have
not been allocated.

The crucial part here is that ApplicationSets and Projects are provisioned by the
platform team, and therefore build in these security features. These resources
must not be accessible to the teams, or an attacker can simply add exclusions.

### Namespace resources

Another way this could be abused is if a team is able to create Namespace
resources in their apps repository. This should be denied using Argo and/or
cluster policies.

If a team is able to create namespace resources (or other cluster scoped
resources) in their namespace an attacked can use this to break their namespace
"encapsulation". Imagine for example if one could use their apps repo to sync
a namespace resource named `kube-system` into their `env/foo-cluster/foo-main`
directory. Argo CD would allow this, as the manifests are read into an Argo CD
application. Then the attacker could delete the namespace and take down the
cluster.

![A slide from KubeCon Europe 2024 showing why it's a bad idea to let product teams create namespaces](https://logos.flamingtext.com/City-Logos/Todo-Logo.png)

It's useful in this multi-tenancy scenario to think of namespaces as resources
owned by the platform team and namespace-scoped resources as owned by the
product teams. This is considered a best practice, and was reiterated at KubeCon
Europe 2024 by XX. Allowing product teams to edit namespaces can open up a ton
of attack vectors, like disabling [Pod Security Admission](https://kubernetes.io/docs/concepts/security/pod-security-admission)
controllers, allowing an attacker to create privileged containers which can
compromise the host node. 

Friends don't let friends edit namespaces!

## Self service configuration

## Tradeoffs
- Moving projects from team to team
- Onboarding a team is a two-step process (creating project and app repo)

## Results
- Onboarding times have become super short
- Teams find this intuitive, especially when combined with auto-sync

## Thank you for reading!
