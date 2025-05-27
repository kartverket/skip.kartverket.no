# Tilgang til GCP

SKIP benytter Google Cloud Platform som økosystem rundt Kubernetes. Det gjør at man kan benytte seg av andre
Google-produkter selv om applikasjonen kjører på et on-premise cluster. Man kan også autentisere seg mot GCP og benytte
`kubectl` gjennom Google sin Connect Gateway for å aksessere on-premise cluster uten å være på det interne nettverket/VDI.

For å kunne logge på GCP med Kartverket-brukeren må brukeren være medlem i en `AAD - TF - TEAM -` gruppe i EntraID.
Dette er beskrevet i [Legge til eller fjerne personer fra et team](./05-add-remove-team-member.md)
Sjekk [onboarding-dokumentasjonen](./onboarding-new-teams#under-onboarding) om du
ikke allerede har gjort dette. Har du nettopp blitt onboardet kan det ta opptil en time før gruppen er synket inn i GCP.
