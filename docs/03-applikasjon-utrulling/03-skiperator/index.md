# 🤖 Skiperator

Skiperator er en operator som har som mål å gjøre oppsett av applikasjoner enkelt sett fra brukernes ståsted.
Man kan se på den som en erstatning for Helm, men med en mer Kubernetes-nativ tilnærming.
Skiperator er utviklet av SKIP for Kubernetes-plattformen og er basert på Operator SDK, som er et rammeverk som bruker controller-runtime-biblioteket for å gjøre det enklere å skrive operatorer.

Operatoren er designet for å brukes av applikasjonsutviklere for å deploye applikasjoner og jobber til et Kubernetes-cluster.
Den vil opprette alle nødvendige ressurser for at applikasjonen skal kjøre, slik som deployments, tjenester og ingress-ressurser,
og håndterer også sikkerhetsaspekter som oppsett av nettverkspolicyer og tjenestekontoer, slik at du som utvikler ikke trenger å bekymre deg for det.

Logger og metrikker vil automatisk være tilgjengelige på [monitoring.kartverket.cloud](https://monitoring.kartverket.cloud)

Skiperator tilbyr tre CRDer (Custom Resource Definitions) for å gjøre det enkelt å deploye applikasjoner og jobber til et Kubernetes-cluster:

- `Application` - for å deploye applikasjoner
- `SKIPJob` - for å kjøre jobber og cron-jobber
- `Routing` - for å sette opp rutingregler, for eksempel frontend- og backend-tjenester under samme domene

For å komme i gang, sjekk ut sidene for [krav](01-requirements.md) og [komme i gang](../../02-kom-i-gang/index.md).
