# Recording- og varslingsregler

## Recording-regler i Mimir

SKIP støtter [https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/) gjennom Mimir og Grafana Agent. Bare definer et `PrometheusRule`-objekt i applikasjonens namespace, så vil Grafana Agent plukke det opp og legge det til i Mimir.

For mer informasjon, se Prometheus-dokumentasjonen ovenfor, eller besøk [https://grafana.com/docs/grafana/latest/alerting/alerting-rules/create-mimir-loki-managed-recording-rule/](https://grafana.com/docs/grafana/latest/alerting/alerting-rules/create-mimir-loki-managed-recording-rule/)

## Recording-regler i Loki

TODO
