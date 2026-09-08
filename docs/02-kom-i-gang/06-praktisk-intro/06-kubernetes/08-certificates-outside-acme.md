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

:::warning
Mangler secreten eller om den er ugyldig, får objektet reason `CustomCertificateMissing` på `Ready`. Kontakt SKIP for hjelp med å provisjonere sertifikatet/feilsøke.
:::

Et delt hostname (`ownership: Shared`) kan ikke bruke eget sertifikat. For mer informasjon, se [Dele et hostname mellom team](../../../03-applikasjon-utrulling/03-skiperator/06-delt-hostname.md).
