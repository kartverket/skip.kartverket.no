# Migrer til ArgoKit v2

Denne guiden hjelper deg med å migrere dine eksisterende Jsonnet-filer til ArgoKit v2.

## Oversikt

ArgoKit v2 introduserer en ny struktur som er mer konsistent og enklere å bruke. Migreringen krever en manuell prosess med rendering, konvertering, og validering av manifester.

## Forutsetninger

- [skipctl installert](../05-skipctl/01-get-started.md)
- Et apps-repo
- ArgoKit v2 installert i repoet ditt ([se installasjonsveiledning](./01-installation-guide.md))

## Migreringsteg

Følg disse stegene for å sikre en trygg migrering:

### Steg 1: Render ut eksisterende manifester (baseline)

Før du begynner migreringen, render ut alle eksisterende env-filer og lagre dem i en egen mappe. Dette brukes senere for å sammenligne med de nye manifestene. Kjør følgende kommandoer:

```shell
mkdir -p migration/legacy-rendered

for env_file in env/**/*.jsonnet; do
  rel_path="${env_file#env/}"
  output_file="migration/legacy-rendered/${rel_path%.jsonnet}.json"
  
  echo "Rendering $env_file -> $output_file"
  mkdir -p "$(dirname "$output_file")"
  skipctl manifests render --path "$env_file" -o json > "$output_file" 2>&1
done
```

### Steg 2: Konverter application-filer til ArgoKit v2

Konverter dine application libsonnet-filer til ArgoKit v2 ved å følge [dokumentasjonen for ArgoKit v2 med eksempler](./09-argokit-v2.md).

Du kan opprette en egen mappe for de konverterte filene for å holde orden på migreringsprosessen:

```shell
mkdir -p applications-v2
```

#### Hjelpeverktøy: skipctl refactor (valgfritt)

> **Note:** `skipctl refactor` er ikke tilgjengelig ennå (per 14. januar 2026), men når den blir lansert, kan den brukes som et hjelpeverktøy i migreringsprosessen.

Når kommandoen er tilgjengelig, kan den brukes til å automatisk konvertere application libsonnet-filer til ArgoKit v2-format. For å bruke verktøyet, spesifiser env-filen som inneholder referansen til application-filen du vil konvertere:

```shell
skipctl refactor env/example-file.jsonnet
```

Kommandoen analyserer env-filen, finner den tilknyttede application-filen, og genererer en ArgoKit v2-versjon av den.

> **Warning:** `skipctl refactor` genererer kun et første utkast basert på automatisk konvertering. Du må alltid validere resultatet manuelt og kjøre diff mellom legacy og nye manifester (se steg 4) for å sikre at migreringen er korrekt.

### Steg 3: Render ut nye manifester

Etter å ha overført application-filene til ArgoKit v2, render de ut og legg de rendrede filene i en egen mappe:

```shell
mkdir -p migration/v2-rendered

for env_file in env/**/*.jsonnet; do
  rel_path="${env_file#env/}"
  output_file="migration/v2-rendered/${rel_path%.jsonnet}.json"
  
  echo "Rendering $env_file -> $output_file"
  mkdir -p "$(dirname "$output_file")"
  skipctl manifests render --path "$env_file" -o json > "$output_file" 2>&1
done
```

### Steg 4: Diff mellom legacy og nye manifester

Bruk diff-scriptet for å sammenligne legacy og nye rendrede manifester. Dette scriptet er spesielt laget for migrering til ArgoKit v2, og det er **sterkt anbefalt** å bruke det for å verifisere at migreringen er korrekt.

Scriptet er annerledes enn `skipctl diff` ved at den tar 2 rendrede manifest-filer som input, ekstraherer ut listen med ressurser og sorterer den så sammenligningen blir tydeligere.

#### Opprett diff-scriptet

Lag et Python-script `scripts/compare-manifests.py`:

