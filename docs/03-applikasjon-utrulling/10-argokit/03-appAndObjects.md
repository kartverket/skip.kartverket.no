# AppAndObjects Konseptet

## Motivasjon

Når du skal skrive mer komplekse manifester for applikasjoner med ekstra ressursser (som ConfigMap, ExternalSecret eller AzureAdApplication),
må du som regel legge til variabler, secrets, access policies eller annen konfigurasjon på applikasjonsobjektet ditt.
Dette kan være vanskelig å koordinere, da ofte navn må stemme på tvers av flere ressursser, og du må huske på sette krevd koknfigurasjon.
AppAndObjects løser dette ved at du kan legge til ekstra ressursser til din applikasjon og riktig konfigurasjon blir lagt til applikasjonsobjektet ditt automatisk.

## Introduksjon
-     AppAndObjects er et abstraksjonslag i ArgoKit over applikasjonsobjektet som lar deg legge til ekstra ressurser samtidig som du manipulerer applikasjonen.
-     Samler applikasjon og relaterte ressurser i ett wrapper-objekt som renderes til en Kubernetes List.
-     Denne siden forklarer hva AppAndObjects er, hvorfor det finnes, hvordan det fungerer på et overordnet nivå, og når du bør bruke det.

## Kontekst
Om du har sett på ArgoKit-koden eller kikket i noen app-repoer i Kartverket, har du kanskje kommet over dette konseptet.
Kanskje har du googlet det og fått nøyaktig 0 treff. Så hva er egentlig AppAndObjects?

## Innhold
I stedet for å jobbe direkte på ett objekt, jobber vi nå på et slags wrapper-objekt med to felter: application og objects. Derav navnet AppAndObjects.

```jsonnet
// uten AppAndObjects
{
  apiVersion: 'skiperator.kartverket.no/v1alpha1',
  kind: 'Application',
  metadata: {
    name: 'test-app',
  },
}

// med AppAndObjects
{
  application: {
    apiVersion: 'skiperator.kartverket.no/v1alpha1',
    kind: 'Application',
    metadata: {
      name: 'test-app',
    },
  },
  objects: [] // ekstra Kubernetes-ressurser legges her
}
```
**NB!** application-feltet kan også inneholde et SKIPJob objekt.

## Hovedtemaer

### Når bør du bruke AppAndObjects
- Når du vil knytte applikasjonen din til én eller flere relaterte ressurser (for eksempel Azure AD, ConfigMap, ExternalSecret) uten å koordinere navn, secrets og policies manuelt.
- Når du ønsker en konsistent måte å legge til og fjerne integrasjoner på, slik at relevant konfigurasjon følger med automatisk.
### Når trenger du ikke å bruke AppAndObjects
- Når du skal ha en enkel applikasjon uten tilleggsressurser (men AppAndObjects kan godt brukes her også)

### Konseptuell modell
**Wrapper-objektet**
- AppAndObjects representerer applikasjonen som et wrapper-objekt med to felter: `application` og `objects`.
- `application` er selve applikasjonsobjektet (Skiperator Application eller SKIPJob).
- `objects` er en liste med tilleggsressurser som hører til applikasjonen (for eksempel AzureAdApplication, ConfigMap, ExternalSecret).

**Utvidelser med** `.with*`
- `.with*`-funksjoner utvider modellen ved å oppdatere `application` og samtidig legge til matchende ressurser i `objects` der dette er relevant.
- Referanser som f.eks. secrets og policies koordineres i samme operasjon for å redusere feil og duplisering.

**Transformasjon ved rendering**
- Ved rendering transformeres wrapper-objektet til en Kubernetes `List` med `application` og alle elementer i `objects` som separate `items`
- Dette gjør at du kan “applye” hele applikasjonen med tilhørende ressurser i én operasjon.


AppAndObjects funksjoner bruker `.with` prefiks som betyr at du har en
applikasjon *med* noe ekstra. For eksempel `.withAzureAdApplication`.
Se eksempelet under for hvordan dette ser ut i praksis:

## Eksempel med Azure AD Application
Si at du ønsker å legge til Azure AD i applikasjonen din, da er det et par ting du må gjøre:
1.	Lage AzureAdApplication-ressursen
2.	Sette access policies i applikasjonen som skal bruke AD
3.	Sette secret
Uten AppAndObjects må du koordinere navn/namespace/secret manuelt. Med AppAndObjects håndteres dette av `.withAzureAdApplication`.

### Uten App And Objects
Her definerer vi først en ny Skiperator Application med tilhørende access policies for Microsoft, i tillegg til å legge inn env fra secret som matcher Azure AD Application.
Deretter definerer vi en ny AzureAdApplication-ressurs med matchende name og secretPrefix som i steget over.
```jsonnet
local argokit = import '../jsonnet/argokit.libsonnet';
local application = argokit.application;

[
  application.new('foo-backend')
  + application.withOutboundHttp('login.microsoftonline.com')
  + application.withSecret('foosecrets-foo-ad'),

  argokit.azureAdApplication.new(
    name='foo-ad',
    namespace='foo-team-main',
    secretPrefix='foosecrets',
  ),
]
```

### Med App And Objects
Når vi har AppAndObjects-abstraksjonslaget kan vi først definere en applikasjon, deretter kalle
`.withAzureAdApplication` på dette objektet.
Det vil gjøre to ting: opprette et AzureAdApplication-objekt, helt likt som i eksempelet over, og legge det til i `objects`-lista.
Deretter vil access policies og env fra secret bli satt med riktig navn.
Fordelen er at all konfigurasjon som trengs for å legge til Azure AD i applikasjonen din, er bakt inn i `.withAzureAdApplication()`,
så du slipper å tenke på det. Det vil også føre til at dersom du bytter ut/fjerner Azure AD, kan du fjerne ett funksjonskall, så vil annen sammenhengende konfigurasjon også bli fjernet.

```jsonnet
local argokit = import '../jsonnet/argokit.libsonnet';
local application = argokit.appAndObjects.application; // bruk appAndObjects

application.new('foo-backend')
+ application.withAzureAdApplication(
  name='foo-ad',
  namespace='foo-team-main',
  secretPrefix='foosecrets',
)
```
