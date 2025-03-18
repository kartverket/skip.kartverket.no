# Dependabot

Dependabot benytter [GitHub dependency graph](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-the-dependency-graph)
for å gi beskjed om sårbare avhengigheter, samt oppgradering av disse. Dette er skrudd på automatisk for alle GitHub-repoer. I tillegg kan det skrus på automatiske
versjonsoppdateringer med Dependabot, slik at Dependabot lager PR-er for nye versjoner for språk/økosystem som er aktivert.

## Skru på automatiske versjonsoppdateringer

Automatiske versjonsoppdateringer må skrus på av en bruker med "Admin"-rolle i repoet. For det aktuelle repoet kan du gå til
"Settings > Code security > Dependabot > Dependabot version updates" og trykke på "Enable".

Dersom dette ikke er gjort fra før må du sette opp en initiell versjon av filen `.github/dependabot.yml`. Det er anbefalt å sette opp for oppdatering av GitHub Actions for
alle repoer som et minimum:

```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: ".github/workflows"
    schedule:
      interval: "daily"
```

I tillegg bør det settes opp for de ulike språkene/økosystemene som ligger i repoet. Se eksemplene i avsnittet [Eksempelkonfigurasjoner](#eksempelkonfigurasjoner).

## Feilsøking av Dependabot

For å se Dependabot-feil i et repo kan man gå til "Insights > Dependency graph > Dependabot" for å se feil, status og logger fra siste kjøringer.

Se også [GitHub-dokumentasjonen](https://docs.github.com/en/code-security/dependabot/troubleshooting-dependabot) for mer detaljert beskrivelse av feilsøking.

## Konfigurasjon av Dependabot

### Begrense antallet pull requests fra Dependabot

Antallet PR-er er begrenset til 5 for vanlige versjonsoppdateringer og 10 for sikkerhetsoppdateringer. Antallet åpne PR-er kan konfigureres med `open-pull-requests-limit` for
hvert økosystem. F.eks.:

```yaml
  - package-ecosystem: "<ecosystem>"
    open-pull-requests-limit: 20
    # ... More config ... 
```

### Oppdateringsintervall

Man kan styre Dependabot kjører ved å konfigurere `schedule` for hvert `package-ecosystem`.

For å kjøre oppdateringer hver morgen i ukedagene:

```yaml
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "daily"
      time: "07:00"
      timezone: "Europe/Oslo"
```

For å kjøre oppdateringer hver mandag morgen:

```yaml
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "07:00"
      timezone: "Europe/Oslo"
```

### Innlogging til private registries

For at Dependabot skal kunne oppdatere dependencies som ligger i private/internal repoer (eks. actions), pakker i private package registries (npm, maven) elle

Merk at dette krever PATs eller access tokens som må ligge som en Dependabot repository secret i repoet.

Private registries må legges i `registries`-listen, og må i tillegg refereres til i `updates`-listen for relevante økosystemer. Eks.:

```yaml
version: 2
registries:
  npm-github:
    type: npm-registry
    url: https://npm.pkg.github.com
    token: ${{ secrets.PAT_GHCR_READ }}
updates:
  - package-ecosystem: npm
    # Check also for updates in GitHub Maven Package frontend-aut-lib
    registries:
      - npm-github
    # Remaining configuration skipped
```

#### NPM

Se også [dokumentasjonen](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/configuring-access-to-private-registries-for-dependabot#npm-registry).

```yaml
registries:
  npm-github:
    type: npm-registry
    url: https://npm.pkg.github.com
    token: ${{ secrets.PAT_GHCR_READ }}
```

#### GitHub

Denne brukes typisk for actions som ligger i private/interne repoer. Dependabot må bli gitt eksplisitt tilgang for å lese nye private/interne repoer
(spør om hjelp i `#gen-github` på Slack). Se også [dokumentasjonen](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/configuring-access-to-private-registries-for-dependabot#git).

```yaml
registries:
  github-repo-name:
    type: git
    url: https://github.com
    username: x-access-token
    password: ${{ secrets.PAT_READ_REPO_NAME }}
```

#### Maven

Denne brukes for å lese Maven-pakker som er publisert i et gitt repo. Se også [dokumentasjonen](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/configuring-access-to-private-registries-for-dependabot#maven-repository).

```yaml
registries:
  maven-repo-name:
    type: maven-repository
    url: https://maven.pkg.github.com/kartverket/repo-name
    username: ${{ secrets.GH_USERNAME }}
    password: ${{ secrets.PAT_GHCR_READ }}
```

## Eksempelkonfigurasjoner

De ulike økosystemene fungerer litt ulikt, og støtte kan variere. For mer informasjon se [dokumentasjonen for økosystemer](https://docs.github.com/en/code-security/dependabot/ecosystems-supported-by-dependabot/supported-ecosystems-and-repositories).

Under følger noen vanlige konfigurasjoner som flere team bruker. Disse er et gir et godt utgangspunkt men må i noen tilfeller konfigureres mer for å fungere.

### GitHub Actions

```yaml
  - package-ecosystem: "github-actions"
    directory: ".github/workflows"
    schedule:
      interval: "daily"
```

### Git submodules

Denne kan legges til i repoer som bruker git submodules, eks. apps-repoer som benytter argokit.

```yaml
  - package-ecosystem: "gitsubmodule"
    directory: "/"
    schedule:
      interval: "daily"
```

### Docker

Pass på at `directory` peker til mappen som inneholder `Dockerfile`.

```yaml
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "daily"
```

### Gradle

```yaml
  - package-ecosystem: "gradle"
    directory: "/"
    schedule:
      interval: "daily"
```

### NPM eksempel

```yaml
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

For å unngå for mange PR-er for minor- og patchversjoner er det i mange tilfeller ok å gruppere disse for NPM:

```yaml
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      minor-and-patch-dependencies:
        patterns:
          - "*"
        update-types:
          - "minor"
          - "patch"
```

### Go

```yaml
  - package-ecosystem: "gomod"
    directory: "/"
    schedule:
      interval: "daily"
```

### Terraform

Oppdater `directory` med riktig filsti.

```yaml
  - package-ecosystem: "terraform"
    directory: "/"
    schedule:
      interval: "daily"
```

Dersom det er flere mapper som inneholder Terraform kan `directories` brukes:

```yaml
  - package-ecosystem: "terraform"
    directories:
      - "dev"
      - "prod"
    schedule:
      interval: "daily"
```

### Python

```yaml
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "daily"
```
