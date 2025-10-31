# 🔐 Tilgangsstyring på SKIP

Tilgangsstyring handler om å sørge for at bare autoriserte brukere og systemer får riktig tilgang til riktige ressurser i en applikasjon.
På SKIP er tilgangsstyring innebygd gjennom Kubernetes-operatoren [Ztoperator](https://github.com/kartverket/ztoperator), som forenkler sikring av applikasjoner ved hjelp av OAuth 2.0 tokens.
Operatoren kan også automatisk omdirigere uautentiserte brukere til en innloggingsflyt, slik at applikasjonen kun er tilgjengelig for de som faktisk har tilgang.

## 🧩 Forutsetninger

Før du kan bruke Ztoperator til å beskytte tjenesten din må følgende være på plass:

- Du må vite hvilken OAuth 2.0-identitetstilbyder som passer for din tjeneste og registrere en klient hos denne. Se [her](02-ztoperator/index.mdx#-st%C3%B8ttede-identitetstilbydere) for en oversikt over hvilke identitetstilbydere som støttes av Ztoperator på SKIP.
- Du må vite hvilket *well-known endepunkt*, *audience* og eventuelle *claims* som gjelder for applikasjonen din.
- Den beskyttede applikasjonen **må** kjøre på SKIP.

:::caution
Ztoperator registrerer ikke en OIDC-klient for deg. Du må selv ha etablert en integrasjon mot valgt identitetstilbyder, og Ztoperator brukes kun til å beskrive hvordan appen skal beskyttes og håndtere eventuelle innloggingsflyter.
:::
