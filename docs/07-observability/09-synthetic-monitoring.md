---
sidebar_position: 9
---

# Syntetisk overvåking

Syntetisk overvåking sjekker tilgjengeligheten til tjenestene dine ved å sende HTTP-forespørsler med jevne mellomrom.

## Kom i gang

For å ta i bruk syntetisk overvåking må du gjøre følgende steg:

1. Velg et repo der konfigurasjonen skal ligge. Vi anbefaler at den legges i repoet som inneholder koden til applikasjonen, men et apps-repo er også mulig.

2. Kjør [onboarding](https://github.com/kartverket/blackbox-exporter/actions/workflows/onboarding.yaml) workflowen i `blackbox-exporter`-repoet. Dette setter opp tilgang slik at ditt repo kan pushe og opprette PR. 
  For å kjøre workflowen, klikk på "Run workflow", skriv inn verdiene for team og repoene du vil skal ha tilgang og deretter klikk på "Run workflow" nederst. 
  Da oprettes en PR som SKOOP-teamet må godkjenne, men det er mulig å fortsette på neste steg i mellomtiden.  
  <img src={require("./images/onboarding-workflow-dispatch.png").default} alt="Skjermbilde av GitHub onboarding workflow dispatch" style={{ width: "40%" }} />
  Så lenge team-navnet er det samme kan denne workflowen kjøres igjen for å legge til flere repoer. 

3. Installer følgende reusable workflow i repoet ditt. Denne validerer konfigurasjonen på pull requests, og dytter den til et sentralt repo ved push til `main` (ev. en annen default branch).

    ```yaml
    name: Validate Synthetic Monitoring Config

    on:
      push:
        branches:
        - main  # Bytt ut med navnet på default branch om det ikke er main
        paths:
        - synthetic-monitoring.yaml
      pull_request:
        paths:
        - synthetic-monitoring.yaml

    jobs:
      call-synthetic-monitoring:
        permissions:
          contents: read
          pull-requests: write
          id-token: write
        uses: kartverket/github-workflows/.github/workflows/synthetic-monitoring.yaml@<release tag>
    ```

    Bytt ut `<release tag>` med den siste versjonen av workflowen. Se [releases](https://github.com/kartverket/github-workflows/releases).



4. Opprett en fil kalt `synthetic-monitoring.yaml` i repoet ditt (se [Konfigurasjon](#konfigurasjon)).


## Konfigurasjon

Syntetisk overvåking konfigureres i filen `synthetic-monitoring.yaml` i roten av repoet ditt. Filen inneholder en liste med targets og tilhørende labels:

```yaml
- targets:
    - https://kartverket.no
    - https://health.atkv3-prod.kartverket.cloud/health
  labels:
    team: mitt-team
    env: prod
    service: min-tjeneste
```

### Felter

| Felt | Påkrevd | Beskrivelse |
|------|---------|-------------|
| `targets` | Ja | Liste med URL-er som skal sjekkes. Må inkludere protokoll (eks. `https://`). |
| `labels.team` | Ja | Navnet på teamet som eier tjenesten. |
| `labels.env` | Ja | Miljøet tjenesten kjører i (f.eks. `prod`, `dev`). |
| `labels.service` | Ja | Navnet på tjenesten. Dette bør tilsvare navnet i [utviklerportalen](https://kartverket.dev). |

Du kan definere flere blokker i samme fil for å gruppere targets med ulike labels:

```yaml
- targets:
    - https://kartverket.no
  labels:
    team: mitt-team
    env: prod
    service: kartverket.no

- targets:
    - https://kartverket.atkv3-dev.kartverket.cloud/health
  labels:
    team: mitt-team
    env: dev
    service: kartverket.no
```

## Hva sjekkes?

En sjekk regnes som vellykket hvis tjenesten svarer med en **HTTP 2xx-statuskode** innen **3 sekunder**.

## Fjerne syntetisk overvåking

Dersom du ønsker å fjerne syntetisk overvåking for en tjeneste, må du slette den tilhørende blokken i `synthetic-monitoring.yaml`-filen og pushe endringen til repoet ditt. Dette vil trigge workflowen som igjen vil oppdatere det sentrale repoet og fjerne sjekken.

:::warning

Dersom `synthetic-monitoring.yaml`-filen slettes eller ikke inneholder noen targets, vil valideringen feile. Vi har ikke full støtte for selvbetjent sletting av sjekker enda. Ta kontakt med oss i [#gen-skoop](https://kartverketgroup.slack.com/archives/C05DVCJ222Y) på Slack for hjelp.

:::

## Spørsmål?

Ta kontakt i [#gen-skoop](https://kartverketgroup.slack.com/archives/C05DVCJ222Y) på Slack.
