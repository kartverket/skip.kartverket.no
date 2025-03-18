# Transitive avhengigheter i Dependency Graph med Gradle

[Dependency Graph](https://kartverket.atlassian.net/wiki/spaces/SIK/pages/306906088/Dependency+Graph) brukes for å få oversikt over avhengigheter og sårbarheter.

For JVM-prosjekter med Gradle må det settes opp en egen action som sender inn alle transitive avhengigheter.

Det kan opprettes en egen action som både sender inn avhengigheter og gjør dependency review som i eksempelet under. Dependency sumbission bør kun kjøres fra en enkelt action per repo. Om dependency submission kjøres fra flere actions vil dette føre til uønsket oppførsel ved håndtering av sårbarheter i Dependency Graph. Se [GitHub egne anbefalinger for bruk av dependency submission og dependency review sammen](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review#using-github-actions-to-access-the-dependency-submission-api-and-the-dependency-review-api).

Merk at oppsett mot private pakkebrønner må gjøres i tillegg (Tailscale eller annet), slik som for vanlige bygg. Java-distribusjon og -versjon må også konfigureres til å tilsvare det som brukes i kodebasen.

```yaml
name: Publiser Gradle-avhengigheter og PR review

on:
  pull_request:
  push:
    branches:
    - 'main'
jobs:
  dependency-submission:
    permissions:
      contents: write # Required for submitting dependencies
      pull-requests: write # Required for dependency review comments in PR
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          # TODO: Update distribution and version if necessary
          distribution: temurin
          java-version: 17

      - name: Generate and submit dependency graph
        uses: gradle/actions/dependency-submission@v4

      - name: Perform dependency review
        uses: actions/dependency-review-action@v4
        if: github.event_name == 'pull_request'
        with:
          comment-summary-in-pr: always
          fail-on-severity: moderate
```

Dependency review kan fjernes eller konfigureres slik teamet ønsker det. Se også [Dependency review](./dependency-review.md).
