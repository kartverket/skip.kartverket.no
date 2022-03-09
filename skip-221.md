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

Github er en skybasert Git-repository tjeneste som vi bruker til å lagre kildekoden til kartverkets prosjekter. med Github får vi også mye annet også som Kontinuerlig integrasjon, Kode Skanning og flere sikkerhets funksjonalitet.

### Git-repositories

Et Git-repository er hvor prosjekt-filer lagres. Det skjer ved at hver enkelt person som jobber på det gjeldene prosjektet har sin kopi av repositoriet som ligger på Github. når noen har utført noen endringer på projeskt-filene da kan den endringen sendes til repositoriet som ligger på Github. og den endringen vil da være tilgjenelig for alle på det prosjektet. det at hver enkelt har sin kopi gjør det enklere å håndtere hvis en endring ble sendt til repositoriet viser seg å tilføre en del feil i funksjonalitet som ikke får fikset, da kan man erstatte reposotoriet som ble "syk", med en "frisk" versjon  av repositoriet av en person på prosjektet

### Automatisk Testing

vi implementerer automatisk testig ved å bruke github action, så når en endring blir sjekket inn i prosjekt trigges en action som er konfigurert til å kjøre test av prosjektet så ved eventuelle innsjekkinger av kode som gjøre repositoriet "syk" så vil man kunne fange det opp i det det blir lagt inn og man kan ta afære med en gang

### Kontinuerlig Integrasjon

Vi benytter Github actions som er Github's eget CI/CD system.
Github Actions bruker noe man kan kaller workflow filer, en workflow representerer en eller flere jobber for et repo og inneholder all konfigurasjon for jobben.
Dette gjør oss i stand til kjøre automatiserte deployments ved commits eller merges slik at nyeste versjon alltid er deployd til klusteret.
Med Terraform som konfigurasjonsspråk får vi muligheten til å skrive fullstendige deklarative konfigurasjoner som sørger for at alt som kreves for at applikasjonen skal kjøre blir deployed.

## Objektlagring

### Bruksområder

Skip tilbyr flere objektlagringstjenester som blant annet gir deg mulighet å lagre terrafrom state til Terraform oppsettet på projektet ditt.

### Teknisk beskrivelse

vi bruker i dag en Objektlagrings-løsning fra [Minio](https://min.io/product/s3-compatibility) som er et AWS s3-kompatibel løsning for å blant annet lagre Terrafrom state'en for hvert prosjekt som kjøres på SKIP. kartverket holder også på å få på plass en SAN-løsning og da vil det kunne tilbys objektlagring gjennom den tjenesten.

Google cloud storage
i tillegg til å lagre terraform state på Minio hos oss så kan man benytte seg av [Google cloud storage](https://cloud.google.com/storage/) som er en lagringstjeneste som følger med Google Anthos. se linken for mer om hvordan dette gjøres
[Sikker bruk av Terraform State på Google cloud storage](https://kartverket.atlassian.net/wiki/spaces/SKIPDOK/pages/306810004/Sikker+bruk+av+Terraform+State+p+Google+Cloud+Storage)

#### Link til S3 API-beskrivelse

[AWS S3 API referanse](https://docs.aws.amazon.com/AmazonS3/latest/API/Type_API_Reference.html)

### Advarsel om backups

Det blir ikke tatt backup av de forskjelligge objektlagringsløsningene. det må hvert enkelt team ta ansvar for selv

### Advarsel om rettigheter

for bruk av de ulike løsningene SKIP tilbyr av objektlagring er det viktig å huske på disse tingene:

- ikke bruk samme nøkler flere plasser
- nøkler skal ikke finnes i kildekoden

## Cloud Run -- Kommer

## Automatiske metrikker og alarmer -- Kommer

## Continuous Deployment -- Kommer
