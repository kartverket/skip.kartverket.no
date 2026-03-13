# Grafana cheat sheet

Dette er en samling av tips&triks som er nyttige ved feilsøking (troubleshooting) av problemer i Kubernetes-clustere basert på data fra LGTM.

## Nyttige Mimir-spørringer (queries)

### Topp 20 metrics med høy kardinalitet (cardinality)

[https://monitoring.kartverket.cloud/goto/cc_GwW1SR?orgId=1](https://monitoring.kartverket.cloud/goto/cc_GwW1SR?orgId=1)

```promql
# Sett tidsintervall til "Last 5 minutes"
topk(20, count by (__name__)({__name__=~".+"}))
```

### Topp 10 namespaces med overallokerte CPU-ressurser

[https://monitoring.kartverket.cloud/goto/6V2jQZJIg?orgId=1](https://monitoring.kartverket.cloud/goto/6V2jQZJIg?orgId=1)

```promql
topk(10, sum by (namespace)
  (kube_pod_container_resource_requests{job="integrations/kubernetes/kube-state-metrics", resource="cpu"})
  - sum by (namespace) (rate(container_cpu_usage_seconds_total{}[$__rate_interval])))
```

### Sum av overallokert CPU for containers per namespace

[https://monitoring.kartverket.cloud/goto/xF2DlW1SR?orgId=1](https://monitoring.kartverket.cloud/goto/xF2DlW1SR?orgId=1)

```promql
sum by (container)
  (kube_pod_container_resource_requests{job="integrations/kubernetes/kube-state-metrics", resource="cpu", namespace=~"matrikkel.*"})
  - sum by (container) (rate(container_cpu_usage_seconds_total{namespace=~"matrikkel.*"}[$__rate_interval]))
```

### Daglig antall forespørsler per destinasjons-app og responskode

```promql
sum by (destination_app, response_code) (
  increase(istio_requests_total{namespace="<namespace name>", response_code=~".*", source_app="istio-ingress-external"}[1d])
)
```

### Nyttige Loki-spørringer (queries)
