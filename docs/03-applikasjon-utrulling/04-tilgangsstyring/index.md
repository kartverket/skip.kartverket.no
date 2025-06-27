# 🔐 Tilgangsstyring på SKIP

SKIP tilbyr innebygd støtte for tilgangsstyring og støtter tre hovedoperasjoner:

- [**Klientregistrering**](01-klientregistrering.mdx): Enkel registrering og vedlikehold av klienter mot ulike identitetstilbydere.
- [**Token-validering og grovkornet autorisasjon**](02-token-validering.mdx): Sikre og effektive mekanismer for validering av tokens og grovkornet autorisasjon.
- [**Automatisert innlogging**](03-auto-login.mdx): Automatisert innlogging gjennom OAuth 2.0 authorization code flow.

SKIP tilbyr Kubernetes-operatoren [Ztoperator](https://github.com/kartverket/ztoperator) for å tilgangsstyre trafikk inn mot applikasjoner.
Du kan lese mer om Ztoperator [her](04-ztoperator/index.md).

## Valg av identitetstilbyder
Før du konfigurerer klientregistrering, token-validering eller innlogging, bør du vurdere hvilken identitetstilbyder som best passer til behovene i din applikasjon.

- **Microsoft Entra ID**: Brukes når applikasjonen er ment for internt bruk i Kartverket, og brukerne er ansatte i Kartverket. Dette gjelder enten hvis man skal tilby et API for andre interne tjenester eller ansatte i Kartverket, eller hvis man ønsker å konsumere et API som er beskyttet med Entra ID.
- **ID-porten**: Egnet for borgertjenester som skal brukes av Ola og Kari Nordmann.
- **Maskinporten**: Benyttes når applikasjonen tilbyr et API for andre offentlige virksomheter eller når man ønsker å konsumere andre API-er som benytter seg av Maskinporten.
