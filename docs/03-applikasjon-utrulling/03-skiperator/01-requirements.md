# Krav

For å deploye applikasjonene og jobbene dine til SKIP, må du og teamet ditt ha noen forutsetninger på plass.

## Applikasjon og jobb

Først og fremst må applikasjonene og jobbene dine være container-baserte. Dette betyr at applikasjonen eller jobben din må være pakket i et Linux-container image som kan kjøres i Kubernetes. I SKIP anbefaler vi å bruke [scratch](https://hub.docker.com/_/scratch) som base for applikasjonen eller jobben din. Dette er et minimalt image som kun inneholder de nødvendige filene for å kjøre applikasjonen eller jobben din.

Deretter må bildet være hostet i et containerregister som er tilgjengelig fra Kubernetes. I SKIP bruker vi [github](../07-github/index.md) som vårt containerregister. Det spiller ingen rolle om bildet er offentlig tilgjengelig eller privat, så lenge repoet er under Kartverket-organisasjonen.

## CI CD

For å deployere applikasjonen din må du ha satt opp en CI/CD-pipeline som bygger og pusher container image til containerregisteret. Som tidligere nevnt, bruker vi github til dette i SKIP. Du kan lese mer om hvordan du setter opp en CI/CD-pipeline i [github actions](../08-github-actions/index.md) dokumentasjonen.

Vi må også sette opp [Argo CD](../09-argo-cd/index.md)  for distribusjon av applikasjonen. Du kan lese mer om hvordan du setter opp Argo CD i Argo CD-dokumentasjonen.

## Oppsummering

For å bruke Skiperator og kjøre en applikasjon må følgende være på plass:

- Applikasjonen eller jobben må være pakket i en konatiner.
- Containerimage må være hostet i et register som kan nås fra kubernetes clusteret til SKIP (vi bruker github).
- En CI/CD løype som bygger og pusher container image til nevnte containerregistry
- Et `team-apps`repo i github som er koblet til Argo CD for å deployere applikasjonskontainer.

Når disse er på plass kan du gå videre til ["kom i gang"](02-get-started) siden for å lære hvordan man deployerer en applikasjon på SKIP.