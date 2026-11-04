# Databaser

Her finner man informasjon om databaser tilgjengelige for bruk via SKIP eller utenfor. Tjenestene driftes av [Team Databaseplattform](https://kartverketgroup.slack.com/archives/C02NYBLRFJS) - kontakt oss på Slack!  

## Alternativer

- For databaser i offentlig sky: se [CloudSQL](./03-cloud-sql.md)
- For databaser på Kartverket:
  - [Bruk selvbetjening på SKIP via ArgoKit](#-on-prem-postgres-på-skip-)
  - [Bestille standard database i VM](#legacy-standard-postgres)

Det er planlagt på sikt å erstatte CloudSQL også med CNPG gjennom samme grensesnitt, men dette ligger nok litt frem i tid.  

## Legacy standard Postgres

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

Teamet tilbyr nå en løsning hvor man kan bestill opp databaser selv på SKIP vha. [ArgoKit](https://github.com/kartverket/argokit).  
Eksempler på oppsett finnes i ArgoKit-repo:

- [Enkel](https://github.com/kartverket/argokit/blob/main/v2/examples/dbOnprem-no-extension.jsonnet)
- [Med extensions](https://github.com/kartverket/argokit/blob/main/v2/examples/dbOnprem.jsonnet)
- [Avansert](https://github.com/kartverket/argokit/blob/main/v2/examples/dbOnprem-advanced.jsonnet)

I tillegg til jsonnet-fila for selve databasen trenger man også å legge til en [config.json](../03-applikasjon-utrulling/09-argo-cd/07-configuring-apps-repositories-with-configjson.md) på samme sted, f.eks. `./env/atkv3-dev-stateful/config.json`. Denne må minst inneholde

```json
{
  "namespaceLabels": {
      "custom.skip.kartverket.no/cnpg": "true"
  }
}
```

### Tilkobling  

På forhånd må man opprette bruker og passord selv i GSM og navngi hemmelighetene `pg-role-NAVN`. F.eks. `pg-role-user1`.  
Det er påkrevd at tilkoblinger til databasen inneholder følgende to parametere: `sslmode=require` og `sslnegotiation=direct`. Her er det viktig å merke seg at sistnevnte er ganske ny og krever oppdaterte biblioteker for å benytte. I Java-biblioteker angir man med camelCase: `sslNegotiation=direct`.  
Man får en URL for skriv/les og en URL til ren les, f.eks. `DATABASENAVN-write.db-dev.kartverket-intern.cloud` og `DATABASENAVN-read.db-dev.kartverket-intern.cloud`.  
Eksempel:  `jdbc:postgresql://DATABASENAVN-write.db-dev.kartverket-intern.cloud:5432/DATABASENAVN?user=BRUKERNAVN&password=DITT_SIKRE_PASSORD&sslMode=require&sslNegotiation=direct`

For å koble til med applikasjon fra SKIP trenger man åpne for utgående trafikk. F.eks. med ArgoKit:

```jsonnet
{
  + app.withOutboundPostgres('DBCLUSTER-write.pg.db-dev.kartverket-intern.cloud', '10.40.10.41')
}
```

Eller manuelt:

```yaml
apiVersion: networking.istio.io/v1
kind: ServiceEntry
metadata:
  name: cluster-local-postgres
spec:
  addresses:
    - 10.40.10.41
  endpoints:
    - address: 10.40.10.41
  exportTo:
    - .
  hosts:
    - DBCLUSTER-write.pg.atkv3-dev-stateful.kartverket-intern.cloud
  ports:
    - name: postgres-port
      number: 5432
      protocol: TCP
  resolution: STATIC
```

### Diverse om løsningen

Denne løsningen er basert på [CloudNativePG](https://cloudnative-pg.io/docs/). Man trenger ikke vedlikeholde images selv hvis man benytter standarder.  
Overvåking finnes i Grafana via [dashboard](https://monitoring.kartverket.cloud/d/cloudnative-pg-dba/cloudnativepg)  

Standardverdier gir alle databaser en replika i tillegg til primær (to databaseinstanser totalt). Dette medfører stor fordel mtp. driftsstabilitet og åpner for lastbalansering. I tillegg blir det automatisk opprettet ukentlige backups og løpende Write Ahead Log (WAL).  
For databaser som krever stor kapasitet for lesing kan vi tilby ytterligere replikaer.

Vi har innført et system med t-skjorte størrelser. Per nå: `S`,`M`,`L`,`XL`. Førstnevnte er standard og anbefales benyttet frem til noe mer beviselig kreves. Denne kan settes som f.eks. `resourceSize: 'S',` i deres jsonnet-fil.  
S: memory.request: 1Gi, memory.limit: 2Gi, cpu.request: 500m.  
M: memory.request: 2Gi, memory.limit: 4Gi, cpu.request: 1000m.  
L: memory.request: 8Gi, memory.limit: 16Gi, cpu.request: 1500m.  
XL: memory.request: 16Gi, memory.limit: 32Gi, cpu.request: 2000m.  

## Database i sky

Se [Cloud SQL for PostgreSQL](./03-cloud-sql.md) for mer informasjon om hvordan sette opp og ta bruk Cloud SQL for PostgreSQL.
