---
title: Prosjektstatus sprint 15
description: Målsetning for sprint 15
slug: sprint-15
authors: espen
tags: [skip, sprint]
hide_table_of_contents: false
---

Her følger oppsummering av sprint 14 og teamets målsetning for sprint 15 (Okt 4,
2021–Okt 18, 2021).

<!--truncate-->

### Oppsummering sprint 14

I sprint 14 fikk vi gjort mye. Vi har:

- Vært i kontakt med VmWare og fått tips til hvordan ephemeral storage kan
  håndteres slik at helm install/upgrade ikke fører til krisetilstander (årsaken
  til at GitLab har gått ned flere ganger de siste ukene)
- Fortsatt å forbedre dokumentasjon
- Ny MinIO-instans er etablert og klar for å brukes til backup
- Nytt testmiljø for Kubernetes/Tanzu-oppgraderinger og annen PoC-ing er
  etablert på separat maskinvare som vi skal begynne å bruke for å hindre
  ustabilitet i prodmiljøet
- Teamet jobber kontinuerlig med å forbedre og utvide Vault-funksjonaliteten og
  bruken av dette
- Verdivurdering, oversikt over tjenester er på plass. Mangler fortsatt
  topologidiagram/arkitekturskisse
- Sikkerhetsanalyse: Må trimmes ned og deles opp for å bli mer håndterbar.
  Analyse av GitLab nesten ferdig, mangler bare en tiltakspakke
- Analyse av å flytte GitLab til SaaS: Dette er noe vi ønsker å få til, men må
  gå gjennom konsekvensene av et stort antall bieffekter av å gjøre dette
- Tiltak for kommunikasjon/forventningsstyring: Vi har laget
  kommunikasjonsstrategi og har planlagt en town hall - må velge et tema for
  denne. Dato må avklares, mulig 15. oktober
- Begynt å sette opp en POC av nytt verktøy for kommunikasjon med resten av
  Kartverket
- Har POCet Terraform på noen områder. På sikt kommer vi til å anbefale bruk av
  Terraform framfor Helm til utrulling av egenutviklede applikasjoner

### Plan for sprint 15

I sprint 15 blir hovedfokuset å jobbe videre med "terraformifiseringen" av
verktøyene våre. På denne måten nærmer vi oss "Infrastructure as Code" (IaC) og
får en mer fremtidssikker.

Målet for sprint 15 er ordlagt som følger:

> Få over minst 50% av verktøy og 1 egenutviklet applikasjon i Terraform

I tillegg er disse delmålene med i sprinten:

- Løse lav disk/nettverks I/O i clusteret som fører til trege bygg
- Løse feilen med ephemeral storage som tar ned applikasjoner
- Ferdigstille PoC av kommunikasjonsplatform
- Spre kompetanse om Terraform i teamet og ut til brukerene av plattformen
- Fortsette med sikkerhetsanalyser
- Prøve å få nærmere samarbeid med drift
- Undersøke om vi skal flytte issues til Jira
- Vi skal fokusere mer på brukertilfredshet fremover, og skal planlegge en
  spørreundersøkelse opp mot tilfredshet med plattformen. Mer info kommer