```python
import json
import sys
import difflib

def load_manifest(filepath):
    """Loads a JSON manifest file."""
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: File not found: {filepath}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Failed to parse JSON in {filepath}: {e}")
        sys.exit(1)

def normalize_manifest(data):
    """
    Normalizes the manifest data for comparison.
    - If it's a list (kind: List), extract 'items' to remove the List wrapper.
    - If it's a raw list, use it directly.
    - Matches single objects by wrapping them in a list.
    """
    if isinstance(data, dict) and data.get("kind") == "List" and "items" in data:
        items = data["items"]
    elif isinstance(data, list):
        items = data
    else:
        # If it's a single object, wrap it in a list for uniform processing
        items = [data]
    
    return items

def deep_sort(obj):
    """
    Recursively sorts lists and dictionaries to ensure deterministic ordering.
    This handles cases where environment variables or list items are reordered.
    """
    if isinstance(obj, dict):
        # Recursively sort values in the dictionary
        return {k: deep_sort(v) for k, v in obj.items()}
    if isinstance(obj, list):
        # Recursively deep sort items in the list first
        items = [deep_sort(x) for x in obj]
        # Then sort the list itself based on stable JSON representation
        return sorted(items, key=lambda x: json.dumps(x, sort_keys=True))
    return obj

def get_resource_id(item):
    """Generates a unique ID for a Kubernetes resource: Kind::Namespace::Name"""
    if not isinstance(item, dict):
        return "Unknown::Unknown"
    kind = item.get("kind", "Unknown")
    meta = item.get("metadata", {})
    name = meta.get("name", "Unknown")
    namespace = meta.get("namespace", "")
    
    if namespace:
        return f"{kind}::{namespace}::{name}"
    return f"{kind}::{name}"

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 compare.py <file1> <file2>") 
        sys.exit(1)
    
    file1 = sys.argv[1]
    file2 = sys.argv[2]

    print(f"Comparing {file1} and {file2}...")

    data1 = load_manifest(file1)
    data2 = load_manifest(file2)

    norm1 = normalize_manifest(data1)
    norm2 = normalize_manifest(data2)

    # Map items by their Kubernetes ID
    map1 = {get_resource_id(item): item for item in norm1}
    map2 = {get_resource_id(item): item for item in norm2}

    # Get a sorted list of all unique resource IDs involved
    all_keys = sorted(set(map1.keys()) | set(map2.keys()))

    found_diff = False
    
    # ANSI colors
    GREEN = '\033[92m'
    RED = '\033[91m'
    CYAN = '\033[96m'
    YELLOW = '\033[93m'
    RESET = '\033[0m'

    for key in all_keys:
        # Check for missing objects
        if key not in map1:
            print(f"{GREEN}[+] Object {key} added in {file2}{RESET}")
            found_diff = True
            continue
        if key not in map2:
            print(f"{RED}[-] Object {key} removed from {file1}{RESET}")
            found_diff = True
            continue
            
        # Object exists in both, compare content
        obj1 = map1[key]
        obj2 = map2[key]
        
        # Apply deep sort to ignore list ordering issues
        sorted1 = deep_sort(obj1)
        sorted2 = deep_sort(obj2)
        
        # Dump to string for diffing
        str1 = json.dumps(sorted1, indent=3, sort_keys=True)
        str2 = json.dumps(sorted2, indent=3, sort_keys=True)
        
        if str1 != str2:
            found_diff = True
            print(f"\n{YELLOW}Mismatch in {key}:{RESET}")
            
            diff = difflib.unified_diff(
                str1.splitlines(), 
                str2.splitlines(), 
                fromfile=f"old", 
                tofile=f"new", 
                lineterm=''
            )
            
            for line in diff:
                if line.startswith('+') and not line.startswith('+++'):
                    print(f"{GREEN}{line}{RESET}")
                elif line.startswith('-') and not line.startswith('---'):
                    print(f"{RED}{line}{RESET}")
                elif line.startswith('^') or line.startswith('@@') or line.startswith('+++') or line.startswith('---'):
                    print(f"{CYAN}{line}{RESET}")
                else:
                    print(line)

    if found_diff:
        print(f"\n❌ Failure: The manifests differ.")
        sys.exit(1)
    else:
        print(f"\n✅ Success: The manifests contain the same objects.")
        sys.exit(0)

if __name__ == "__main__":
    main()
```

#### Kjør diff-scriptet

```shell
python3 scripts/compare-manifests.py migration/legacy-rendered/<env>.json migration/v2-rendered/<env>.json
```

Scriptet vil:
- Ekstraherer ut alle ressurser fra begge manifester
- Sorterer ressursene for bedre sammenligning
- Viser forskjeller med fargekoding (grønn = lagt til, rød = fjernet, gul = endret)
- Returnerer exit code 0 hvis manifestene er identiske, 1 hvis de er forskjellige

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
