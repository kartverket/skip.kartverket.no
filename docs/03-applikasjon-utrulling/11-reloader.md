# 🔄 Reloader

:::info
For spørsmål om Reloader, kontakt Team Tilgangsstyring via #gen-tilgangsstyring på Slack.
:::

Når en `ConfigMap` eller `Secret` endres, vil ikke pods som allerede kjører nødvendigvis plukke opp endringen av seg
selv. Miljøvariabler leses kun inn når containeren starter, og mange applikasjoner leser konfigurasjonsfiler bare ved
oppstart. For at endringen skal få effekt må det i så fall rulles ut nye pods.

SKIP har [Reloader](https://github.com/stakater/Reloader) installert i alle clustere. Reloader følger med på
`ConfigMap`- og `Secret`-ressurser, og kan starte en ny utrulling av applikasjonen din når en ressurs den bruker endres.
Utrullingen skjer som en rolling update, på samme måte som ved enhver annen endring.

Et alternativ til Reloader for configmaps og secrets du selv definerer navnet på, er å legge til en kort
hash av innholdet i navnet. Når innholdet endres, endres også navnet. Siden `Application` refererer til ressursen ved
navn gir dette en diff i `Application`-manifestet, som fører til en ny utrulling ved sync i Argo. Se
[Alternativ: hash i navnet på configmaps og secrets](#alternativ-hash-i-navnet-på-configmaps-og-secrets).

Et annet alternativ er å montere configmaps og secrets som filer med `filesFrom`, og la applikasjonen lese innholdet
fra fil fortløpende i stedet for kun ved oppstart. Kubernetes oppdaterer monterte filer automatisk når ressursen endres,
vanligvis innen et minutt, slik at applikasjonen kan plukke opp endringen uten en ny utrulling. Merk at dette ikke
gjelder filer som er montert med `subPath`.

## Ta i bruk Reloader

Reloader styres med annotasjoner. For en Skiperator-`Application` legger du disse under `spec.podSettings.annotations`.

Det finnes tre måter å bruke Reloader på. Alle tre krever at du legger til en annotasjon på `Application`, mens én av
metodene i tillegg krever annotasjon på `ConfigMap`- og `Secret`-ressursene som skal trigge utrulling:

| Metode                                        | Annotasjon på `Application`                                                      | Rulles ut ved                                                                                                             |
|-----------------------------------------------|----------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| [Søk og match](#søk-og-match)                 | `reloader.stakater.com/search`                                                   | endring i en `ConfigMap` eller `Secret` applikasjonen bruker, gitt at denne er annotert med `reloader.stakater.com/match` |
| [Automatisk](#automatisk)                     | `reloader.stakater.com/auto`                                                     | endring i en `ConfigMap` eller `Secret` applikasjonen bruker                                                              |
| [Spesifikke ressurser](#spesifikke-ressurser) | `configmap.reloader.stakater.com/reload` / `secret.reloader.stakater.com/reload` | endring i en av de navngitte ressursene                                                                                   |

### Søk og match

Med `reloader.stakater.com/search` rulles applikasjonen bare ut på nytt når en ressurs den bruker endres, _og_ denne
ressursen selv er annotert med `reloader.stakater.com/match: "true"`.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: foo-backend
spec:
  image: ghcr.io/kartverket/foo-backend:1.2.3
  port: 8080
  envFrom:
    - configMap: foo-backend-config
// diff-add-start
  podSettings:
    annotations:
      reloader.stakater.com/search: "true"
// diff-add-end
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: foo-backend-config
// diff-add-start
  annotations:
    reloader.stakater.com/match: "true"
// diff-add-end
data:
  LOG_LEVEL: info
```

Secrets fra Azurerator og Digdirator er allerede annotert med `reloader.stakater.com/match`, så det eneste du trenger er
`reloader.stakater.com/search` på applikasjonen din. For secrets fra
[External Secrets](09-argo-cd/04-hente-hemmeligheter-fra-hemmelighetsvelv.md) kan du legge på annotasjonen via `spec.target.template.metadata.annotations` i `ExternalSecret`-ressursen.

### Automatisk

Med `reloader.stakater.com/auto` rulles applikasjonen ut på nytt når en hvilken som helst `ConfigMap` eller `Secret`
som applikasjonen refererer til endres, uavhengig av om ressursen selv er annotert med
`reloader.stakater.com/match: "true"`. Har applikasjonen både `reloader.stakater.com/auto` og
`reloader.stakater.com/search`, er det `auto` som gjelder.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: foo-backend
spec:
  image: ghcr.io/kartverket/foo-backend:1.2.3
  port: 8080
  envFrom:
    - configMap: foo-backend-config
    - secret: foo-backend-secrets
// diff-add-start
  podSettings:
    annotations:
      reloader.stakater.com/auto: "true"
// diff-add-end
```

Ønsker du bare å følge med på én type ressurs kan du bruke `configmap.reloader.stakater.com/auto: "true"` eller
`secret.reloader.stakater.com/auto: "true"` i stedet.

Enkeltressurser kan unntas fra automatisk reloading med `configmaps.exclude.reloader.stakater.com/reload` og
`secrets.exclude.reloader.stakater.com/reload`, som tar en kommaseparert liste med navn:

```yaml
  podSettings:
    annotations:
      reloader.stakater.com/auto: "true"
      secrets.exclude.reloader.stakater.com/reload: "foo-backend-secrets"
```

### Spesifikke ressurser

Hvis du bare vil at endringer i enkelte ressurser skal føre til en ny utrulling, kan du liste dem opp eksplisitt.
Verdien er en kommaseparert liste med navn på configmaps eller secrets i samme namespace.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: foo-backend
spec:
  image: ghcr.io/kartverket/foo-backend:1.2.3
  port: 8080
  envFrom:
    - configMap: foo-backend-config
    - configMap: foo-backend-feature-flags
    - secret: foo-backend-secrets
// diff-add-start
  podSettings:
    annotations:
      configmap.reloader.stakater.com/reload: "foo-backend-config,foo-backend-feature-flags"
      secret.reloader.stakater.com/reload: "foo-backend-secrets"
// diff-add-end
```

## Alternativ: hash i navnet på configmaps og secrets

For configmaps og secrets som du definerer selv i ditt apps-repo, finnes det et alternativ som ikke krever Reloader:
å legge til en kort hash av innholdet i navnet på ressursen. Når innholdet endres, endres også navnet. Siden
`Application`-manifestet refererer til ressursen ved navn, gir dette en diff i `Application`-manifestet, som igjen
medfører utrulling av applikasjonen.

Den gamle ressursen bør ikke slettes før den nye er rullet ut. Uten den vil gamle pods som restarter underveis i
utrullingen, eller hvis du ruller tilbake, peke på en ressurs som ikke finnes lenger, og feile med
`CreateContainerConfigError`. Ved bruk av manuell sync i Argo CD vil gamle ressurser kun fjernes dersom du huker av for
"Prune" ved sync. Med autosync i Argo CD er prune skrudd på som standard, og den gamle ressursen slettes da
i samme sync som den nye opprettes. Dersom du foretrekker autosync i produksjon kan det derfor være lurt å legge
sync-opsjonen `PruneLast=true` på ressursen, slik at Argo CD venter med å slette den til resten av syncen er fullført og
ressursene er healthy. Se eksempelet nedenfor.

Metoden beskrevet over fungerer bare for ressurser der innholdet ligger i apps-repoet, og du selv kan styre navnet. For
hemmeligheter som hentes fra Google Secret Manager eller opprettes av andre (f.eks. en operator, som Azurerator,
Digdirator med mer), må du bruke [Reloader](#ta-i-bruk-reloader).

### Eksempel med Jsonnet

```jsonnet
local appName = 'foo-backend';

local configData = {
  LOG_LEVEL: 'info',
  FEATURE_X_ENABLED: 'true',
};

// Legger til de første 7 tegnene av en md5-hash av innholdet i navnet
local withHash(name, data) =
  name + '-' + std.substr(std.md5(std.toString(data)), 0, 7);

local configMapName = withHash(appName + '-config', configData);

[
  {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {
      name: configMapName,
      annotations: {
        'argocd.argoproj.io/sync-options': 'PruneLast=true',
      },
    },
    data: configData,
  },
  {
    apiVersion: 'skiperator.kartverket.no/v1alpha1',
    kind: 'Application',
    metadata: {
      name: appName,
    },
    spec: {
      image: 'ghcr.io/kartverket/foo-backend:1.2.3',
      port: 8080,
      envFrom: [
        { configMap: configMapName },
      ],
    },
  },
]
```

Dette genererer en `ConfigMap` med navnet `foo-backend-config-d38b68a`, som `Application` refererer til i `envFrom`.
Endres `LOG_LEVEL` til `debug`, blir navnet i stedet `foo-backend-config-a8dbbff`, og både `ConfigMap` og
`Application` får en diff:

```diff
 spec:
   envFrom:
-    - configMap: foo-backend-config-d38b68a
+    - configMap: foo-backend-config-a8dbbff
```

:::tip
Bruker du [ArgoKit](10-argokit/index.md) v2 kan du få hash i navnet med `addHashToName=true`, f.eks. i
`withConfigMapAsEnv(name, data, addHashToName=true)` eller `argokit.k8s.configMap.new(name, data, addHashToName=true)`.
Se [ArgoKit v2](10-argokit/09-argokit-v2.md#configmap-hjelpere).
:::
