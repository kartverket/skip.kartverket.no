---
sidebar_position: 10
---

# Alarmer på syntetisk overvåking

Når syntetisk overvåking er satt opp kan man konfigurere alarmering hvis en probe ikke får kontakt med endepunktet sitt.

## Kom i gang

Bekreft at du er onboardet i `grafana-alerts`-repoet. Hvis du ikke er det, ta kontakt i [#gen-skoop](https://kartverketgroup.slack.com/archives/C05DVCJ222Y) på Slack.

## Konfigurasjon

I teamets alarm-oppsett legges følgende kodeblokk:

```hcl
resource "grafana_folder" "teamX_uptime_alerts" {
  title    = "Uptime alerts teamX"
}

module "teamx_uptime_alert_tjenestex_api" {
  source           = "../../modules/uptime_alerts"
  team             = "Team X"
  alert_name       = "uptime_alerts_teamx_tjenestex_api"
  runbook_base_url = var.runbook_base_url
  folder_uid       = grafana_folder.teamX_uptime_alerts.uid
  label_team       = "teamX"
  label_env        = "prod"
  label_service    = "tjenestex-api"
  for              = "2m"
  severity         = "warning"
}
```

### Felter

| Felt | Påkrevd | Beskrivelse |
|------|---------|-------------|
| `source` | Ja | Hvor modulen ligger. Ikke endre denne. |
| `team` | Ja | Navnet på teamet ditt slik det vises i Grafana. |
| `alert_name` | Ja | Unik identifikator for alarmen. Brukes for å finne riktig oppføring i runbook om man har det. |
| `runbook_base_url` | Nei | URL-en til en runbook med feilsøkingstips. |
| `folder_uid` | Ja | Navn på mappen hvor alarmen lagres. Her utledet fra ressursen `grafana_folder.teamX_uptime_alerts.uid` |
| `label_team` | Ja | Samme som `label.team` fra din `synthertic-monitoring.yaml`. |
| `label_env` | Ja | Samme som `label.env` fra din `synthertic-monitoring.yaml`. |
| `label_service` | Ja | Samme som `label.service` fra din `synthertic-monitoring.yaml`. |
| `for` | Ja | Definerer hvor lenge problemet skal vare før alarmen sendes. |
| `severity` | Ja | Setter alvorlighetsgrad for alarmen. `warning` gir typisk en alarm i Slack, `critical`sender alarmen til vaktlaget (brukes _kun_ etter avtale med IT-vaktordningen). |

Du definerer én blokk for hver tjeneste i hvert miljø som du vil ha alarm på:

```hcl
resource "grafana_folder" "teamX_uptime_alerts" {
  title    = "Uptime alerts teamX"
}

module "teamx_uptime_alert_tjenestex_api" {
  source           = "../../modules/uptime_alerts"
  team             = "Team X"
  alert_name       = "uptime_alerts_teamx_tjenestex_api"
  runbook_base_url = var.runbook_base_url
  folder_uid       = grafana_folder.teamX_uptime_alerts.uid
  label_team       = "teamX"
  label_env        = "prod"
  label_service    = "tjenestex-api"
  for              = "2m"
  severity         = "warning"
}

module "teamx_uptime_alert_tjenestex_prod" {
  source           = "../../modules/uptime_alerts"
  team             = "Team X"
  alert_name       = "uptime_alerts_tjenestex_prod"
  runbook_base_url = var.runbook_base_url
  folder_uid       = grafana_folder.teamX_uptime_alerts.uid
  label_team       = "teamx"
  label_env        = "prod"
  label_service    = "tjenestex.kartverket.no"
  for              = "2m"
  severity         = "warning"
}
```

## Spørsmål?

Ta kontakt i [#gen-skoop](https://kartverketgroup.slack.com/archives/C05DVCJ222Y) på Slack.
