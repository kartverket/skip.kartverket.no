# Retningslinjer for Kubernetes
## Minstekrav for sikkerhet

I Kubernetes bruker vi Pod Security Standards for å sikre at alle pods som kjører i clusteret vårt er sikre. Dette er en standard som er satt av CNCF, og som vi følger for å sikre at vi ikke har noen åpenbare sikkerhetshull i Kubernetes-clusteret vårt. Alle workloads skal følge PSS nivå "restricted", som er et nivå som følger dagens best practices for sikring av containere. Applikasjoner som kjører som Skiperator Applications følger allerede denne standarden. Les mer om [Pod Security Standards her](https://kubernetes.io/docs/concepts/security/pod-security-standards).

## Namespaces som avgrensning mellom teams

Hvert team kan lage så mange Namespaces som de har behov for. Dette er for å kunne skille på ressurser og tilganger mellom forskjellige applikasjoner og team. Dette er også for å kunne gi teamene mulighet til å eksperimentere og teste ting uten at det påvirker andre team. Les mer om dette på [Argo CD](../argo-cd).

Kommunikasjon mellom tjenester internt i ett namespace er helt lukket (“default deny”-policy), og det er opp til teamet selv å sørge for å åpne for kommunikasjon mellom tjenester. Les mer om dette på [Skiperator](https://github.com/kartverket/skiperator).

Informasjon om kommunikasjon mot tjenester som ligger i andre namespaces finnes her: [Anthos Service Mesh Brukerdokumentasjon](https://kartverket.atlassian.net/wiki/spaces/SKIP/pages/305956270/Anthos+Service+Mesh+Brukerdokumentasjon)

- Tjenester og fellesfunksjoner som brukes av flere teams skal settes i egne namespaces. Tilgang til disse namespacene gis ved at det opprettes en ny gruppe i AD på samme måte som et produktteam.

## Ressursbruk i Kubernetes

Ressursbruk i Kubernetes dreier seg om hvor mye CPU og RAM hver pod skal bruke.

Requests er hvor mye CPU og minne hvercontainerspør om når den først settes på en node. Hvis man for eksempel ber om 500 mCPUer, men noden bare har 250 mCPU ledig, kan containeres ikke kjøres på den noden.

Merk at man kan spesifisere CPU helt ned i millicpuer (mCPU).

Minne-requests kan settes i mange forskjellige enheter, se [dokumentasjonen](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) for detaljer. Vi anbefaler dog at man holder seg til M - megabytes.

Limits er hvor mye ressurser en container maksimalt får lov til å bruke. Dette er med andre ord noe som settes for å forhindre at en container med en bug tar over alle ressursene, og gjør det umulig for andre containere å skalere.

Vi anbefaler at du ser på Limiten som en mulighet til å finne bugs og memory leaks. Sett den så lavt du er komfortabel med, og følg med på det faktiske forbruket. Hvis noe kræsjer er det da god sjanse for at det ble innført en bug.

Dersom det faktiske forbruket nærmer seg limiten på grunn av naturlige grunner - flere requests eller tyngre load+ er det på tide å øke limiten. Ikke vent til appliasjonen kræsjer - det skaper en dårlig brukeropplevelse.

:::tip
En god tommelfingerregel for requests og limits er følgende: For minne bør man profilere applikasjonens gjennomsnittlige minnebruk og doble denne som limit. For CPU trenger man ikke limit, men heller definere en fornuftig request.
:::

Logikken bak dette er at dersom en applikasjon bruker altfor mye minne kan det føre til at andre applikasjoner går ned. Dersom en applikasjon bruker mye CPU fører det derimot bare i verste fall til at ting går tregere.

Dette er reglene for ressursbruk i Kubernetes på SKIP

- Produktteamet velger selv hva som er naturlig ressursbruk for sine containere, og skal ha et bevisst forhold til hvilke grenser som er satt.
- Produktteamet skal følge med på ressursbruken over tid, og oppdatere grensene slik at de til enhver tid reflekterer hva applikasjonen faktisk trenger.
- Resource requests og limits skal settes på alle containere slik at det blir tydelig hva som er forventet ressursbruk.
- Resource limits skal skal alltid settes høyere enn requests, men aldri unaturlig høyt. Husk at dette fungerer både som dokumentasjon og som en sikring mot bugs og feilkonfigurasjon.
- Resource limits skal aldri fjernes permanent, men kan fjernes for debugging. Da skal SKIP-teamet gjøres oppmerksom på dette.

- [Godt blogginnlegg om korrelasjonen mellom JVMs og Kubernetes’ minnebruk](https://akobor.me/posts/heap-size-and-resource-limits-in-kubernetes-for-jvm-applications)

[Kubernetes’ dokumentasjon om ressursbruk](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

[Google Clouds dokumentasjon om “cost effective apps”](https://cloud.google.com/architecture/best-practices-for-running-cost-effective-kubernetes-applications-on-gke#set_appropriate_resource_requests_and_limits) (Merk at Google anbefaler å sette limit til det samme som requests - vi setter driftsstabilitet over kostnad, og er derfor uenig i dette.)
