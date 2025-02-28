# End-user IP-Addresses in Containers

To forward end-user IP-Addresses to a kubernetes container running spring boot, you need to add the following line to your configuration:

```java
server.forward-headers-strategy=NONE
```

After testing, we found that this setting should be “NONE”.

[Running spring Behind a Front-end Proxy Server](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.webserver.use-behind-a-proxy-server)

[Spring server.forward-headers-strategy NATIVE vs FRAMEWORK](https://stackoverflow.com/questions/68318269/spring-server-forward-headers-strategy-native-vs-framework)
