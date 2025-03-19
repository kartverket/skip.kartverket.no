# Recording and alerting rules

## Recording rules in Mimir

SKIP supports [https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/) through Mimir and Grafana Agent. Just define a `PrometheusRule` object in your application’s namespace, and Grafana Agent will pick it up and add it to Mimir.

For more information, see the Prometheus documentation above, or visit [https://grafana.com/docs/grafana/latest/alerting/alerting-rules/create-mimir-loki-managed-recording-rule/](https://grafana.com/docs/grafana/latest/alerting/alerting-rules/create-mimir-loki-managed-recording-rule/)

## Recording rules in Loki

TODO
