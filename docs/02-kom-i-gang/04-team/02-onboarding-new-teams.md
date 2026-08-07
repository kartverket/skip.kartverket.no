# Onboarding av nytt produktteam til SKIP

:::info
Vil teamet ditt bruke SKIP? Vennligst les denne artikkelen først: [Hva skal til for å bruke Plattformen?](https://kartverket.atlassian.net/wiki/spaces/DT/pages/497614849/Hva+skal+til+for+bruke+Plattformen)
:::

Denne siden inneholder instruksjoner for onboarding av nye produktteam til SKIP-plattformen. Både oppgaver som må gjøres av SKIP-teamet, og oppgaver som må gjøres av det nye
produktteamet er beskrevet her.

Ta gjerne kontakt med SKIP-teamet eller kommenter direkte i dokumentet dersom du finner feil eller mangler i veiledningen.

:::info
Produktteamet trenger ikke å opprette et GCP-prosjekt selv.
:::

## Produktteamets oppgaver

Produktteamet har ansvaret for å fordele disse oppgavene internt.

- Informere SKIP om hvem som er teamleder slik at de kan administrere AD-gruppen
- Vurdere hvilke teammedlemmer som trenger ekstra Kubernetes/GCP-kurs
- Hvis ArgoCD skal brukes: Opprette nytt Apps-repo i GitHub basert på denne [SKIP-malen](https://github.com/kartverket/apps-template)
- Sørge for at applikasjonen har en [IP og/eller DPIA](https://kartverket.atlassian.net/wiki/spaces/PER/pages/436338711/Mal+for+IP+-+DPIA+og+ROS.+KOPIER+SIDENE+TIL+ET+EGET+OMR+DE.)
- Tilpasse applikasjonen for å tilfredsstille SKIPs sikkerhetskrav
- Sørge for at utviklerne på teamet har tilgang på GitHub (se [Tilgang til GitHub](../06-praktisk-intro/01-github/01-tilgang-til-github.md))
- Lese, forstå og følge GitHub-sikkerhetskravene: [Sikkerhet på GitHub](https://kartverket.atlassian.net/wiki/spaces/SIK/pages/308216163/Sikkerhet+p+GitHub)
- Fullføre ROS-analyse
- Forberede informasjon til SKIP-teamet
  - Tekniske forventninger
  - Tjenestedesign/arkitektur
  - Utenforliggende avhengigheter
- Ta ansvar for egne krav og kommunisere disse tydelig og konsist til SKIP
- Sørge for at alle teammedlemmer inviteres til møter og Slack-grupper under onboarding-prosessen
- Lese og forstå SKIP-dokumentasjonen
- Gjøre forventet/påkrevd go-live-dato kjent for SKIP


## SKIP-teamets oppgaver

### Før onboarding

- Invitere en representant fra produktteamet til plattformlauget
- Dedikere et SKIP-teammedlem som kontaktpunkt for migreringsprosessen (TAM) (kun for selve migreringsprosessen, etter det starter vanlig supportflyt)
- Invitere til et møte for å avklare forventninger mellom SKIP og produktteamet
- Invitere til gjennomgang av applikasjoner
- Bli enige om frekvensen av onboarding standups med produktteamet og invitere til disse
- Sørge for at en prosess rundt risikovurdering (“ROS-analyse”) startes. Denne vurderingen må være klar i tide til produksjon
- Opprette en kanal på Slack for samarbeid under onboarding
- Invitere til #gen-skip, #gen-argo og andre relevante felleskanaler for bruk av SKIP
- Invitere til GCP- og Kubernetes-kurs hvis produktteamet ønsker det
- Gi en introduksjon til ArgoCD og beste praksis for dette verktøyet

### Under onboarding

- Invitere til et kickoff-møte hvor kontaktpunkter, ansvarsfordeling, support, veikart og andre relevante saker diskuteres.
- Opprette grupper ved å legge dem til [entra-id-config](https://github.com/kartverket/entra-id-config/blob/main/org.yaml) (gruppe synces fra Entra ID til GCP hver time)
- Teamet må merkes med security i admin.google.com ([workflow](https://github.com/kartverket/skip-core-infrastructure/actions/workflows/security-groups.yaml) kjøres hver dag kl. 8 UTC)
- Opprett produkt/prosjekt ved å kjøre workflow i [platform-onboarding](https://github.com/kartverket/platform-onboarding/actions/workflows/add-team-resources.yml)
- Gå til de aktuelle repoene som mottar et "onboarding"-event fra workflowen og review endringene
- Teamet og app-repositoriet settes opp i henhold til [Komme i gang med Argo CD](../../03-applikasjon-utrulling/09-argo-cd/01-komme-i-gang-med-argocd.md)
- Hvis teamet krever Terraform:
  - Service account for Terraform settes opp med [gcp-service-accounts](https://github.com/kartverket/gcp-service-accounts) og gis tilganger til kubernetes namespace via [WIF](https://kartverket.atlassian.net/wiki/spaces/SKIP/pages/320570259/Workload+Identity+Federation).
