---
sidebar_position: 2
---

# GitLab-byggeløyper
## Generelt

GitLab-byggeløyper opprettes ved å legge til en fil med navn .gitlab-ci.yml (NB!
merk innledende punktum) i prosjektets rotkatalog.

Dokumentasjon av syntaksen man bruker finnes her: https://docs.gitlab.com/ee/ci/

Denne siden tar for seg en migrasjonsprosess fra Jenkins-byggeløyper og over
i GitLab.

I motsetning til Jenkins er det bare 1 pipeline-fil per prosjekt. Denne filen
inneholder definisjon på alle jobber som skal kjøres i prosjektet når en fil
sjekkes inn. Individuelle jobber kan settes opp til å kun kjøres under gitte
omstendigheter, til gitte tider, osv.

Hver pipeline deles inn i "Stages" og "Jobs". Hvert stage kan inneholde 1 eller
flere jobber, men hver jobb kan bare inngå i 1 stage. Stages er blant annet
nyttig for å holde styr på parallellisering og sekvensielle jobber - alle jobber
i en gitt stage kjører parallellt, så dersom man er avhengig av et sekvensielt
byggforløp (eks. build → test → publish → deploy), vil man typisk dele disse opp
i 4 stages som kjøres sekvensielt - men f.eks. test-stage kan parallelliseres
dersom man har flere ulike testjobber, slik som sikkerhetsscanning, statisk
analyse osv.

Rekkefølgen på stages (og eventuelle ekstra stages utover de som GitLab har
definert som standard - build, test, deploy) defineres slik i begynnelsen av
pipelinescriptet:

```yaml
stages:
 - build
 - test
 - publish
```

### Variabler

Variabler(eksempelvis brukernavn/token til Harbor-registry, http proxy etc.) kan
settes som CI/CD-variabler, enten på prosjektnivå eller gruppenivå. Variabler på
gruppenivå vil da være tilgjengelige for alle prosjekter i gruppen.

Variabler kan også gjøres tilgjengelig for hele GitLab-instansen av
administratorer dersom dette skulle være aktuelt.

Variabler kan settes opp til å maskeres i output, og også settes opp til å kun
deles med "protected" branches dersom dette er ønskelig.

For å legge til en variabel, klikk "Settings" i menyen til høyre
i GitLab-prosjektet eller gruppen du ønsker, og velg "CI/CD". Trykk så på
"Expand" under Variables-seksjonen, og klikk på "Add Variable".


### Mellomlagring, caching og artefakter

Man kan få byggeforløpet til å gå raskere ved å gjenbruke pakker, artefakter
etc. på tvers av jobber.

Dette kan oppnås ved hjelp av bruk av nøkkelordene "cache" og "artifacts".

Cache kan brukes for dependencies som lastes ned fra nettet - pakker,
biblioteker og den slags.

Artifacts kan brukes for å videresende midlertidige byggeartefakter (eks.
jar-filer) mellom stages.

Artifacts kan også tilgjengeliggjøres i etterkant dersom det er hensiktsmessing,
eksempelvis testrapporter som man jo ønsker å kunne lese i etterkant av en
fullført pipeline.

Les mer om forskjellen på bruk av cache og artifacts, samt utvidet dokumentasjon
her:

https://docs.gitlab.com/ee/ci/caching/

https://docs.gitlab.com/ee/ci/pipelines/job_artifacts.html

### Images

GitLab bruker "runnere" for å kjøre bygg. Disse tilsvarer Jenkins-byggenoder,
med en viktig forskjell: de spinnes opp i Kubernetes hver gang et bygg starter,
og har ingenting forhåndsinstallert.

Nøkkelordet "image:" brukes for å definere hva som skal være tilgjengelig i en
slik runner - dette er rett og slett docker-imaget man vil at runneren skal
startes med.

Trenger man Gradle, npm osv. kan dette altså løses ved å bruke et image med
dette forhåndsinstallert.


### Templates

