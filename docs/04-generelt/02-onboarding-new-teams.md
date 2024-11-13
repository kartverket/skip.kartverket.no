# Onboarding new product teams onto SKIP

:::info
Does you team want to use SKIP? Please read this article first: [Hva skal til for å bruke Plattformen?](https://kartverket.atlassian.net/wiki/spaces/DT/pages/497614849/Hva+skal+til+for+bruke+Plattformen)
:::

This page consists of responsibilities and important tasks that need to be done before on-boarding new product teams onto the SKIP platform. It consists both of tasks that need to be done by the SKIP team, as well as tasks that need to be done by the new product team.

We would greatly appreciate if you report any shortcomings and/or missing information in this guide to the SKIP team, either by contacting us or by commenting directly in this document.

:::info
The product team does not need to create a GCP project themselves!
:::

## SKIP team tasks

### Before onboarding

- Invite a representative from the product team to the plattformlaug
- Dedicate a SKIP team member as a point of contact for the migration process (TAM) *(Only for the migration process, after this is finished, a regular support flow is started)*
- Invite to a meeting to clarify expectations between SKIP and the product team
- Invite to review applications
- Agree on the frequency of *on-boarding standups* with the product team and invite to these
- Ensure that a process is started around risk assessment ("ROS-analyse"). This assessment must be ready in time for production

- Create a channel on slack for collaboration during on-boarding
- Invite to #gen-skip, #gen-argo and other relevant common channels for using SKIP
- Invite to GCP and Kubernetes courses if the product team wants it
- Give an introduction to ArgoCD and best practices for this tool

### During onboarding

- Invite to a kickoff meeting where points of contact, distribution of responsibilities, support, roadmap and any other relevant issues are discussed.
- GitHub, given that the team has not used this before
- Create groups by adding them to [entra-id-config](https://github.com/kartverket/entra-id-config)
- The team need to be labeled with `security` in the [admin.google.com](http://admin.google.com/) . This can only be done through click-ops and only Bård and Eline have access, sadly.
- The team needs to be added to the IAM repository
- Workflow in the IAM repository needs to be run by a SKIP member with access to do this.
- The teams are synced from AD into IAM
- If the team requires Terraform:
  - Service account for Terraform is set up through [gcp-service-accounts](https://github.com/kartverket/gcp-service-accounts) and are granted access to its Kubernetes namespace with [WIF](https://kartverket.atlassian.net/wiki/spaces/SKIP/pages/320570259/Workload+Identity+Federation).
  - Terraform state is migrated/set up
  - The team and app-repository is set up in accordance with [Komme i gang med Argo CD](../09-argo-cd/01-komme-i-gang-med-argocd.md)

## Product team tasks

The product team is responsible for delegating tasks among themselves.

- Inform SKIP who is the team lead so they can administer the AD group
- Consider which team members need extra Kubernetes/GCP courses
- If ArgoCD is going to be used: Create new Apps repository in GitHub based on [this SKIP template](https://github.com/kartverket/apps-template)
- Ensure the application completes an [IP and/or DPIA](https://kartverket.atlassian.net/wiki/spaces/PER/pages/436338711/Mal+for+IP+-+DPIA+og+ROS.+KOPIER+SIDENE+TIL+ET+EGET+OMR+DE.)

- Adapt the application in order to satisfy SKIP's security requirements
- Read, understand and follow the GitHub security requirements: [Sikkerhet på GitHub](https://kartverket.atlassian.net/wiki/spaces/SIK/pages/308216163/Sikkerhet+p+GitHub)
- Finish the risk assessment document (ROS-analyse)
- Prepare information for the SKIP team, including technical expectations and service design/architecture
- Take responsibility for your own requirements and communicate these clearly and concisely to SKIP
- Ensure all team members are invited to meetings and Slack groups during the on-boarding process
- Read and understand the SKIP documentation
- Make the expected/required go-live date known to SKIP
