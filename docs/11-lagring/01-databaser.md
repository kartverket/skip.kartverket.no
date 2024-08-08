# Databaser

Som bruker av SKIP har du et par alternativ når det kommer til databaser. Det første alternativet er å bruke databaser som er administrert av DBA-ene på Kartverket og lever på lokal infrastruktur. Det er også mulig å bruke databaser i sky i Google Cloud.

## Lokal Postgres

Dersom man ønsker en lokal postgres tar man kontakt med DBA-ene for å bestille opp en server. Da vil man få en Postgres-database og en administratorbruker som man kan bruke til å opprette tabeller.

For å bestille dette sender man ticket gjennom service desken med hvor mye lagring man trenger og circa hvor mye CPU-kraft man trenger.

Når man har fått en database så er det to ting man må gjøre før man kan ta den i bruk fra en applikasjon på SKIP:

- Bestill brannmursåpning for databasen ved å opprette en sak i ServiceNow. F.eks.
  Jeg ønsker å bestille en brannmursåpning for en database som skal aksesseres fra SKIP. Det er clusteret “atkv1-dev” som trenger å nå “XXXX.statkart.no” på TCP port XXXX.
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

Det er mulig å bruke database i GCP, men her gjenstår det noe utforsking før vi har en god løype for produktteamene. Ta kontakt med SKIP så tar vi en dialog rundt database i sky.
