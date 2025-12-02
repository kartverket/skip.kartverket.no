# Konfigurere applikasjons-repositorier med config.json

Applikasjoner i [Argo CD](index.md) opprettes dynamisk når nye mapper i [apps-repoet](02-hva-er-et-apps-repo.md) blir opprettet. Disse applikasjonene følger en standard som er forhåndsdefinert av SKIP. Som standard er autosynkronsikring aktivert i utviklingsmiljø (dev), men ikke i produksjon (prod).

Det er mulig å konfigurere innstillingene til en applikasjon i apps-repoet ditt ved å legge til en spesiell fil kalt config.json i mappen. Når denne filen er til stede, kan et sett forhåndsdefinerte alternativer angis for å konfigurere hvordan applikasjonen skal synkroniseres av Argo CD.

Eksempelet nedenfor viser en `config.json` fil:

```javascript
{
  "tool": "directory",
  "autoSync": true
}
```

`config.json` Kan kun plasseres i rot-mappen for namespaces. For eksempel: `dev/foo-main/config.json` eller `env/atkv3-dev/foo-main/config.json` .

Når filen er lagt til i mappen, må applikasjonen synkroniseres i Argo CD for å oppdatere applikasjonsinnstillingene slik at de følger spesifikasjonene i `config.json`. Dette skjer automatisk hvis autosynkronsikring er aktivert.

## Tilgjengelige innstillinger

| **Nøkkel**           | **Type**                           | **Beskrivelse**                                                                                                                                                                                                                                                                                                                                      |
| ----------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tool` (required) | `directory` / `kustomize` / `helm` | Hvilken framgangsmåte Argo CD skal bruke for å synkronisere applikasjonen. “Directory” alternativet støtter yaml og jsonnet filer. Se [tools](https://argo-cd.readthedocs.io/en/latest/user-guide/application_sources/).                                                                                                                                           |
| `autoSync`        | boolean ( `true` / `false` )       | Når den er `true` , vil applikasjonen automatisk synkroniseres når Argo CD oppdager endringer i apps-repoet.  Standardverdi er`true` i dev og `false` i prod.                                                                                                                                                                                                        |
| `prune`           | boolean ( `true` / `false` )       |Når den er `true` , Vil Argo CD automatisk fjerne ressurser som ikke eksisterer i apps-repoet i Git. Standardverdi er `true` . Se [prune](https://argo-cd.readthedocs.io/en/latest/user-guide/auto_sync/#automatic-pruning) . Blir bare brukt hvis `autoSync` er `true`.                                                                                                  |
| `allowEmpty`      | boolean ( `true` / `false` )       | Sikkerhetsmekanisme. Når prune er `true`, vil ressurser slettes automatisk, men det tillates ikke tomme synkroniseringer (slette alt) utenom når `allowEmpty` er også satt til `true`. Standardverdi er `false` . Se [allowEmpty](https://argo-cd.readthedocs.io/en/latest/user-guide/auto_sync/#automatic-pruning-with-allow-empty-v18) . Blir bare brukt hvis `autoSync` er `true`. |
| `selfHeal`        | boolean ( `true` / `false` )       | Når forandringer er gjort direkte på klusteret, vil Argo CD ikke tilbakestille disse med mindre `selfHeal` er satt til `true` . Standardverdi er `true` . Se [selfHeal](https://argo-cd.readthedocs.io/en/latest/user-guide/auto_sync/#automatic-self-healing) . Blir bare brukt hvis `autoSync` er `true`.                                                                             |
