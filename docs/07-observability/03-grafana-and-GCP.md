# Grafana og GCP

## Google Cloud Monitoring

Det er mulig å hente metrics fra et Google Cloud-prosjekt ved å bruke Grafana-datakilden "Google Cloud Monitoring".

![Example query Google Cloud Monitoring Logging Service](images/grafana_googlecloudquery.png)

Ved å bruke denne datakilden vil du kunne se alle metrics som er eksponert gjennom ulike Google Cloud-tjenester, som CloudSQL, BigQuery, CloudKMS, Logging osv. Disse kan deretter legges til i dine dashboards og alarmer.

### Sette opp datakilden

Selv om datakilden er til stede, vil den ikke som standard hente data fra alle prosjekter i Kartverkets organisasjon i GCP. I skrivende stund (13. okt 2023) tilrettelegger ikke SKIP for dette oppsettet på noen spesifikk måte, men du står fritt til å gjøre det på "SKIP-måten".

For å legge til ditt GCP-prosjekt i listen over prosjekter, må du ganske enkelt legge til GCP-rollen `monitoring.viewer` på Google Service Account-en `grafana-scraper@kubernetes-0dca.iam.gserviceaccount.com`. Det skal se ut som på bildet under.

![How IAM for the SA should look after adding the correct role](images/google_grafana_iam.png)

Husk at dersom du ikke har tilgang til å redigere IAM for dine prosjekter som standard, kan du alltid eskalere tilgangen din ved å bruke [JIT Access](https://jit.skip.kartverket.no/).

Merk at oppsettet for dette kan endre seg i fremtiden, da denne funksjonen er noe uutforsket i skrivende stund.
