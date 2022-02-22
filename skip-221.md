# Oversikt over tjenester SKIP tilbyr

## Formål med dokument

Dette dokumentet er ment som en teknisk introduksjon til nye utviklere på SKIP-plattformen.  
I stedet for å skrive en full manual om alle de tjenestene og programvarene som SKIP tilbyr og er basert på, har vi skrevet litt kort om hver tjeneste du som utvikler kan benytte deg av, og hvordan den ser ut under panseret. Hvis det finnes mer dokumentasjon fra SKIP om tjenesten vil det være linket til her, men hvis du ønsker et skikkelig dypdykk vil det som regel være like greit å søke på nettet etter mer dokumentasjon - det er ikke noe vi har som ambisjon å produsere selv.

## Kubernetes

### Hva er Anthos/GKE

Anthos er Googles hybridplatformsløsning for å kunne kjøre applikasjoner i sky og på kartverkets egne datasentre. den kommer med en rekke verktøy som gjør det enkelt for brukere å få innsyn i egne applikasjoner, håndheve policyer som skal virke på tvers av multisky-implementasjoner og gir oss mulighet til å integrere sikkerhet gjennom en "develop-build-run cycle".

Anthos Hovedkomponenter er GKE, Anthos Config Management og Anthos Service Mesh. GKE

### Hvordan bruker vi Kubernetes

Vi bruker kubernetes gjennom CI/CD-byggeløyper hvor man bruker IAC-verktøyet Terraform og definerer hva som skal utrulles på kubernetes-cluster
[eksempel på et prosjekt som bruker kubernetes på tiltenkt måte](https://github.com/kartverket/nibas-backend). man har ikke mulighet å kjøre exec eller run inne i pod'ene.

### Getting Started

## Logging og metrikker

Google tilbyr veldig gode logging-systemer, og veldig grundige metrikk-systemer.
Dessverre er de veldig avanserte, og særlig metrikksystemet Google Monitoring krever mye manuelt arbeid for å bruke riktig.

### Google Logging

Hovedinterfacen for loggsøk hos SKIP er [Logs Explorer](https://console.cloud.google.com/logs). Husk å velge riktig prosjekt øverst på siden - alle logger som kommer fra våre Kubernetes-clustre ligger under `kartverket-anthos` prosjektet - selv om selve applikasjonen kjører på et cluster som ligger i et annet prosjekt.  
Google Logging skal automatisk ta mot og indeksere alt av tekst som blir sendt til `stderr` og `stdout` fra applikasjoner som kjører på Google Cloud og Anthos. Dette betyr i teorien at alt er søkbart og skal være enkelt å finne. I praksis er det en del arbeid som skal til for å tolke hver linje tekst korrekt. Dette er et problem som er godt dokumentert, og det er mange som har skrevet forskjellige måter å løse problemet på på forskjellige blogger osv.
Mer info: [Using the Log Explorer](https://cloud.google.com/logging/docs/view/logs-viewer-interface)

### Google Monitoring

[Google Monitoring](https://console.cloud.google.com/monitoring/metrics-explorer) er en veldig kraftig tjeneste, og nesten alt som skjer på våre clustre og alle andre tjenester på Google Cloud blir lagt inn her.
A bruke disse metrikkene fornuftig, er dog ikke så enkelt, siden det er så mange av de.
Siden ingen på SKIP egentlig har begynt å bruke Google Monitoring i stor grad heller, er det lite jeg kan si om de mulighetene som finnes her.
Mer info: [Introduction to Cloud Monitoring](https://cloud.google.com/monitoring/docs/monitoring-overview)

### Google Error Reporting

[Google Error Reporting](https://console.cloud.google.com/errors) er et glimrende produkt. Siden Google Cloud uansett har alle logger og metrikker, har de lagt til litt logikk, og lagrer alle feilene i alle applikasjonene på Google Cloud. Merk dog at dette bare fungerer dersom loggene til applikasjonen tolkes riktig.
Mer info: [View Errors](https://cloud.google.com/error-reporting/docs/viewing-errors)

## Vault

Vi bruker [HashiCorp Vault](https://www.vaultproject.io/) til oppbevaring av hemmeligheter og nøkler. Vault har også et API som alle applikasjoner kan få tilgang til, for å kunne lage, hente og endre hemmeligheter og nøkler selv.

### Bruksområde

Vault kan holde på nøkler for f.eks. databaser, slik at teamet slipper å lagre dette i Kubernetes direkte. I stedet kan man be appen koble seg til Vault for å få passordet til databasen.
Vault kan også brukes til å opprette og lagre nye nøkler. Denne funksjonaliteten brukes blant annet i `aut-idporten` modulen.

### Mer info

Vault skal alltid være tilgjengelig fra en Kubernetes Pod via hostname `vault`. Merk at hvert miljø har en unik instans av Vault, og hemmeligheter som ligger på `prod` vil ikke være tilgjengelig fra en pod i `dev` eller `test`.
For mer informasjon, og for å få tilgang til Vault, ta kontakt med SKIP-teamet.
// TODO: Link til retningslinjer for bruk av Vault.
// TODO: Noe om Google Secret Manager?

## GitHub

### Git-repositories

### Automatisk Testing

### Kontinuerlig Integrasjon

## Objektlagring

### Bruksområde

### Teknisk beskrivelse

#### Link til S3 API-beskrivelse

#### Link til liste over klientbiblioteker og apps

### Advarsel om backups

### Advarsel om rettigheter

## Cloud Run -- Kommer

## Automatiske metrikker og alarmer -- Kommer

## Continuous Deployment -- Kommer
