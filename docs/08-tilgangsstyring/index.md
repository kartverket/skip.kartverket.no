# 🔐 Tilgangsstyring

## Målbilde for tilgangsstyring på SKIP
Vi tilbyr plattformfunksjonalitet som gjør det enkelt for teamene på SKIP å levere sikre tjenester, basert på
prinsipper om least privilege og zero trust, samt bruk av nasjonale felleskomponenter og moderne autentiserings- og
autorisasjonsmekanismer.

En fordel med å tilby slik funksjonaliteten på plattformnivå er at de samme mekanismene kan brukes, på samme måte,
uavhengig av applikasjonen den skal beskytte. Dette gir Kartverket målbarhet og konsistens i hvordan tilgangsstyring
håndteres, uavhengig av applikasjon, team eller divisjon. Innebygd tilgangsstyringsfunksjonalitet i plattformen hjelper
oss å opprettholde et høyt minimumsnivå av sikkerhet i alle applikasjoner.

### Funksjonalitet vi tilbyr
- [Dokumentasjon og anbefalinger](01-valg-av-identitetstilbyder/index.mdx) av relevante identitetstilbydere
- [Klientregistrering](02-klientregistrering/index.mdx) mot relevante identitetstilbydere
- [Innlogging og sesjonshåndtering](03-innlogging/index.mdx)
- [Grovkornet autorisasjon](04-grovkornet-autorisasjon/index.mdx), som lar deg autorisere hvilke requests som slippes gjennom til din applikasjon
- [Finkornet autorisasjon](05-finkornet-autorisasjon/index.mdx) med Open Policy Agent, som hjelper deg å implementere komplekse og domenespesifikke autorisasjonsregler
- [Token Exchange](06-token-exchange/index.mdx)
- [Verktøy for uthenting og validering av tokens](07-token-uthenting-og-validering/index.mdx)

Mye av denne funksjonaliteten tilbys via to Kubernetes-operatorer og tilhørende Kubernetes-ressurser:
- [Ztoperator](08-ztoperator/index.mdx): en Kubernetes-operator for innlogging, sesjonshåndtering og claims-validering, via
  Kubernetes-ressursen `AuthPolicy`
- [Accesserator](09-accesserator/index.mdx): en Kubernetes-operator for token exchange, finkornet autorisasjon, token-uthenting av m2m-tokens og
  token-validering, via Kubernetes-ressursen `SecurityConfig`

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
Med bruk av [test-authpolicy-action](08-ztoperator/04-test-authpolicy.mdx) er det mulig å teste i CI/CD at en
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
