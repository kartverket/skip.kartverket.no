# Grafana Cloud IRM

Denne siden går gjennom oppsettet av grafana cloud IRM for team og overgangen fra self hosted oncall. 

## Hva er Grafana Cloud IRM?

Grafana Cloud IRM er Grafana Cloud sitt verktøy for varsling og oppfølging av alarmer, og tar over for Grafana OnCall.
Alarmer fra Grafana sendes til en integration i IRM.
IRM samler alarmene, legger dem ut i teamets Slack-kanal og varsler eventuelt vaktlaget.

:::info[Under arbeid]
Overgangen fra OnCall er ikke ferdig.
Behold OnCall til dere har sett at varslingen fra IRM fungerer.
:::

## Kom i gang

Alt oppsett gjøres med pull requests i [`grafana-alerts`-repoet](https://github.com/kartverket/grafana-alerts).
Endringene applyes automatisk når pull requesten er merget til `main`.

1. Finn teamets shortname og name i [entra-id-config](https://github.com/kartverket/entra-id-config/blob/main/org.yaml), for eksempel `skoop`/`SKOOP` eller `egenreg`/`Egenregistrering`.
2. Opprett eller oppdater teamets integration i IRM, se [Integration](#integration).
3. Inviter [Grafana-appen](https://grafana.com/docs/grafana-cloud/observe-and-act/respond-to-incidents/integrations/chat-and-collaboration/slack/) til Slack-kanalene som skal motta varsler. Skriv `/invite @Grafana` i kanalen, og velg den som heter "Grafana" hvis du får flere forslag.
4. Koble teamets contact point til integration, se [Koble til contact point](#koble-til-contact-point).
5. Fjern OnCall når varslingen fra IRM fungerer, se [Fjerne OnCall](#fjerne-oncall).


## Integration

Teamets integrations er konfigurert i `grafana_cloud/teams/<team>/config.yaml`, der `<team>` er teamets shortname fra entra-id-config.

:::warning[Allerede opprettet for noen team]
Noen team har allerede fått en `config.yaml`, men den kan inneholde feil.
Gå gjennom filen og rett opp det som ikke stemmer, for eksempel Slack-kanal, miljøer og vaktlag.
:::

[SKOOP sin konfigurasjon](https://github.com/kartverket/grafana-alerts/blob/main/grafana_cloud/teams/skoop/config.yaml) ser omtrent slik ut:

```yaml
team_name: SKOOP
envs:
  prod:
    slack_channel: "#skoop-alerts"
    vaktlag: infrastrukturdrift
  dev:
    slack_channel: "#skoop-alerts"
```

Det finnes én integration per miljø under `envs`, med navnet `<team>-<miljø>`, for eksempel `skoop-prod`.
Dette navnet brukes når contact point skal kobles til integration.

| Felt | Påkrevd | Beskrivelse |
|---|---|---|
| `team_name` | Ja | Teamets navn, for eksempel `SKOOP`. Som i entra gruppe `AAD - TF - TEAM - <team_name>` |
| `envs` | Ja | Miljøene teamet har applikasjoner i, for eksempel `prod` og `dev`. |
| `slack_channel` | Ja | Slack-kanalen som skal varsles i miljøet. `#` foran er valgfritt, og flere miljøer kan bruke samme kanal. |
| `vaktlag` | Nei | `appdrift` eller `infrastrukturdrift`, for team som har avtale med vaktlaget. |

`slack_channel` og `vaktlag` settes per miljø.

En ny integration, for et nytt team eller et nytt miljø, må opprettes i en egen pull request.
Den må være merget og applyet før dere kobler contact point til integrationen.


## Koble til contact point

Contact point i Grafana OSS får en `webhook`-blokk som sender alarmene videre til teamets integration i Grafana Cloud IRM.
I overgangen beholdes `oncall`-blokken, slik at alarmene sendes både til OnCall og IRM.
Ingen alarmer mistes, men teamet får alle meldinger dobbelt i Slack til OnCall er [fjernet](#fjerne-oncall).
Har miljøet `vaktlag`, blir også vaktlaget varslet to ganger.

Ikke endre navnet på contact point, ellers kommer ikke alarmene fram.

Lenken til integration inneholder en token og skal ikke skrives rett inn i koden.
Den hentes i stedet opp med navnet på integration og sendes inn til teamets kode.

[`skoop.tf`](https://github.com/kartverket/grafana-alerts/blob/main/atgcp1-prod/skoop.tf) og [`skoop/oncall.tf`](https://github.com/kartverket/grafana-alerts/blob/main/atgcp1-prod/skoop/oncall.tf) kan brukes som eksempel.
Gjør følgende i `atgcp1-prod`:

1. Hvis teamets contact point ikke allerede er definert i teamets egne filer, ligger det i [`contact_points.tf`](https://github.com/kartverket/grafana-alerts/blob/main/atgcp1-prod/contact_points.tf). Flytt det først, se [Contact point i `contact_points.tf`](#contact-point-i-contact_pointstf).
2. Legg til navnet på integration i `integration_names` i [`grafana_cloud_integrations.tf`](https://github.com/kartverket/grafana-alerts/blob/main/atgcp1-prod/grafana_cloud_integrations.tf):

   ```hcl
   locals {
     integration_names = [
       "skoop-prod",
       "<team>-<miljø>",
     ]
   }
   ```

3. Send lenken inn til teamets modul i `<team>.tf`:

   ```hcl
   module "<team>" {
     source = "./<team>"
     ...
     irm_integration_link = data.grafana_oncall_integration.cloud["<team>-<miljø>"].link
   }
   ```

   Legg til variabelen i `<team>/variables.tf`:

   ```hcl
   variable "irm_integration_link" {
     description = "Link to the Grafana Cloud IRM integration"
     type        = string
     sensitive   = true
   }
   ```

   Har teamet flere miljøer i samme modul, lag én variabel per miljø, for eksempel `irm_integration_link_prod` og `irm_integration_link_dev`. 
   Team som ikke har egen mappe, men bare `<team>.tf`, hopper over dette steget og bruker lenken direkte i contact point med `url = sensitive(data.grafana_oncall_integration.cloud["<team>-<miljø>"].link)`.

4. Legg til en `webhook`-blokk i contact point ved siden av `oncall`-blokken:

   ```hcl
   resource "grafana_contact_point" "main" {
     name = "<contact-point-navn>"

     oncall {
       url = module.oncall_integration.webhook_url
     }

     webhook {
       url = var.irm_integration_link
     }
   }
   ```

   Behold resten av contact point som det er, også `disable_provenance`. Endres `disable_provenance`, blir contact point slettet og opprettet på nytt.

### Contact point i `contact_points.tf`

Contact points som ble opprettet manuelt i Grafana, er importert til [`contact_points.tf`](https://github.com/kartverket/grafana-alerts/blob/main/atgcp1-prod/contact_points.tf).
Flytt teamets contact point til teamets fil eller mappe før dere legger til `webhook`-blokken:

1. Fjern teamets linje fra `oncall_contact_points` i `contact_points.tf`. 
   Hvis contact point også står i `explicit_http_method`, fjern det derfra og sett `http_method = "POST"` i `oncall`-blokken.
2. Opprett contact point ved siden av teamets eksisterende `oncall_integration`-modul, for eksempel i `<team>/oncall.tf`. 
   Bruk samme navn som før, og hent lenken fra modulen i stedet for fra ID-en i `contact_points.tf`.
3. Legg til en `moved`-blokk i `<team>.tf`, slik at Terraform flytter contact point i stedet for å slette og opprette det på nytt.

Etter flyttingen kan det se slik ut:

```hcl
# <team>.tf
moved {
  from = grafana_contact_point.oncall["<contact-point-navn>"]
  to   = module.<team>.grafana_contact_point.main
}
```

```hcl
# <team>/oncall.tf
resource "grafana_contact_point" "main" {
  name               = "<contact-point-navn>"
  disable_provenance = true

  oncall {
    url = module.oncall_integration.webhook_url
  }
}

# eksisterende integration i Grafana OnCall
module "oncall_integration" {
  source = "../../modules/oncall_integration"
  ...
}
```

Hvis teamet ikke har egen mappe, bruk `to = grafana_contact_point.main` og legg contact point i `<team>.tf`. 
`moved`-blokken kan fjernes i en senere pull request etter at endringen er applyet.

## Fjerne OnCall

Når dere har sett at alarmene kommer fram i Slack fra både OnCall og IRM, kan OnCall fjernes i en ny pull request:

1. Fjern `oncall`-blokken fra contact point, men behold `webhook`-blokken.
2. Fjern teamets `oncall_integration`-modul hvis den ikke brukes til noe annet.
3. Fjern `moved`-blokken hvis dere flyttet contact point.

Etter dette får teamet bare én melding per alarm, og vaktlaget varsles bare én gang.
