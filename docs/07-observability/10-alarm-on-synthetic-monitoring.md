---
sidebar_position: 10
---

# Alarmer på syntetisk overvåking

Når syntetisk overvåking er satt opp kan man konfigurere alarmering hvis en probe ikke får kontakt med endepunktet sitt.

## Kom i gang

Bekreft at du er on-board'et i `grafana-alerts`-repoet. Hvis du ikke er det, ta kontakt i #gen-skoop på Slack.

## Konfigurasjon

Syntetisk overvåking konfigureres i filen `synthetic-monitoring.yaml` i roten av repoet ditt. Filen inneholder en liste med targets og tilhørende labels:

```terraform
module "<deskriptivt navn>" {
  source           = "../../modules/uptime_alerts"
  team             = <team-navn>
  alert_name       = "uptime_alerts_<teamnavn>_<tjeneste>"
  runbook_base_url = var.runbook_base_url
  folder_uid       = <teamnavn>_uptime_alerts
  label_team       = "<label.team fra din synthertic-monitoring.yaml>"
  label_env        = "<label.env fra din synthertic-monitoring.yaml>"
  label_service    = "<label.service fra din synthertic-monitoring.yaml>"
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
| `folder_uid` | Ja | Navn på mappen hvor alarmen lagres. |
| `label_team` | Ja | Samme som `label.team` fra din `synthertic-monitoring.yaml`. |
| `label_env` | Ja | Samme som `label.env` fra din `synthertic-monitoring.yaml` (f.eks. `prod`, `dev`). |
| `label_service` | Ja | Samme som `label.service` fra din `synthertic-monitoring.yaml`. |
| `for` | Ja | Definerer hvor lenge problemet skal vare før alarmen sendes. |
| `severity` | Ja | Setter alvorlighetsgrad for alarmen. `warning` gir typisk en alarm i Slack, `critical`sender alarmen til vaktlaget (brukes _kun_ etter avtale med IT-vaktordningen). |

Du definerer én blokk for hver tjeneste i hvert miljø som du vil ha alarm på:

```terraform
module "skoop_uptime_alert_status_kartverket_no_dev" {
  source           = "../../modules/uptime_alerts"
  team             = "SKOOP"
  alert_name       = "uptime_alerts_skoop_status_kartverket_no"
  runbook_base_url = var.runbook_base_url
  folder_uid       = skoop_uptime_alerts
  label_team       = "skoop"
  label_env        = "dev"
  label_service    = "status.kartverket.no"
  for              = "2m"
  severity         = "warning"
}

module "skoop_uptime_alert_grafana_prod" {
  source           = "../../modules/uptime_alerts"
  team             = "SKOOP"
  alert_name       = "uptime_alerts_skoop_status_kartverket_no"
  runbook_base_url = var.runbook_base_url
  folder_uid       = skoop_uptime_alerts
  label_team       = "skoop"
  label_env        = "prod"
  label_service    = "grafana"
  for              = "2m"
  severity         = "warning"
}
```

## Spørsmål?

Ta kontakt i [#gen-skoop](https://kartverketgroup.slack.com/archives/C05DVCJ222Y) på Slack.
