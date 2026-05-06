---
sidebar_position: 11
---

# Alarmer ved utløpende SSL-sertifikat

Når syntetisk overvåking er satt opp kan man konfigurere alarmering hvis et SSL-sertifikat er på vei til å utløpe.

## Beskrivelse

Ved å bruke denne modulen så får du en enkel vei til varsling om utløpende sertifikater.

En oppføring gir to alarmer:
- Første advarsel går mot konfigurert varslingskanal, styrt av `warning_days`.
- Andre advarsel kan konfigureres til å varsle vaktlaget (kun etter avtale med vaktlaget), styrt av `critical_days`.

Følgende standardverdier er satt:
- `warning_days` er `21` dager.
- `critical_days` er `7` dager.

Hvis disse verdiene passer deg så trenger du ikke definere disse i kodeblokken.

Alarmene aktiveres kun i normal arbeidstid (08:00-15:00 normaltid eller 09:00-16:00 sommertid, mandag til fredag), og vil alarmere _hver morgen_ til problemet er løst.

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
  runbook_base_url  = var.runbook_base_url # Optional
  folder_uid        = grafana_folder.teamX_certexpiry_alerts.uid
  label_team        = "teamX"
  label_env         = "prod"
  warning_days      = 28 # Optional
  critical_days     = 14 # Optional
  critical_severity = "warning" # Sett til "critical" for å varsle vaktlaget ved nedetid (etter avtale med vaktlaget, og riktig oppsett av Grafana OnCall)
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
| `warning_days` | Nei | Definerer hvor mange dager før setifikatutløp at førstenivåalarmen sendes. |
| `critical_days` | Nei | Definerer hvor mange dager før setifikatutløp at andrenivåalarmen sendes. |
| `critical_severity` | Ja | Setter alvorlighetsgrad for den kritiske alarmen. `warning` gir typisk en alarm i Slack, `critical` kan sende alarmen til vaktlaget (brukes _kun_ etter avtale med IT-vaktordningen). |

Du definerer én blokk for hvert miljø som du vil ha alarm på:

```hcl
resource "grafana_folder" "teamX_certexpiry_alerts" {
  title    = "Uptime alerts teamX"
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
  critical_days     = 14
  critical_severity = "warning"
}

module "teamx_certexpiry_alert_dev" {
  source            = "../../modules/certexpiry_alerts"
  team              = "Team X"
  alert_name        = "certexpiry_alerts_teamx_dev"
  runbook_base_url  = var.runbook_base_url
  folder_uid        = grafana_folder.teamX_certexpiry_alerts.uid
  label_team        = "teamX"
  label_env         = "prod"
  critical_severity = "warning"
}
```

## Spørsmål?

Ta kontakt i [#gen-skoop](https://kartverketgroup.slack.com/archives/C05DVCJ222Y) på Slack.
