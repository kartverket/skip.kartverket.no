# Feilsøking på SKIP

:::info
Denne siden er under konstruksjon og kan bli oppdatert uten forvarsel
:::

Feilsøking av en applikasjon på SKIP kan være utfordrende. Denne dokumentasjonen har som mål å gi leserne en grov idé om hvor de skal starte og hva de skal se etter når de feilsøker.
Den er ment for bruk både av SKIP-teammedlemmer og produktteammedlemmer, og vi vil ta hensyn til å spesifisere feilsøkingstrinn som kan kreve ekstra tilgang som kun er tilgjengelig
for SKIP-teammedlemmer eller administratorer.

## Relevante lenker

[Skiperator kode og dokumentasjon](https://github.com/kartverket/skiperator)

[CLI Jukselapp for SKIP](https://kartverket.atlassian.net/wiki/spaces/SKIP/pages/404553808/CLI+Cheatsheet+for+SKIP) (kan kreve ekstra privilegier)

## Generell sjekkliste ved feilsøking

Nettverk/Istio-relaterte problemer:

- Network policies - default-deny and others (if applicable).
- AccessPolicies both outbound and inbound.
- ServiceEntries
- +++