Templates er forhåndsdefinerte jobber/stages m.m. som man kan importere inn
i pipelinescriptet sitt ved hjelp av et include-nøkkelord i begynnelsen av fila.

Eksemplevis vil et template kalt SAST.gitlab-ci.yml være noe vi ønsker de fleste
pipelines tar med, det gjennomfører bl.a. statisk sikkerhetstesting og scanning
av kode.

Man kan lage sine egne templates for å samle felles funksjonalitet som flere
pipelines brukes på samme sted, se
https://docs.gitlab.com/ee/development/cicd/templates.html for artikler knyttet
til utvikling av egne templates.


:::caution Obs! Ved bruk av SAST-template må du sørge for følgende:

- Ved bruk av gradle-wrapper må den være merket som eksekverbar. Kjør kommandoen
  git update-index --chmod=+x gradlew , commit og push.
- Dersom prosjektet benytter en annen java-versjon enn 8, må det settes en CI/CD
  variabel på prosjekt-eller gruppenivå kalt SAST_JAVA_VERSION med verdi lik
  java-versjonen man bruker (eks. 11 hvis man bruker java 11).

:::


## Bygging/testing

Byggesteg foregår ved hjelp av en eller flere bash-kommandoer under nøkkelordet
"script".

```yaml
script:
  - echo "Dette er et enkelt byggescript"
  - gradle assemble
```

GitLabs standard er at bygging og testing foregår i separate jobber - dette er
imidlertid retningslinjer, ikke tvang, så det kan tilpasses ut fra egne behov.


## Publisering

Publisering av Docker-images skal skje ved hjelp av Kaniko buildpack, dette for
å unngå Docker-in-Docker på GitLab-runnere med medfølgende privilegerte
containere, som er en potensiell sikkerhetsrisiko.

For å publisere et Docker-image til Harbor (vårt foretrukne container-registry)
må man ha opprettet et prosjekt og en robot-bruker for prosjektet man kan logge
seg inn med (se egen dokumentasjon for dette her).

Robot-brukernavn og token legges så inn som CI-variabler på gruppenivå som
beskrevet ovenfor i seksjonen om variabler. I eksempelet har vi brukt
HARBOR_USERNAME og HARBOR_TOKEN som navn på disse.


```yaml
publish:
  stage: publish
  image:
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: [""]
  script:
    - mkdir -p /kaniko/.docker
    - |-
      KANIKOPROXYBUILDARGS=""
      KANIKOCFG="{ \"auths\":{\"$HARBOR_URL\":{\"username\":\"$HARBOR_USERNAME\",\"password\":\"$HARBOR_TOKEN\"}}"
      if [ "x${http_proxy}" != "x" -o "x${https_proxy}" != "x" ]; then
        KANIKOCFG="${KANIKOCFG}, \"proxies\": { \"default\": { \"httpProxy\": \"${http_proxy}\", \"httpsProxy\": \"${https_proxy}\", \"noProxy\": \"${no_proxy}\"}}"
        KANIKOPROXYBUILDARGS="--build-arg http_proxy=${http_proxy} --build-arg https_proxy=${https_proxy} --build-arg no_proxy=${no_proxy}"
      fi
      KANIKOCFG="${KANIKOCFG} }"
      echo "${KANIKOCFG}" > /kaniko/.docker/config.json
    - cat /kaniko/.docker/config.json
    - /kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile $KANIKOPROXYBUILDARGS --destination harbor.statkart.no/example/gitlab-demo:$CI_COMMIT_TAG

  only:
    refs:
      - master
  except:
    - tags
  dependencies:
    - build
```


## Release

GitLab har et konsept i forhold til kode som kalles "release". Dette er et
snapshot av all kode og andre relevante artefakter slik det så ut ved tidspunkte
releasen ble opprettet. Den kan tenkes på som en slags git tag med utvidede
muligheter for å inkludere dokumentasjon osv.

Les mer her: https://docs.gitlab.com/ee/user/project/releases/


## Komplett løype


