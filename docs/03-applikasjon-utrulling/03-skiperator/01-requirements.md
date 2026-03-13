# Krav

For å kunne rulle ut applikasjoner og jobber til SKIP, må du og teamet ditt ha enkelte forutsetninger på plass.

## Krav til applikasjon og jobb

Først og fremst må applikasjonene og jobbene dine være containerisert. Dette betyr at applikasjonen eller jobben må pakkes i et linux-containerimage som kan kjøres i et Kubernetes-cluster.
I SKIP anbefaler vi å bruke [scratch](https://hub.docker.com/_/scratch)-imaget som basisimage for applikasjonen eller jobben din. Dette er et minimalt image som bare inneholder de nødvendige filene for å kjøre applikasjonen eller jobben.

Deretter må imaget ligge i et container-register (container registry) som er tilgjengelig fra Kubernetes-clusteret.
I SKIP bruker vi [github](../../02-kom-i-gang/06-praktisk-intro/01-github/index.md) som vårt container-register. Det spiller ingen rolle om imaget er offentlig tilgjengelig eller privat, så lenge repositoriet ligger under Kartverket-organisasjonen.

## Krav til CI/CD

For å rulle ut applikasjonen din må du ha satt opp en CI/CD-pipeline som bygger og pusher containerimaget ditt til container-registeret.
Som tidligere nevnt, bruker vi github som repositorium i SKIP. Du kan lese mer om hvordan du setter opp en CI/CD-pipeline i dokumentasjonen for [github actions](../08-github-actions/index.md).

Vi må også sette opp Argo CD for utrulling av applikasjonen. Du kan lese mer om hvordan du setter opp Argo CD i dokumentasjonen for [Argo CD](../09-argo-cd/index.md).

## Oppsummering

For å oppsummere, for å kunne bruke Skiperator og kjøre applikasjonene dine i SKIP må du ha følgende på plass:

- Applikasjonen eller jobben din må være containerisert
- Containerimaget må ligge i et container-register som er tilgjengelig fra Kubernetes-clusteret (github)
- En CI/CD-pipeline som bygger og pusher containerimaget til container-registeret
- Argo CD satt opp for utrulling av applikasjonen fra et `team-apps`-repositorium

Nå som du har forutsetningene på plass, kan du gå videre til siden for [Kom i gang](../../02-kom-i-gang/index.md) for å lære hvordan du ruller ut applikasjonen eller jobben din til SKIP.
