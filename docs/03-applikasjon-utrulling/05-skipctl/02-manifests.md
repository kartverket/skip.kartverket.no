# Manifester
Her har du en oversikt over ulike kommandoer som kan hjelpe når du jobber med skiperator manifester i ditt apps-repo.
Kommandoene skal gjøre lokal utvikling enklere, men de kan også brukes i github workflows.
## Globalt

Felles for alle manifest-kommandoer.

**Flagg**
| Flagg | Type | Standardverdi | Tillatte verdier | Effekt |
|---|---|---|---|---|
| `--output`, `-o` | string | `text` | `text`, `json` | Velger loggformat for logger. |
| `--debug` | bool | `false` | `true`, `false` | Aktiverer debug-logging. |
| `--path`, `-p` | string | `.` | Valgfri sti | Angir hvor manifestene leses fra. |
| `--no-analytics` | `bool` | `true` | Ingen | Velge bort at anonym analysedata blir sendt |

---
## Diff

Sammenligner lokale manifest mot en git ref.

**Eksempel bruk**
| Kommando | Handling |
|---|---|
| `skipctl manifest diff` | Diff’er mot `HEAD` i pretty/full som default. |
| `skipctl manifest diff --diff-format patch --ref main` | Patch-format, automatisk `verbosity=chunk`. |
| `skipctl manifest diff --verbosity minimal --diff-format json` | JSON-format, eksplisitt minimal verbosity. |
| `skipctl manifest diff --chunk-size 5` | Øker kontekst til 5 linjer per side. |


**Flagg**
| Flagg | Type | Standardverdi | Tillatte verdier | Effekt |
|---|---|---|---|---|
| `--ref` | string | `HEAD` | Gyldig git-ref (commit SHA, branch) | Angir hvilken git-ref det diffes mot. |
| `--verbosity` | string | `full` | `minimal`, `chunk`, `full` | Styrer mengde kontekst i diff-output. |
| `--chunk-size` | int | 3 | Heltall ≥ 0 | Antall linjer kontekst over/under endret linje. |
| `--diff-format` | string | `pretty` | `pretty`, `patch`, `json` | Velger output-format for diff. |

**Automatisk standard for `--verbosity` basert på `--diff-format`**
| diff-format | verbosity |
|---|---|
| `pretty` | `full` |
| `patch` | `chunk` |
| `json` | `full` |

**Verbosity nivå**
| verbosity | Beskrivelse |
|---|---|
| `minimal` | Kun endrede linjer |
| `chunk` | Endrede linjer med kontekst (3 linjer over/under som utgangspunkt; påvirkes av `--chunk-size`) |
| `full` | Hele filen |

**Eksempel bruk**
| Kommando | Handling |
|---|---|
| `skipctl manifest diff` | Diff’er mot `HEAD` i pretty/full som default. |
| `skipctl manifest diff --diff-format patch --ref main` | Patch-format, automatisk `verbosity=chunk`. |
| `skipctl manifest diff --verbosity minimal --diff-format json` | JSON-format, eksplisitt minimal verbosity. |
| `skipctl manifest diff --chunk-size 5` | Øker kontekst til 5 linjer per side. |

---


## Validate

Validerer manifestfiler mot kjente Kubernetes-skjema, oppsummerer resultater og rydder opp midlertidige filer.

**Eksempel bruk**
| Kommando | Handling |
|---|---|
| `skipctl manifest validate` | Validerer alle manifester i nåværende katalog. |
| `skipctl manifest validate -p ./k8s` | Validerer alle manifester under ./k8s. |
| `cat manifest.jsonnet \| skipctl manifest validate -` | Validerer manifest fra stdin. |

**Output (oppsummering)**
| Felt | Beskrivelse |
|---|---|
| `totalResources` | Totalt antall ressurser prosessert |
| `valid` | Antall gyldige |
| `invalid` | Antall ugyldige |
| `errors` | Antall feil under validering |
| `skipped` | Antall hoppet over |

---

## Render

Renderer manifestfiler og skriver gyldig output til stdout. Feil går til stderr.

**Eksempel bruk**
| Kommando | Handling |
|---|---|
| `skipctl manifest render` | Renderer alle manifester i nåværende katalog. |
| `skipctl manifest render -p ./manifests` | Renderer alle manifester under ./manifests. |
| `cat manifest.jsonnet \| skipctl manifest render -` | Leser manifest fra stdin og renderer til stdout. |

---


## Format

Formaterer manifestfiler i stedet (“in place”) eller fra stdin til stdout.

**Eksempel bruk**
| Kommando | Handling |
|---|---|
| `skipctl manifest format` | Formaterer alle manifester i nåværende katalog rekursivt. |
| `skipctl manifest format -p ./k8s` | Formaterer alle manifester under ./k8s. |
| `cat manifest.jsonnet \| skipctl manifest format -` | Leser fra stdin, skriver formatert til stdout. |

---

## Schemas

Lister ut alle støttede skjemaer som kan brukes for validering.

**Eksempel bruk**
| Kommando | Handling |
|---|---|
| `skipctl schemas` | Lister ut alle støttede skjemaer. |
