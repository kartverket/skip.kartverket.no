---
sidebar_position: 1
---

# Introduksjon

Velkommen som bruker av SKIP!

Målet med SKIP er å skape en platform som kan danne grunnlaget for en
fremtidsrettet platform som alle avdelinger i Kartverket kan ta i bruk for sine
IT-prosjekter. Platformen skal legge opp til at anerkjente best practices blir
bygget inn i arbeidsflyten, noe som fører til en sikrere, enklere og mer
standardisert utvikling- og driftsopplevelse for alle ansatte.

SKIP er bygget på Kubernetes, en bransjestandard for å kjøre containers. Målet
med å bruke Kubernetes er at det skal bli lett å ta i bruk best practices som
CI/CD og muliggjør nye designmønster som mikrotjenester og sky-native tankegang.
Platformen vil i bakgrunnen sørge for at applikasjonen skalerer ved behov og
sørge for at applikasjonene restartes ved ustabilitet.

Kubernetes-platformen vår er bygget på vSphere med Tanzu, noe som gjør at
platformen er integrert med VMWare-clusteret vårt. På sikt er det mulig vi
flytter clusteret ut i en skyplatform, og da blir det nok noe annerledes.

Per nå jobber prosjektet på en Thinnest Viable Platform (TVP)-strategi hvor vi
begrenser ned omfanget av prosjektet til å levere kun det som er strengt
nødvendig for å kunne kjøre applikasjoner i produksjon. Årsaken til dette er for
det første at dette er et ekstremt komplisert domene og vi ønsker å ta de
riktige avgjørelsene slik at vi går så sakte som mulig frem for å ivareta
fremtiden til applikasjonen best mulig. På en annen side ønsker vi jo å levere
verdi raskest mulig, derfor begrenser vi omfanget med det mål å få applikasjoner
i produksjon på SKIP raskest mulig. Du kan lese mer om hva TVP innebærer under
"Roadmap"-menypuntet øverst.
