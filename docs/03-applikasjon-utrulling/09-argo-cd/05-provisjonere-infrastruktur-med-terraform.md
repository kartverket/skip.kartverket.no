# Provisjonere infrastruktur med Terraform

Når man deployer en applikasjon til SKIP er det også tilfeller hvor man ønsker å provisjonere infrastruktur.
For eksempel kan dette være å opprette servicekontoer i GCP, lage lagringsbøtter og gi servicekontoer tilgang til disse. 
Dette er noe som tidligere har vært gjort med Crossplane, 
men dette verktøyet fases nå ut og vi oppfordrer til bruk av Terraform som allerede har denne funksjonaliteten i tillegg til mye annet, 
eksempelvis oppsett av tjenester slik som PubSub.

## Hjelp, jeg har ingen erfaring med Terraform!
Ingen fare - Terraform er enkelt å komme i gang med. Hashicorp, firmaet bak Terraform, [har mange tutorials](https://developer.hashicorp.com/terraform/tutorials) som hjelper deg i gang.
Det finnes også mange repoer i Kartverkets organisasjon på Github som gjør bruk av Terraform som det er mulig å hente inspirasjon fra,
i tillegg til en del gjenbrukbare moduler i SKIPS eget [terraform-modules](https://github.com/kartverket/terraform-modules/) repo.
Er du fortsatt i tvil? Spør på Slack i #gen-skip - hvis ikke vi kan hjelpe deg, finnes det mange knallflinke folk med kompetanse på TF blant brukerne våre.

## Hvordan kommer jeg i gang?

Du trenger et infrastruktur-repo som inneholder Terraform-kode, konfigurasjon og Github Action for å kunne provisjonere opp GCP-infrastruktur.
For å opprette GCP-ressurser bruker vi Googles egen provider, som støtter de fleste av Googles tjenester.
Github Action kjøres med deploy-serviceaccount som er opprettet for de fleste prosjekter med formål å deploye applikasjonen. 

Hvis denne deploy-kontoen ikke eksisterer ennå kan du opprette en ved å lage en pull request i dette repoet: 
[https://github.com/kartverket/gcp-service-accounts](https://github.com/kartverket/gcp-service-accounts). 
I resources.yaml fila i dette repoet defineres det opp produkt, hvilke GCP-prosjekter det gjelder, hvilke Github-repositories det skal gjelde for, samt hvilke roller deploy-servicekontoen trenger for å opprette ressurser i GCP.
Hvilke roller denne deploykontoen trenger avhenger av hvilke ressurser man ønsker å opprette, ofte vil de være på admin-nivå - typisk vil f.eks. oppretting av bøtter kreve `roles/storage.admin` og administrering av WIF kreve `roles/iam.workloadIdentityUser` + `roles/iam.workloadIdentityPoolAdmin` osv.
Du kan bruke Googles dokumentasjon [på denne siden](https://docs.cloud.google.com/iam/docs/roles-permissions) for å søke deg fram til riktige roller.

Hvis du trenger å teste terraform-koden ved å kjøre `terraform plan` lokalt, så vil dette i utgangspunktet feile fordi du kjører som egen bruker istedenfor deploykontoen.
Du kan impersonate deploykontoen ved å sette en env-variabel for dette på denne måten: `GOOGLE_IMPERSONATE_SERVICE_ACCOUNT="<team/produkt>-deploy@<prosjekt-id>.iam.gserviceaccount.com terraform plan`
Husk at du må være autentisert mot gcloud for å kjøre Terraform-kommandoer, så sørg for å¨ logg deg inn med `gcloud auth application-default login`.

For eksempler på hvordan dette kan settes opp med tanke på opprettelse av bl.a. lagringsbøtter i GCP, se vårt [terraform-modules](https://github.com/kartverket/terraform-modules/tree/main/cloud_storage) repository på Github - modulen cloud_storage inneholder noen gode eksempler og kan også brukes i egen kildekode som modul.
Se også [Googles dokumentasjon av terraform-provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs) for utvidet dokumentasjon og eksempler.
Vi legger ikke føringer på hvordan infrastruktur-repo struktureres ut over det som er best practice for Kartverket generelt og Terraform spesielt.
Noen hete tips er:
* Unngå bruk av workspaces, bruk mapper for ulike miljøer i stedet
* Samle kode som gjenbrukes på tvers av miljøer i egne moduler som kan importeres ved behov.
* Les output av "terraform plan" nøye før du godkjenner kjøring av en Github Action, så du ikke kommer i skade for å slette og gjenopprette ressurser ved endringer.'

Når det gjelder workflows for kjøring av selve Terraform-koden i Github, anbefaler vi vår egen [run-terraform](https://github.com/kartverket/github-workflows/#run-terraform) workflow.
I tillegg bør selve github-repoet beskyttes mot utilsiktede endringer - se [denne Confluence-siden](https://kartverket.atlassian.net/wiki/spaces/SIK/pages/1769996376/Sikkerhetstiltak+p+Github)
for hvilke tiltak som bør gjennomføres som et minimum.
