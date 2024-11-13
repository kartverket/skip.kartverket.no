# Tilgang til GCP
SKIP benytter Google Cloud Platform som økosystem rundt Kubernetes/Anthos. Det gjør at man kan benytte seg av andre Google-produkter selv om applikasjonen kjører på et on-premise cluster. Man kan også autentisere seg mot GCP og benytte `kubectl` gjennom Google sin Connect Gateway for å aksessere on-premise cluster uten å være på det interne nettverket/VDI.

For å kunne logge på GCP med Kartverket-brukeren må brukeren være medlem i en `CLOUD_SK_TEAM` AD-gruppe. Vi anbefaler at leads (produkteier, team lead, tech lead) på teamet sender inn en ticket til [PureService](https://kartverket.pureservice.com/), eksempelvis med følgende informasjon:

> Hei!
>
> Kan dere legge til følgende medlemmer i AD-gruppen `CLOUD_SK_TEAM_Eiet`?
>
> - Navn Navnesen
> - Kari Nordmann
>
> Hilsen Navnesen Navnemann

`CLOUD_SK_TEAM` AD-gruppen må også være synket inn i GCP. Dette kan ta opp til en time, selv etter du har fått bekreftelse på at medlemmet har blitt lagt inn i AD-gruppen.

[//]: # "TODO: Oppdater til riktig gruppenavn/moderne TF-config"
