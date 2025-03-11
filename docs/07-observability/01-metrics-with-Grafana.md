# Metrics with Grafana

[Grafana](https://grafana.com/oss/) is one of the more well-known solutions used for insight and utilization of metrics. It offers the ability to inspect single metrics, as well as the ability to aggregate several metrics in a single pane of glass through its dashboards.

## Background

So far we have been able to see metrics through Google Cloud (to be phased out) and Instana (phased out due to not fulfilling its promised potential), but from now on Grafana is the single source of truth in regards to metrics. This is because SKIP has chosen to implement the LGTM stack (Loki, Grafana, Tempo, Mimir), of which Grafana is pretty much an industry standard.

## Getting started

### Adjusting applications

To be able to expose metrics from your own application, the following steps are required:

- Expose Prometheus-format metrics on a known path, for example `/metrics` . We prefer this to be done on its own dedicated port for health checks, metrics and other administrative purposes. If this is not possible with your current setup, please contact us and we will work with you to find a solution.
- Change the Skiperator manifest by adding an extra port and enable scraping of Prometheus metrics.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: super-app
  namespace: team-foo-main
spec:
  image: "kartverket/example"
  port: 8080

  # Definer egen port
  additionalPorts:
    - name: management
      port: 8181
      protocol: TCP

  # Skru på innsamling av metrikker fra den nye porten
  prometheus:
    port: management
    path: "/actuator/prometheus"

```

### Viewing metrics

In order to view metrics and dashboards, visit our Grafana instance at [monitoring.kartverket.cloud](https://monitoring.kartverket.cloud/) .

Here we offer pre-provisioned dashboards that can be viewed to gain insight into how an environment is performing, as well as more detailed metrics about single applications. In addition, there is a dashboard named `JVM (Micrometer)` which is a generic dashboard that offers basic information about Java applications, instrumented through Micrometer.

The **Explore** menu offers the ability to play around with PromQL-formatted queries and view single metrics.

### Provisioning new dashboards

There are two main ways to provision dashboards in our Grafana instance.

The first way is to set it up through “clickops”, that is, using Grafana’s own Dashboards editor in order to design and save a dashboard suited to your needs.

Building your own dashboard is a topic that is way too out of scope for this documentation, and there are many good guides and tutorials on this out there, so we shall merely include a selection of links to some of the more relevant ones here.

:::note
We strive to continually improve our documentation, so if you have experience with building dashboards and can provide some helpful hints and tricks (or even know of other good guides out there) we would greatly appreciate any contributions to this guide.
:::

- [https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/create-dashboard/](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/create-dashboard/) - simple introduction to building your first dashboard.
- [https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/) - it is always worthwile to follow best practices as defined by Grafana themselves.
- [The Four Golden Signals | Google SRE](https://sre.google/sre-book/monitoring-distributed-systems/#xref_monitoring_golden-signals) - worth reading as it mentions the most important metrics to focus on when building a monitoring solution for your system.

The second way is to add a pre-made dashboard as a JSON file (either self-made or from [Grafana’s official Dashboards site](https://grafana.com/grafana/dashboards/) ) in the [skip-dashboards](https://github.com/kartverket/skip-dashboards) repository. By following the GitOps principle, you get quicker access to your own dashboards in a critical scenario in case an environment needs to be rebuilt.
