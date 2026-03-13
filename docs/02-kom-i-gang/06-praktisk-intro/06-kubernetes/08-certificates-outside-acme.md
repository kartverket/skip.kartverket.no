# Sertifikater utenfor ACME

I noen tilfeller er det behov for å bruke sertifikater som ikke kommer fra ACME. Dette kan være fordi DNS peker på noe annet enn SKIP LB, og trafikk rutes til SKIP via andre endpoints i Kartverket.

## Opprett certificate secret-ressurs i istio-gateways

For å kunne bruke et egendefinert sertifikat trenger vi en secret som kan monteres til gateway-ressursen. Dette er en secret av typen kubernetes.io/tls og kan opprettes via external secrets slik:

```yaml
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: star-matrikkel
  namespace: istio-gateways
spec:
  dataFrom:
  - extract:
      conversionStrategy: Default
      decodingStrategy: Auto
      key: star-matrikkel-no-key
  refreshInterval: 1h
  secretStoreRef:
    kind: SecretStore
    name: gsm
  target:
    creationPolicy: Owner
    deletionPolicy: Retain
    name: star-matrikkel # Secret i Kubernetes
    template:
      engineVersion: v2
      mergePolicy: Replace
      type: kubernetes.io/tls
```

Dette henter secreten fra Google Secret Manager. Denne secreten bør se slik ut:

```json
{
"tls.crt":"[base64 encoded cert chain]",
"tls.key":"[base64 encoded tls.key]"
}
```

## Rediger gateway-ressursen

Gateway-ressursen bør deretter oppdateres med den nye secreten:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: gateway-ingress
  namespace: matrikkel-keycloak
spec:
  selector:
    app: istio-ingress-external
  servers:
  - hosts:
    - auth.matrikkel.no
    port:
      name: http
      number: 80
      protocol: HTTP
  - hosts:
    - auth.matrikkel.no
    port:
      name: https
      number: 443
      protocol: HTTPS
    tls:
      credentialName: star-matrikkel # Secret opprettet av externalsecret
      mode: SIMPLE
```

### Hvis Skiperator er gateway-oppretteren

Når gateway-en er opprettet via Skiperator, vil den ha et credentialName som tilsvarer secreten opprettet av sertifikatet fra Skiperator. Skiperator vil tilbakestille konfigurasjoner til sine egne ressurser med mindre ressursen er merket med labelen `skiperator.kartverket.no/ignore: "true"`. Dette vil få Skiperator til å ignorere denne spesifikke ressursen under reconciliation loops.

```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  labels:
    skiperator.kartverket.no/ignore: "true"
```

Dette er ment som en midlertidig løsning, og ACME er den foretrukne måten å få sertifikater i SKIP.

## Bytte til ACME-sertifikat
### Apper som ikke bruker Skiperator

Bruk av ACME-sertifikat på en app som ikke bruker Skiperator krever en certificate-ressurs, og bruk av den resulterende secreten i gateway-en. Denne ressursen må opprettes i istio-gateways-namespacet og derfor i [skip-apps](https://github.com/kartverket/skip-apps):

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: certificate-name
  namespace: istio-gateways
spec:
  dnsNames:
  - appname.kartverket.no
  issuerRef:
    kind: ClusterIssuer
    name: cluster-issuer
  secretName: desired-secret-name
```

Etter at denne og secreten er opprettet, kan gateway-ressursen redigeres, og spec.tls.credentialName settes til secreten.

### Apper som bruker Skiperator

Fjern labelen `skiperator.kartverket.no/ignore: "true"`, så vil Skiperator håndtere resten.
