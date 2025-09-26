# 🔐 Tilgangsstyring på SKIP

Tilgangsstyring handler om å sørge for at bare autoriserte brukere og systemer får riktig tilgang til riktige ressurser i en applikasjon.
På SKIP er tilgangsstyring innebygd gjennom Kubernetes-operatoren [Ztoperator](https://github.com/kartverket/ztoperator), som forenkler sikring av applikasjoner ved hjelp av OAuth 2.0 tokens.
Operatoren kan også automatisk omdirigere uautentiserte brukere til en innloggingsflyt, slik at applikasjonen kun er tilgjengelig for de som faktisk har tilgang.

## 🧩 Forutsetninger

- Du må ha registrert en klient hos en OAuth 2.0-identitetstilbyder.
- Du må vite hvilket *well-known endepunkt*, *audience* og eventuelle *claims* som gjelder for applikasjonen din.
- Den beskyttede applikasjonen **må** kjøre på SKIP.

Før du kan bruke Ztoperator til å beskytte tjenesten din, må du registrere en klient hos en relevant identitetstilbyder.
Dette er nødvendig for å instruere Ztoperator i hvem som skal slippes inn og hvem som skal blokkeres. Denne "oversikten" får man ved å opprette en klientregistrering hos en OAuth 2.0-identitetstilbyder og knytte den til Ztoperator.
