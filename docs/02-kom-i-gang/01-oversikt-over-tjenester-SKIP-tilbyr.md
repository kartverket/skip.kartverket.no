# Oversikt over tjenester SKIP tilbyr

Økosystemet rundt SKIP endrer seg støtt og stadig. Det kan godt hende denne siden ikke er helt oppdatert med alle tjenester.
![plattform_core](images/plattform_core.jpg)

| **Navn på tjenesten**                                     | **Informasjon**                                                                                                                                                                        | **Adresse**                                                                                                                                                                                     |
|-----------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Google Anthos                                             | - [https://cloud.google.com/anthos/](https://cloud.google.com/anthos/)                                                                                                                 | [Google Cloud Console](https://console.cloud.google.com/l)                                                                                                                                      |
| Google Cloud Storage                                      | - [Sikker bruk av Terraform State på Google Cloud Storage](https://kartverket.atlassian.net/wiki/spaces/SKIPDOK/pages/306810004/Sikker+bruk+av+Terraform+State+p+Google+Cloud+Storage) |                                                                                                                                                                                                 |
| [Google Cloud Storage](https://cloud.google.com/storage/) |                                                                                                                                                                                        |                                                                                                                                                                                                 |
| Google Secret Manager                                     | - [Oppsett og bruk av Secret Manager](../03-applikasjon-utrulling/03-oppsett-og-bruk-av-secret-manager.md)                                                                                               |                                                                                                                                                                                                 |
| GitHub Git-repository                                     | - [Opprette nytt repo på GitHub](./06-praktisk-intro/01-github/03-opprette-nytt-repo-på-github.md)                                                                                                      | [https://github.com/kartverket](https://github.com/kartverket)                                                                                                                                  |
| GitHub Advanced Security                                  | - [Sikkerhet på GitHub](https://kartverket.atlassian.net/wiki/spaces/SIK/pages/308216163/Sikkerhet+p+GitHub)                                                                           | `https://github.com/kartverket/<<navn på repository>>/actions`                                                                                                                                  |
| GitHub Action                                             | - [GitHub Actions som CI/CD](../03-applikasjon-utrulling/08-github-actions/index.md)                                                                                                                            | `https://github.com/kartverket/<<navn på repository>>/security`                                                                                                                                 |
| Grafana                                                   |                                                                                                                                                                                        | [https://monitoring.kartverket.cloud](https://monitoring.kartverket.cloud/)                                                                                                                     |
| Dynamisk Tilgangskontroll GCP (JIT)                       |                                                                                                                                                                                        | [https://jit.skip.kartverket.no/](https://jit.skip.kartverket.no/)                                                                                                                              |
| Scality S3-kompatibel lagring                             |                                                                                                                                                                                        | [https://s3-rin.statkart.no/_/console/login](https://s3-rin.statkart.no/_/console/login)<br/>[https://s3-rin.statkart.no/_/s3browser/connect](https://s3-rin.statkart.no/_/s3browser/connect) |
| ArgoCD                                                    | [Komme i gang med Argo CD](../03-applikasjon-utrulling/09-argo-cd/01-komme-i-gang-med-argocd.md)                                                                                                                |                                                                                                                                                                                                 |
| Backstage                                                 |                                                                                                                                                                                        | [https://kartverket.dev](https://kartverket.dev)                                                                                                                                                |

## Formål med dokument

Dette dokumentet er ment som en teknisk introduksjon til nye utviklere på SKIP-plattformen.
I stedet for å skrive en full manual om alle de tjenestene og programvarene som SKIP tilbyr og er basert på, har vi skrevet litt kort om hver tjeneste du som utvikler kan benytte
deg av, og hvordan den ser ut under panseret. Hvis det finnes mer dokumentasjon fra SKIP om tjenesten vil det være linket til her, men hvis du ønsker et skikkelig dypdykk vil det
som regel være like greit å søke på nettet etter mer dokumentasjon - det er ikke noe vi har som ambisjon å produsere selv.

## GKE Enterprise / Anthos

GKE Enterprise er Googles hybridplatformsløsning for å kunne kjøre et Kubernetes cluster on-premise, men likevel være administrert via et sky-interface. GKE Enterprise følger med
en rekke verktøy som gjør det enkelt for brukere å få innsyn i egne applikasjoner, håndheve policyer som skal virke på tvers av multisky-implementasjoner og gir oss mulighet til
å integrere sikkerhet gjennom en "develop-build-run cycle".

## Logging, metrikker, tracing og alarmer

SKIP tilbyr innsyn i applikasjoners metrikker og logger ved hjelp av Grafana. Dette kan nås på [https://monitoring.kartverket.cloud](https://monitoring.kartverket.cloud/) .

### Grafana

Grafana Loki er et logglagringsverktøy som brukes som datakilde for Grafana.

Grafana Mimir lagrer metrikker fra appliasjoner, og brukes som datakilde for Grafana.

Grafana Tempo lagrer tracing for applikasjoner, og brukes som datakilde for Grafana

Brukes for å sende ut varslinger basert på data i grafana.

### Google Secret Manager

For hemmelighetshåndtering anbefaler vi bruk av Google Secret Manager (GSM). Her har vi solid adgangskontroll og kan enkelt hente hemmeligheter både i build time og run time til
applikasjoner vi kjører i Kubernetes.

I GSM opprettes hemmeligheter per prosjekt, og man kan adgangskontrollere både for et helt prosjekt og for individuelle hemmeligheter. Hemmeligheter kan versjoneres og rulleres automatisk.

Ved hjelp av et system kalt External Secrets er det enkelt å hente disse hemmelighetene til build time. Se [Hente hemmeligheter fra hemmelighetshvelv](../03-applikasjon-utrulling/09-argo-cd/04-hente-hemmeligheter-fra-hemmelighetsvelv.md).

For å hente hemmeligheter fra GSM under run time, se [Autentisering mot GCP fra Applikasjon](./06-praktisk-intro/06-kubernetes/05-autentisering-mot-gcp-fra-applikasjon.md) .

### GitHub

GitHub er en skybasert git-repository-tjeneste som vi bruker til å lagre kildekoden til Kartverkets prosjekter. Med GitHub får vi også mye annet også som kontinuerlig integrasjon, kodescanning.

### Objektlagring

SKIP tilbyr flere objektlagringstjenester som blant annet gir deg mulighet å lagre filer i sky eller on-prem.

For å lagre filer i sky anbefaler vi å benytte [Google cloud storage](https://cloud.google.com/storage/) . Dette er en lagringstjeneste som følger med Google Cloud Platform.
Her kan du f. eks provisjonere bøtter via terraform, og laste opp filer til denne bøtten via en applikasjon på et Kubernetes cluster. Se [Autentisering mot GCP fra Applikasjon](./06-praktisk-intro/06-kubernetes/05-autentisering-mot-gcp-fra-applikasjon.md)
for å koble seg til GCP via en applikasjon.

I tillegg til lagring med Google cloud storage så har man mulighet til å benytte [Scality on-prem](../06-lagring/02-objektlagring-scality-s3.md) som er et AWS S3-kompatibel løsning.

### Continuous Deployment

ArgoCD er et deklarativt, GitOps-kontinuerlig leveranseverktøy for Kubernetes-applikasjoner. Det automatiserer distribusjon og administrasjon av applikasjoner i Kubernetes ved å
synkronisere den ønskede tilstanden som er definert i Git-repositorier med den faktiske cluster konfigurasjonen.
