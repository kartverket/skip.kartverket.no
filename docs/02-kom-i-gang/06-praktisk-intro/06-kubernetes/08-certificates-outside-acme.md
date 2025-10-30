# Certificates outside ACME

In some instances there is a requirement to use certificates not from ACME. This might be because DNS points to something other than SKIP LB, and traffic is routed to SKIP via other endpoints in kartverket.

## Create certificate secret resource in istio-gateways

To be able to use a custom certificate we need a secret to mount to the gateway resource. This is a kubernetes.io/tls type secret and can be created via external secrets like this:

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
    name: star-matrikkel # Secret in Kubernetes
    template:
      engineVersion: v2
      mergePolicy: Replace
      type: kubernetes.io/tls
```

This fetches the secret from Google Secret Manager. This secret should look like this:

```json
{
"tls.crt":"[base64 encoded cert chain]",
"tls.key":"[base64 encoded tls.key]"
}
```

## Edit the gateway resource

The gateway resource should then be updated with the new secret:

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
      credentialName: star-matrikkel # Secret created by externalsecret
      mode: SIMPLE
```

### If Skiperator is the gateway creator

When the gateway is created via Skiperator it will have a credentialName corresponding to the secret created by the certificate from Skiperator. Skiperator will reset configurations to its resources unless the resource labeled “skiperator.kartverket.no/ignore: "true"“. This will make skiperator ignore this specific resource during reconciliation loops.

```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  labels:
    skiperator.kartverket.no/ignore: "true"
```

This is meant to be a temporary solution, and ACME is the prefered way to get certificates in SKIP.

## Change to ACME certificate
### Non-Skiperator apps

Using ACME certificate on a non skiperator app requires a certificate resource, and using the resulting secret in the gateway. This resource must be created in the istio-gateways namespace and therefore in the [skip-apps](https://github.com/kartverket/skip-apps) :

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

After this is created and the secret is created, the gateway resource can be edited, and spec.tls.credentialName set to the secret.

### Skiperator apps

Remove the “skiperator.kartverket.no/ignore: "true"“ label, and skiperator will handle the rest.
