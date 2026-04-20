# Tilgang til on-prem infrastruktur fra GitHub Actions

## Bakgrunn

:::warning
Tailscale i denne konteksten er ment som et hjelpemiddel for å migrere pakker ut til et ekstern pakkeregister, og som et verktøy for å bli kvitt interne avhengigheter. Anbefales ikke for allmenn bruk.
:::

For å understøtte produktteamene med å migrere bort fra intern kode- og artifakthosting, samt avhengigheter på interne databaser har SKIP introdusert Tailscale.

Tailscale er en mesh-basert peer-to-peer VPN-løsning, som du kan lese mer om i deres [egen dokumentasjon](https://tailscale.com/blog/how-tailscale-works/) .

## Komme i gang

1. Kontakt en [GitHub-administrator](https://github.com/orgs/kartverket/people?query=role%3Aowner) for å be om tilgang for ditt repository

Hei $NAVN! Teamet mitt trenger tilgang til å benytte Tailscale på repoet [https://github.com/kartverket/mittRepo](https://github.com/kartverket/mittRepo) . Jeg trenger at du granter organisasjonshemmelighetene `TS_OAUTH_CLIENT_ID` og `TS_OAUTH_SECRET` (+ tilsvarende for Dependabot org-wide) på repoet, så klarer vi resten selv.

På forhånd takk 🙌

2. Etter du har fått tilgang til hemmelighetene, legg til følgende i din GitHub workflow

```yaml
- name: Tailscale
  uses: tailscale/github-action@v4
  with:
    oauth-client-id: ${{ secrets.TS_OAUTH_CLIENT_ID }}
    oauth-secret: ${{ secrets.TS_OAUTH_SECRET }}
    tags: tag:github-runner
    version: latest
```

3. Du kan nå benytte deg av utvalgte interne tjenester. Lykke til!

Vil du vite hvilke tjenester du får tilgang til eller behov for flere tjenester
enn dagens utvalg? Ta kontakt med [SKIP på Slack](https://kartverketgroup.slack.com/archives/C028ZEED280).
