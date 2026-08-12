---
sidebar_position: 10
---

# Alarmer basert på oppetidsmålinger

Når oppetidsmålinger er satt opp kan det alarmeres på høy feilrate mot endepunktet det sjekkes mot. Feil her kan f.eks. indikere DNS som ikke fungerer, feilkonfigurert routing eller at applikasjonen ikke fungerer som den skal. Det kan også skyldes underliggende feil i plattformen og/eller nettverks- og serverinfrastruktur. Uansett hva feilen skyldes vil dette påvirke tjenestens brukere. Varsler som plukker opp dette raskt og presist er derfor viktig for alle applikasjoner.

## Hvorfor SLO og feilbudsjett?

Alarmen krever at teamet definerer et tjenestenivåmål (*service level objective*, SLO) for tilgjengelighet (oppetid) for produktet. En SLO har også et *feilbudsjett*, dvs. hvor mye feil tolereres før SLO-en brytes. En løpende SLO-periode på 30 dager benyttes for alarmer.

:::note[Feilbudsjett]

For en tilgjengelighets-SLO på 99.5% over 30 dager kan vi være nede i 0.5% av tiden (ca. 3 timer og 36 minutter). Dette er feilbudsjettet.

Når SLO-en for tilgjengelighet settes er det ofte lettere å svare på "hvor mye nedetid tolererer vi og brukerne våre?". Dette blir feilbudsjettet, og så kan SLO-en settes deretter.

En SLO på 99% tilgjengelighet over 30 dager gir et feilbudsjett på ca. 7 timer og 12 minutter, mens SLO på 99.9% tillater ca. 43 minutter nedetid.

:::

Selv om vi har en SLO og et tilhørende feilbudsjett er det for sent å varsle i det budsjettet er brukt opp. Vi må varsles i god tid før det brukes opp. Her er det mange måter å gjøre det på, og det er vanlig å varsle med en fast terskel (eks. feilrate over X% siste Y minutter), men dette gir ofte støyete alarmer som ikke nødvendigvis krever at teamet agerer. Derfor brukes feilbudsjettets *brennrate* (*error budget burn rate*) for alarmer, og det varsles dersom brennraten er høy. På denne måten vil ikke kortvarige småfeil trigge varsler. En brennrate på 1x betyr at vi bruker akkurat det budsjettet tillater. 6x betyr at vi forbruker budsjettet 6 ganger så fort, og vil dermed bryte SLO-en etter 5 dager (30 dager/6).

Høyere SLO gir raskere varsling. Lavere SLO gir mindre støyende alarmer for tjenester med forventet lavere oppetid ved f.eks. utrulling. Dersom tjenesten er helt nede er forventet varslingstid omtrent 2 minutter for 99.9%, ~5 minutter for 99.5% og ~9 minutter for 99%.

:::tip[Les mer]

