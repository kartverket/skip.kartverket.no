# Valg av ACME og cert-manager for sertifikathåndtering

## Innledning

For å effektivisere og sikre prosessen med sertifikathåndtering har vi valgt å bruke ACME (Automatic Certificate Management Environment) og cert-manager. Her er hovedgrunnene til vårt valg:

## Automatisering og effektivitet

1. **Redusert risiko for utløpte sertifikater:**
   - ACME automatiserer fornyelsen av sertifikater, noe som sikrer at de alltid er gyldige og reduserer risikoen for tjenesteavbrudd på grunn av utløpte sertifikater.

2. **Minimert menneskelig feil:**
   - Ved å automatisere sertifikathåndteringen med cert-manager, reduserer vi sannsynligheten for menneskelige feil som kan oppstå ved manuell håndtering, som feilkonfigurasjoner eller glemte fornyelser.

## Forbedret sikkerhet

1. **Hyppige fornyelser:**
   - ACME muliggjør hyppigere fornyelser av sertifikater, noe som reduserer vinduet for potensielle angrep dersom et sertifikat skulle bli kompromittert.

2. **Automatisert oppdagelse og revokasjon:**
   - Cert-manager overvåker kontinuerlig sertifikatenes status og kan automatisk oppdage og revokere kompromitterte sertifikater.

## Skalerbarhet og fleksibilitet

1. **Håndtering av store volumer:**
   - Med ACME og cert-manager kan vi effektivt håndtere et stort antall sertifikater uten å øke arbeidsbelastningen på teamene. Antallet tjenester i Kartverket gjør det vanskelig å håndtere uten automasjon, eller fellessertifikater som benyttes på mange tjenester, noe som gjør de mer sårbare.

2. **Integrasjon med Kubernetes:**
   - Cert-manager integreres sømløst med Kubernetes, noe som gjør det enkelt å administrere sertifikater i våre containeriserte applikasjoner, og sikre at de alltid er oppdaterte.

## Overholdelse og beste-praksis

1. **Samsvar med industristandarder:**
   - Ved å bruke ACME og cert-manager, sikrer vi at vi overholder bransjestandarder og forskrifter som krever hyppige fornyelser og sikker håndtering av digitale sertifikater.

2. **Sentralisert kontroll og synlighet:**
   - Cert-manager gir oss en sentralisert plattform for å administrere alle våre sertifikater, noe som gir bedre kontroll og synlighet over hele sertifikatbeholdningen.

## Konklusjon

Valget av ACME og cert-manager for sertifikathåndtering gir oss en sikker, effektiv og skalerbar løsning som reduserer risikoen for menneskelige feil, forbedrer sikkerheten og sikrer samsvar med bransjestandarder. Ved å automatisere sertifikathåndteringen kan vi fokusere på strategiske initiativer og opprettholde en sterk sikkerhetsstilling.