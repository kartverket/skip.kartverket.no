# URLer og sertifikat for tjenester på SKIP

For å bruke sertifikat på tjenester man skal eksponere utenfor kubernetes-clusteret anbefaler vi å bruke Skiperator. Skiperator håndterer utstedelse og fornying av sertfikater ved hjelp av [cert-manager.](https://cert-manager.io/) [Vår implementasjon av cert-manager](https://github.com/kartverket/certificate-management) bruker [ACME protokollen](https://en.wikipedia.org/wiki/Automatic_Certificate_Management_Environment) og [http-01 challenge](https://letsencrypt.org/docs/challenge-types/#http-01-challenge) for å bevise at vi er eier av domenet vi skal utstede cert til. Vi utsteder sertifikater automatisk i både dev og prod med [Let’s encrypt](https://letsencrypt.org/).

[![ACME](images/acme.png)](https://en.wikipedia.org/wiki/Automatic_Certificate_Management_Environment)

Under kommer vi til å skille på internt- og eksternt eksponerte tjenester i følgende kategorier:

## Interne tjenester

### kartverket-intern.cloud

Dersom du har en tjeneste som kun skal være tilgjengelig for folk på kartverkets nettverk og VPN og ikke på internett for allmennheten har man flere forskjellige alternativer. Avhengig av bruksområde og hva slags URL man ønsker seg fungerer dette litt forskjellig, og beskrives i paragrafene under.

For tjenester som skal nås på et domene under kartverket-intern.cloud håndteres alt automatisk, inkludert utstedelse og fornying av sertfikater. Det ligger et wildcard record i DNS som håndterer innkommende trafikk, og bruker cluster-leddet i URL-en på Load Balanceren til å rute denne inn til riktig cluster. Deretter rutes denne til applikasjonen din basert på URL-konfigurasjonen din i Skiperator.

:::info
Eksempel: minapp.atkv3-prod.kartverket-intern.cloud
:::

### Vanity URL-er

:::note
Akkurat nå støttes kun kartverket-intern.cloud URL-er pga. en begrensning i utstedelse av sertfikater ( [SKIP-1459](https://kartverket.atlassian.net/browse/SKIP-1459) ) og en begrensning i lastbalanserer på atkv3-dev cluster ( [SKIP-1458](https://kartverket.atlassian.net/browse/SKIP-1458) ). Dette skal utbedres.
:::

Dersom du ønsker et annet hostname enn `app.<cluster>.kartverket-intern.cloud` er dette mulig, men krever noe mer setup. Den nye URL-en må registreres i DNS og skiperator-applikasjonen din må settes opp til å lytte på denne. Utstedelse og fornying av sertfikater vil fremdeles håndteres automatisk av Skiperator.

For å sette opp DNS må du gjøre følgende: Først bestem hvilke URL du vil ha, deretter sett opp et CNAME for denne URL-en til `<cluster>.kartverket-intern.cloud` . Dersom du ønsker et CNAME som ligger under kartverket-intern.cloud (for eksempel minapp.kartverket-intern.cloud) kan dette gjøres av SKIP, for alle andre domener ta kontakt med eier av domenet via bestilling i pureservice. Når dette er gjort vil alle spørringer som går mot URL-en du har bestemt ende opp host lastbalansereren foran clusteret, og sendes videre inn til Kubernetes.

Neste steg er at Kubernetes sender spørringen videre til din applikasjon. Da må du registere URL-en i Skiperator som vanlig under `ingresses` .

### Cluster-intern

Alle applikasjoner som kjører på SKIP har en kubernetes Service tilknyttet seg. Med denne servicen kan man sende spørringer direkte til applikasjonen uten å sende trafikken ut av clusteret.

Merk at man her bruker http og ikke https. Trafikken vil allikevel krypteres av service meshet så trafikken vil gå over https mellom tjenestene, men fra ditt perspektiv skal du bruke http og trenger ikke tenke på sertfikater.

For å sende en spørring på denne måten bruker du en URL i følgende format:

```
http://<appnavn>.<namespacenavn>:port
```

Merk at å snakke med en annen tjeneste på denne måten krever at du har åpnet opp for at trafikk kan flyte mellom disse tjenestene. I utgangspunktet blir all trafikk blokkert av sikkerhetshensyn. Å åpne opp gjøres ved å spesifisere `spec.accessPolicy.outbound.rules` i applikasjonen som skal sende spørringen og `spec.accessPolicy.inbound.rules` i applikasjonen som skal motta spørringene.

Dersom du har samme tjeneste i sky og ønsker å presisere at du skal gå mot samme cluster må man legge på dette i URL. Hvis ikke blir den “round robined” mellom remote og lokal. Eksempel:

```
http://<appnavn>.<namespacenavn>.svc.cluster.local:port
```

### Mesh-intern

Dersom du har behov for å sende en spørring til en annen applikasjon som ikke ligger på samme cluster, men er en del av samme service mesh (for eksempel fra atkv3-prod til atgcp1-prod) så kan dette rutes på nesten samme måte som cluster-intern trafikk.

Merk at man her bruker http og ikke https. Trafikken vil allikevel krypteres av service meshet så trafikken vil gå over https mellom tjenestene, men fra ditt perspektiv skal du bruke http og trenger ikke tenke på sertfikater.

For å sende trafikk til et annet cluster over service meshet sender du en spørring i følgende format:

```
http://<appnavn>.<namespacenavn>.svc.cluster.<cluster>:port
```

> TODO: Hvordan blir networkpolicies for Skiperator apper på mesh?

## Tjenester eksponert på internett

Det er to alternativer for å eksponere ting på internett. Bruk kartverket.cloud eller en penere “vanity URL”.

Merk at skiperator-tjenester som eksponeres på andre domenenavn enn subdomener av kartverket-intern.cloud vil automatisk bli åpnet for trafikk fra internett, men vil ikke være tilgjengelig før DNS konfigureres.

### kartverket.cloud

For tjenester som skal nås på et domene under kartverket.cloud håndteres alt automatisk, inkludert utstedelse og fornying av sertfikater. Det ligger et wildcard record i DNS som håndterer innkommende trafikk, og bruker cluster-leddet i URL-en på Load Balanceren til å rute denne inn til riktig cluster. Deretter rutes denne til applikasjonen din basert på URL-konfigurasjonen din i Skiperator.

:::info
Eksempel: minapp.atkv3-prod.kartverket.cloud
:::

### Vanity URL-er
Dersom du ønsker et annet hostname enn `app.<cluster>.kartverket.cloud` er dette mulig, men krever noe mer setup. Den nye URL-en må registreres i DNS og skiperator-applikasjonen din må settes opp til å lytte på denne. Utstedelse og fornying av sertfikater vil fremdeles håndteres automatisk av Skiperator.

For å sette opp DNS må du gjøre følgende: Først bestem hvilke URL du vil ha, deretter sett opp et CNAME for denne URL-en til `<cluster>.kartverket.cloud` . Dersom du ønsker et CNAME som ligger under kartverket.cloud (for eksempel minapp.kartverket.cloud) kan dette gjøres av SKIP, for alle andre domener ta kontakt med eier av domenet via bestilling i pureservice. Når dette er gjort vil alle spørringer som går mot URL-en du har bestemt ende opp host lastbalansereren foran clusteret, og sendes videre inn til Kubernetes.

Neste steg er at Kubernetes sender spørringen videre til din applikasjon. Da må du registere URL-en i Skiperator som vanlig under `ingresses` .

Dersom du ønsker å ha en URL på toppnivå ([annentjeneste.no](http://annentjeneste.no/)) er ikke CNAME støttet i DNS. Her må man bruke an A record, og her kan man i så fall få IP-adresser med å gjøre et DNS-oppslag på `<cluster>.kartverket.cloud` .

## HTTPS by default

Når man eksponerer en applikasjon får man også HTTPS automatisk satt opp og eksponert. I dette tilfellet kan man fort spørre seg om man burde redirecte HTTP til HTTPS for at alle brukerene skal nyte godt av dette, og svaret på det er i nesten alle tilfeller ja.

For å sette opp en slik redirect er det enkleste å få applikasjonen som serverer ressurser til klienten (nettleseren) å sende en [https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) header (HSTS). Når en nettleser laster en nettside og oppdager en HSTS header vil den legge denne nettsiden i sin interne cache med et flagg som sier at denne nettsiden alltid skal lastes med HTTPS. Lengden på denne cachen kan settes i flagget, og i de fleste tilfeller vil denne settes ganske høyt.

Den eneste tiden hvor dette kan bli problematisk er om det plutselig skjer en endring som gjør at nettsiden ikke lenger serveres på HTTPS. For å forhindre downgrade attacks vil nettleseren serveres en feilmelding om at nettsiden kun kan åpnes på HTTPS og det vil ikke være mulig å gå forbi denne for å nå HTTP-siden. Men i de aller fleste tilfeller er ikke dette noe å bekymre seg over.
