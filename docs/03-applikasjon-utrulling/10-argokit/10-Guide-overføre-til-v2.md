# Migrer til ArgoKit v2

Denne guiden hjelper deg med å migrere dine eksisterende Jsonnet-filer til ArgoKit v2.

## Oversikt

ArgoKit v2 introduserer en ny struktur som er mer konsistent og enklere å bruke. Migreringen krever en manuell prosess med rendering, konvertering, og validering av manifester.

## Forutsetninger

- [skipctl installert](../skipctl/get-started.md)
- Et apps-repo
- ArgoKit v2 installert i repoet ditt ([se installasjonsveiledning](./01-installation-guide.md))

## Migreringsteg

Følg disse stegene for å sikre en trygg migrering:

### Steg 1: Render ut eksisterende manifester (baseline)

Før du begynner migreringen, render ut alle eksisterende env-filer og lagre dem i en egen mappe. Dette brukes senere for å sammenligne med de nye manifestene.

```shell
# Lag en mappe for legacy manifester
mkdir -p migration/legacy-rendered

# Render ut eksisterende manifester
skipctl manifest render --output migration/legacy-rendered
```

### Steg 2: Konverter application-filer til ArgoKit v2

Konverter dine application libsonnet-filer til ArgoKit v2 ved å følge [dokumentasjonen for ArgoKit v2 med eksempler](./09-argokit-v2.md).

#### Hjelpeverktøy: skipctl refactor (valgfritt)

Hvis `skipctl refactor` er tilgjengelig (per 14. januar 2026 ikke ute enda), kan den brukes til å få AI til å gjøre et første forsøk på å omskrive application libsonnet-filene:

```shell
skipctl refactor --path ./env
```

> Warning: `skipctl refactor` gir kun et første utkast. Du må uansett validere og diffe manifestene manuelt etterpå.

### Steg 3: Render ut nye manifester

Etter å ha overført application-filene til ArgoKit v2, render de ut og legg de rendrede filene i en egen mappe:

```shell
# Lag en mappe for nye manifester
mkdir -p migration/v2-rendered

# Render ut nye manifester
skipctl manifest render --output migration/v2-rendered
```

### Steg 4: Diff mellom legacy og nye manifester

Bruk et diff-script for å sammenligne legacy og nye rendrede manifester. Dette scriptet er annerledes enn `skipctl diff` ved at den tar 2 filer som input, ekstraherer ut listen med ressurser og sorterer den så sammenligningen blir tydeligere.

```shell
# Script kommer (TODO: skal legges til etterpå)
# ./scripts/diff-manifests.sh migration/legacy-rendered migration/v2-rendered
```

:::note
Diff-scriptet vil hjelpe deg med å identifisere eventuelle forskjeller mellom de gamle og nye manifestene, slik at du kan verifisere at migreringen er korrekt.
:::

## Detaljert bruk av skipctl refactor

Hvis `skipctl refactor` er tilgjengelig, kan du bruke følgende kommandoer:

### Grunnleggende bruk

For å refaktorere en enkel fil:

```shell
skipctl refactor <filnavn.jsonnet>
```

### Refaktorere flere filer

For å refaktorere alle Jsonnet-filer i en katalog:

```shell
skipctl refactor --path ./manifests
```

### Tilgjengelige flagg

| Flagg | Type | Beskrivelse |
|---|---|---|
| `--path`, `-p` | string | Katalog som inneholder Jsonnet-filene som skal migreres |
| `--dry-run` | bool | Viser endringene uten å skrive til filer |
| `--output`, `-o` | string | Output-format: `text`, `json` |


## Verifiser endringene

Etter migrering, valider manifestene dine:

```shell
skipctl manifest validate --path ./manifests
```

Hvis du bruker Argo CD, kan du også sjekke diff før du committer:

```shell
skipctl manifest diff --ref main
```

## Vanlige utfordringer

### Manuelle justeringer

Noen komplekse konstruksjoner kan kreve manuell justering etter automatisk refaktorering:

- Custom objects som ikke er standard ArgoKit-funksjoner
- Komplekse betingede uttrykk
- Avanserte array-manipulasjoner

### Namespace-parametere

ArgoKit v2 krever ofte eksplisitte `namespace`-parametere for inbound/outbound policies. Disse må legges til manuelt hvis de mangler.

## Neste steg

Når migreringen er ferdig og du har verifisert at manifestene er korrekte:

1. Test manifestene dine lokalt med `skipctl manifest render`
2. Valider med `skipctl manifest validate`
3. Gjennomgå diff-resultatene nøye og gjør eventuelle manuelle justeringer
4. Se [ArgoKit v2 API Reference](./09-argokit-v2.md) for full dokumentasjon av nye funksjoner
5. Commit og deploy endringene via Argo CD

## Hjelp og support

Hvis du støter på problemer:

- Sjekk [ArgoKit v2 API Reference](./09-argokit-v2.md) for korrekt syntaks
- Se [eksempler i ArgoKit-repoet](https://github.com/kartverket/argokit/tree/main/v2/examples)
- Kontakt SKIP-teamet for assistanse
