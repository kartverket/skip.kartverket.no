---
sidebar_position: 9
---

# Bruk av Helm

Helm er et verktøy for å deklarativt definere en applikasjon og deres påkrevde
kubernetes-ressurser via såkalte Helm charts. Disse filene kan være templates
som kan inneholde dynamiske elementer som kan overstyres ved behov. For eksempel
kan det tenkes at man installerer en applikasjon via en Helm chart og overstyrer
URL-en den blir eksponert på via en variabel i et sett av values.yml-filer hvor
hver fil inneholder forskjellige verdier for respektivt test og prod. Det finnes
samlinger av Helm charts hvor man kan få tak i ferdige charts, for eksempel for
mysql eller annet mye brukt programvare slik at man slipper å skrive chartet
selv og kan kun instansiere det med values. Et eksempel på et slikt sted er det
offisielle https://artifacthub.io.

En av fordelene med å bruke Helm kontra å sette opp manuelt med kommandolinjen
eller bruke rene kubernetes-filer er at man kan enkelt gjenskape et miljø dersom
det skulle være behov, for eksempel ved rollback eller når man skal sette opp et
nytt cluster. Dersom man sjekker inn alle Helm charts i et git repo kan man også
følge bransjestandarden GitOps.  Tanken bak dette er at ressursene ligger
tilgjengelig i et repo og vil da inneholde en sporbar historikk over alle
endringer som har skjedd med clusteret.  Dette repoet kan så overvåkes for
endringer og automatisk sørge for at clusterene holdes i synk med det som ligger
i Git. Da har man kontinuerlig utrulling for applikasjonsinfrastrukturen og
etterlever GitOps-tankegangen fullt ut. Dette står i sterk kontrast til ad-hoc
løsninger hvor man manuelt kjører skripter og kommandolinjeverktøy for å sette
opp infrastruktur, noe som ofte fører til configuration drift.

Man kan også rulle tilbake Helm charts ved behov, for eksempel om konfigurasjon
ble rullet ut og at noe sluttet å fungere. Da kjører man `helm rollback` og får
rullet tilbake til en tidligere versjon.

[Installer helm her](https://helm.sh/docs/intro/install/).

Les [Helm chart template
guide](https://helm.sh/docs/chart_template_guide/getting_started/) for å komme
i gang med å skrive charts.
