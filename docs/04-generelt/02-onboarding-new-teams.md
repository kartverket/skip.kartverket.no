# Onboarding av nytt produkt-team til SKIP

:::info
Vil teamet ditt bruke SKIP? Vennligst les denne artikkelen først: [Hva skal til for å bruke Plattformen?](https://kartverket.atlassian.net/wiki/spaces/DT/pages/497614849/Hva+skal+til+for+bruke+Plattformen)
:::

Denne siden innholder ansvarsområder og viktige oppgaver som må gjøres før onboarding av nye produktteam til SKIP-plattformen. Både av oppgaver som må gjøres av SKIP-teamet, samt oppgaver som må gjøres av det nye produktteamet er beskrevet her.


Vi setter stor pris på om du rapporterer eventuelle mangler og/eller manglende informasjon i denne veiledningen til SKIP-teamet, enten ved å kontakte oss eller ved å kommentere direkte i dette dokumentet.

:::info
Produktteamet trenger ikke å opprette et GCP-prosjekt selv!
:::

## SKIP-team oppgaver

### Før onboarding

- Invitere en representant fra produktteamet til plattformlauget
- Dedikere et SKIP-teammedlem som kontaktpunkt for migreringsprosessen (TAM) (Kun for migreringsprosessen, etter dette starter en vanlig supportflyt)*
- Invitere til et møte for å avklare forventninger mellom SKIP og produktteamet
- Invitere til gjennomgang av applikasjoner
- Bli enige om frekvensen av onboarding standups med produktteamet og invitere til disse
 -Sørge for at en prosess rundt risikovurdering (“ROS-analyse”) startes. Denne vurderingen må være klar i tide til produksjon
- Opprette en kanal på Slack for samarbeid under onboarding
- Invitere til #gen-skip, #gen-argo og andre relevante felleskanaler for bruk av SKIP
- Invitere til GCP- og Kubernetes-kurs hvis produktteamet ønsker det
- Gi en introduksjon til ArgoCD og beste praksis for dette verktøyet

### Under onboarding

- Invitere til et kickoff-møte hvor kontaktpunkter, ansvarsfordeling, support, veikart og andre relevante saker diskuteres.
- GitHub, gitt at teamet ikke har brukt dette før
- Opprette grupper ved å legge dem til entra-id-config
- Teamet må merkes med security i admin.google.com. Dette kan kun gjøres gjennom click-ops og kun Bård og Eline har tilgang, dessverre.
- Teamet må legges til IAM-repositoriet
- Workflow i IAM-repositoriet må kjøres av et SKIP-medlem med tilgang til dette.
- Teamene synkroniseres fra AD til IAM
- Hvis teamet krever Terraform:
  - Service account for Terraform settes opp med [gcp-service-accounts](https://github.com/kartverket/gcp-service-accounts) og gis tilganger til kubernetes namespace via [WIF](https://kartverket.atlassian.net/wiki/spaces/SKIP/pages/320570259/Workload+Identity+Federation).
  - Terraform state migreres/settes opp
  - Teamet og app-repositoriet settes opp i henhold til Komme i gang med Argo CD [Komme i gang med Argo CD](../09-argo-cd/01-komme-i-gang-med-argocd.md)

## Produkt-team oppgaver

The product team is responsible for delegating tasks among themselves.

- Informere SKIP om hvem som er teamleder slik at de kan administrere AD-gruppen
- Vurdere hvilke teammedlemmer som trenger ekstra Kubernetes/GCP-kurs
- Hvis ArgoCD skal brukes: Opprette nytt Apps-repositorium i GitHub basert på denne [SKIP malen](https://github.com/kartverket/apps-template)
- Sørge for at applikasjonen har en [IP og/eller DPIA](https://kartverket.atlassian.net/wiki/spaces/PER/pages/436338711/Mal+for+IP+-+DPIA+og+ROS.+KOPIER+SIDENE+TIL+ET+EGET+OMR+DE.)
- Tilpasse applikasjonen for å tilfredsstille SKIPs sikkerhetskrav
- Lese, forstå og følge GitHub-sikkerhetskravene: [Sikkerhet på GitHub](https://kartverket.atlassian.net/wiki/spaces/SIK/pages/308216163/Sikkerhet+p+GitHub)
- Fullføre ROS-analyse
- Forberede informasjon til SKIP-teamet, inkludert tekniske forventninger og tjenestedesign/arkitektur
- Ta ansvar for egne krav og kommunisere disse tydelig og konsist til SKIP
- Sørge for at alle teammedlemmer inviteres til møter og Slack-grupper under onboarding-prosessen
- Lese og forstå SKIP-dokumentasjonen
- Gjøre forventet/påkrevd go-live-dato kjent for SKIP
