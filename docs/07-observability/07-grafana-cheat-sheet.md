# Grafana cheat sheet

This is a collection of tips&tricks that are useful when troubleshooting problems in the kubernetes clusters based on data from LGTM

## Useful Mimir queries

### Top 20 of metrics with high cardinality

[https://monitoring.kartverket.cloud/goto/cc_GwW1SR?orgId=1](https://monitoring.kartverket.cloud/goto/cc_GwW1SR?orgId=1)

```promql
# Set time range to "Last 5 minutes"
topk(20, count by (__name__)({__name__=~".+"}))
```

### Top 10 namespaces with overallocated cpu resources

[https://monitoring.kartverket.cloud/goto/6V2jQZJIg?orgId=1](https://monitoring.kartverket.cloud/goto/6V2jQZJIg?orgId=1)

```promql
topk(10, sum by (namespace)
  (kube_pod_container_resource_requests{job="integrations/kubernetes/kube-state-metrics", resource="cpu"})
  - sum by (namespace) (rate(container_cpu_usage_seconds_total{}[$__rate_interval])))
```

### Sum of overallocated cpu for containers by namespace

[https://monitoring.kartverket.cloud/goto/xF2DlW1SR?orgId=1](https://monitoring.kartverket.cloud/goto/xF2DlW1SR?orgId=1)

```promql
sum by (container)
  (kube_pod_container_resource_requests{job="integrations/kubernetes/kube-state-metrics", resource="cpu", namespace=~"matrikkel.*"})
  - sum by (container) (rate(container_cpu_usage_seconds_total{namespace=~"matrikkel.*"}[$__rate_interval]))
```

### Daily amount of requests by destination app and response code

```promql
sum by (destination_app, response_code) (
  increase(istio_requests_total{namespace="<namespace name>", response_code=~".*", source_app="istio-ingress-external"}[1d])
)
```

# Useful Loki queries