Oppsettet er basert på [Google SRE Workbook, *Alerting on SLOs*](https://sre.google/workbook/alerting-on-slos/). Vi benytter oss av metoden for *multi-window, multi-burn-rate alerts* for å få rask og treffsikker varsling.

:::


## Kom i gang

Teamet ditt må først være onboardet i `grafana-alerts`-repoet. Hvis ikke, ta kontakt i [#gen-skoop](https://kartverketgroup.slack.com/archives/C05DVCJ222Y) på Slack.

## Konfigurasjon

I teamets alarmoppsett legges følgende kodeblokk:

```hcl
module "teamX_uptime_alert_serviceX" {
  source           = "../../modules/uptime_alerts"  # If alerts are specified in a file directly in atgcp1-prod folder, use `../` instead of `../..`
  team             = "Team X"                       # As specified elsewhere in grafana-alerts, used for alert routing
  alert_name       = "ServiceX availability"        # Can be anything, results in a folder name
  runbook_base_url = var.runbook_base_url           # Optional
  folder_uid       = grafana_folder.any_folder.uid  # Specify any folder
  label_team       = "teamX"                        # Team as specified in synthetic_monitoring.yaml
  label_env        = "prod"                         # Env as specified in synthetic_monitoring.yaml
  label_service    = "tjenestex-api"                # Service as specified in synthetic_monitoring.yaml
  availability_slo = 0.995                          # Set to target SLO, eg. 95%, 99%, 99.5%
  severity         = "warning"                      # Set to "critical" for routing to Vaktlaget (after prior agreement, and correctly configured OnCall)
}
```

### Felter

| Felt | Påkrevd | Beskrivelse |
|------|---------|-------------|
| `source` | Ja | Hvor modulen ligger. Ikke endre denne. |
| `team` | Ja | Navnet på teamet ditt slik det vises i Grafana. Dette må være det samme som for andre alarmer slik at varsler rutes til riktig Slack-kanal. |
| `alert_name` | Ja | Unik identifikator for alarmen. Brukes for å finne riktig oppføring i runbook om man har det. |
| `runbook_base_url` | Nei | URL-en til en runbook med feilsøkingstips. |
| `folder_uid` | Ja | UID for mappen hvor alarmen lagres. |
| `label_team` | Ja | Samme som `label.team` fra din `synthetic-monitoring.yaml`. |
| `label_env` | Ja | Samme som `label.env` fra din `synthetic-monitoring.yaml`. |
| `label_service` | Ja | Samme som `label.service` fra din `synthetic-monitoring.yaml`. |
| `availability_slo` | Ja | Ønsket tilgjengelighets-SLO som desimaltall mellom `0.85` og `0.9995` (f.eks. `0.999` = 99.9 %). Bestemmer feilbudsjettet og dermed hvor følsom alarmen er. Lavere SLO gir en mindre støyende alarm. |
| `severity` | Ja | Setter alvorlighetsgrad for alarmen. `warning` gir typisk en alarm i Slack, `critical` kan sende alarmen til vaktlaget (brukes _kun_ etter avtale med IT-vaktordningen). |

:::warning

Feltet `for` er faset ut for SLO-baserte alarmer. De evaluerer allerede over lengre tidsvinduer, så feltet ignoreres. Er alarmen for støyende, vurder om SLO-en er satt for høyt.

Hvis du utelater `availability_slo` faller modulen tilbake til den gamle, enkle alarmen. Dette fases ut tidlig høst 26, når alle team har migrert over. Nye alarmer bør bruke SLO.

:::

Du definerer én blokk for hver tjeneste i hvert miljø som du vil ha alarm på:

```hcl
# Configure prod with SLO of 99.5%
module "teamX_uptime_alert_serviceX_prod" {
  source           = "../../modules/uptime_alerts"
  team             = "Team X"
  alert_name       = "ServiceX availability"
  runbook_base_url = var.runbook_base_url
  folder_uid       = grafana_folder.any_folder.uid
  label_team       = "teamX"
  label_env        = "prod"
  label_service    = "tjenestex-api"
  availability_slo = 0.995
  severity         = "warning"
}

# Configure test env with SLO of 98%
module "teamX_uptime_alert_serviceX_test" {
  source           = "../../modules/uptime_alerts"
  team             = "Team X"
  alert_name       = "ServiceX availability"
  runbook_base_url = var.runbook_base_url
  folder_uid       = grafana_folder.any_folder.uid
  label_team       = "teamX"
  label_env        = "test"
  label_service    = "tjenestex-api"
  availability_slo = 0.98
  severity         = "warning"
}
```

## Fullstendig eksempel

### SKOOP Grafana produksjonsmiljø
```hcl
module "skoop_uptime_alerts_prod" {
  source           = "../../modules/uptime_alerts"
  team             = local.team
  alert_name       = "Grafana prod unavailable"
  runbook_base_url = var.runbook_base_url
  folder_uid       = grafana_folder.skoop[var.atgcp1_mimir_envs.atgcp1-prod.name].uid
  label_team       = "skoop"
  label_env        = "prod"
  label_service    = "grafana"
  availability_slo = "0.995"
  severity         = "warning"
}
```
- SKOOP legger alarmene sine i mappen `grafana-alerts/atgcp1-prod/skoop/`, så må vi opp to mappenivåer for å finne `grafana-alerts/modules`-mappen (ut av `skoop`og `atgcp1-prod`), derfor bruker vi `../../modules`. Hver `../` går opp ett mappenivå. Hvis alarmen ble definert i en fil i roten på `atgcp1-prod`-mappen så ville det bare blitt `../modules`.
- `alert_name` blir til navnet på alarmgruppen i Grafana Alert Manager, så det er lurt å kalle den noe deskriptivt som gir mening for teamet. Selve alarmen får navnet `label_service+label_env+HighErrorRate`, i dette tilfellet `GrafanaProdHighErrorRate`, og det blir også overskriften på alarmen i Slack.
- `folder_uid` bruker et variabel så alarmen havner i SKOOP sin mappe for atgcp1-prod:  
![Alert path in Grafana Alert Manager](images/grafana_alert_manager_path.png)

## Spørsmål?

Ta kontakt i [#gen-skoop](https://kartverketgroup.slack.com/archives/C05DVCJ222Y) på Slack.
