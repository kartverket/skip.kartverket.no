# Databaser

Som bruker av SKIP har du et par alternativer når det kommer til databaser. Det første alternativet er å bruke databaser som er administrert av DBA-ene på Kartverket og lever på lokal infrastruktur. Det er også mulig å bruke databaser i sky via Google Cloud.

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

## Database i sky

Se [Cloud SQL for PostgreSQL](./03-cloud-sql.md) for mer informasjon om hvordan sette opp og ta bruk Cloud SQL for PostgreSQL.
