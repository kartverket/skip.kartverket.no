# Real User Monitoring med Faro

![Faro Grafana Dashboard](images/faro_header.png)

Det kan ofte være utfordrende å oppdage lastetider for sider og brukeratferd i nettleseren, da det ikke genereres logger eller metrikker man kan inspisere. [Grafana Faro](https://grafana.com/oss/faro/) løser dette ved at du kan legge til en JavaScript SDK i frontend-applikasjonen din, som sender hendelser (events) over HTTP til en mottaker som legger dataene inn i Grafana. På denne måten kan du observere metrikker for reell brukeratferd i sanntid ved hjelp av Grafana, og sette opp alarmer på disse som du vanligvis ville gjort med Grafana Alerting.

Det er flere typer hendelser som støttes av Faro:

- Hendelser som Time To First Byte og First Contentful Paint kan hjelpe med feilsøking av trege frontend-sider
- Unntak (exceptions) samles inn og sendes slik at du har en komplett katalog over alle unntak som har oppstått i frontend av appen din. Source maps brukes for å koble linjenumre tilbake til kildekoden
- Sidebesøk telles slik at du kan se hvilke sider som besøkes av brukere
- Metadata som nettlesertype gjør det mulig å se hvilke nettlesere som er i bruk og hvilke du ikke trenger å støtte lenger

Du har kanskje hørt om lignende tjenester som [Sentry.io](http://sentry.io/) . Faro må ikke forveksles med en analysetjeneste, og det anbefales å ha en egen instans for brukerinnsikt som Google Analytics eller Posthog. En analysetjeneste kan fortelle deg mer om brukeratferd, mens tjenester som Faro og Sentry er mer beregnet for overvåking og feilsøking.

## Kom i gang

Oppsett av Faro krever to steg som er forklart nedenfor:

1. Installere SDK-en
2. Konfigurere SDK-en

Det vil også være nyttig å starte med å lese [Faros hurtigstartveiledning](https://github.com/grafana/faro-web-sdk/blob/main/docs/sources/tutorials/quick-start-browser.md#install-grafana-faro-web-sdk) . Se også [README-filen](https://github.com/grafana/faro-web-sdk/blob/main/README.md) på Faro sin GitHub-side for flere lenker til relevant dokumentasjon.

### Installere SDK-en

Hvis du bruker React, gjøres dette ved å kjøre en av følgende kommandoer:

```bash
# Hvis du bruker npm
npm i -S @grafana/faro-web-sdk

# Hvis du bruker Yarn
yarn add @grafana/faro-web-sdk
```

### Konfigurere SDK-en

Importer og konfigurer følgende alternativer i appens startpunkt (main.js eller lignende).

```js
import { initializeFaro } from "@grafana/faro-react";

initializeFaro({
  app: {
    name: "mitt_app_navn",
    environment: getCurrentEnvironment(),
  },
  url: "https://faro.atgcp1-prod.kartverket.cloud/collect",
});
```

### Liste over gyldige alternativer for `app`

|             | **Type**    | **Beskrivelse**                                                        | **Påkrevd?** |
| ----------- | ----------- | ---------------------------------------------------------------------- | ------------- |
| name        | string      | Navnet på applikasjonen slik det vil vises på dashboards i Grafana | Ja           |
| environment | “localhost” &vert; “dev” &vert; “test” &vert; “prod” | Miljøet frontend-appen kjører i for øyeblikket. Dette brukes til å filtrere data i Grafana-dashboards | Ja |

### Konfigurere SDK-en med React Router-integrasjon

Grafana Faro støtter integrasjon med React Router. Dette gir deg hendelser for sidenavigering og re-renderinger. Se [Faro-dokumentasjonen](https://github.com/grafana/faro-web-sdk/blob/main/packages/react/README.md) for mer informasjon om dette.

## Vise dataene

Når metrikkene har begynt å samles inn, vil de være synlige i et eget Grafana Faro-dashboard. Dette dashboardet finner du [her](https://monitoring.kartverket.cloud/d/CiroMopVz/grafana-faro-frontend-monitoring) .

Det er også mulig å søke etter data i [Explore-visningen](https://monitoring.kartverket.cloud/explore) . Nyttige labels å søke etter er:

- `faro_app_name`
- `kind`
- `env`

## Personvern

:::note
Det er opp til deg og teamet ditt å vurdere hvordan Faro skal brukes i forhold til personopplysninger, som beskrevet i deres IP og DPIA.
:::

Når vi sender data til Faro, er det for det meste metrikker som ikke inneholder [PII (personidentifiserbar informasjon)](https://www.investopedia.com/terms/p/personally-identifiable-information-pii.asp) . Det er mulig å inkludere PII som navn, IP eller annet som er tilgjengelig fra JavaScript i SDK-en, men dette gjøres ikke som standard og krever at man kaller `setUser`-funksjonen i SDK-en.

En sesjons-ID sendes inn for å muliggjøre de-duplisering av hendelser som navigering mellom sider og rangering av toppbrukere. Dette er en tilfeldig generert streng og lagres i brukerens SessionStorage i nettleseren. Merk at selv om dette ikke er en informasjonskapsel (cookie), betyr dette at et “cookie-banner” er påkrevd i henhold til EUs [ePrivacy-direktiv](https://en.wikipedia.org/wiki/EPrivacy_Directive#Cookies) .

Siden `SessionInstrumentation` er [inkludert som standard](https://github.com/grafana/faro-web-sdk/blob/28f2d0c6c3032ce56876045c5a92256f5f798605/packages/web-sdk/src/config/getWebInstrumentations.ts#L18) i web-instrumenteringen til JavaScript SDK-en, krever deaktivering av dette at man kaller SDK-en med `instrumentations` satt og utelater `SessionInstrumentation`-funksjonen.

Data lagres på SKIP sitt `atgcp1-prod`-cluster, som lagrer data i Google Cloud Storage i regionen europe-north1. Denne regionen ligger i Finland, og er dermed innenfor EU. Dette betyr at ingen data forlater EUs grenser, noe som betyr at lagringen av dataene er i samsvar med GDPR.

## Rate limiting

En hastighetsbegrensning (rate limit) for forespørsler er implementert og er for øyeblikket satt til `50` forespørsler per sekund. Denne deles mellom alle brukere av Faro, så det er mulig at vi til slutt når grensen. Kontakt SKIP hvis du begynner å få forespørsler avvist med `HTTP 429 Too Many Requests` .

Algoritmen for hastighetsbegrensning er en "token bucket"-algoritme, der en bøtte (bucket) har en maksimal kapasitet på opptil burst_size forespørsler og fylles opp med en hastighet på rate per sekund.

Hver HTTP-forespørsel tømmer kapasiteten til bøtta med én. Når bøtta er tom, blir HTTP-forespørsler avvist med statuskoden HTTP 429 Too Many Requests inntil bøtta har ledig kapasitet igjen.

## Tracing

Faro støtter [tracing](https://grafana.com/docs/grafana-cloud/monitor-applications/frontend-observability/instrument/tracing-instrumentation/) av HTTP-forespørsler, men dette er foreløpig ikke implementert i innsamleren på SKIP. Kontakt SKIP hvis du ønsker dette!
