# Kompetanse for bruk av SKIP

For å ta i bruk SKIP trenger du grunnkunnskaper om flere temaer. På denne siden presenteres de viktigste områdene vi mener du bør være kjent med.

## Læringsressurser

Vi lenker til Pluralsight-kurs der det er relevant, men vær oppmerksom på at ikke alt innhold er like viktig. Mange kurs på Pluralsight er rettet mot administrasjon fremfor praktisk bruk.

I noen tilfeller har vi allerede god brukerinformasjon i dokumentasjonen, mens andre ganger vil det være nødvendig å konsultere offisiell dokumentasjon. Vi oppfordrer deg til å finne egne ressurser for å supplere kunnskapen. Hvis du finner noe ekstra relevant, kan du gjerne gi beskjed til SKIP-teamet så vi kan legge inn lenke her.

:::info
Tidligere hadde Kartverket lisenser til Pluralsight på rotasjon, men dette er det nå slutt på. 
Du kan fortsatt bruke Pluralsight, men du må nå kjøpe lisens selv og utgiftsføre den etter avklaring med leder.
:::


## Grunnkompetanse for å ta i bruk dev-miljøet

For å komme i gang med utvikling i SKIP-plattformen er det viktig å ha grunnleggende forståelse for følgende temaer:

### Kubernetes og orkestrering
- [Kubernetes](./06-praktisk-intro/06-kubernetes/index.md) - Container-orkestrering og deployment ([Pluralsight](https://app.pluralsight.com/paths/certificate/certified-kubernetes-application-developer-ckad-2023) | [Offisiell Intro](https://kubernetes.io/docs/tutorials/kubernetes-basics/))
- [Argo CD](../03-applikasjon-utrulling/09-argo-cd/index.md) - GitOps og continuous delivery ([Pluralsight](https://app.pluralsight.com/library/courses/argo-cd-getting-started/table-of-contents) | [Offisiell Intro](https://argo-cd.readthedocs.io/en/stable/))
- [Skiperator](../03-applikasjon-utrulling/03-skiperator/index.md) - Vår egen Kubernetes-operator

### Google Cloud Platform (GCP)
Det finnes mange GCP-kurs på [Pluralsight](https://www.pluralsight.com/browse/gcp-cloud-training)

- [GCP Secrets](../03-applikasjon-utrulling/03-oppsett-og-bruk-av-secret-manager.md) - Håndtering av hemmeligheter ([GCP Docs](https://cloud.google.com/secret-manager/docs))
- [Service Accounts](./06-praktisk-intro/06-kubernetes/05-autentisering-mot-gcp-fra-applikasjon.md) - Tilgangsstyring for tjenester
- [IAM & Permissions](./04-team/08-jit.md) - Rettigheter og tilganger ([IAM Docs](https://cloud.google.com/iam/docs/overview) | [WIF Docs](https://cloud.google.com/iam/docs/workload-identity-federation))
- [CloudSQL](../06-lagring/03-cloud-sql.md) - Relasjonell database

### Infrastruktur og containere
- [Terraform](../03-applikasjon-utrulling/08-github-actions/bruk-av-terraform.md) - Infrastructure as Code ([Pluralsight](https://app.pluralsight.com/library/courses/terraform-getting-started-2023/table-of-contents))
- Helm - Kubernetes package manager ([Offisiell Intro](https://helm.sh/docs/intro/quickstart/))
- Docker - Containerteknologi ([Offisiell Intro](https://docs.docker.com/get-started/))

### CI/CD og GitHub Actions
- [GitHub Actions](../03-applikasjon-utrulling/08-github-actions/index.md) - Automatisering og deployment, CI/CD

## Ekstra kompetanse for å ta i bruk prod-miljøet

Prodklare apper på SKIP forventes å implementere grunnleggende sikkerhet og overvåkning. 

### Sikkerhet og eksponering
- [Internetteksponering](../03-applikasjon-utrulling/03-sjekkliste-før-internett-eksponering.md) - Sjekkliste og retningslinjer for ekstern tilgang
- [Sikkerhet](./06-praktisk-intro/security.md) - Sikkerhetsprinsipper og best practices
  - [Network Policies Docs](https://kubernetes.io/docs/concepts/services-networking/network-policies/)

### Overvåkning og drift
- [Monitoring](../07-observability/index.md) - Observabilitet og overvåkning
- [Alarmer](../07-observability/04-alerting-with-grafana.md) - Konfigurering av alarmer og varsling
- [Kostnadsoversikt](./04-team/09-kostnadsoversikt-og-alarmer.md) - Kostnadsstyring og budsjettering
