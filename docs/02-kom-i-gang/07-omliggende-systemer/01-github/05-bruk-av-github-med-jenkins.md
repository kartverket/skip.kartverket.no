# Bruk av GitHub med Jenkins

Hvis en på ditt område (Grunnboka/Matrikkel/etc.) har satt opp repoer på GitHub (med Jenkins) så skal oppsett av en ny App ikke være nødvendig. Men repoet må legges til i Appen! Dette gjøres ved å sende en PR til [https://github.com/kartverket/github-iac/blob/main/apps/modules.tf](https://github.com/kartverket/github-iac/blob/main/apps/modules.tf)

Denne oppskriften tar utgangspunkt i **Multibranch-pipeline** oppsett i Jenkins. Men skal fungere for andre konfigurasjoner.

Utgangspunktet er at oppsettet i Jenkins skal være likt for GitHub som BitBucket, men selve autentiseringen av GitHub (kontra BitBucket) vil være noe forskjellig. Dette kommer av naturlige årsaker, siden BitBucket er lokalt hostet hos Kartverket, sammenlignet med GitHub som er åpent for “alle” på internet - og bygger på litt annen teknologi.

## 📚 Autentisering 📚

Det er flere måter å autentisere Jenkins mot GitHub på, blant annet; deploy keys, personal access tokens, GitHub App. Vi vil se at GitHub Apps er valget vi går for når vi autentiserer.

[ **Deploy keys** ](https://docs.github.com/en/developers/overview/managing-deploy-keys) er enkle men;
- 👍 Eies av repoet og Jenkins (priv + pub nøkler)
- 👊 Kan kun brukes som “Git” source på Jenkins
- 👎 Snakker ikke med GitHub sitt API - kun pulle / pushe kode

[ **Personal access tokens** ](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) \*\*\*\* (PAT) gir mer;
- 👍 Kan brukes gjennom “GitHub” plugin på Jenkins (source)
- 👍 Snakker med GitHub API’et - PR/Commit status triggere etc.
- 👎 Nøkkelen følger brukeren, selv etter vedkommende bytter team eller slutter (kan slettes fra bruker)
- 👎 Ikke i utgangspunktet gjenbrukbar (beta- fine grained PAT’er kan tilegnes flere repo pr. nøkkel)

[ **GitHub Apps** ](https://docs.github.com/en/developers/apps/getting-started-with-apps/about-apps) er litt mer å konfigurere, men er en kombinasjon av de over;
- 👍 Gjenbrukbare, som flere repoer kan bruke gjennom én privat nøkkel på Jenkins.
- 👍 Eies av “Organisasjonen” Kartverket på Github, som da ikke er bundet til en GitHub bruker.
- 👍 Kan brukes gjennom “GitHub” plugin på Jenkins (source)
- 👍 Snakker med GitHub API’et - PR/Commit status triggere etc.
- 👎 Ratelimit (men skal ikke være et problem)

## 🧑‍🚒 Brannmurer 🧑‍🚒

I utgangspunktet så skal portene til ditt Jenkins miljø være åpnet, slik at Jenkins når ut til GitHub. Men hvis det dette er første gang så må de åpnes for trafikk mot GitHub. Primært er det HTTPs og SSH trafikk som må tilgjengeliggjøres på port 443 og 22. Dette må bestilles hos drift.

## 🪝 Webhook 🪝

Work in progress. Er ikke ferdig testet enda.

For å få status på PR/Commits i GitHub så må GitHub ha en vei inn til Jenkins. Dette gjøres på et webhook endepunkt typisk seende slik ut `https://<jenkins-host>/github-webhook/` . Dette er noe som må åpnes fra drift og spesifiseres inne i GitHub Appen.

⚙️ Legg til hvordan det er med webhook secret.

## 📁 Oppsett av GitHub App 📁

SKIP kontaktes og de setter opp en App for ditt behov. Er denne som følges: [Using GitHub App authentication](https://docs.cloudbees.com/docs/cloudbees-ci/latest/traditional-admin-guide/github-app-auth#_creating_the_github_app) .

:::info
Oppsettet av nøklen må du gjøre selv! Og dette FØR du får brukt Appen, men ETTER at SKIP setter igang med oppsett av app. SKIP sender melding når du må gjøre dette.

_nb: skal Appen ha flere/mindre rettigheter enn i oppskriften må du spesifisere dette_
:::

Når SKIP har satt opp Appen, må du sette den private nøkkelen, som senere skal deles med Jenkins. Dette gjøres slik som beskrevet i punktet [Generating a private key for authenticating to the GitHub App](https://docs.cloudbees.com/docs/cloudbees-ci/latest/traditional-admin-guide/github-app-auth#_generating_a_private_key_for_authenticating_to_the_github_app) .

Det er først når dette er gjort, at SKIP kan installere Appen på organisasjonen. Send en heads-up at du har lagret nøkkelen.

Hvis Appen er installert i org. og linket til ditt repo, og nøkkelen er satt opp i App og Jenkins så skal alt være på plass! 🎉
