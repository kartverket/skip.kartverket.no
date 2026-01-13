# Migrer til ArgoKit v2 med skipctl

Denne guiden hjelper deg med å migrere dine eksisterende Jsonnet-filer til v2 ved hjelp av `skipctl refactor`.

## Oversikt

ArgoKit v2 introduserer en ny struktur som er mer konsistent og enklere å bruke. `skipctl refactor` bruker vertex-AI og vil prøve å konvertere de eksisterende manifest-filene dine.

## Forutsetninger

- [skipctl installert](../skipctl/get-started.md)
- Et apps-repo
- ArgoKit v2 installert i repoet ditt ([se installasjonsveiledning](./01-installation-guide.md))

## Bruk av skipctl refactor

### Grunnleggende bruk

For å refaktorere en enkel fil:

```shell
skipctl refactor <filnavn.jsonnet>
```

### Refaktorere flere filer
TODO: test at funker

For å refaktorere alle Jsonnet-filer i en katalog:

```shell
skipctl refactor --path ./manifests
```

### Flagg

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

Når migreringen er ferdig:

1. Test manifestene dine lokalt med `skipctl manifest render`
2. Valider med `skipctl manifest validate`
3. Se [ArgoKit v2 API Reference](./09-argokit-v2.md) for full dokumentasjon av nye funksjoner
4. Commit og deploy endringene via Argo CD

## Hjelp og support

Hvis du støter på problemer:

- Sjekk [ArgoKit v2 API Reference](./09-argokit-v2.md) for korrekt syntaks
- Se [eksempler i ArgoKit-repoet](https://github.com/kartverket/argokit/tree/main/v2/examples)
- Kontakt SKIP-teamet for assistanse
