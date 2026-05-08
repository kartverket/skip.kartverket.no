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

module "teamx_certexpiry_alert_environment" {
  source            = "../../modules/certexpiry_alerts"
  team              = "Team X"
  alert_name        = "certexpiry_alerts_teamx_environment"
  runbook_base_url  = var.runbook_base_url # Valgfri
  folder_uid        = grafana_folder.teamX_certexpiry_alerts.uid
  label_team        = "teamX"
  label_env         = "prod"
  warning_days      = 28 # Valgfri
  critical_days     = 14 # Valgfri, kun etter avtale med vaktlaget!
}
```

### Felter

| Felt | Påkrevd | Standardverdi | Beskrivelse |
|------|---------|---------------|-------------|
| `source` | Ja | | Hvor modulen ligger. Ikke endre denne. |
| `team` | Ja | | Navnet på teamet ditt slik det vises i Grafana. Dette må være det samme som for andre alarmer slik at varsler rutes til riktig Slack-kanal. |
| `alert_name` | Ja | | Unik identifikator for alarmen. Brukes for å finne riktig oppføring i runbook om man har det. |
| `runbook_base_url` | Nei | | URL-en til en runbook med feilsøkingstips. |
| `folder_uid` | Ja | | UID for mappen hvor alarmen lagres. Her utledet fra ressursen `grafana_folder.teamX_uptime_alerts.uid` |
| `label_team` | Ja | | Samme som `label.team` fra din `synthetic-monitoring.yaml`. |
| `label_env` | Ja | | Samme som `label.env` fra din `synthetic-monitoring.yaml`. |
| `warning_days` | Nei | 21 | Definerer hvor mange dager før setifikatutløp at "advarsel"-alarmen sendes. |
| `critical_days` | Nei | | Definerer hvor mange dager før setifikatutløp at "kritisk"-alarmen sendes. Denne skal _kun_ settes etter avtale med vaktlaget! |

Du definerer én blokk for hvert miljø som du vil ha alarm på:

```hcl
resource "grafana_folder" "teamX_certexpiry_alerts" {
  title    = "SSL-sertifikat alarmer teamX"
}

module "teamx_certexpiry_alert_prod" {
  source            = "../../modules/certexpiry_alerts"
  team              = "Team X"
  alert_name        = "certexpiry_alerts_teamx_prod"
  runbook_base_url  = var.runbook_base_url
  folder_uid        = grafana_folder.teamX_certexpiry_alerts.uid
  label_team        = "teamX"
  label_env         = "prod"
  warning_days      = 28
}

module "teamx_certexpiry_alert_dev" {
  source            = "../../modules/certexpiry_alerts"
  team              = "Team X"
  alert_name        = "certexpiry_alerts_teamx_dev"
  runbook_base_url  = var.runbook_base_url
  folder_uid        = grafana_folder.teamX_certexpiry_alerts.uid
  label_team        = "teamX"
  label_env         = "dev"
}
```

## Greit å vite

Alarmene aktiveres kun i normal arbeidstid (08:00-15:00 normaltid eller 09:00-16:00 sommertid, mandag til fredag), og vil alarmere _hver morgen_ til problemet er løst.

## Spørsmål?

Ta kontakt i [#gen-skoop](https://kartverketgroup.slack.com/archives/C05DVCJ222Y) på Slack.
