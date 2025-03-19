# Vedlikehold av applikasjoner

Applikasjoner som flyttes over på SKIP uten tilpassing til et moderne kjøretidsmiljø kan ha spesielle behov som krever litt manuell håndtering ved f.eks. oppgraderinger eller vedlikehold av databaser.

Denne siden prøver å forklare hvordan man kan gjøre en del av disse manuelle handlingene.

## Stoppe kjørende applikasjon i ArgoCD

For å kunne stoppe en kjørende applikasjon som er administrert av ArgoCD må man først være sikker på at autosync/self heal er deaktivert for produktteamet som eier applikasjonen. Hvis ikke vil bare applikasjonen spinne opp igjen automatisk.

Se [denne filen](https://github.com/kartverket/skip-apps/blob/main/lib/argocd/argocd.libsonnet#L51) for å sjekke hva som er status, eventuelt spør noen på SKIP hvis du er usikker. Hvis ikke annet er satt kan du gå ut i fra at autosync er skrudd på i dev og test, men avslått i prod.

For å stoppe en applikasjon trykker du på menyen til en application-ressurs og velger “Stop”. Dette vil midlertidig sette antall kopier til 0 slik at skiperator skalerer ned applikasjonen. Du vil da kunne se at pods forsvinner fra grensesnittet, og “Sync Status” for applikasjonen vil stå som “OutOfSync”
![Trykk stopp](images/671907942.png)
Når man er ferdig med vedlikeholdet og ønsker å gjennopprette tidligere konfigurasjon trenger man bare å trykke “Sync” for at applikasjonen skal spinne opp igjen.

## Stoppe kjørende applikasjon manuelt

For å stoppe en applikasjon som kjører på SKIP må man i praksis skalere ned antallet kjørende kopier til 0. Den største hindringen ved dette er en policy som vi håndhever i prod-miljøet, som heter “K8sReplicaLimits”. Denne krever at en applikasjon skal ha mellom 2 og 30 kjørende kopier til en hver tid.

For å manuelt stoppe en skiperator-applikasjon er det to ting man må gjøre:

- Sette en annotation for å ignorere k8sReplicaLimits policy
- Sette antall replicas til 0

Se følgende eksempel på manifest som skalerer til 0

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: some-app
  annotations:
    skip.kartverket.no/k8sReplicaLimits: ignore
spec:
  replicas: 0
```
