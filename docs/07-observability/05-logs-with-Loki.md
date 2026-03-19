# Logger med Loki

LGTM-stacken er satt opp til å automatisk samle inn logger fra alle applikasjoner som kjører i Kubernetes-clustrene. Du trenger ikke konfigurere noe spesielt for å oppnå dette, bortsett fra å sørge for at applikasjonen din logger til `stdout`. Loggene plukkes opp av Grafana Alloy gjennom den egendefinerte ressursen `PodLogs`, som spesifiserer hvilke navnerom det skal samles logger fra (alle, i dette tilfellet) og et sett med regler for omerking som sikrer at vi har et felles sett med labels til bruk i søk, dashbord og varsling.

Logger samles inn og lagres i Loki, som bruker et lokalt (on-premise) S3-kompatibelt lagringssystem basert på Scality, med én bucket per cluster. Hver Loki-instans er konfigurert som en datakilde i Grafana, som tilbyr verktøy for søk, dashbord og varsling.

For en oversikt over Explore-seksjonen slik den gjelder for Loki, se [https://grafana.com/docs/grafana/latest/explore/logs-integration/](https://grafana.com/docs/grafana/latest/explore/logs-integration/). Denne og andre sider beskriver funksjonaliteten og hvordan du bruker den effektivt i god detalj, så vi skal ikke forsøke å gjenskape en slik guide her, bare påpeke noen ting som gjelder for vårt eget oppsett.

Standard label-settet er nødvendigvis ganske begrenset sammenlignet med hva noen av dere kanskje ønsker. Dette er fordi et stort utvalg av labels kan være svært negativt for ytelsen – se [https://grafana.com/docs/loki/latest/get-started/labels/bp-labels/](https://grafana.com/docs/loki/latest/get-started/labels/bp-labels/) for en forklaring.

Det anbefales derfor å bruke filteruttrykk i stedet. Du kan filtrere på logglinjer som inneholder/ikke inneholder en gitt tekst, regex-uttrykk og en rekke andre muligheter.

Søkefunksjonen er også utstyrt med en JSON-parser som gjør det enklere å filtrere på feltene du ønsker.

Du kan velge mellom to søkemodi: skrive en spørring manuelt, eller bygge en spørring gjennom Grafanas grafiske spørringsbygger. Så lenge spørringen du har bygget eller skrevet er gyldig, kan du sømløst bytte mellom de to modusene.

![Eksempel: Bruk av JSON-parser for å trekke ut felt og filtrere på metoden "POST"](images/loki_example.png)
Over: Bruk av JSON-parser for å trekke ut felt og filtrere på metoden "POST"
