# Sikkerhetsscanning med Pharos

[Pharos](https://github.com/kartverket/pharos) er en GitHub action som forenkler statisk skanning av konfigurasjon og container images.

Det er anbefalt å skanne images minst en gang i døgnet og ved bygging av images fra hovedbranchen.

For å få Pharos-oppdateringer automatisk er det anbefalt å sette opp [Dependabot](../07-github/06-dependabot.md).

## Eksempler

### Kjør skannere en gang i døgnet

Scanning en gang i døgnet kan se ut som eksempelet under. Merk at `matrix` er brukt for å scanne flere images i parallel, men det er ikke nødvendig for repoer med kun ett image:

```yaml
name: Sikkerhetsscanning av images

on:
  schedule:
    - cron: '00 5 * * *'  # 05:00 UTC each day. 

env:
  registry: ghcr.io

jobs:
  pharos:
    name: Run Pharos
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false    # De andre jobbene i matrisen vil kjøre selv om en av dem feiler
      matrix:
        package-name: [ 'image1', 'image2', 'image3', 'image4' ]

    # Permissions påkrevd av pharos
    permissions:
      actions: read
      packages: read
      contents: read
      security-events: write

    steps:
      - name: Run Pharos
        uses: kartverket/pharos@v0.2.5
        with:
          trivy_category: ${{ matrix.package-name }}
          image_url: ${{ env.registry }}/${{ github.repository_owner }}/${{ matrix.package-name }}:latest

```

### Kjør skannere for hver gang et nytt image bygges

Det er lurt å skanne images ved hvert push til hovedbranchen. Da må imaget pushes først, og så kan det skannes av Pharos. Det er anbefalt å kjøre scanning for push til hovedbranchen, og ikke ved f.eks. push til tag. Om scanning kjøres ved push til hovebranchen for repoet blir "Code scanning"-oversikten blir intuitiv og resultatene dukker også opp i sikkerhetsmetrikkerverktøyet i [Utviklerportalen](https://kartverket.dev/).

```yaml
on:
  push:
    branches:
      - main

env:
  image_name: ghcr.io/${{ github.repository }} # ghcr.io/kartverket/repo-name

jobs:
  build:
    steps:
      # Most steps skipped for brevity
      - name: Build and push container image
        id: build-image
        uses: docker/build-push-action@v6
        with:
          push: true # Image must be pushed before scanning
          tags: ${{ env.image_name }}:latest
          # Remaining properties skipped for brevity

    outputs:
      image_digest: ${{ steps.build-image.outputs.image_digest }}

  run-pharos:
    name: Run Pharos
    runs-on: ubuntu-latest
    # Only run on pushes to default branch
    if: github.event_name == 'push' && github.ref_name == github.event.repository.default_branch
    permissions:
      actions: read
      packages: read
      contents: read
      security-events: write
    steps:
      - name: "Run Pharos"
        uses: kartverket/pharos@v0.2.5
        with:
          image_url: ${{ env.image_name }}@${{ needs.build.outputs.image_digest }}
```

## Konfigurasjon av skannere

Konfigurasjonsskanning gjøres automatisk om det ikke skrus av. Da vil bl.a. `Dockerfile` og Terraform-kode skannes. Skanning av container images gjøres automatisk om `image_url` er spesifisert.

Workflowen vil feile om sårbarheter vurdert som `high` eller `critical` finnes. Dette kan konfigureres enten ved å sette `allow_serverity_level` til `high` eller `critical`, eller med å sette `disable_serverity_check` til false.

For mer informasjon, se på [dokumentasjonen for konfigurerbare inputs](https://github.com/kartverket/pharos?tab=readme-ov-file#inputs).
