---
sidebar_position: 8
---

# Oppsett og bruk av Vault

Databasepassord må ikke sjekkes inn i kode repository. Dette gjelder ikke bare
databasepassord, men det meste som man ikke vil skal være allment tilgjengelig.
SKIP platformen løser dette ved å ta i bruk Hashicorp Vault, et system for
å lagre, sikre og kontrollere tilgang til hemmeligheter.

For å få dette til å virke er det en del konfigurasjon som må gjøres, og det kan
være det er litt annerledes å jobbe med i utviklingsmiljø lokalt i forhold til
SKIP platformen.

## Legge inn secret

Det første skrittet mot å forvare sikkerhetene trygt er å sjekke om du har
tilgang til Vault. Gå til https://vault.statkart.no og forsøk å logge deg inn.

Dersom du kommer inn på Vault kan du trykke på `skip_produksjon`
hemmelighetsmotoren på forsiden og så blir du presentert med tokenene som din
bruker har tilgang til. Her kan du lage en hemmelighet ved å trykke "Create
secret" øverst til høyre. Bruk denne skjermen til å fylle ut "path" til
hemmeligheten (bruk mapper for å organisere, for eksempel
`projects/yourproject/db`) og dataen hemmeligheten skal bruke.

For å senere få tilgang til denne dataen er du også avhengig av å lage en vault
token. Dette er "passordet" som applikasjonen bruker for å få tilgang til
hemmelighetene. For å generere en token, begynn med å [installere vault
CLI-et](https://learn.hashicorp.com/tutorials/vault/getting-started-install?in=vault/getting-started).
Deretter sett følgende verdi i din `~/.profile` for å

```bash
export VAULT_ADDR=https://vault.statkart.no
```

Nå kan du gå i web-grensesnittet og klikke på menyen øverst til høyre og velge
"Copy token". Dette tokenet bruker du for å logge inn med CLI.

Nå kan du kjøre følgende kommando for å logge inn og generere en token:

```bash
$ vault login -method=userpass username=<your username>
$ vault token create
```

:::info Merk
Dersom du får en feilmelding om at sertfikatet ikke er gyldig må du legge til
`-tls-skip-verify` på alle `vault` CLI-kommandoer eller
`export VAULT_SKIP_VERIFY=true` i din `~/.profile`. Sistnevnte anbefales ikke
med mindre du skal kjøre mange kommandoer mot vault.
:::

Ta vare på tokenet som ble generert og bruk det når du confer opp applikasjonen
din.

:::warning Obs!
Pass på at tokenet ikke blir eksponert noe sted det ikke skal være, behandle
tokenet som et passord.
:::


## Hente ut secret

Det er flere måter å hente ut secrets på, det de alle har til felles er at de
bruker applikasjonens "Vault Token" for å autentisere seg mot Vault. Måten dette
gjøres er å sende det med på spørringen som en header, noe man kan se på
eksempelet under som demonstrerer hvordan man kan hente ut secrets med en enkel
HTTP-spørring.

```bash title="Hente ut secret med HTTP"
$ curl \
  --header "X-Vault-Token: ..." \
  --request POST \
  --data @payload.json \
  https://127.0.0.1:8200/v1/secret/config
```

Men å bruke HTTP-spørringer hver gang er ikke like smidig som det kunne vært, så
det finnes bedre løsninger for dette. Eksempelvis finnes det et [Spring Cloud
Vault bibliotek](https://spring.io/projects/spring-cloud-vault). Med dette
biblioteket kan man bruke `@Value`-annotasjoner for å gjøre uthentingen av
verdier enklere.

```java {8,11,21} title="Hente ut secret med Spring Could Vault"
public class VaultDemoOrderServiceApplication  {

  private static final Logger logger = LoggerFactory.getLogger(VaultDemoOrderServiceApplication.class);

  @Autowired
  private SessionManager sessionManager;

  @Value("${spring.datasource.username}")
  private String dbUser;

  @Value("${spring.datasource.password}")
  private String dbPass;

  public static void main(String[] args) {
    SpringApplication.run(VaultDemoOrderServiceApplication.class, args);
  }

  @PostConstruct
  public void initIt() throws Exception {
    logger.info("Got Vault Token: " + sessionManager.getSessionToken().getToken());
    logger.info("Got DB User: " + dbUser);
  }
}
```

Hashicorp har også laget en demoapplikasjon hvor man kan se hvordan dette
fungerer i praksis. [Du finner applikasjonen
her](https://learn.hashicorp.com/tutorials/vault/eaas-spring-demo).
