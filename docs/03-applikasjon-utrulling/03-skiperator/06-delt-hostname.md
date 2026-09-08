# Dele et hostname mellom team

Flere team kan ha behov for å dele på det samme hostnamet, for eksempel `wms.example.com`, med hver sin path. Hvert team har appene sine i eget namespace og styrer sine egne paths. Teamene trenger ikke koordinere seg med hverandre.

Det fungerer slik:

- Hvert team lager ett `Routing`-objekt i sitt eget namespace. Alle bruker samme `hostname`, `routingProvider: Standard` og `ownership: Shared`.
- `targetApp` slås opp i namespacet til `Routing`-objektet. Du kan ikke peke på en applikasjon i et annet namespace.
- Skiperator slår sammen bidragene og eksponerer hostnamet. Hver path rutes til applikasjonen i teamets eget namespace.

## 1. Sett opp DNS

Dette gjøres én gang for hostnamet, ikke per team. Ligger navnet under `kartverket.cloud` eller `kartverket-intern.cloud`, er alt på plass fra før. For andre domener trenger du et CNAME til `<cluster>.kartverket.cloud`. Se [URLer og sertifikat for tjenester på SKIP](../../02-kom-i-gang/06-praktisk-intro/06-kubernetes/07-urler-og-sertifikat-for-tjenester-på-skip.md).

## 2. Hvert team lager sitt Routing-objekt

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Routing
metadata:
  name: wms
  namespace: team-a
spec:
  hostname: wms.example.com
  routingProvider: Standard
  ownership: Shared
  routes:
    - pathPrefix: /ortosat
      targetApp: ortosat
    - pathPrefix: /ortofoto
      targetApp: ortofoto
```

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Routing
metadata:
  name: wms
  namespace: team-b
spec:
  hostname: wms.example.com
  routingProvider: Standard
  ownership: Shared
  routes:
    - pathPrefix: /kd_veger
      targetApp: kd-veger
```

Med ArgoKit:

```jsonnet
// Team A sitt apps-repo
argokit.routing.new('wms', 'wms.example.com', routingProvider='Standard', ownership='Shared')
+ argokit.routing.withRoute(pathPrefix='/ortosat', targetApp='ortosat')
+ argokit.routing.withRoute(pathPrefix='/ortofoto', targetApp='ortofoto')

// Team B sitt apps-repo
argokit.routing.new('wms', 'wms.example.com', routingProvider='Standard', ownership='Shared')
+ argokit.routing.withRoute(pathPrefix='/kd_veger', targetApp='kd-veger')
```

Sett `port` på `route` hvis applikasjonen svarer på en annen port enn den Skiperator ruter til i utgangspunktet.

## 3. Resten ordner Skiperator

Du skal ikke sette opp `accessPolicy` for dette. Skiperator lager en NetworkPolicy i namespacet ditt som slipper trafikk fra ingress-gatewayen inn til målapplikasjonen.

Sertifikatet er delt per hostname og utstedes med ACME.

`Routing`-objektet ditt får condition `SharedRoutingResources` når det bruker de delte ressursene.

## Paths kan ikke overlappe

Den første ruta som blir akseptert, vinner. Prøver du å ta en path et annet team allerede serverer, avviser Skiperator dette, og HTTPRoute-en din fortsetter å servere bare dine egne paths. Du får condition `RoutePathConflict` med reason `OverlappingPathPrefix`, og en melding av typen:

```
path "/foo" on hostname "wms.example.com" overlaps accepted HTTPRoute team-a/wms
```

Bli enige om path-oppdelingen på forhånd hvis det er fare for overlapp. Skiperator hindrer at to team tar samme path, men velger ikke hvem som skal ha hva.

## Når et team slutter å bruke hostnamet

Sletter du ditt `Routing`-objekt, blir de delte ressursene stående så lenge minst ett annet team bruker hostnamet. Når det siste teamet som bruker hostnamet sletter objektet, blir de delte ressursene slettet.

## Begrensninger

- `ownership: Shared` krever `routingProvider: Standard` på samme `Routing`-objekt.
- Du kan ikke bruke eget sertifikat. `hostname+secret-navn` blir avvist, fordi sertifikatet deles av alle på hostnamet.
- `redirectToHTTPS` gjelder hele hostnamet. Den første som slår den på, slår den på for alle, og ingen kan slå den av igjen. Setter du den til `false` mens et annet team har den på, skjer det ingenting.
