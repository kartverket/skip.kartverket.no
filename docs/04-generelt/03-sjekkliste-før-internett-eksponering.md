# Sjekkliste før internetteksponering

:::info
Denne siden er under utarbeidelse og er et samarbeid mellom utvikling og sikkerhet
:::

For å eksponere en applikasjon som kjører på SKIP mot internett må man:

- Opprette en DNS-record som ikke er under statkart.no-domenet, f.eks. `applikasjonX.kartverket.no` . Det gjøres ved å opprette en ticket i [PureService](https://kartverket.pureservice.com/) og be om at dette domenet skal peke mot SKIP-lastbalansereren (lb01.kartverket.no)
- Legge til det nye domenenavnet under `ingresses` i [Skiperator-manifestet](https://github.com/kartverket/skiperator?tab=readme-ov-file#application-reference) eller `hostname` for [Routing-manifestet](https://github.com/kartverket/skiperator?tab=readme-ov-file#routing-reference) , slik at applikasjonen registrerer seg mot ekstern ingress gateway

Før dette kan gjøres må man gå igjennom denne sjekklisten:

- Gjør dere kjent med [Overordnede føringer](https://kartverket.atlassian.net/wiki/spaces/SIK/pages/599130113/Overordnede+f+ringer) og spesielt [Ansvarsfordeling](https://kartverket.atlassian.net/wiki/spaces/SIK/pages/770113537/Ansvarsfordeling) fra Sikkerhetshåndboka
- Opprett metadata i GitHub-repoene tilknyttet applikasjonen i henhold til [sikkerhet i repoet](https://kartverket.atlassian.net/wiki/spaces/SIK/pages/732397586/Sikkerhet+i+repoet). Dette sikrer at applikasjonen blir integrert i Utviklerportalen og får tilgang til sikkerhetsmetrikker.
- Foranalyse må være gjennomført (det kommer løype for dette i PureService)
- Det er gjort IP (Innledende Personvernsvurdering) og eventuelt DPIA. Kopier malen [IP, DPIA og ROS-analyse for [det som vurderes]](https://kartverket.atlassian.net/wiki/spaces/PER/pages/436338719/IP+DPIA+og+ROS-analyse+for+det+som+vurderes+.+IKKE+SKRIV+INN+I+MALEN+men+kopier+sidene.) til deres område og fyll ut informasjonen der.
- ROS-analyse gjennomført og godkjent av risikoeier/systemeier
- Codeowners definert i koderepo [CODEOWNERS](https://kartverket.atlassian.net/wiki/spaces/SIK/pages/561348667/CODEOWNERS)
- Gjennomført initiell penetrasjonstesting (hvem og hvordan?) eller manuell avsjekk med SKIP rundt konfigurasjon

- Følgende headere blir sendt på alle kall:
  - [HTTP Strict Transport Security](https://scotthelme.co.uk/hsts-the-missing-link-in-tls/)
  - [Content Security Policy](https://scotthelme.co.uk/content-security-policy-an-introduction/)
  - [X-Frame-Options](https://scotthelme.co.uk/hardening-your-http-response-headers/#x-frame-options)
  - [X-Content-Type-Options](https://scotthelme.co.uk/hardening-your-http-response-headers/#x-content-type-options)
  - [Referrer Policy](https://scotthelme.co.uk/a-new-security-header-referrer-policy/)
  - [Permissions Policy](https://scotthelme.co.uk/goodbye-feature-policy-and-hello-permissions-policy/)
- Når appen er eksponert skal sikkerhetsheaders testes med [https://securityheaders.com](https://securityheaders.com/) og [https://observatory.mozilla.org](https://observatory.mozilla.org/)
- Monitorering og varsling er satt opp i [Grafana](https://monitoring.kartverket.cloud), og vaktlaget er onboardet disse alarmene
  - [Metrics with Grafana](../10-observability/01-metrics-with-Grafana.md)
  - [Logs with Loki](../10-observability/05-logs-with-Loki.md)
  - [Alerting with Grafana](../10-observability/04-alerting-with-grafana.md)

Denne sjekklisten gjelder eksponering av tjenester som skal være tilgjengelig på internett, uavhengig av miljø (prod/dev). Hvis man har behov for å eksponere en applikasjon eksternt i dev må man i tillegg kontakte SKIP for å sikre at alle sikkerhetskrav overholdes.

Navnekonvensjon for eksternt tilgjengelig domenenavn vil i så fall være

- \<applikasjonX\>.atkv3-dev.kartverket.cloud
