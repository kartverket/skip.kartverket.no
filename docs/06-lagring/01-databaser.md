# Databaser

Som bruker av SKIP har du noen alternativer når det kommer til databaser. Det første alternativet er å bruke databaser som er administrert av DBA-ene på Kartverket og lever på lokal infrastruktur. Det er også mulig å bruke databaser i sky i Google Cloud. I tillegg kan man nå opprette databaser selv via [Database-as-a-Service](#-on-prem-postgres-på-skip-)

## On-prem Postgres

Dersom du ønsker en lokal postgres, tar du kontakt med DBA-ene for å bestille opp en server. Da får du en Postgres-database og en administratorbruker som du kan bruke til å opprette tabeller.

For å bestille dette sender du ticket til service desken med hvor mye lagring du trenger og circa hvor mye CPU-kraft du trenger.

Når du har fått en database, er det to ting du må gjøre før du kan ta den i bruk fra en applikasjon på SKIP:

- Bestill brannmuråpning for databasen ved å opprette en sak i PureService. F.eks.:
  Jeg ønsker å bestille en brannmursåpning for en database som skal aksesseres fra SKIP. Det er clusteret “atkv3-dev” som trenger å nå “XXXX.statkart.no” på TCP port XXXX.
- Sett opp tilgang til databasen i Kubernetes. I Skiperator gjøres dette ved hjelp av external accessPolicies. Her må applikasjonen definere at den skal kunne snakke med den eksterne serveren som databasen lever på.

```yaml
accessPolicy:
  outbound:
    external:
    - host: XXXX.statkart.no
      ip: "XXX.XXX.XXX.XXX"
      ports:
        name: db
        port: 5432
        protocol: TCP
```

## 💽 On-prem Postgres på SKIP 💽

Team Databaseplattform tilbyr nå en løsning hvor man kan spinne opp databaser på SKIP vha. [ArgoKit](https://github.com/kartverket/argokit).  
Eksempler på oppsett finnes også i ArgoKit-repo:

- [Enkel](https://github.com/kartverket/argokit/blob/main/v2/examples/dbOnprem-no-extension.jsonnet)
- [Med extensions](https://github.com/kartverket/argokit/blob/main/v2/examples/dbOnprem.jsonnet)
- [Avansert](https://github.com/kartverket/argokit/blob/main/v2/examples/dbOnprem-advanced.jsonnet)

I tillegg til jsonnet-fila for selve databasen trenger man også å legge til en [config.json](../03-applikasjon-utrulling/09-argo-cd/07-configuring-apps-repositories-with-configjson.md) på samme sted. Denne må minst inneholde

```json
{
  "namespaceLabels": {
      "custom.skip.kartverket.no/cnpg": "true"
  }
}
```

På forhånd må man opprette bruker og passord selv i GSM og navngir hemmeligheten slik det er vist i eksemplene over.  
Det er påkrevd at tilkoblinger til databasen inneholder følgende to parametere: `sslmode=require` og `sslnegotiation=direct`. Her er det viktig å merke seg at sistnevnte er ganske ny og krever oppdaterte biblioteker for å benytte.
Man får en URL for skriv/les og en URL til ren les, f.eks. `database1-write.pg.atkv3-dev-stateful.kartverket-intern.cloud` og `database1-read.pg.atkv3-dev-stateful.kartverket-intern.cloud`

Denne løsningen er basert på [CloudNativePG](https://cloudnative-pg.io/docs/)  
Overvåking finnes i Grafana via [dashboard](https://monitoring.kartverket.cloud/d/cloudnative-pg-dba/cloudnativepg)  

Standardverdier gir alle databaser en replica. Dette medfører stor fordel mtp. driftsstabilitet og åpner for lastbalansering.

## Database i sky

Se [Cloud SQL for PostgreSQL](./03-cloud-sql.md) for mer informasjon om hvordan sette opp og ta bruk Cloud SQL for PostgreSQL.
