---
sidebar_position: 3
---

# Roadmap

## Thinnest viable platform for SKIP

Følgende tooling har vært tenkt som en del av TVP for produksjonsbruk.

| Kildekodekontroll                              | Gitlab                | Oppe                               |                                                                                                            |
| ---------------------------------------------- | --------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| CI/CD                                          | Gitlab                | Pågående                           | Registrerer saker fortløpende i eget issue-board                                                           |
| Applikasjonsversjonering                       | Helm                  | Oppe                               |                                                                                                            |
| Secret-management                              | Hashicorp Vault       | Pågående                           | Har vært litt problemer med bruk av Vault i DSA. Manuell registrering av kubernetes-secrets som workaround |
| Intern provisjonering av DNS                   | External DNS          | Oppe                               |                                                                                                            |
| Logging av Tools-cluster                       | ELK (Logzilla)        | Oppe                               |                                                                                                            |
| Monitorering av tools-cluster                  | Prometheus og Grafana | Oppe                               |                                                                                                            |
| Logging av applikasjoner på plattform          | ELK                   | Pågående                           | Stort behov for dette blant pilotteamene                                                                   |
| Innsyn i clustre                               | Botkube               | Pågående                           | Stort behov for dette blant pilotteamene                                                                   |
| Image-registry og sikkerhetsscanning           | Harbour               | Oppe                               |                                                                                                            |
|                                                |                       |                                    |                                                                                                            |
| Service Mesh                                   | Analyse               | Ikke startet                       |                                                                                                            |
| Metrikker for applikasjoner                    | Analyse               | Ikke startet                       |                                                                                                            |
| Verktøy for IaC                                | Terraform             | Såvidt startet                     |                                                                                                            |
|                                                |                       |                                    |                                                                                                            |
| Sikkerhetsscanning av tredjepartsavhengigheter | Owasp Dep. Track      | Ikke startet (finnes utenfor SKIP) |                                                                                                            |
| Pen.testing for applikasjoner                  | Owasp Zap             | Ikke startet (finnes utenfor SKIP) |                                                                                                            |
| Statisk kodeanalyse                            | SonarQube             | Ikke startet (finnes utenfor SKIP) |                                                                                                            |
