# Manifester

## Bruk

`skipctl manifests` gir deg kommandoer for å jobbe med skiperator-manifester lokalt. Du kan formatere, validere og rendre manifestene dine før de tas i bruk i produksjon, slik at du raskt oppdager feil.

Alle kommandoene kjøres lokalt, og krever ikke tilgang til eksterne tjenester.

### Format

Formaterer skiperator-manifester direkte (in-place) for å sikre at de følger en konsistent og lesbar struktur.

**Støttede filformater**
- .jsonnet
- .yaml / .yml

```shell
skipctl manifests format --path=env/atkv3-dev
```

### Validate K8s

Validerer en Skiperator-manifestfil mot Skiperators egne skjema-definisjoner (skiperator.kartverket.no/v1alpha1).

**Støtter følgende ressurs-typer:**
-  Application
-  Routing
-  SKIPJob

API-referansen for disse typene finner du i [SKIP-dokumentasjonen](https://skip.kartverket.no/docs/applikasjon-utrulling/skiperator/api-docs).


**Støttede filformater**
- .jsonnet
- .yaml / .yml


```shell
skipctl manifests validate --path=env/atkv3-dev
```



### Render

Rendrer skiperator-manifester til `stdout`, slik at du kan inspisere det endelige resultatet. Filer med syntaksfeil logges til `stderr`.

**Støttede filformater**
- .jsonnet
- .yaml / .yml

Jsonnet filer blir rendret til json.

```shell
skipctl manifests render --path=env/atkv3-dev
```
