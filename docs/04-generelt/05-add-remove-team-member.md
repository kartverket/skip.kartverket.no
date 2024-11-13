# Legge til eller fjerne personer fra et team

:::info
**Merk:** Dette gjelder for team som har Entra ID-grupper som starter med `AAD - TF - TEAM`. Hvis dette ikke gjelder ditt team, les kapittelet lenger ned for å bestille en endring for å få selvbetjent aministrasjon av Entra ID-grupper.
:::

Det vil ofte forekomme tilfeller hvor personer går inn eller ut av et produktteam. Dette kan for eksempel være om man har fått en nyansatt som skal inn eller en konsulent som har skiftet over til et annet team. I disse tilfellene har man tradisjonelt vært avhengig av at dette håndteres som en bestilling og derfor er en tidkrevende prosess å gi nye teammedlemmer tilganger, noe som fører til treghet i onboarding.

På SKIP har vi delegert tilganger til team lead på hvert team slik at disse personene kan administrere sine grupper i Entra ID. Disse gruppene er de som brukes for å gi tilgang til tjenester på SKIP slik at et medlem av disse gruppene automatisk får tilgang til SKIP-tjenester som Google Cloud og Kubernetes. Med andre ord er det produktteamene sitt ansvar å holde sine team oppdatert, og av sikkerhetsmessige hensyn forventes det at dette gjøres. Det kan bli utført kontroll av dette i ettertid, så det forventes at team på SKIP har rutiner og sjekklister for offboarding av teammedlemmer.

![List of group members in an Entra ID group](images/entra-group-members.png)

For å legge til eller fjerne et teammedlem må team leaden på teamet (eller personen som har fått team lead ansvar) gå til [Entra ID](https://entra.microsoft.com/#view/Microsoft_AAD_IAM/GroupsManagementMenuBlade/~/AllGroups/menuId/AllGroups) . Her finner man sin gruppe ved å søke etter `TF - AAD - TEAM - mitt_teamnavn` (bytt ut mitt_teamnavn med ditt teamnavn). Klikk deg inn på dette og du vil finne **Members** i sidemenyen til venstre. Etter du har klikket deg inn der bør du se et skjermbilde som ligner på det over. Her ser du alle som ligger i team-gruppen deres og i kraft av det har fått tilganger til det en person på deres team skal ha.

Du vil også se at det ligger tre grupper øverst i denne listen. Dette er grupper for personer med henholdsvis produkteier-, team lead- og tech lead-ansvar. Disse skal ligge der og det forventes også at dere fyller ut disse med de enkeltpersonene som skal ha disse ansvarsområdene.

Dersom du er logget inn som team lead vil **Add members**-knappen øverst være mulig å klikke på. Dersom du vil legge til et nytt teammedlem klikker du på denne og søker opp den personen du ønsker å legge til. Etter dette bekreftes vil denne personen legges i gruppen og etter litt tid få de tilgangene som forventes.

For å fjerne (offboarde) et teammedlem krysser du av i firkanten ved siden av bildet på brukeren og klikker **Remove**. Dette er også noe som kun team lead kan gjøre.

## Mitt team ønsker tilgang til selvbetjente team-grupper

Dersom du ikke har tatt i bruk de nye gruppene enda, vil det kreves noe jobb for SKIP å flytte tilganger fra de gamle `CLOUD_SK`-gruppene til `TF - AAD - TEAM`-gruppene. Dette er noe SKIP må gjøre, så ta kontakt med oss for å gjennomføre disse endringene.

Ta kontakt med SKIP i [#gen-skip](https://kartverketgroup.slack.com/archives/C028ZEED280) for å få oppgradert til selvbetjente grupper.

Først må det bekreftes at gruppen som skal oppgraderes eksisterer. Søk etter den i [Entra ID](https://entra.microsoft.com/#view/Microsoft_AAD_IAM/GroupsManagementMenuBlade/~/AllGroups/menuId/AllGroups) . Hvis den ikke finnes er ikke teamet onboardet på SKIP riktig og må legges inn i [entra-id-config](https://github.com/kartverket/entra-id-config).

Nå må gruppene som gis tilgang i `skip-core-infrastructure`-repoet (tidligere `IAM`) byttes over fra `CLOUD_SK`-gruppene til `TF - AAD`-gruppene. Dette gjøres i [teams-modulen](https://github.com/kartverket/skip-core-infrastructure/blob/main/dynamic/env/teams/modules.tf#L187). Stort sett er det bare å endre fra en e-post til en annen slik at man ender opp med de nye `aad-tf`-gruppene. Dette vil være litt problematisk dersom teamet bruker `locals.teams`-abstraksjonen, så der bør noe skrives om for å støtte `TF - AAD`-grupper i tillegg til de gamle “CLOUD_SK”-gruppene.

Etter IAM er oppdatert og kjørt må gruppene som gis tilgang til Argo CD oppdateres. Dette gjøres i [argocd.libsonnet](https://github.com/kartverket/skip-apps/blob/main/lib/argocd/argocd.libsonnet). Finn UUID-en fra teamet i [Entra ID](https://entra.microsoft.com/#blade/Microsoft_AAD_IAM/GroupsManagementMenuBlade/menuId/AllGroups) og kopier Object ID inn. Deretter må argocd-apps synkes ut i alle miljøer.

Etter dette skal teamet være byttet over til det nye oppsettet. Spør teamet om de fortsatt har tilgangene de forventer. Merk at det kan ta noe tid før tilgangene er ordentlig inne, så om det ikke funker med en gang, alt ser riktig ut og alt er kjørt kan det lønne seg å prøve igjen etter litt tid.
