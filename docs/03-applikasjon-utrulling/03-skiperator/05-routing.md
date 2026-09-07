# Migrering av ekstern trafikk

:::info
Vi anbefaler at du migrerer fra `Legacy` til `Standard` routing. På sikt blir `Standard` standardverdien i ArgoKit.
:::

Skiperator kan sette opp ekstern trafikk (ingress) på to ulike måter. Feltet `spec.routingProvider` styrer hvilken. Det finnes både på `Application` og `Routing`.

| Verdi      | Hva Skiperator lager                                      | Status                                                                                  |
|------------|-----------------------------------------------------------|-----------------------------------------------------------------------------------------|
| `Legacy`   | Istio `Gateway` og `VirtualService`                       | Nåværende standardverdi, blir fjernet senere når de fleste teamene har migrert         |
| `Standard` | Kubernetes Gateway API: `ListenerSet` og `HTTPRoute` etc. | Anbefalt verdi, og bør brukes i alle nye applikasjoner                                 |

Skal flere team dele ett hostname, for eksempel `wms.example.com`, se [Dele et hostname mellom team](06-delt-hostname.md). Det bruksmønsteret krever `Standard` på `Routing`-objektet.

## Hvorfor finnes det to måter?

Da SKIP startet, var det bare én realistisk måte for oss å sette opp ekstern trafikk på: Istio sine API-er for trafikkstyring, `VirtualService` og `Gateway`. Det svarer til `spec.routingProvider=Legacy`. Siden har økosystemet standardisert på [Gateway API](https://gateway-api.sigs.k8s.io/docs/introduction/), en leverandøruavhengig måte å konfigurere trafikkstyring på. Det er `spec.routingProvider=Standard`.

SKIP unngår leverandørbindinger der vi kan, og bygger på etablerte standarder når det gir mening. Vi mener Gateway API nå er modent nok til å bli den nye måten vi eksponerer trafikk på.

## Migrere til `Standard` routing

Med YAML:

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: minapp
spec:
  image: image
  port: 8080
  routingProvider: Standard # Dette er alt som trengs
  ingresses:
    - minapp.atkv3-dev.kartverket-intern.cloud
```

Med ArgoKit:

```jsonnet
application.new('minapp', 'foo.io/image', 8080)
+ application.forHostnames('minapp.atkv3-dev.kartverket-intern.cloud')
+ application.withRoutingProvider('Standard') # Dette er alt som trengs
```

## Hva skjer under panseret når du bytter

Skiperator flytter deg over uten nedetid når applikasjonen allerede kjører på `Legacy`.

1. Skiperator lager de nye Gateway API-ressursene i tillegg til de eksisterende Istio-ressursene. Trafikken går fortsatt gjennom `Legacy`.
2. `Ready` settes til `False` og `LegacyRoutingActive` til `True` så lenge migreringen pågår. Skiperator sender ut et `GatewayAPIMigrationStarted`-event.
3. Når Kubernetes-ressursene av typen `ListenerSet`, `HTTPRoute`, `Certificate` og tilhørende TLS-secret er klare, går trafikken via den nye konfigurasjonen. Da vil Istio-ressursene slettes, `Ready` blir satt til `True` og du får et `GatewayAPIMigrationFinished`-event.

Tar overgangen mer enn **10 minutter**, kan du se `MigrationStalled` på `Application`-objektet, og Skiperator sender et `GatewayAPIMigrationStalled`-event (warning). `Legacy`-konfigurasjonen sørger for at trafikk fortsatt flyter som normalt. Havner du i denne tilstanden, bør du ta kontakt med SKIP.

## Begrensninger

`spec.istioSettings.retries` virker bare med `Legacy`. Gateway API tilbyr retries på HTTPRoute kun i den eksperimentelle kanalen, og den installerer vi ikke i SKIP-clusterne. En `Application` som ber om både retries og `Standard` blir avvist, slik at du ikke mister retry-policyen uten å oppdage det.

## Status og conditions

Conditions er synlige i verktøy som snakker med Kubernetes, for eksempel `kubectl` og Argo CD. De viser hvor langt migreringen har kommet.

```shell
# Se status på en applikasjon
kubectl describe applications.skiperator.kartverket.no minapp -n mitt-namespace
# Se status på en routing-ressurs
kubectl describe routings.skiperator.kartverket.no minrouting -n mitt-namespace
```

| Condition                | Betyr                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------|
| `Ready`                  | Aggregert status for objektet                                                           |
| `StandardRoutingReady`   | Om Gateway API-ressursene er klare                                                      |
| `LegacyRoutingActive`    | Om Istio-ressursene fortsatt serverer trafikk                                           |
| `SharedRoutingResources` | Objektet bruker delte ressurser, se [delt hostname](06-delt-hostname.md)                |
| `RoutePathConflict`      | To routes på samme hostname overlapper på path, se [delt hostname](06-delt-hostname.md) |

Reason-verdier du kan møte:

| Reason                     | Betyr                                                                   | Hva skal du gjøre?                                         |
|----------------------------|-------------------------------------------------------------------------|------------------------------------------------------------|
| `StandardRoutingNotReady`  | Skiperator venter på en ressurs                                         | Vent, sjekk meldingen for hvilken ressurs som ikke er klar |
| `CustomCertificateMissing` | Secreten med sertifikatet mangler eller er ubrukelig i `istio-gateways` | Provisjoner/fiks custom-sertifikat i samråd med SKIP       |
| `MigrationStalled`         | Migreringen har tatt over 10 minutter                                   | Ta kontakt med SKIP for hjelp med feilsøking               |
| `OverlappingPathPrefix`    | En annen route på hostnamet dekker samme path                           | Endre `pathPrefix` for å unngå kollisjon                   |
