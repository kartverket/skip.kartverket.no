# Nettverkstesting


## Bruk

De ulike `test`-kommandoene vil kjøres mot en API-server. Kjør `skipctl test ping --api-server=something` for å få en liste over støttede API-servernavn.
En API-server representerer et sted som kan kjøre tester fra sitt perspektiv. All kommunikasjon med API-servere er kryptert over TLS.

> :exclamation: Før du kjører noen kommandoer, må du sørge for å være autentisert først (`gcloud auth application-default login`).

### Ping
Sjekker om en server svarer på ping (ICMP), sett fra nettverksplasseringen til API-serveren.
```shell
skipctl test ping --hostname=kv-vm-0123.statkart.no --api-server=atkv3-dev
```

### Port probe
Sjekker om en server har en åpen port, dvs. at det er mulig å kommunisere med denne serveren fra miljøet som API-serveren lever i.
```shell
skipctl test probe --hostname=kv-vm-0123.statkart.no --port=5432 --api-server=atkv3-dev
```
