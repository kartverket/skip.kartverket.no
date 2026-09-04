# Tilgang til GCP

SKIP bruker Google Cloud Platform som økosystem rundt Kubernetes. Det gjør at du kan bruke andre
Google-produkter selv om applikasjonen kjører på et on-premise cluster. Du kan også autentisere deg mot GCP og bruke
`kubectl` gjennom Googles Connect Gateway for å aksessere on-premise cluster uten å være på det interne nettverket/VDI.

For å kunne logge på GCP med Kartverket-brukeren må brukeren være medlem i en `AAD - TF - TEAM -` gruppe i Entra ID.
Dette er beskrevet i [Legge til eller fjerne personer fra et team](./05-add-remove-team-member.md).
Sjekk [onboarding-dokumentasjonen](./02-onboarding-new-teams.md#under-onboarding) om du
ikke allerede har gjort dette. Har du nettopp blitt onboardet, kan det ta opptil en time før gruppen er synket inn i GCP.
