# Bruk av porter i pods

Porter under 1024 er priviligierte og krever at prosessen som kjører kjører som root. Dette er ikke tillatt på SKIP, og prosessen må derfor binde til en høyere port. Dette betyr at man ofte må gjøre tilpasninger på Docker-imaget man bygger slik at f.eks. nginx binder til en annen port.

Når prosessen i containeren binder seg til en upriviligert port, kan man spesifisere denne porten i Skiperator-manifestet slik som under. I bakgrunnen vil Skiperator ta seg av å lage en Kubernetes-service for denne porten slik at trafikken kan rutes til riktig sted.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: teamname-frontend
  namespace: yournamespace
spec:
  image: "kartverket/eksempel-image"
  port: 8080
  additionalPorts:
    - name: metrics-port
      port: 8181
      protocol: TCP
    - name: another-port
      port: 8090
      protocol: TCP
```

En annen ting å merke seg her er muligheten for å spesifisere ekstra porter som kan benyttes til andre formål som f.eks. helsesjekker eller prometheus-metrikker. Disse portene vil automatisk få opprettet en service, men det er fortsatt kun hovedporten som kobles opp mot en ingress-gateway. På den måten kan man skille ut endepunktet som ikke trengs eksternt.
