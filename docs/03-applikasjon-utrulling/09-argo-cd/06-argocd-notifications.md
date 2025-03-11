# ArgoCD Notifications

ArgoCD har støtte for å sende notifikasjoner basert på forhåndsdefinerte triggers gjennom en rekke kanaler, deriblant Slack og Github. Eksempelvis kan dette være triggers basert på at synkroniseringen av en applikasjon feilet, eller at en applikasjon har blitt liggende i OutOfSync over et visst tidsrom.

[ArgoCD Notifications er dokumentert her](https://argocd-notifications.readthedocs.io/en/stable/).

Vår ArgoCD installasjon kommer med en rekke triggers og templates for utseende forhåndsinstallert.

Se [https://github.com/kartverket/skip-apps/blob/main/bases/argocd/patches/argocd-notifications-templates.yml](https://github.com/kartverket/skip-apps/blob/main/bases/argocd/patches/argocd-notifications-templates.yml) for hvilke triggers som er tilgjengelig.

### Slack

For Slack er det satt opp en notifikasjonskanal for hvert team på mønster &lt;teamnavn&gt;-argocd-alerts, f.eks. #nrl-argocd-alerts. Disse kanalene er videre satt opp med integration mot Slack-appen “ArgoCD Notifications” som tar imot meldinger fra ArgoCD og dytter de inn i korrekt kanal.

(NB: Hvis du ikke finner en slik kanal for teamet ditt, kontakt en administrator for Kartverkets Slack og be om å få opprettet en kanal med korrekt navnemønster og integrasjon mot “ArgoCD Notifications”).

![Fig 1. Eksempel på Slack-notifikasjon](images/595165215.png)

### Github

For Github er det satt opp en app kalt “KV ArgoCD Notifications” som har mulighet til å skrive til Github workflow statuser til de forskjellige apps-repoene. Kontakt en av Kartverkets Github-administratorer dersom flere apps-repoer skal legges til her.

Eksempler på notifikasjoner:
![Fig. 2 Et lite grønt “checkmark” indikerer at utrulling til ArgoCD har gått bra](images/594280578.png) 
![Fig.3 … og klikker man på det får man opp en liten detaljvisning med linker til ArgoCD](images/594542693.png)

### Standardnotifikasjoner

Følgende triggers er lagt til som standard for alle apps-repoer:

| **Trigger**                                                         | **Kommunikasjonskanal** | **Når trigges denne?**                                                                                                            |
| ------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `notifications.argoproj.io/subscribe.on-sync-failed.slack`          | Slack                   | Synkronisering av applikasjon feilet                                                                                              |
| `notifications.argoproj.io/subscribe.on-sync-failed.github`         | Github                  | Synkronisering av applikasjon feilet                                                                                              |
| `notifications.argoproj.io/subscribe.on-sync-succeeded.github`      | Github                  | Synkronisering av applikasjon gikk bra                                                                                            |
| `notifications.argoproj.io/subscribe.on-sync-running.github`        | Github                  | Synkronisering av applikasjon kjører                                                                                              |
| `notifications.argoproj.io/subscribe.on-health-degraded.github`     | Github                  | Helsesjekk av applikasjonen returnerer et “degraded”-resultat                                                                     |
| `notifications.argoproj.io/subscribe.on-sync-status-unknown.github` | Github                  | Ukjent synkroniseringsstatus                                                                                                      |
| `notifications.argoproj.io/subscribe.on-deployed.github`            | Github                  | Ny versjon av applikasjonen deployet til miljø                                                                                    |
| `notifications.argoproj.io/subscribe.on-outofsync-one-day.slack`    | Slack                   | Applikasjonen har status OutOfSync i minst en dag (det har blitt sjekket inn endringer i apps-repoet som ikke har blitt deployet) |
| `notifications.argoproj.io/subscribe.on-outofsync-one-week.slack`   | Slack                   | Applikasjonen har status OutOfSync i minst en uke (det har blitt sjekket inn endringer i apps-repoet som ikke har blitt deployet) |

### Ekstra triggers

I tillegg er det mulig å spesifisere andre triggers (så lenge disse er lagt inn i ArgoCD) per team i objektet triggerSubscriptions i [https://github.com/kartverket/skip-apps/blob/main/lib/argocd/argocd.libsonnet](https://github.com/kartverket/skip-apps/blob/main/lib/argocd/argocd.libsonnet) .

:::info
Husk å spesifisere om det er slack eller github notifikasjon man ønsker ved å legge til suffikset .slack eller .github på slutten av trigger, og husk å spesifisere kanalnavn ved bruk av slack notifikasjon
:::

```javascript
{
    name: 'teamnavn',
    oidcGroup: 'aabbbcc-123-321-ccbbbaa',
    allowlistedPrefixes: [{ name: 'teamnavn' }],
    triggerSubscriptions: {
      'notifications.argoproj.io/subscribe.on-sync-succeeded.slack': 'navn-paa-slack-kanal',
      'notifications.argoproj.io/subscribe.eksempel-trigger.github': '', # denne er blank siden det ikke er en kanal å sende til på github
    }
},
```
