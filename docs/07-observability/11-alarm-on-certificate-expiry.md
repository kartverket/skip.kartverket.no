---
sidebar_position: 11
---

# Alarmer ved utløpende SSL-sertifikat

Når syntetisk overvåking er satt opp kan man konfigurere alarmering hvis et SSL-sertifikat er på vei til å utløpe.

## Kom i gang

Bekreft at du er onboardet i `grafana-alerts`-repoet. Hvis du ikke er det, ta kontakt i [#gen-skoop](https://kartverketgroup.slack.com/archives/C05DVCJ222Y) på Slack.

## Konfigurasjon

I teamets alarmoppsett legges følgende kodeblokk:

```hcl
resource "grafana_folder" "teamX_certexpiry_alerts" {
  title    = "Certificate expiry alerts teamX"
}

module "teamx_certexpiry_alert_prod" {
  source           = "../../modules/certexpiry_alerts"
  team             = "Team X"
  alert_name       = "certexpiry_alerts_teamx_prod"
  runbook_base_url = var.runbook_base_url # Optional
  folder_uid       = grafana_folder.teamX_certexpiry_alerts.uid
  label_team       = "teamX"
  label_env        = "prod"
  for              = "6h"
  severity         = "warning" # Sett til "critical" for å varsle vaktlaget ved nedetid (etter avtale med vaktlaget, og riktig oppsett av Grafana OnCall)
}
```

### Felter

| Felt | Påkrevd | Beskrivelse |
|------|---------|-------------|
| `source` | Ja | Hvor modulen ligger. Ikke endre denne. |
| `team` | Ja | Navnet på teamet ditt slik det vises i Grafana. Dette må være det samme som for andre alarmer slik at varsler rutes til riktig Slack-kanal. |
| `alert_name` | Ja | Unik identifikator for alarmen. Brukes for å finne riktig oppføring i runbook om man har det. |
| `runbook_base_url` | Nei | URL-en til en runbook med feilsøkingstips. |
| `folder_uid` | Ja | UID for mappen hvor alarmen lagres. Her utledet fra ressursen `grafana_folder.teamX_uptime_alerts.uid` |
| `label_team` | Ja | Samme som `label.team` fra din `synthetic-monitoring.yaml`. |
| `label_env` | Ja | Samme som `label.env` fra din `synthetic-monitoring.yaml`. |
| `for` | Ja | Definerer hvor lenge problemet skal vare før alarmen sendes. |
| `severity` | Ja | Setter alvorlighetsgrad for alarmen. `warning` gir typisk en alarm i Slack, `critical` kan sende alarmen til vaktlaget (brukes _kun_ etter avtale med IT-vaktordningen). |

Du definerer én blokk for hver tjeneste i hvert miljø som du vil ha alarm på:

```hcl
resource "grafana_folder" "teamX_certexpiry_alerts" {
  title    = "Uptime alerts teamX"
}

module "teamx_certexpiry_alert_prod" {
  source           = "../../modules/certexpiry_alerts"
  team             = "Team X"
  alert_name       = "uptime_alerts_teamx_tjenestex_api"
  runbook_base_url = var.runbook_base_url
  folder_uid       = grafana_folder.teamX_certexpiry_alerts.uid
  label_team       = "teamX"
  label_env        = "prod"
  for              = "6h"
  severity         = "warning"
}

module "teamx_certexpiry_alert_dev" {
  source           = "../../modules/certexpiry_alerts"
  team             = "Team X"
  alert_name       = "uptime_alerts_tjenestex_prod"
  runbook_base_url = var.runbook_base_url
  folder_uid       = grafana_folder.teamX_certexpiry_alerts.uid
  label_team       = "teamx"
  label_env        = "dev"
  for              = "6h"
  severity         = "warning"
}
```

## Spørsmål?

Ta kontakt i [#gen-skoop](https://kartverketgroup.slack.com/archives/C05DVCJ222Y) på Slack.
