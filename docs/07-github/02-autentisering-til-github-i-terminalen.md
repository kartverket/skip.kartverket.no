# Autentisering til GitHub i terminalen

Denne siden forklarer hvordan du setter opp og tar i bruk SSH nøkler med Git på en sikker måte for GitHub autentisering.

:::info
Denne siden antar at du bruker Linux eller Windows Subsystem for Linux (WSL)
:::

## Oppdater Git

:::warning
**Ikke hopp over dette steget** . Du finner oversikt over sårbare versjoner av git her: [https://github.com/git/git/security/advisories](https://github.com/git/git/security/advisories)
:::

Velg ditt operativsystem og følg instruksene for å installere den nyeste versjonen av Git.

- [Oppdater Git for Linux](https://git-scm.com/download/linux)
- [Oppdater Git for macOS](https://git-scm.com/download/mac)
- [Oppdater Git for Windows](https://git-scm.com/download/win)

Du kan sjekke hvilken versjon du har med denne kommandoen:

```bash
git --version
```

## Generer SSH nøkkel

Du kan velge mellom ed25519 og RSA-4096.

(det finnes flere alternativer, men disse er vurdert som akseptable)

Bruk `ssh-keygen` for å generere en ny nøkkel lokalt på din maskin. Husk å bytt ut “DINEPOST” med Kartverket eposten din (f.eks. `"jell.fjell@kartverket.no"` ).

```bash
ssh-keygen -a 50 -t ed25519 -f ~/.ssh/github -C “DINEPOST”
```

<details>
<summary>Alternativt kan du bruke RSA-4096</summary>
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github -C "DINEPOST"
```
</details>

:::warning
NB! Husk å sette passord når du blir spurt. **Ikke la passordfeltet stå tomt.**
:::

### Sett lokale rettigheter på SSH nøkkelen

SSH nøkkelen er privat for din bruker, og skal kun leses av din bruker.

```bash
chmod 600 ~/.ssh/github
```

## Legg til nøkkelen (public key) i GitHub

- Vis og kopier din public key fra~/.ssh/github.pubfra terminalen.

```bash
cat ~/.ssh/github.pub
```

Marker utskriften og kopier innholdet.

- Logg inn på GitHub.com med Kartverket kontoen din.
- Trykk på profilbildet ditt, øverst i høyre hjørne.
- Velg « **Settings** ».
- Naviger deg til « **SSH and GPG keys** » (under kategorien «Access») i venstre kolonne.
- Trykk på den grønne « **New SSH key** » knappen.
- Skriv inn en passelig tittel (f.eks. “Min private SSH nøkkel”).
- Kopier og lim inn innholdet fra~/.ssh/github.pub(ikke private key), som vist i første steg.
- Trykk på « **Add SSH key** ».
- Du skal nå se oversikten over dine nøkler, med den nye nøkkelen i listen.
- For å bruke kartverket nøkkelen må man bekrefte nøkkelen med SSO. Dette gjøres ved å trykke configure SSO på nøkkelen.

## Test nøkkelen

Du kan raskt teste nøkkelen din mot GitHub ved å kjøre:

```bash
ssh -T git@github.com -i ~/.ssh/github
```

Du skal få tilbakemelding om vellykket autentisering:

```
Hi! You've successfully authenticated, but GitHub does not provide shell access.
```

## Automatisk bruk av nøkkelen din

:::note
Det finnes flere måter å ta i bruk nøkkelen din. Dette er et eksempel på hvordan, men du står fritt til å bruke andre løsninger.
:::

Opprett filen~/.ssh/configog fyll den ut med innholdet for GitHub med nøkkelen din:

```
Host github
    HostName github.com
    User git
    IdentityFile ~/.ssh/github
```

### Ta i bruk nøkkelen når du kloner et repo

Du kan ta i bruk nøkkelen din ved å refere til `github` når du skal klone et repo. Husk å bytt ut “DITTREPO” med navnet på repoet du prøver å klone.

```
git clone github:kartverket/DITTREPO.git
```

Når du kloner repoet på denne måten vil Git automatisk ta i bruk remote med din konfigurasjon (tar automatisk i bruk nøkkelen din ved `git pull / push` ).

## Legg til navn og epost for riktig eier av commits

For at commits du gjør på din maskin skal stemme overens med GitHub brukeren din må du sette brukernavn og epost i Git. Husk å bytt ut “DITT NAVN” med github brukernavnet ditt (f.eks. “jellfjell“) og “DINEPOST” med Kartverket eposten din (f.eks. `"jell.fjell@kartverket.no"` ).

```bash
git config --global user.name "DITT NAVN"
git config --global user.email "DINEPOST"
```

<details>
  <summary>TLDR</summary>
  <p>
  For deg som ikke leste i gjennom og vil rett på sak uten forklaring.

  Oppdater Git: [https://git-scm.com/downloads](https://git-scm.com/downloads) - **IKKE HOPP OVER DETTE STEGET**

  ```bash
  ssh-keygen -a 50 -t ed25519 -f ~/.ssh/github -C “DINEPOST”
  chmod 600 ~/.ssh/github
  cat ~/.ssh/github.pub
  ```

  Kopier og lim inn public key på GitHub [https://github.com/settings/ssh/new](https://github.com/settings/ssh/new)

  ```java
  ssh -T git@github.com -i ~/.ssh/github
  git config --global user.name "DITT NAVN"
  git config --global user.email "DINEPOST"
  git clone URL --config core.sshCommand="ssh -i ~/.ssh/github"
  ```

  Nå er du klar for å begi deg ut på eventyr.
  </p>
</details>
