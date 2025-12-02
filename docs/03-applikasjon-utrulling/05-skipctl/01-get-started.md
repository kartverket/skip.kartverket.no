# Kom i gang

## Bruk Homebrew (macOS & Linux)
### Installasjon
```shell
brew tap kartverket/taps && \
brew install skipctl
```

### Oppdatering
Om du allerede har installert skipctl kan du sjekke versjon slik:
```shell
skipctl -v
```

Oppdater til nyeste versjon slik:
```shell
brew upgrade kartverket/taps/skipctl
```

## Utvikling av skipctl

*Dette avsnittet er kun relevant for de som skal jobbe med kildekoden til skipctl.*

### Installere Go
For å bygge skipctl fra kildekode trenger du Go installert:
```shell
brew install go
```

### Bygg
Bygg skipctl med make:
```shell
make build
```

### Lokal utvikling

Bygg en lokal versjon:
```shell
go build -o skipctl .
```

Kjør den lokale versjonen:
```shell
./skipctl schemas
./skipctl manifest validate myapp.yaml
```

Kjør linter:
```shell
brew install golangci-lint
golangci-lint run
```

## Windows

### Installasjon
Last ned [siste versjon](https://github.com/kartverket/skipctl/releases) for Windows.

### Oppdatering
Last ned [siste versjon](https://github.com/kartverket/skipctl/releases) og erstatt den eksisterende filen.

Sjekk versjon:
```shell
skipctl -v
```

## Utvikling av skipctl (Windows)

*Dette avsnittet er kun relevant for de som skal jobbe med kildekoden til skipctl.*

### Installere Go
For å bygge skipctl fra kildekode trenger du Go installert. Last ned fra [go.dev/dl](https://go.dev/dl/).

### Bygg
Bygg skipctl med make:
```shell
make build
```

### Lokal utvikling

Bygg en lokal versjon (lager `skipctl.exe`):
```shell
go build -o skipctl.exe .
```

Kjør den lokale versjonen:
```shell
.\skipctl schemas
.\skipctl manifest validate myapp.yaml
```

Kjør linter:
```shell
golangci-lint run
```

## Skipctl server
Last ned [siste versjon](https://github.com/kartverket/skipctl/releases) eller bruk det medfølgende Docker-imaget (hovedsakelig for å kjøre en server for `test`-funksjonaliteten).
