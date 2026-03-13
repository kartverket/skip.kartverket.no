---
sidebar_position: 1
---


# Metrics

SKIP bruker Grafana Mimir for å lagre og gjøre spørringer på metrics. Disse lagres i 60 dager.

## Eksponer metrics fra applikasjonen

For å kunne eksponere metrics fra applikasjonen må du gjøre følgende:

* Eksponer metrics på et eget endepunkt, f.eks. `/metrics`. Det beste her er også å eksponere metrics på en egen port for å unngå at endepunktet uheldigvis eksponeres eksternt. Om du ikke kan gjøre dette, ta kontakt med SKIP for å sammen sørge for at data ikke eksponeres eksternt.

* Endre `Skiperator`-manifestet ved å legge til en ekstra port og tillate innhenting av metrics;

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

      # Skru på innsamling av metrics fra den nye porten
      prometheus:
        port: management
        path: "/metrics"
    ```

## Utforsk metrics i Metrics Explore

For å finne ut hvilke metrics du har tilgjengelig for applikasjonen, sjekk ut [Metrics Explore](https://monitoring.kartverket.cloud/explore/metrics).

![Metrics Explore](./images/grafana-metrics-explore.png)

* Bruk labels for å filtrere på f.eks. `namespace`, `application` eller `container` for å finne metrics som er interessante, og søk på metrics i feltet.

* Du kan velge "Select" for å se videre på en enkeltmetrics, og trykke på kompassikonent for å gå videre til Explore for å gjøre metrics-spørringen mer nøyaktig.

Se også:

* 📚 [Grafanas egen dokumentasjon](https://grafana.com/docs/grafana/latest/explore/simplified-exploration/metrics/) beskriver alle detaljene.
* 🎬 Grafana har også en [demovideo](https://www.youtube.com/watch?v=UWTsYTe5Gy4).

## Lag spørringer i Explore

[Explore](https://monitoring.kartverket.cloud/explore) lar deg videreforedle spørringer, eksperimentere og grave raskt.

![Grafana Explore mode](./images/grafana-explore.png)

Her kan du gjøre spørringer i split screen fra ulike datakilder, korrelere data fra både logs, metrics og traces, samt legge ferdige spørringer som paneler i dashboards.

Se også:

* 📚 [Grafanas dokumentasjon](https://grafana.com/docs/grafana/latest/explore/get-started-with-explore/)
