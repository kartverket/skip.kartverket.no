# 🤖 Skiperator

Skiperator er en operator utviklet for å gjøre oppsett av applikasjoner enkelt for brukerne.
Du kan se på det som en erstatning for Helm, men med en mer Kubernetes-nativ tilnærming.
Skiperator er utviklet av SKIP for Kubernetes-plattformen og er basert på Operator SDK, som er et rammeverk som bruker controller-runtime-biblioteket for å gjøre det enklere å skrive operatorer.

Operatoren er designet for å brukes av applikasjonsutviklere til å rulle ut sine applikasjoner og jobber i et Kubernetes-cluster.
Den vil opprette alle nødvendige ressurser for at applikasjonen skal kjøre, som deployments, tjenester (services) og ingress-ressurser,
og den håndterer også sikkerhetsaspekter som oppsett av nettverkspolicyer (network policies) og tjenestekontoer (service accounts) slik at du som utvikler ikke trenger å bekymre deg for det.

Logger og metrikker vil automatisk være tilgjengelige på [monitoring.kartverket.cloud](https://monitoring.kartverket.cloud)

Skiperator tilbyr tre CRDer (Custom Resource Definitions) for å gjøre det enkelt å rulle ut applikasjoner og jobber i et Kubernetes-cluster:

- `Application` - for utrulling av applikasjoner
- `SKIPJob` - for kjøring av jobber og cron-jobber
- `Routing` - for oppsett av ruteringsregler, for eksempel frontend- og backend-tjenester under samme domene

For å komme i gang, sjekk ut sidene for [Krav](01-requirements.md) og [Kom i gang](../../02-kom-i-gang/index.md).
