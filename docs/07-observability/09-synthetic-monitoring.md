---
sidebar_position: 9
---

# Syntetisk overvåking

Syntetisk overvåking sjekker tilgjengeligheten til tjenestene dine ved å sende HTTP-forespørsler med jevne mellomrom.

## Kom i gang

For å ta i bruk syntetisk overvåking må du gjøre følgende steg:

1. Velg et repo der konfigurasjonen skal ligge. Vi anbefaler at den legges i repoet som inneholder koden til applikasjonen, men et apps-repo er også mulig.

2. Sett opp tilgang for repoet ditt via Octo STS. Dette er et førstegangssteg som gir workflowen tilgang til å opprette PR-er i det sentrale repoet. Du må opprette en PR i [`blackbox-exporter`-repoet](https://github.com/kartverket/blackbox-exporter) med to endringer:

    **a)** Opprett en Octo STS trust policy-fil under `.github/chainguard/<repo-navn>.sts.yaml`:

    Bytt ut `<repo-navn>` med navnet på repoet ditt.

    ```yaml
    issuer: https://token.actions.githubusercontent.com
    subject_pattern: repo:kartverket\/(<repo-navn>:(ref:refs\/heads\/.+|pull_request))

    permissions:
      pull_requests: write
      contents: write
    ```

    Se [Octo STS-dokumentasjonen](https://skip.kartverket.no/docs/applikasjon-utrulling/github-actions/tilgang-til-repoer-med-tokens-fra-github-actions#secure-token-service-sts) for mer informasjon om hvordan dette fungerer.

    **b)** Legg til repoet ditt i `onboarded-teams.yaml`:

    ```yaml
    teams:
      # ... eksisterende teams
      - name: Mitt Team
        repositories:
          - name: mitt-repo
    ```

3. Installer følgende reusable workflow i repoet ditt. Denne validerer konfigurasjonen på pull requests, og dytter den til et sentralt repo ved push til `main` (ev. en annen default branch).

    ```yaml
    name: Validate Synthetic Monitoring Config

    on:
      push:
        branches:
        - main  # Bytt ut med navnet på default branch om det ikke er main
      pull_request:

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
