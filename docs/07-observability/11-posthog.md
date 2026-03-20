# PostHog

PostHog er et analyseverktøy som kan brukes til å forstå bruksmønstre i tjenester. 
Se [Retningslinjer for bruk av PostHog i Kartverket](https://kartverket.atlassian.net/wiki/spaces/DT/pages/1954676765/Retningslinjer+for+bruk+av+PostHog+i+Kartverket) for mer informasjon.

Gå til [eu.posthog.com](https://eu.posthog.com) og logg inn med kartverket epost

## Onboarding

1. Legg til `enable_posthog: true` for team i [`entra-id-config`](https://github.com/kartverket/entra-id-config/blob/main/org.yaml)
2. Kjør onboarding workflow i [posthog-infrastructure](https://github.com/kartverket/posthog-infrastructure/actions/workflows/onboarding.yaml) med
    - **Prosjektnavn**: navnet prosjektet i posthog får
    - **Teamnavn**: team navn som gitt i `name` feltet i [`entra-id-config`](https://github.com/kartverket/entra-id-config/blob/main/org.yaml)

![PostHog onboarding workflow](images/posthog-onboarding.png)

:::info
etter posthog_enabled er lagt til for teamet må brukere og roller synces, dette skjer automatisk hvert 40. minutt og må være på plass før prosjektet kan opprettes
:::

Når dette er gjort vil medlemmer av teamet få brukere i posthog og admin tilgang til prosjektet. 
Øvrige brukere vil få member tilgang som gir editor på ressursene. 
En del innstillinger på prosjektnivå trenger admin tilgang. 

## Administrer prosjekt

Teamet står fritt til å konfigurere prosjektet etter behov. 
Det er derimot en rekke instillinger som er definert via terraform som ikke kan endres av teamene, de er:
- navn på prosjekt
- tidssone
- default tilgangsnivå
- tilgangsnivå for team rollen

Dersom du har behov for å endre noen av disse, kontakt SKOOP via [#gen-posthog](https://kartverketgroup.slack.com/archives/C0AED5A698X) kanalen på Slack. 
