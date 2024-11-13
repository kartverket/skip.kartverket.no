# Tilgang til repoer med tokens fra GitHub Actions

Det vil ofte være slik at man trenger tilgang til andre repoer, for eksempel for å skrive inn en ny versjon i et apps-repo. I disse tilfellene har man ofte brukt GitHub sine Personal Access Tokens (PAT), og dette fungerer helt greit. Det er derimot ikke en ideell løsning.

Ulempene med PAT-er er todelt. For det første har de en levetid på maks 90 dager før de må fornyes. Om de ikke fornyes vil handlingen som avhenger av tokenet slutte å fungere, og det kan for eksempel føre til at deployments stopper opp. I dette tilfellet er man avhengig av at personen som laget tokenet går inn og fornyer det, og da blir man også sårbar for fravær og oppsigelser.

Den andre utfordringen er at tokenene er “langlevde”. Det vil si at selv om de må fornyes jevnlig vil det bety at dersom en token lekkes til en angriper vil den personen ha opp til 90 dager å misbruke tokenet på. Det fører til at man må ivareta disse tokenene på en svært god måte for å hindre misbruk.

Disse ulempene har ført til at mange har etterspurt bedre løsninger enn GitHub PAT-er.

## Secure Token Service (STS)

En Secure Token Service (STS) er en tjeneste som utsteder sikkerhetstokener som kan brukes til autentisering og autorisering i ulike systemer og applikasjoner. I vårt tilfelle ønsker vi å utstede kortlevde tokens som kun er gyldige i perioden de brukes som en erstatning for PAT-er. Vi har derfor implementert et verktøy som heter [Octo STS](https://github.com/apps/octo-sts) for å levere denne funksjonaliteten.

Måten STS fungerer på er at man etablerer tillit mellom to repoer. Dette gjøres ved å legge inn en konfigurasjonsfil i repoet du ønsker å ha tilgang til som sier noe om hvem som skal kunne få tilgang til repoet. Deretter bruker man en ferdig GitHub action i repot som skal få tilgang til å etablere et kortlevd tiken via STS-tjenesten.

Les [denne artikkelen](https://www.chainguard.dev/unchained/the-end-of-github-pats-you-cant-leak-what-you-dont-have) for mer detaljer om Octo STS.

### Etablere tillit

Først må man etablere tillit ved å legge inn en config-fil i repoet man skal få tilgang til. Dette legges i mappen `.github/chainguard/<navn>.sts.yaml` . Erstatt `<navn>` med identiteten som skal ha tilgang og bruk dette navnet i GitHub actionen senere.

Eksempelet under viser hvordan man gir tilgang fra GitHub actions som kjører på repoet `kartverket/mittrepo` på branchen `main` .

```yaml
issuer: https://token.actions.githubusercontent.com
subject: repo:kartverket/mittrepo:ref:refs/heads/main

permissions:
  contents: write
```

Dersom du ønsker å bruke et wildcard til å gi tilgang, for eksempel dersom det deployes ved hjelp av “environments” i GitHub slik at dette blir subjektet ditt kan man bruke et `subject_pattern` . Dette er et regex.

```yaml
issuer: https://token.actions.githubusercontent.com
subject_pattern: repo:kartverket\/mittrepo:environment:(sandbox|prod)

permissions:
  contents: write
```

### Få tilgang

Når man skal ha tilgang til dette repoet så bruker man en GitHub action til å snakke med STS-tjenesten og få en kortlevd token som brukes på samme måte som en PAT. For en deploy til et apps-repo kan du for eksempel skrive følgende i din GitHub action:

```yaml
permissions:
  id-token: write # Required for Octo STS

steps:
- uses: octo-sts/action@6177b4481c00308b3839969c3eca88c96a91775f # v1.0.0
  id: octo-sts
  with:
    scope: kartverket/skip-apps
    identity: utviklerportal

- name: Checkout apps repo
  uses: actions/checkout@v4
  with:
    repository: kartverket/skip-apps
    token: ${{ steps.octo-sts.outputs.token }}
```

Når dette blir kjørt vil det bli gjort en spørring til Octo STS-tjenesten, som deretter sjekker filen vi laget i repoet over og om det har blitt etablert tillit. Dersom dette er tilfellet så genereres en token som brukes i dette eksempelet til å sjekke ut et annet repo.

Se også [https://github.com/octo-sts/action](https://github.com/octo-sts/action) for dokumentasjon på GitHub actionen.
