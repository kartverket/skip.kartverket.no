# 🔐 Tilgangsstyring på SKIP

## Målbilde for tilgangsstyring på SKIP
Vi ønsker å tilby plattformfunksjonalitet som gjør det enkelt for teamene på SKIP å levere sikre tjenester, basert på
prinsipper om least privilege og zero trust, samt bruk av nasjonale felleskomponenter og moderne autentiserings- og
autorisasjonsmekanismer. Dette innebærer blant annet:
- Klientregistrering mot relevante identitetstilbydere, som for eksempel Entra ID og nasjonale felleskomponenter, uten
  bruk av virksomhetssertifikat eller applikasjonsnære hemmeligheter
- Innloggingsflyter, sesjonshåndtering og validering av OAuth-tokens
- Grovkornet tilgangsstyring basert på claims-validering
- Finkornet tilgangsstyring basert på Open Policy Agent
- Finkornede nettverksregler og sikker kommunikasjon med andre SKIP-applikasjoner basert på SPIFFE
- Token exchange for bevaring av sluttbrukerkontekst i tjeneste-til-tjeneste-kommunikasjon

En fordel med å tilby slik funksjonaliteten på plattformnivå er at de samme mekanismene kan brukes, på samme måte,
uavhengig av applikasjonen den skal beskytte. Dette gir Kartverket målbarhet og konsistens i hvordan tilgangsstyring
håndteres, uavhengig av applikasjon, team eller divisjon. Innebygd tilgangsstyringsfunksjonalitet i plattformen hjelper
oss å opprettholde et høyt minimumsnivå av sikkerhet i alle applikasjoner.

### Funksjonalitet vi tilbyr
- [Klientregistrering](01-klientregistrering/index.mdx) mot relevante identitetstilbydere
- [Ztoperator](02-ztoperator/index.mdx): en Kubernetes-ressurs for innlogging, sesjonshåndtering og claims-validering
- [SPIFFE](03-SPIFFE/index.mdx): finkornet nettverkstilgangsstyring og sikker kommunikasjon innad i et 
  Kubernetes-cluster basert på SPIFFE-identiteter

### Funksjonalitet vi planlegger å tilby i nær fremtid
- Token exchange: bevaring av sluttbrukerkontekst i tjeneste-til-tjeneste-kommunikasjon
- Open Policy Agent: finkornet tilgangsstyring

### Annen funksjonalitet vi vurderer å tilby på sikt
- Tilby grensesnitt for interne maskin-til-maskin-tokens, istedenfor Microsoft Entra ID

## 🔥 Plattform- vs. applikasjonssikkerhet
Plattformfunksjonalitet _kan_, men _bør_ ikke nødvendigvis, erstatte all tilsvarende funksjonalitet i de underliggende
applikasjonene. Noen sikkerhetsmekanismer, som f.eks utførelse av OAuth-innloggingsflyt eller kryptering av
nettverkstrafikk, er de fleste team tilfreds med å la plattformen håndtere i sin helhet. Validering av tokens og mer
detaljert tilgangsstyring er derimot noe som med fordel kan gjøres både av plattformen _og_ av applikassjonskoden selv.
Vi anbefaler hvert enkelt team, gjerne i samarbeid med Team Tilgangsstyring, å vurdere hvilke plattform- og
applikasjonsmekanismer som passer best for deres behov.

På generelt grunnlag anbefaler vi å ha flere lag med sikkerhet, og dermed implementere egnede sikkerhetsmekanismer og
validering både i plattformen og i applikasjonskoden.

### Token-validering og grovkornet tilgangsstyring i Ztoperator vs. applikasjonskode
Med bruk av [test-authpolicy-action](02-ztoperator/04-test-authpolicy.mdx) er det mulig å teste i CI/CD at en
Ztoperator-`AuthPolicy` er konfigurert til å utføre deny/redirect/allow slik som forventet. Det eksisterer derimot ikke
noe testverktøy som tester selve applikasjonskoden sitt samspill med Ztoperator. Basert på dette anbefaler vi at teamene
selv tar stilling til hvorvidt de er komfortable med å kun stole på Ztoperator for token-validering, eller om de ønsker
å implementere token-validering i applikasjonskoden i tillegg.

### SPIFFE vs. bruk av tokens for tjeneste-til-tjeneste-kommunikasjon innad i Kubernetes-cluster
Plattformen garanterer for at ondsinnede aktører ikke kan anskaffe seg eller forfalske SPIFFE-identiteter. Det er derfor
**mulig** å tilgangsstyre kommunikasjon mellom interne tjenester på SKIP ved kun bruk av SPIFFE-identiteter. Derimot er det
en realitet at vi ikke tilbyr noe god måte å teste eller verifisere dette på en applikasjonsnær måte, f.eks som del av
CI/CD. Med dette tatt i betrakning anbefale vi å bruke SPIFFE i kombinasjon med én eller flere av følgende mekanismer:

- Validering av `X-Forwarded-Client-Cert`-header i applikasjonen, som inneholder SPIFFE-identiteten til klienten
- Bruk av maskinidentiteter med tokens, f.eks Microsoft Entra ID