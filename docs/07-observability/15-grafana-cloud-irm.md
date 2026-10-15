# Grafana Cloud IRM

Grafana Cloud IRM skal erstatte Grafana OnCall for håndtering av alarmer. 
Team kan konfigurere hvilken Slack-kanal som skal motta varsler i prod, dev og sandbox. 
Alarmer opprettes fortsatt i Grafana; se [Alarmering med Grafana](./04-alerting-with-grafana.md) for oppsett av alarmer.

Overgangen fra dagens Grafana (OSS) til Grafana Cloud pågår. SKIP og SKOOP er lagt til i IRM, men ikke alle team er lagt til ennå. 
Noen eksisterende kontaktpunkter er importert, mens andre fortsatt må flyttes. Sjekk derfor hvor teamets alarmer faktisk rutes før dere tar i bruk IRM eller slutter å bruke OnCall. 

## Konfigurasjon

Teamets IRM-konfigurasjon legges i `grafana_cloud/teams/<team>/config.yaml`. Erstatt `<team>` med teamets shortname i Entra ID, for eksempel `skoop` eller `skip`. 

```yaml
prod:
	slack_channel: "<kanalnavn>"
dev:
	slack_channel: "<kanalnavn>"
sandbox:
	slack_channel: "<kanalnavn>"
```

Erstatt `<kanalnavn>` med slack-kanalen for hvert miljø. 
Dere kan bruke samme kanal i flere miljøer.  
Oppsett for escalation chains, SMS og vaktlag er ikke klart ennå.

## Kom i gang

1. Finn teamets shortname i Entra ID og velg slack-kanal for prod, dev og sandbox
2. Legg til `grafana_cloud/teams/<team>/config.yaml` i [`grafana-alerts` repoet](https://github.com/kartverket/grafana-alerts)
3. Oppdater contact point til å være av typen "webhook" og peke mot integrasjonen i grafana cloud. Bruk data block med integration id for å hente ut link til integration <!-- litt greier med provider og noen forenklinger som ikke er nevnt her -->
