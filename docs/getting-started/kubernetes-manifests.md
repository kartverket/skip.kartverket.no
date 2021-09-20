---
sidebar_position: 5
---

# Kubernetes manifestfiler

## Om manifestfiler


For å deploye noe til Kubernetes trengs som et minimum en manifestfil.

Dette er en beskrivelse av hvordan den totale applikasjonen skal se ut, og kan
tenkes på som en mer avansert docker-compose fil.

Kan også bruke https://k8syaml.com/ for å generere en manifestfil, men mulig
denne må tilpasses litt avhengig av applikasjon/kjøremiljø.


Man kan, som illustrert i eksempelet, inkludere flere manifest i en og samme
fil, så lenge de er adskilt med ---. Man kan også ha flere manifestfiler.

Best practice er å samle alt som henger sammen i en og samme manifestfil, ref.
den offisielle dokumentasjonen:

> Group related objects into a single file whenever it makes sense. One file is
> often easier to manage than several. See the guestbook-all-in-one.yaml file as
> an example of this syntax.

Dersom man har en større applikasjon hvor man ønsker å fordele over flere
manifestfiler, er det uansett en fordel å samle det så mye som mulig:

> It is a recommended practice to put resources related to the same microservice
> or application tier into the same file, and to group all of the files
> associated with your application in the same directory.

## Sentrale konsepter

Her nevnes utvalgte konsepter som man kan komme over i forbindelse med
Kubernetes-API'et. En mer utfyllende liste ligger her:
https://kubernetes.io/docs/reference/kubernetes-api/

- Pod - en ansamling containere som kjører på samme host. Best practice er
  1 container per pod, bortsett fra i spesialtilfeller (initContainers etc.)
- ReplicaSet - spesifiserer minimumsantall av en gitt pod som skal kjøre til
  enhver tid. Hvis en pod i et replicaset går ned, kjøres automatisk en ny opp.
  Angis med nøkkelordet "replicas" i manifestet
- StatefulSet - som ReplicaSet, men angir at disse pod'ene skal være stateful,
  dvs at de har mer spesifikke krav til konsistens, identitet og state.
- Service - en navngitt abstraksjon av en gitt tjeneste. Kan f.eks. brukes til
  å sette opp en LoadBalancer for å gi tilgang til en applikasjon utenfra
  namespace/cluster, eller for å fasilitere kommunikasjon mellom pod'er internt.
- Labels - egendefinerte "merkelapper" man kan bruke for å skille mellom og
  referere til ulike Kubernetes-objekter. Se
  https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/

## Enkel eksempelfil

Denne eksemplefilen lager en deployment ut fra en container med navn
gitlab-demo. I tillegg setter den opp en LoadBalancer-service for å gi tilgang
utenfra (utenfra clusteret, ikke nødvendigvis utenfra Kartverks-nettet, der må
andre løsninger på plass).


Verdt å merke seg her er "securityContext". Dette beskriver enkelte
sikkerhetsbegrensninger pod'en må kjøre med. I dette tilfellet angis "runAsUser"
for at containeren skal kjøre med en angitt bruker-uid (må svare til en uid
  opprettet i Dockerfile), samt "allowPrivilegeEscalation: false" slik at
  containeren ikke kan eskalere til å kjøre som privilegert bruker.

En annen ting verdt å merke seg her er annotasjonen
external-dns.alpha.kubernetes.io/hostname på Service-objektet. Dette er en
annotasjon som plukkes opp av external-dns, og som lar deg aksessere servicen
ved hjelp av en URL. Verdien til denne må være på formatet <ønsket
navn>.test.k8s.local .

```
apiVersion: v1
kind: Namespace
metadata:
  name: example
---
apiVersion: v1
kind: Deployment
metadata:
  name: gitlab-demo
  namespace: example
spec:
  selector:
    matchLabels:
      app: gitlab-demo-pod
  replicas: 1
  template:
    metadata:
      labels:
        app: gitlab-demo-pod
    spec:
      containers:
        - name: gitlab-demo-container
          image: harbor.statkart.no/example/gitlab-demo:1.0.262
          ports:
            - containerPort: 80
          securityContext:
            runAsUser: 1242
            allowPrivilegeEscalation: false
---
apiVersion: v1
kind: Service
metadata:
  name: gitlab-demo-service
  namespace: example
  annotations:
    external-dns.alpha.kubernetes.io/hostname: gitlab-demo-app.test.k8s.local # to access the service, specify the URL you would like here on the format <name>.test.k8s.local
spec:
  selector:
    app: gitlab-demo-pod
  ports:
    - port: 80
      targetPort: 8080
  type: LoadBalancer
```

## Kommunikasjon mellom pods

TODO: oppdatere når vi har fått POCet og tatt beslutning på service mesh.

For å kommunisere mellom pods internt i applikasjonen er vi som minimum nødt til å bruke en service. Dette fordi vi aldri kan være sikker på at IP-adressen til en pod vil være den samme. Ved å bruke en service til å aksessere en gitt pod, sørger vi for at servicen holder styr på DNS og alltid blir oppdatert med ny IP dersom pod'en skulle endre seg.

Legg merke til et par nye ting her:

- Vi har introdusert en ny label kalt "tier". Dette er egendefinert, og brukes til å skille mellom flere pod'er tilhørende samme applikasjon. Hva man kaller labels eller hvordan man gjør dette er opp til hver enkelt, labels er egendefinerte - eneste krav er at de henger sammen internt, og ikke er et Kubernetes-nøkkelord
- Vi har som nevnt ovenfor introdusert en ny service for å tilgå det nye deploymentet "example-backend". Den bruker en selector basert på label'ene "example" og "backend" for å identifisere korrekt pod.

```
apiVersion: v1
kind: Namespace
metadata:
  name: example
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: example-frontend
  namespace: example
spec:
  replicas: 1
  selector:
    matchLabels:
      app: example
      tier: frontend
  template:
    metadata:
      labels:
        app: example
        tier: frontend
    spec:
      containers:
        - name: example-klient-container
          image: harbor.statkart.no/foo/foobar-klient:0.1.0.9999
          ports:
            - containerPort: 8080
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: example-backend
  namespace: example
spec:
  replicas: 1
  selector:
    matchLabels:
      app: example
      tier: backend
  template:
    metadata:
      labels:
        app: example
        tier: backend
    spec:
      containers:
        - name: example-backend-container
          image: harbor.statkart.no/foo/foobar-backend:0.1.9999
          securityContext:
            runAsUser: 1242
          ports:
            - containerPort: 8082
---
apiVersion: v1
kind: Service
metadata:
  name: example-service
  namespace: example
  annotations:
    external-dns.alpha.kubernetes.io/hostname: example.test.k8s.local
spec:
  selector:
    app: example
    tier: frontend
  ports:
    - port: 80
      targetPort: 80
  type: LoadBalancer

---
apiVersion: v1
kind: Service
metadata:
  name: example-backend-service
  namespace: example
spec:
  selector:
    app: example
    tier: backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8082
```


Når servicen er opprettet kan man referere til den ved hjelp av navnet, som blir et internt DNS-record i namespacet. F.eks gjennom en proxy.conf i nginx dersom frontend er en webapplikasjon med nginx som base-image:
```
http {
        location /example/api/ {
            proxy_pass http://example-backend-service;
        }
    }
}
```
