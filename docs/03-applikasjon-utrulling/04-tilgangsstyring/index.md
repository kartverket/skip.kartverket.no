# 🔐 Tilgangsstyring i SKIP

SKIP tilbyr innebygd støtte for tilgangsstyring gjennom tre identitetstilbydere: Microsoft Entra ID, IDPorten og Maskinporten.
Plattformen støtter tre hovedoperasjoner:

- [**Klientregistrering**](01-klientregistering): Automatisert registrering av klienter for sømløs integrasjon.
- [**Token-validering og autorisasjon**](02-token-validering): Sikre og effektive mekanismer for validering av tokens og grovkornet autorisasjon.
- [**Innlogging**](03-auto-login): Automatisert innlogging gjennom OAuth 2.0 authorization code flow.

Før du konfigurerer klientregistrering, token-validering eller innlogging, bør du vurdere hvilken identitetstilbyder som best passer til behovene i din applikasjon.

## Valg av identitetstilbyder

Når du velger en identitetstilbyder, bør du ta hensyn til bruksområdet for applikasjonen:

- **Microsoft Entra ID**: Brukes når applikasjonen er ment for internt bruk i Kartverket, og brukerne er ansatte i Kartverket. Dette gjelder enten hvis man skal tilby et API for andre interne tjenester eller ansatte i Kartverket, eller hvis man ønsker å konsumere et API som er beskyttet med Entra ID.
- **IDPorten**: Egnet for borgertjenester som skal brukes av Ola og Kari Nordmann.
- **Maskinporten**: Benyttes når applikasjonen tilbyr et API for andre offentlige virksomheter eller når man ønsker å konsumere andre API-er som benytter seg av Maskinporten.
