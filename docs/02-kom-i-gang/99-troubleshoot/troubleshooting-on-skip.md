# Feilsøking på SKIP

:::info
Denne siden er under konstruksjon og kan bli oppdatert uten forvarsel
:::

Feilsøking av en applikasjon på SKIP kan være utfordrende. Denne dokumentasjonen har som mål å gi leserne en grov idé om hvor de skal starte og hva de skal se etter når de feilsøker.
Den er ment for bruk både av SKIP-teammedlemmer og produktteammedlemmer, og vi vil ta hensyn til å spesifisere feilsøkingstrinn som kan kreve ekstra tilgang som kun er tilgjengelig
for SKIP-teammedlemmer eller administratorer.

## Relevante lenker

[Skiperator kode og dokumentasjon](https://github.com/kartverket/skiperator)

[CLI Jukselapp for SKIP](https://kartverket.atlassian.net/wiki/spaces/SKIP/pages/404553808/CLI+Cheatsheet+for+SKIP) (kan kreve ekstra privilegier)

## Generell sjekkliste ved feilsøking

Nettverk/Istio-relaterte problemer:

- Network policies - default-deny and others (if applicable).
- AccessPolicies both outbound and inbound.
- ServiceEntries
- +++

## Ingress svarer ikke

Start med statusen på objektet:

```bash
kubectl describe applications.skiperator.kartverket.no minapp
```

Bruker applikasjonen `routingProvider: Standard`, sier disse conditionene hva som står på:

| Condition                | Betyr                                                                                                                                |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `Ready`                  | Aggregert status for objektet                                                                                                        |
| `StandardRoutingReady`   | Om Gateway API-ressursene er klare                                                                                                   |
| `LegacyRoutingActive`    | Om Istio-ressursene fortsatt serverer trafikk                                                                                        |
| `SharedRoutingResources` | Objektet bruker delte ressurser, se [delt hostname](../../03-applikasjon-utrulling/03-skiperator/06-delt-hostname.md)                |
| `RoutePathConflict`      | To routes på samme hostname overlapper på path, se [delt hostname](../../03-applikasjon-utrulling/03-skiperator/06-delt-hostname.md) |

Reason-verdien peker på årsaken:

| Reason                     | Betyr                                                                   | Hva skal du gjøre?                                         |
|----------------------------|-------------------------------------------------------------------------|------------------------------------------------------------|
| `StandardRoutingNotReady`  | Skiperator venter på en ressurs                                         | Vent, sjekk meldingen for hvilken ressurs som ikke er klar |
| `CustomCertificateMissing` | Secreten med sertifikatet mangler eller er ubrukelig i `istio-gateways` | Provisjoner/fiks custom-sertifikat i samråd med SKIP       |
| `MigrationStalled`         | Migreringen har tatt over 10 minutter                                   | Ta kontakt med SKIP for hjelp med feilsøking               |
| `OverlappingPathPrefix`    | En annen route på hostnamet dekker samme path                           | Endre `pathPrefix` for å unngå kollisjon                   |

Sjekk også eventene:

```bash
kubectl get events --field-selector involvedObject.name=minapp
```

`GatewayAPIMigrationStarted` og `GatewayAPIMigrationFinished` viser at migreringen går som den skal. `GatewayAPIMigrationStalled` kommer som warning når den har tatt mer enn 10 minutter.

En applikasjon som allerede kjørte på `Legacy`, fortsetter å servere trafikk gjennom `Legacy` så lenge `LegacyRoutingActive` er `True`. En ny applikasjon som starter rett på `Standard`, har ingen fallback, og hostnamet svarer ikke før `StandardRoutingReady` er `True`.

Se [Migrering av ekstern trafikk](../../03-applikasjon-utrulling/03-skiperator/05-routing.md).

## Applikasjonen står i InvalidConfig

En intern `outbound`-regel i `accessPolicy` henter portene fra Servicen til applikasjonen den peker på. Finnes ikke den applikasjonen, blir objektet stående i `InvalidConfig`.

Skiperator kjører en ny reconcile med en gang målapplikasjonen dukker opp eller blir slettet, så dette retter seg selv når det andre teamet ruller ut. Endrede porter og nye namespace-labels fanges opp innen fem minutter.

Er det en `external`-regel som er ugyldig, prøver ikke Skiperator på nytt. Da må du rette regelen selv.
