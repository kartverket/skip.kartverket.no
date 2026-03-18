# Logger med Loki

SKIPs LGTM-stack er satt opp for å automatisk samle inn logger fra alle applikasjoner som kjører i våre Kubernetes-clustre. Det er ingenting spesielt du som utvikler trenger å konfigurere eller sette opp for å oppnå dette, bortsett fra å sørge for at applikasjonen din logger til `stdout` . Disse plukkes opp av Grafana Agent gjennom `PodLogs` custom resource, som spesifiserer hvilke namespacer det skal samles inn logger for (alle i dette tilfellet) og et sett med relabeling-regler for å sikre at vi har et felles sett med labels for bruk i søk, dashboards og varsling.

Logger samles inn og lagres i Loki, som støttes av et lokalt S3-kompatibelt Scality-lagringssystem, én lagringsbøtte for hvert cluster. Hver Loki-instans er definert som en datakilde i Grafana, som tilbyr verktøy for søk, dashboards og varsling.

For en oversikt over Explore-seksjonen slik den gjelder for Loki, se [https://grafana.com/docs/grafana/latest/explore/logs-integration/](https://grafana.com/docs/grafana/latest/explore/logs-integration/) . Denne og andre sider beskriver funksjonene og hvordan de brukes effektivt i relativt god detalj, så vi skal ikke forsøke å gjenskape en slik guide her, bare påpeke noen ting slik de gjelder for vårt eget oppsett.

Av nødvendighet er standardsettet med labels ganske begrenset sammenlignet med hva noen av dere kanskje skulle ønske. Dette er fordi et stort utvalg av labels kan være svært negativt for ytelsen - se [https://grafana.com/docs/loki/latest/get-started/labels/bp-labels/](https://grafana.com/docs/loki/latest/get-started/labels/bp-labels/) for en forklaring.

Derfor anbefales det å bruke filteruttrykk i stedet. Du kan filtrere på logglinjer som inneholder/ikke inneholder en gitt tekst, regex-uttrykk og en rekke andre muligheter.

Søkefunksjonen er også utstyrt med en JSON-parser som gjør det enklere å filtrere på feltene du ønsker.

Du kan velge mellom to søkemoduser: skrive en spørring manuelt, eller bygge en spørring gjennom Grafanas grafiske spørringsbygger. Så lenge spørringen du har bygget eller skrevet er gyldig, kan du sømløst bytte mellom de to modusene.

![Eksempel: Bruk av JSON-parser for å hente ut felt og filtrere på metoden “POST”](images/loki_example.png)
Over: Eksempel på bruk av JSON-parser for å hente ut felt og filtrere på metoden “POST”
