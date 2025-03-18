import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 📝 Klientregistrering

For å ta i bruk Microsoft Entra ID for tilgangsstyring, så må du først opprette en app-registrering i Entra ID.
Det kan du enkelt gjøre med [Azureator](01-azureator.md).

<Tabs>
  <TabItem value="Entra ID" label="Microsoft Entra ID">
    For å registrere en klient i Microsoft Entra ID:
    1. Gå til Azure AD-portalen.
    2. Opprett en ny app-registrering.
    3. Konfigurer tillatelser og sertifikater.
  </TabItem>
  <TabItem value="IDPorten" label="IDPorten">
    For å registrere en klient i IDPorten:
    1. Gå til Digdir sin selvbetjeningsportal.
    2. Opprett en ny klient.
    3. Konfigurer redirect-URIer og tilgangsrettigheter.
  </TabItem>
  <TabItem value="Maskinporten" label="Maskinporten">
    For å registrere en klient i Maskinporten:
    1. Opprett en virksomhetssertifikat.
    2. Send inn registreringsforespørsel til Digdir.
    3. Konfigurer tilgangsnivåer for API-bruk.
  </TabItem>
</Tabs>