# Troubleshooting on SKIP

:::info
This page is under construction and may be updated without warning
:::

Troubleshooting an application on SKIP can be daunting. This documentation aims to give readers a rough idea of where to start and what to look for when troubleshooting. It is intended for use both by SKIP team members as well as product team members, and we will take care to specify troubleshooting steps that might need additional access that is only available to SKIP team members or administrators.

# Relevant links

[Skiperator code and documentation](https://github.com/kartverket/skiperator)

[CLI Cheatsheet for SKIP](https://kartverket.atlassian.net/wiki/spaces/SKIP/pages/404553808/CLI+Cheatsheet+for+SKIP) (may require additional privileges)

# General checklist when troubleshooting

Network/Istio related issues:

- Network policies - default-deny and others (if applicable).
- AccessPolicies both outbound and inbound.
- ServiceEntries
- +++
