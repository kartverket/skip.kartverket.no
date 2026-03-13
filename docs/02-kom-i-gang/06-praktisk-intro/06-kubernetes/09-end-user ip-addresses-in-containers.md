# Sluttbrukers IP-adresser i containers

For å videresende sluttbrukers IP-adresser (End-user IP-Addresses) til en Kubernetes container som kjører Spring Boot, må du legge til følgende linje i konfigurasjonen din:

```java
server.forward-headers-strategy=NONE
```

Etter testing fant vi ut at denne innstillingen bør være "NONE".

[Running spring Behind a Front-end Proxy Server](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.webserver.use-behind-a-proxy-server)

[Spring server.forward-headers-strategy NATIVE vs FRAMEWORK](https://stackoverflow.com/questions/68318269/spring-server-forward-headers-strategy-native-vs-framework)
