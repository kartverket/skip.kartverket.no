# Komme i gang med Argo CD

![ArgoCD](images/554043034.png)

Så du ønsker å komme i gang med å deploye til SKIP. Det er bra! Vi bruker et par teknologier for å gjøre det enklest mulig å deploye koden sin til plattformen, og disse er:

- [GitHub](../../02-kom-i-gang/06-praktisk-intro/01-github/01-tilgang-til-github.md) – Kodelagring
- [GitHub Actions](../08-github-actions/index.md) – Bygging av artefakter og containere
- [Argo CD](index.md) – Deploye til SKIP
- [External Secrets](04-hente-hemmeligheter-fra-hemmelighetsvelv.md) – Synkronisere hemmeligheter til Kubernetes
- [Crossplane](./05-provisjonere-infrastruktur-med-crossplane.md) – Provisjonere infrastruktur
- [Skiperator](https://github.com/kartverket/skiperator) – Beskrive en applikasjon i et manifest

Her skal vi beskrive hvordan du kommer i gang med å synke ut applikasjonene dine til clusteret ved hjelp av Argo CD. For beskrivelser av hvordan man kommer i gang med det andre teknologiene se lenkene over.

## Sjekkliste

For å starte med Argo CD må du gjøre følgende:

- Sørg for at teamet ditt oppfyller [Hva skal til for å bruke SKIP?](https://kartverket.atlassian.net/wiki/spaces/DT/pages/497614849/Hva+skal+til+for+bruke+Plattformen)
- Produktteamet deres må ha en team-gruppe i Entra ID
- Det må settes opp et apps-repo
  - Les [Hva er et apps-repo](02-hva-er-et-apps-repo.md) for å forstå hvordan apps-repoer fungerer
  - Repoet opprettes fra [apps-template malen](https://github.com/kartverket/apps-template)
  - GitHub teamet deres må gis tilgang til apps-repoet som admin
  - SKIP må gi Argo CD-appen på GitHub tilgang slik at Argo kan pulle apps-repoet, dette gjøres gjennom [Github IAC](https://github.com/kartverket/github-iac) repoet
- Det bestemmes et “prefiks” som dere deployer til
  - Vanligvis er dette navnet på applikasjonen som skal deploye til SKIP
  - Dere kan administrere alle Kubernetes namespacer som starter med dette prefikset
- SKIP må konfigurere Argo til å lese og synkronisere fra apps-repoet
  - SKIP gjør en endring i [skip-apps repoet](https://github.com/kartverket/skip-apps/blob/main/lib/argocd/argocd.libsonnet)
- Nå skal du kunne logge inn på Argo CD og se applikasjonen din! 🚀
  - Du finner lenker til Argo på [Argo CD](index.md)
  - Videre dokumentasjon finnes på [Hvordan bruke Argo CD](./03-hvordan-bruke-argocd.md)
