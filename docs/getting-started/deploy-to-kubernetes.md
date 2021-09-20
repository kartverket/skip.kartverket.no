---
sidebar_position: 1
---

# Deploye til Kubernetes

I GitLab Agent-oppsettet er det en agentprosess som ligger i clusteret og lytter
på en angitt liste med repoer som inneholder manifestfiler. Hver gang den fanger
opp et nytt manifest (eller endring i eksisterende manifest), gjør den en
automatisk deployment basert på nevnte manifestfil.

Vi har et felles repo for manifestfiler og utrulling til devtest under
https://gitlab.statkart.no/skip/devtest-deploy. Dersom man ikke ønsker å bruke
dette felles-repoet kan man opprette et eget repo og be om å få lagt til dette
i listen over repoer som agenten lytter på. **Merk at et slikt repo må være
public for at agenten skal kunne få tilgang.**

Med andre ord er det en nokså enkel prosess å rulle ut et nytt eller oppdatert
deployment: lag en merge request inneholdende endringene på nevnte
devtest-deploy prosjekt (eller eget public manifest-repo), så vil det rulles ut
så fort endringene er godkjent og merget inn.

Eksempel på manifestfil her:
[Eksempel på Kubernetes manifestfil](kubernetes-manifests#enkel-eksempelfil)