Eksempel på en komplett pipeline som bygger, tester, publiserer og lager en
release:

```yaml
include:
  - template: Security/SAST.gitlab-ci.yml # for å få med automatiske jobber for sikkerhetskontroll av kode osv.

# Definer alle jobber som må kjøre sekvensielt her, ellers blir de kjørt i parallell
stages:
  - build
  - test
  - publish
  - release

variables:
  FF_GITLAB_REGISTRY_HELPER_IMAGE: 1
build:
  image: gradle:jdk11
  variables:
    GRADLE_OPTS: "-Dorg.gradle.daemon=false"
  before_script:
    - export GRADLE_USER_HOME=`pwd`/.gradle
  stage: build
  script:
    - gradle assemble
    - echo "PROJECT_VERSION=$MAJOR_VERSION.$MINOR_VERSION.$CI_JOB_ID" > build.env # bruk build-jobbens unike id som utgangspunkt for patch-delen av semver-versjonstagg
  cache:
    key: "$CI_COMMIT_REF_NAME" # cache artefaktet som er bygd slik at vi kan bruke det til å kjøre tester og eventuelt pakke inn i docker-image
    policy: push
    paths:
      - build/
      - .gradle/
  artifacts:
    paths:
      - build/
    reports:
      dotenv: build.env # dette er for å kunne dele variabler mellom byggejobber, i dette tilfellet versjonsnummer
  except:
    - tags # ikke kjør denne jobben når man sjekker inn en tag


test:
  image: gradle:jdk11
  variables:
    GRADLE_OPTS: "-Dorg.gradle.daemon=false"
  before_script:
    - export GRADLE_USER_HOME=`pwd`/.gradle
  stage: test
  script:
    - echo "This is where the testing is done"
    - gradle test # eksempel-templaten bruker check istedenfor test, kan evt vurdere hva dette har å si
  cache:
    key: "$CI_COMMIT_REF_NAME" # hent ferdigbygd artefakt fra cache
    policy: pull
    paths:
      - build/
      - .gradle/
  artifacts:
    when: always
    reports:
      junit: build/test-results/test/**/TEST-*.xml #riktig filsti til testrapporten er viktig
  except:
    - tags




publish:
  stage: publish
  image:
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: [""]
  script:
    - mkdir -p /kaniko/.docker
    - |-
      KANIKOPROXYBUILDARGS=""
      KANIKOCFG="{ \"auths\":{\"$HARBOR_URL\":{\"username\":\"$HARBOR_USERNAME\",\"password\":\"$HARBOR_TOKEN\"}}"
      if [ "x${http_proxy}" != "x" -o "x${https_proxy}" != "x" ]; then
        KANIKOCFG="${KANIKOCFG}, \"proxies\": { \"default\": { \"httpProxy\": \"${http_proxy}\", \"httpsProxy\": \"${https_proxy}\", \"noProxy\": \"${no_proxy}\"}}"
        KANIKOPROXYBUILDARGS="--build-arg http_proxy=${http_proxy} --build-arg https_proxy=${https_proxy} --build-arg no_proxy=${no_proxy}"
      fi
      KANIKOCFG="${KANIKOCFG} }"
      echo "${KANIKOCFG}" > /kaniko/.docker/config.json
    - cat /kaniko/.docker/config.json
    - /kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile $KANIKOPROXYBUILDARGS --destination harbor.statkart.no/example/gitlab-demo:$CI_COMMIT_TAG

  only:
    refs:
      - master
  except:
    - tags
  dependencies:
    - build



release: # Lager en release som samler "evidence" (kildekode etc) på ett sted og sjekker inn en git tag i koderepoet
  image: registry.gitlab.com/gitlab-org/release-cli
  stage: release
  script:
    - echo "Release stage"
    - echo $PROJECT_VERSION
  release:
    tag_name: $PROJECT_VERSION
    description: "Gitlab demo"
  only:
    refs:
      - master
  except:
    - tags
  dependencies:
    - build
```

