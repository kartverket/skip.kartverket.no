# Sertifikater utenfor ACME

Noen ganger kan du ikke bruke et ACME-sertifikat. Det skjer typisk når DNS peker et annet sted enn SKIP-lastbalansereren, og trafikken kommer inn til SKIP via andre endepunkter i Kartverket.

Da legger du sertifikatet i en secret i namespacet `istio-gateways` og peker applikasjonen på den. ACME er fortsatt den foretrukne måten å få sertifikater på i SKIP.

## Lag secreten i istio-gateways

Secreten må være av typen `kubernetes.io/tls` og ligge i `istio-gateways`. Namespacet ligger i [skip-apps](https://github.com/kartverket/skip-apps), så SKIP må opprette secreten for deg.

Med External Secrets henter du den fra Google Secret Manager:

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
    name: star-matrikkel
    template:
      engineVersion: v2
      mergePolicy: Replace
      type: kubernetes.io/tls
```

Verdien i Google Secret Manager skal se slik ut:

```json
{
"tls.crt":"[base64-enkodet sertifikatkjede]",
"tls.key":"[base64-enkodet tls.key]"
}
```

## Bruk sertifikatet fra Skiperator

Skriv hostnamet som `hostname+secret-navn`. Dette virker likt for `Application` og `Routing`, og for begge verdier av `routingProvider`.

```yaml
apiVersion: skiperator.kartverket.no/v1alpha1
kind: Application
metadata:
  name: auth
spec:
  image: image
  port: 8080
  routingProvider: Standard
  ingresses:
    - auth.matrikkel.no+star-matrikkel
```

Resten ordner Skiperator. Du skal ikke redigere noen Gateway selv.

Med `routingProvider: Standard` lager Skiperator en ListenerSet i ditt eget namespace som leser secreten fra `istio-gateways`. Gateway API tillater ikke en slik referanse på tvers av namespacer uten en `ReferenceGrant`, så Skiperator skriver en. Den navngir akkurat den ene secreten, og gir derfor ikke tilgang til de andre sertifikatene i namespacet.

Med `routingProvider: Legacy` setter Skiperator `credentialName` på Istio-gatewayen til navnet på secreten.

:::warning
Mangler secreten, eller er den ubrukelig, får objektet reason `CustomCertificateMissing` på `Ready`. Ingen venting løser dette. Du må provisjonere secreten. Ruller du fra `Legacy` til `Standard`, fortsetter `Legacy` å servere trafikken mens dette står på.
:::

Et delt hostname (`ownership: Shared`) kan ikke bruke eget sertifikat, fordi sertifikatet er delt per hostname. Se [Dele et hostname mellom team](../../../03-applikasjon-utrulling/03-skiperator/06-delt-hostname.md).

## Applikasjoner uten Skiperator

Kjører applikasjonen uten Skiperator, må du sette opp Istio-gatewayen selv:

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
      credentialName: star-matrikkel
      mode: SIMPLE
```

### Hvis Skiperator eier gatewayen

Skiperator overskriver endringer du gjør i ressursene sine. Labelen `skiperator.kartverket.no/ignore: "true"` får Skiperator til å hoppe over en enkelt ressurs under reconcile:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  labels:
    skiperator.kartverket.no/ignore: "true"
```

:::caution
Dette er en midlertidig nødløsning, og virker bare med `routingProvider: Legacy`. Med `Standard` lager ikke Skiperator noen Istio-gateway, så labelen gjør ingenting. Bruk `hostname+secret-navn` i stedet.
:::

## Gå tilbake til ACME

### Applikasjoner uten Skiperator

Opprett en `Certificate` i `istio-gateways` gjennom [skip-apps](https://github.com/kartverket/skip-apps), og pek gatewayen på secreten den lager:

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

Når secreten finnes, setter du `spec.tls.credentialName` på gatewayen til navnet på den.

### Skiperator-applikasjoner

Fjern `+secret-navn` fra hostnamet. Har du brukt nødløsningen over, fjerner du også labelen `skiperator.kartverket.no/ignore: "true"`. Skiperator ordner resten.
