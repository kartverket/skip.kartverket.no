# Egress IP-adresser fra SKIP

Når applikasjoner som kjører på SKIP gjør utgående kall til tjenester utenfor Kartverket (over internett), vil trafikken komme fra spesifikke IP-adresser avhengig av hvilket miljø applikasjonen kjører i.

Info hentet fra følgende confluence:
- https://kartverket.atlassian.net/wiki/spaces/SKIP/pages/573046857/GCP-Nettverk
- https://kartverket.atlassian.net/wiki/spaces/SKIP/pages/322896033/IP-adresser

## IP-adresser for utgående trafikk over internett

### On-prem miljøer

For applikasjoner som kjører i on-prem miljøene (atkv3-sandbox, atkv3-dev, atkv3-prod) vil utgående trafikk over internett komme fra `159.162.102.1/32`.
Denne IP-adressen er SNAT IP-en som brukes for egress trafikk fra atkv3-miljøene.


### GCP miljøer (atgcp1)

For applikasjoner som kjører i GCP-miljøene (atgcp1) vil utgående trafikk over internett komme fra følgende IP-adresser avhengig av miljøet:

| Miljø | Egress IP (Cloud NAT) |
|-------|----------------------|
| **dev** | 34.88.69.201/32 |
| **prod** | 35.228.20.196/32 |
| **sandbox** | 34.88.71.194/32 |

Disse IP-adressene er Cloud NAT IP-er som brukes for egress trafikk fra GCP-miljøene.


## Når trenger du disse IP-adressene?

Disse IP-adressene er relevante når:

- Du skal kalle en ekstern tjeneste som krever at du whitelister IP-adresser for å kunne nå dem
