# Opprette nytt repo på Github

Dette dokumentet beskriver fremgangsmåten et produktteam skal bruke for å opprette et nytt repository på Github - enten de skal starte et nytt prosjekt, eller flytte et gammelt.

## Merknad for produkter som ikke er på SKIP

Merk at det meste av dette dokumentet også er gyldig for prosjekter som ikke er på SKIP-plattformen - men at det likevel er skrevet for SKIP-teams, så sikkerhetsreglene kan sees på
som gode råd dersom du ikke skal bruke SKIP.

For ikke å snakke om at du dersom du følger disse sikkerhetsreglene vil få en mye enklere jobb hvis du skal flytte prosjektet over til SKIP i fremtiden ![smile](images/smile.png)

## Hvordan opprette et nytt GitHub Repository

- Logg inn på GitHub
- Opprett et nytt repository ved å trykke på pluss-ikonet øverst til høyre på [https://github.com](https://github.com/) og velge “New repository”. Dette gjelder uansett om du skal
lage et nytt prosjekt eller importere et eksisterende prosjekt, siden du ikke vil kunne bruke “Import”-funksjonaliteten på vanlig måte.
  ![](images/309002687.png)
- Dersom du skal importere et eksisterende git-repository, følg [denne tutorialen](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/importing-a-git-repository-using-the-command-line).
- Fyll ut skjemaet med riktig informasjon.
  ![](images/308838936.png)
  - **Huskeregler:**
    - Alle prosjekter som ikke skal være åpne skal være `Internal` . Det er likevel mulig å invitere eksterne utviklere. Mer informasjon: [https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories#about-repository-visibility](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories#about-repository-visibility)
    - Pass på at `Owner` er satt til `kartverket` , og ikke din private bruker.
    - Ikke velg en lisens med mindre du faktisk skal lage et open-source prosjekt. Å velge en åpen kildekode-lisens her kan ødelegge for sikkerhetsverktøyene i Kartverket og i siste
    instans skape legale problemer for Kartverket.
  Hvis du er i tvil, ta kontakt med SKIP-teamet.
- Dokumenter hvilket team som er ansvarlig for repositoriet ved å opprette en `Codeowners` fil.Dette er [dokumentert her](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners).
  Som regel er det nok med en linje - [slik](https://github.com/kartverket/iam/blob/main/CODEOWNERS) (bytt ut `skip` med ditt eget team).
- Gi teamet ditt rettigheter til repoet. Dette er dokumentert [her](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/managing-teams-and-people-with-access-to-your-repository).
  Det er vanlig å sette Tech Lead som eier for repositoriet, men dette bestemmer dere selv.

## Opprett tilganger til Google Cloud for Github Actions

Dersom du har behov til å autentisere deg mot GCP kan du legge til at ditt repo GitHub kan autentisere seg mot Google Cloud med en bestemt bruker.
Da må man sette opp [Workload Identity Federation](https://kartverket.atlassian.net/wiki/spaces/SKIPDOK/pages/320439634).
Dette er noe SKIP ordner for produktteamene på en automatisert måte ved hjelp av Terraform.

Ønsker du å legge til et nytt repo kan du opprette en Pull Request for dette repoet: [https://github.com/kartverket/gcp-service-accounts](https://github.com/kartverket/gcp-service-accounts)

Eksempel på liste over GitHub repoer for KomReg: [https://github.com/kartverket/gcp-service-accounts/blob/main/modules.tf](https://github.com/kartverket/gcp-service-accounts/blob/main/modules.tf)

```hcl
module "komreg" {
  source    = "./project_team"
  team_name = "KomReg"
  repositories = [
    "kartverket/komreg-frontend",
    "kartverket/komreg-backend",
    "kartverket/komreg-frontend-api", # Legg til flere repoer i denne listen
  ]
  env                               = var.env
  project_id                        = var.komreg_project_id
  kubernetes_project_id             = var.kubernetes_project_id
  can_manage_log_alerts_and_metrics = true
  can_manage_sa                     = true
  extra_team_sa_roles = [
    "roles/resourcemanager.projectIamAdmin",
    "roles/secretmanager.admin",
    "roles/storage.admin"
  ]
}
```

Når PR’en merges inn vil det ved et nytt team bli opprettet en deploy-servicekonto, som heter `<teamnavn>-deploy@<prosjekt-id>.iam.gserviceaccount.com` . Denne servicekontoen
tillater at github-repoene i listen har lov til å etterligne den og dens tilganger.

Mer informasjon om Github Actions: [GitHub Actions som CI/CD](../../../03-applikasjon-utrulling/08-github-actions/index.md)
