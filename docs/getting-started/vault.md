---
sidebar_position: 8
---

# Oppsett og bruk av Vault

Rettningslinjene for sikkerhet sier at man ikke skal

Databasepassord må ikke sjekkes inn i kode repository. Dette gjelder ikke bare
databasepassord, men det meste som man ikke vil skal være allment tilgjengelig.
SKIP platformen løser dette ved å ta i bruk Hashicorp Vault.

For å få dette til å virke er det en del konfigurasjon som må gjøres, og det kan
være det er litt annerledes å jobbe med i utviklingsmiljø lokalt i forhold til
SKIP platformen.
