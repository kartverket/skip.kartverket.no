# Varsling med Grafana

![Grafana Alerting](images/alerting_with_grafana_header.png)

Applikasjoner på SKIP bruker [Grafana](https://grafana.com/) for å overvåke uventede endringer i systemet. Når en alarm utløses, kan den enten håndteres som en kritisk alarm sendt til flere kanaler, inkludert SMS og e-post, eller som en ikke-kritisk alarm som håndteres i kontortiden av produktteamet.

Her er noen nyttige lenker for håndtering av alarmer:

- [Alarmkonfigurasjon (grafana-alerts på GitHub)](https://github.com/kartverket/grafana-alerts)
- [Alarm-dashboard](https://monitoring.kartverket.cloud/alerting/list?view=state)
- [Dashboard for kritiske alarmer](https://monitoring.kartverket.cloud/d/dd79f2b5-feca-45ff-9396-f67d22adc3c5/alerts?orgId=1)
- [Gjeldende aktive hendelser](https://monitoring.kartverket.cloud/a/grafana-oncall-app/alert-groups)
- [Oversikt over syntetisk overvåking](https://monitoring.kartverket.cloud/d/fU-WBSqWz/synthetic-monitoring-summary?dashboard=summary&orgId=1)
- [Sjekker for syntetisk overvåking](https://monitoring.kartverket.cloud/a/grafana-synthetic-monitoring-app/checks)
- [Planlagte alarmeringer som er dempet (vedlikeholdsperioder)](https://monitoring.kartverket.cloud/alerting/silences)
- [Vaktplaner (Alert Schedules)](https://monitoring.kartverket.cloud/a/grafana-oncall-app/schedules?p=1)

## Opprette alarmer

Det første steget for å begynne å legge til alarmer for applikasjonen din er å onboarde appen til SKIP. Grafana brukes kun for SKIP, resten av Kartverket bruker Zabbix. Når du har blitt onboardet og deployet appen din til SKIP, kan du be om tilgang til [grafana-alerts](https://github.com/kartverket/grafana-alerts)-repoet.

Repoet grafana-alerts er designet for å inneholde alarmer for alle team og håndterer utrulling av alarmer til Grafana. Du vil få en fil som inneholder konfigurasjonen av alarmene dine i et Terraform-format. For eksempel kan filen se slik ut:

```hcl
resource "grafana_folder" "MITT_TEAMNAVN_folder" {
  for_each = local.envs
  title    = "Alarmer MITT_TEAMNAVN ${each.key}"
}

module "MITT_TEAMNAVN_alerts_kubernetes" {
  source   = "../modules/grafana_alert_group"
  for_each = local.envs

  name             = "kube-state-metrics"
  env              = each.value
  runbook_base_url = # URL til dokument som beskriver hver alarm
  folder_uid       = grafana_folder.MITT_TEAMNAVN_folder[each.key].uid
  team = {
    name = "MITT_TEAMNAVN"
  }
  alerts = {
    KubernetesPodNotHealthy = {
      summary     = "Kubernetes Pod er ikke frisk (instans {{ $labels.instance }})"
      description = "Pod har vært i en ikke-klar (non-ready) tilstand i mer enn 15 minutter.\n  VERDI = {{ $value }}\n  LABELS = {{ $labels }}"
      severity    = "critical"
      for         = "15m"
      expr        = <<EOT
          sum by (namespace, pod) (kube_pod_status_phase{phase=~"Pending|Unknown|Failed", namespace=~"nrl-.*"})
      EOT
    },
    # ... flere alarmer
  }
}
```

I filen over oppretter vi en alarm som overvåker helsen til en pod i alle nrl-namespacer. Vær oppmerksom på `expr`-feltet, som er Prometheus-spørrespråket PromQL. Hvis du vil lære mer om PromQL, se på [dokumentasjonen](https://prometheus.io/docs/prometheus/latest/querying/basics/) samt [noen eksempler](https://prometheus.io/docs/prometheus/latest/querying/examples/) fra Prometheus-dokumentasjonen og eksemplene på [awesome prometheus alerts](https://samber.github.io/awesome-prometheus-alerts/) .

Dette er en fil som du vil få CODEOWNER-tilgang til. Dette betyr at du og teamet ditt vil kunne oppdatere denne filen og godkjenne dine egne endringer uten å involvere SKIP. Teamet ditt forventes å holde dem på et nivå som verifiserer applikasjonens kjøretilstand.

Oppdatering av denne filen i GitHub-repoet vil automatisk rulle ut endringene til Grafana.

## Grafana Oncall-alarmer

I tillegg til Grafana-alarmer har vi installert en plugin til Grafana som heter Oncall. Denne pluginen gir oss muligheten til å legge til vaktplaner/skift og tilpasset varslingsoppførsel. Den gir også teamet ditt en oversikt og et system for å håndtere alarmer.

![Oncall Alerts](images/oncall_alerts.png)

### Integrasjon

For å begynne å bruke Oncall trenger du en [oncall-integrasjon](https://grafana.com/docs/oncall/latest/integrations/) i Grafana. Denne integrasjonen vil vises som et kontaktpunkt (contact point) i Grafana, som kan brukes i varslingspolicyer (notification policies) for å rute alarmer til integrasjonen din.

Fra integrasjonen kan du legge til [ruter og eskaleringskjeder](https://grafana.com/docs/oncall/latest/escalation-chains-and-routes/) som bestemmer hvordan integrasjonen skal varsle teamet. Standardoppsettet er å sende alle alarmer til en Slack-kanal, og også til et teammedlem i henhold til vaktplan eller felles innboks.

![SKIPs Oncall-integrasjon](images/oncall_integration.png)

![Grafana kontaktpunkt for en Oncall-integrasjon watchdog](images/oncall_contactpoint.png)

I grafana-alerts-repoet har vi opprettet en `oncall_integration`-modul som du kan bruke for å opprette teamets integrasjon.

### Ruter (Routes)

I en integrasjon har du alltid en standardrute (default route), men du kan også ha en spesifisert rute. En rute bestemmer hvilken eskaleringskjede integrasjonen skal bruke når den mottar en alarm. For eksempel hvis du har en kritisk app som krever 24/7-varsling, kan du opprette en rute som sjekker etter bestemte labels, og hvis de blir funnet, vil den rute alarmen til eskaleringskjeden for “appdrift”.

### Vaktplaner (Schedules)

En [Oncall-vaktplan](https://grafana.com/docs/oncall/latest/on-call-schedules/web-schedule/) er en samling av “skift”. Kort fortalt betyr dette at du kan tildele en person til et skift, og den personen vil motta alle alarmer sendt til Oncall-integrasjonen i løpet av sitt skift. I grafana-alerts-repoet kan du bruke `oncall_team`-integrasjonen for å opprette både en vaktplan og en eskaleringskjede.

![Oncall Schedule](images/oncall_schedule.png)

### Eskaleringskjeder (Escalation Chains)

[Eskaleringskjeder](https://grafana.com/docs/oncall/latest/escalation-chains-and-routes/) er instruksjoner til Oncall om hvordan du skal varsles når den tilkoblede integrasjonen mottar en alarm. Standardoppsettet her er å kontakte den tildelte personen på den måten de har satt opp i Oncall.

Eskaleringskjeden under vil kontakte personen som har et tildelt skift i vaktplanen, på den måten de har valgt i Oncall. Vanligvis e-post eller Slack-mentions.

![Escalation Chain](images/oncall_escalationchain.png)

Under Oncall → Users → edit user, kan du bestemme hvordan du vil at eskaleringskjeden skal kontakte deg.

![Edit user](images/oncall_edituser.png)

### Terraform

Et typisk Grafana Oncall-oppsett for et team vil se slik ut:

```hcl
module "team_oncall" {
    source                      = "../modules/oncall_team"
    team_name                   = "team"
    use_schedule                = true
}

module "team_integration" {
    source                      = "../modules/oncall_integration"
    integration_name            = "team"
    slack_channel_name          = "grafana-oncall" //Ikke påkrevd, bytt ut med din egen
    vaktlag_enabled             = false
    default_escalation_chain_id = module.team_oncall.team_escalation_chain_id
}
```

:::note
Slack-kanalen må allerede eksistere i Grafana.

Hvis du ønsker å bruke forhåndsdefinerte brukere i stedet for en vaktplan, må brukerne allerede eksistere i Oncall.
:::

### Varslingspolicyer (Notification policies)

Du må også konfigurere varslingspolicyer for å bruke integrasjonen din. Terraform aktiverer ikke kontaktpunktet til integrasjonen ennå, så dette må gjøres manuelt før du legger dette til i Terraform (gjør dette ved å navigere til integrasjonen din og aktivere kontaktpunktet). Legg til kode [her.](https://github.com/kartverket/grafana-alerts/blob/main/atgcp1-prod/policies.tf)

Eksempel:

```hcl
policy {
  contact_point = "watchdog"
  group_by      = ["cluster", "alertname"]
  matcher {
    label = "team"
    match = "="
    value = "Vaktlag"
  }
}
```

## 24/7-varsling

Når du har konfigurert et sett med alarmer, vil du kanskje at de skal overvåkes 24/7. Kartverket tilbyr en løsning for dette i form av “Vaktlaget”. Vaktlaget er et team bestående av ulike personer i IT-drift som har en spesiell avtale som tillater dem å bli varslet og følge opp når en alarm utløses utenfor normal arbeidstid.

Det første steget for å få alarmene dine onboardet til vaktlaget er å vedlikeholde et sett med alarmer som kun utløses når det er en alvorlig driftsstans. Husk at en alarm som utløses potensielt vil vekke folk midt på natten, så det er avgjørende at dette settet med alarmer ikke inneholder ikke-kritiske eller ustabile ("flaky") alarmer. Disse alarmene bør gis alvorlighetsgraden “critical” for å skille dem fra andre alarmer.

Når du har gjort dette, må du kontakte vaktlaget for å diskutere alarmene du ønsker å onboarde. De vil gi tilbakemelding på hva som er viktig nok til å bli onboardet, og du vil ende opp med et sett med alarmer som er en god balanse mellom å sikre stabiliteten i systemene våre og å bevare den mentale helsen til personene på vaktplanen.

Etter at du har diskutert med vaktlaget, kan du kontakte SKIP i #gen-skip for å få alarm-integrasjonen din byttet over. Når dette er gjort, vil alle alarmer merket med env=prod og severity=critical bli sendt til vaktlaget i henhold til følgende plan:

- Alarmene vil bli sendt til din Slack-kanal hele døgnet
- Alarmene vil bli sendt til appdrift som e-post, SMS og telefonsamtale mellom kl. 07 og 22
- Alarmene vil bli sendt til infrastrukturdrift som e-post, SMS og telefonsamtale mellom kl. 22 og 07

Du kan også opprette en pull request i grafana-alerts med vaktlagets eskaleringskjede lagt til i din integrasjon:

```hcl
module "skip" {
  source                      = "../modules/oncall_integration"
  integration_name            = "skip"
  slack_channel_name          = "grafana-oncall" //Ikke påkrevd, bytt ut med din egen
  vaktlag_enabled             = true
  vaktlag_escalation_chain_id = module.vaktlag.appdrift_escalation_chain_id
  default_escalation_chain_id = module.skip.team_escalation_chain_id
}
```

Når du senere legger til flere alarmer på kritisk nivå, må du også diskutere med vaktlaget slik at de kan godkjenne de nye alarmene før de blir lagt til.
