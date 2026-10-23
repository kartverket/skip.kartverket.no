# Grafana Cloud IRM

## Hva er Grafana Cloud IRM?

Grafana Cloud IRM brukes til å håndtere alarmer og sende varsler til teamet ditt. 
Når en alarm går i Grafana, sendes den via et contact point til en integration i Grafana Cloud IRM. 
Derfra kan den varsle teamets Slack-kanal og eventuelt vaktlag. 

Alarmene opprettes i Grafana. Se [Alarmering med Grafana](./04-alerting-with-grafana.md) for hvordan du setter opp alarmer.

:::info[Under arbeid]
Grafana Cloud IRM skal erstatte dagens Grafana OnCall, men overgangen er ikke ferdig. 
Ikke alle team er lagt til, og ikke alle contact points er flyttet fra Grafana OSS til Grafana Cloud. 
Oppsett for escalation chains, SMS og vaktlag gjenstår. 

Hvis teamet ditt bruker OnCall i dag, behold oppsettet til dere har flyttet og testet varslingen i IRM. 
Sjekk hvor alarmene sendes før dere slutter å bruke OnCall. Nye team kan kontakte SKOOP via [#gen-skoop](https://kartverketgroup.slack.com/archives/C05DVCJ222Y) på Slack for å avklare oppsettet. 
:::

## Kom i gang

1. Inviter [Grafana Cloud-appen](https://grafana.com/docs/grafana-cloud/observe-and-act/respond-to-incidents/integrations/chat-and-collaboration/slack/) til kanalene som skal motta varsler. Skriv `/invite @Grafana` i hver kanal som skal motta varsler. Velg den som heter "Grafana" om du får opp flere forslag.
2. Konfigurer integration, se [konfigurasjon av integration](#konfigurasjon-av-integration)
3. Sett contact point til å peke mot integration, se [konfigurasjon av contact point](#konfigurasjon-av-contact-point)


## Konfigurasjon av integration

Legg teamets IRM-konfigurasjon i `grafana_cloud/teams/<team>/config.yaml` i [`grafana-alerts`-repoet](https://github.com/kartverket/grafana-alerts). 
Erstatt `<team>` med teamets shortname i Entra ID, for eksempel `skoop` eller `skip`. 

```yaml
prod:
  slack_channel: "<kanalnavn>"
dev:
  slack_channel: "<kanalnavn>"
sandbox:
  slack_channel: "<kanalnavn>"
```

Erstatt `<kanalnavn>` med navnet på Slack-kanalen som skal varsles i hvert miljø. 
Du kan bruke samme kanal i flere miljøer. 


## Konfigurasjon av contact point

Konfigurasjonen av contact point avhenger av om teamet tidligere har opprettet contact points manuelt (click-ops). 
For team som har opprettet contact points manuelt, følg først [Flytting av eksisterende contact point](#flytting-av-eksisterende-contact-point). 
Team med contact point definert som kode trenger kun oppdatere eksisterende contact point. 
Her skal `oncall` blokken byttes ut med `webook` med link til ny Grafana Cloud integration

<!-- 
  TODO: avgjør om vi skal opprette integrasjoner i GC basert på oppsett i OSS og oppdatere eksempelet her etter det
  -> lener mot ja og modul/struktur må på plass før dette oppdateres
-->
```hcl
data "grafana_oncall_integration" "main" {
  id = "<id>"
}

resource "grafana_contact_point" "main" {
  name = "skoop-oncall"

  webhook {
    url = data.grafana_contact_point.main.link
  }
}
```

I overgangen kan både oncall og webhook defineres samtidig med henholdsvis gammel og ny integration. 
Da vil det sendes dobbelt opp med alarmer, men sikrer at ingenting mistes. 


### Flytting av eksisterende contact point

Eksisterende contact points av typen `oncall` for `atgcp1-prod` som ble opprettet manuelt har blitt importert inn i state og ligger i [`contact_points.tf`](https://github.com/kartverket/grafana-alerts/blob/main/atgcp1-prod/contact_points.tf). 
Disse må først flyttes til teamets fil/mappe før øvrig konfigurasjon kan gjøres. 

Etter flyttingen til teamets mappe kan det se slik ut:
```hcl
moved {
  from = grafana_contact_point.oncall["<contact-point-navn>"]
  to   = module.<team>.grafana_contact_point.main
}

resource "grafana_contact_point" "main" {
  name = "<contact-point-navn>"

  oncall {
    url         = module.oncall_integration.link
  }
}

# gammel integration
module "oncall_integration" {
  source                      = "../../modules/oncall_integration"
  ...
}
```
