# Nettverkstesting


## Bruk

De ulike `test`-kommandoene vil kjøres mot en API-server. Kjør `skipctl test ping --api-server=something` for å få en liste over støttede API-servernavn.
En API-server representerer et sted som kan kjøre tester fra sitt perspektiv. All kommunikasjon med API-servere er kryptert over TLS.

> :exclamation: Før du kjører noen kommandoer, må du sørge for å være autentisert først (`gcloud auth application-default login`).


### Ping

```shell
skipctl test ping --hostname=example.com --api-server=myApiServer
```

### Port probe

```shell
skipctl test probe --hostname=example.com --port=1521 --api-server=myApiServer
```
