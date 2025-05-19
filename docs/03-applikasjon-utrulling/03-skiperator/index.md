# 🤖 Skiperator

Skiperator er en operator som er ment å gjøre oppsettet av applikasjoner enkelt fra brukernes synspunkt. Du kan se på det som en erstatning for Helm, men med en mer Kubernetes-native tilnærming. Skiperator er utviklet av SKIP for Kubernetes-plattformen og er basert på Operator SDK, som er et rammeverk som bruker controller-runtime-biblioteket for å gjøre det enklere å skrive operatorer.

Operatoren er designet for applikasjonsutviklere for å distribuere applikasjoner og jobber i en Kubernetes. Den vil opprette alle nødvendige ressurser for at applikasjonen skal kunne kjøre, slik som deployment, services og ingress-ressurser, og også håndtere sikkerhetsaspekter som å sette opp nettverkspolicyer og servicekontoer slik at du som utvikler ikke trenger å bekymre deg for det.

Logger og metrikker vil også automatisk tilgjengeliggjøres på [monitoring.kartverket.cloud](https://monitoring.kartverket.cloud)

Skiperator har tre CRDs (Custom Resource Definitions) for å gjøre det lettere å deploye en applikasjon, en jobb eller dirigere trafikk:

- `Application` - Deployment av applikasjoner og medhørende ressurser
- `SKIPJob` - For å opprette kubernetes-jobber
- `Routing` - For å kunne route trafikk til samme domene/sub-domene til forskjellige applikasjoner

For å komme i gang: [Requirements](01-requirements.md) og [Getting started](02-get-started.md) pages.
