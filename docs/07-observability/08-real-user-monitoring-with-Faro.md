# Real User Monitoring med Faro

![Faro Grafana Dashboard](images/faro_header.png)

Å oppdage lastetider for sider og brukeratferd i nettleseren kan ofte være vanskelig, da det ikke genereres logger eller metrikker som kan inspiseres. [Grafana Faro](https://grafana.com/oss/faro/) løser dette ved å la deg legge til en JavaScript SDK i din frontend som sender hendelser (events) over HTTP til en mottaker som legger dataene inn i Grafana. På denne måten kan du observere metrikker for reell brukeratferd i sanntid ved hjelp av Grafana, og sette opp alarmer på dem slik du vanligvis ville gjort med Grafana Alerting.

Det er flere typer hendelser (events) som støttes av Faro:

- Hendelser som Time To First Byte og First Contentful Paint kan hjelpe med feilsøking av trege frontend-sider.
- Unntak (exceptions) samles inn og sendes slik at du har en komplett oversikt over alle unntak som har blitt kastet i frontend av appen din. Source maps brukes for å koble linjenummer tilbake til kildekoden.
- Sidebesøk telles slik at du kan se hvilke sider som besøkes av brukerne.
- Metadata som nettlesertype lar deg se hvilke nettlesere som er i bruk og hvilke du kanskje ikke trenger å støtte lenger.

Du har kanskje hørt om lignende tjenester som [Sentry.io](http://sentry.io/). Faro skal ikke forveksles med en analysetjeneste, og det anbefales å ha en separat instans for brukerinnsikt som Google Analytics eller Posthog. En analysetjeneste kan fortelle deg mer om brukeratferd, mens tjenester som Faro og Sentry er mer beregnet for overvåking (monitoring) og feilsøking (debugging).

## Kom i gang

Oppsett av Faro krever to trinn som er forklart under:

1. Installere SDK
2. Konfigurere SDK

Det vil også være nyttig å starte med å lese [Faro quick start guide](https://github.com/grafana/faro-web-sdk/blob/main/docs/sources/tutorials/quick-start-browser.md#install-grafana-faro-web-sdk). Se også [README](https://github.com/grafana/faro-web-sdk/blob/main/README.md) på Faros GitHub-side for flere lenker til relevant dokumentasjon.

### Installere SDK

Hvis du bruker React, gjøres dette ved å kjøre en av følgende kommandoer:

```bash
# Hvis du bruker npm
npm i -S @grafana/faro-web-sdk

# Hvis du bruker Yarn
yarn add @grafana/faro-web-sdk
```

### Konfigurere SDK

Importer og konfigurer følgende alternativer i appens inngangspunkt (main.js eller lignende).

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
| name        | string      | Navnet på applikasjonen slik det vil vises på dashboards i Grafana     | Ja           |
| environment | “localhost” &vert; “dev” &vert; “test” &vert; “prod” | Miljøet frontenden kjører i for øyeblikket. Dette brukes til å filtrere data i Grafana-dashboards | Ja |

### Konfigurere SDK med React Router-integrasjon

Grafana Faro støtter integrasjon med React Router. Dette gir deg hendelser for sidenavigasjon og re-rendering. Se [Faro-dokumentasjonen](https://github.com/grafana/faro-web-sdk/blob/main/packages/react/README.md) for mer informasjon om dette.

## Vise data

Når metrikkene har begynt å samles inn, vil de være synlige i et dedikert Grafana Faro-dashboard. Dette dashboardet finnes [her](https://monitoring.kartverket.cloud/d/CiroMopVz/grafana-faro-frontend-monitoring).

Det er også mulig å søke etter data i [explore view](https://monitoring.kartverket.cloud/explore). Nyttige labels å søke etter er:

- `faro_app_name`
- `kind`
- `env`

## Personvernhensyn

:::note
Det er opp til deg og teamet ditt å vurdere hvordan Faro skal brukes sammen med personopplysninger, som beskrevet i deres IP og DPIA.
:::

Når vi sender data til Faro, er det for det meste metrikker som ikke inneholder [PII](https://www.investopedia.com/terms/p/personally-identifiable-information-pii.asp) (personidentifiserbar informasjon). Det er mulig å inkludere PII som navn, IP eller annet som er tilgjengelig fra JavaScript i SDK-en, men dette gjøres ikke som standard og krever at man kaller funksjonen `setUser` i SDK-en.

En sesjons-ID (session ID) sendes med for å muliggjøre fjerning av duplikate hendelser som navigasjon mellom sider og rangering av toppbrukere. Dette er en tilfeldig generert streng og lagres i brukerens SessionStorage i nettleseren. Merk at selv om dette ikke er en informasjonskapsel (cookie), betyr det at et "cookie-banner" er påkrevd i henhold til EUs [ePrivacy directive](https://en.wikipedia.org/wiki/EPrivacy_Directive#Cookies).

Siden `SessionInstrumentation` er [inkludert som standard](https://github.com/grafana/faro-web-sdk/blob/28f2d0c6c3032ce56876045c5a92256f5f798605/packages/web-sdk/src/config/getWebInstrumentations.ts#L18) i web-instrumenteringen til JavaScript SDK-en, kreves det at man kaller SDK-en med `instrumentations` satt og utelater `SessionInstrumentation`-funksjonen for å deaktivere den.

Data lagres på SKIPs `atgcp1-prod`-cluster, som lagrer data i Google Cloud Storage i regionen europe-north1. Denne regionen ligger i Finland, og er dermed innenfor EU. Dette betyr at ingen data forlater EUs grenser, noe som betyr at lagringen av dataene er i samsvar med GDPR.

## Rate limiting

Det er implementert en begrensning på antall forespørsler (rate limit), og denne er for øyeblikket satt til `50` forespørsler per sekund. Denne deles mellom alle brukere av Faro, så det er mulig at vi til slutt når grensen. Kontakt SKIP hvis du begynner å få forespørsler avvist med `HTTP 429 Too Many Requests`.

Algoritmen for rate limiting er en "token bucket"-algoritme, hvor en "bøtte" har en maksimal kapasitet på opptil `burst_size` forespørsler og fylles på med en hastighet på `rate` per sekund.

Hver HTTP-forespørsel tømmer kapasiteten i bøtta med én. Når bøtta er tom, avvises HTTP-forespørsler med statuskoden HTTP 429 Too Many Requests inntil bøtta har mer ledig kapasitet.

## Traces (Tracing)

Faro støtter [traces (tracing)](https://grafana.com/docs/grafana-cloud/monitor-applications/frontend-observability/instrument/tracing-instrumentation/) av HTTP-forespørsler, men dette er foreløpig ikke implementert i innsamleren (collector) på SKIP. Kontakt SKIP hvis du ønsker dette!
