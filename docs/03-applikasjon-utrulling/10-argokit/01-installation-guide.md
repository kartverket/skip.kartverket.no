# Installasjon

Forutsatt at du har fulgt [Komme i gang](../09-argo-cd/01-komme-i-gang-med-argocd.md)-guiden, kan du bruke ArgoKit i ditt apps-repo.
Første steg er å inkludere ArgoKit-biblioteket ved å kjøre følgende kommando:

```bash
$ git submodule add https://github.com/kartverket/argokit.git
```

Dersom du har klonet et apps-repo med ArgoKit allerede installert (med vanlig git clone),
må du kjøre følgende kommando for å få ArgoKit koden:
```bash
$ git submodule update --init --recursive
```

### Automatiske versjonsoppdateringer

Det anbefales sterkt å bruke dependabot for å automatisk oppdatere ArgoKit-versjonen når en ny versjon blir utgitt.
For å gjøre dette, legg til følgende i din `.github/dependabot.yml` fil:

```yaml
version: 2
updates:
  - package-ecosystem: git-submodules
    directory: /
    schedule:
      interval: daily
```

Med denne konfigurasjonen vil dependabot sjekke én gang om dagen om det finnes en ny versjon av ArgoKit. Hvis den finner en ny versjon, oppretter den automatisk en PR for å oppdatere versjonen.
