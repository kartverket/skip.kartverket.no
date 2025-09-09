# Kompetanse for bruk av SKIP

Mange av ressursene er tilgjengelige gjennom pluralsight. 
Her har kartverket et fåtall lisenser som går på rotasjon. 
Ta kontakt med pureservice for å få tilgang. 





## Grunnkompetanse for å ta i bruk dev miljøet

For å komme i gang med utvikling i SKIP-plattformen er det viktig å ha grunnleggende forståelse for følgende temaer:

### Kubernetes og orkestrering
- [Kubernetes](./06-praktisk-intro/06-kubernetes/index.md) - Container-orkestrering og deployment
- [Argo CD](../03-applikasjon-utrulling/09-argo-cd/index.md) - GitOps og continuous delivery
- [Skiperator](../03-applikasjon-utrulling/03-skiperator/index.md) - Vår egen Kubernetes-operator

### Google Cloud Platform (GCP)
- [GCP Secrets](../03-applikasjon-utrulling/03-oppsett-og-bruk-av-secret-manager.md) - Håndtering av hemmeligheter
- [Service Accounts](./06-praktisk-intro/06-kubernetes/05-autentisering-mot-gcp-fra-applikasjon.md) - Tilgangsstyring for tjenester
- [IAM & Permissions](./04-team/08-jit.md) - Rettigheter og tilganger

### Infrastruktur og containere
- [Terraform](../03-applikasjon-utrulling/08-github-actions/bruk-av-terraform.md) - Infrastructure as Code
- [Helm](*placeholder*) - Kubernetes package manager
- [Docker](*placeholder*) - Containerteknologi

De fleste av disse temaene har gode kurs tilgjengelig på Pluralsight. Ta kontakt med PureService for tilgang til kursplattformen.


## Ekstra kompetanse for å ta i bruk prod miljøet

### Sikkerhet og eksponering
- [Internetteksponering](../03-applikasjon-utrulling/03-sjekkliste-før-internett-eksponering.md) - Sjekkliste og retningslinjer for ekstern tilgang
- [Sikkerhet](./06-praktisk-intro/security.md) - Sikkerhetsprinsipper og best practices

### Overvåkning og drift
- [Monitoring](../07-observability/index.md) - Observabilitet og overvåkning
- [Alarmer](../07-observability/04-alerting-with-grafana.md) - Konfigurering av alarmer og varsling
- [Kostnadsoversikt](./04-team/09-kostnadsoversikt-og-alarmer.md) - Kostnadsstyring og budsjettering
