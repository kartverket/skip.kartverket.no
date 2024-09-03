"use strict";(self.webpackChunkskip_docs=self.webpackChunkskip_docs||[]).push([[1096],{70597:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>g,contentTitle:()=>s,default:()=>d,frontMatter:()=>i,metadata:()=>a,toc:()=>o});var n=t(85893),A=t(11151);const i={},s="Migrering fra atkv1 til atkv3",a={id:"troubleshooting/migrering-fra-atkv1-til-atkv3",title:"Migrering fra atkv1 til atkv3",description:"Vi har satt opp et nytt cluster! Dette clusteret er p\xe5 ny fin hardware og med nye arkitekturl\xf8sninger.",source:"@site/docs/12-troubleshooting/migrering-fra-atkv1-til-atkv3.md",sourceDirName:"12-troubleshooting",slug:"/troubleshooting/migrering-fra-atkv1-til-atkv3",permalink:"/docs/troubleshooting/migrering-fra-atkv1-til-atkv3",draft:!1,unlisted:!1,editUrl:"https://github.com/kartverket/skip-docs/edit/main/docs/12-troubleshooting/migrering-fra-atkv1-til-atkv3.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"\ud83e\udd54 Troubleshooting",permalink:"/docs/troubleshooting/"},next:{title:"Troubleshooting on SKIP",permalink:"/docs/troubleshooting/troubleshooting-on-skip"}},g={},o=[{value:"Deployment av applikasjoner til nye clustere",id:"deployment-av-applikasjoner-til-nye-clustere",level:2},{value:"\xc5pninger til tjenester utenfor skip",id:"\xe5pninger-til-tjenester-utenfor-skip",level:2},{value:"DNS",id:"dns",level:2},{value:"Test clusteret finnes ikke lenger!",id:"test-clusteret-finnes-ikke-lenger",level:2},{value:"Endringer p\xe5 ArgoCD",id:"endringer-p\xe5-argocd",level:2},{value:"Endringer p\xe5 Grafana",id:"endringer-p\xe5-grafana",level:2},{value:"Trafikk-flyt ArgoCD og Grafana",id:"trafikk-flyt-argocd-og-grafana",level:3}];function l(e){const r={a:"a",admonition:"admonition",h1:"h1",h2:"h2",h3:"h3",img:"img",p:"p",...(0,A.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.h1,{id:"migrering-fra-atkv1-til-atkv3",children:"Migrering fra atkv1 til atkv3"}),"\n",(0,n.jsx)(r.p,{children:"Vi har satt opp et nytt cluster! Dette clusteret er p\xe5 ny fin hardware og med nye arkitekturl\xf8sninger."}),"\n",(0,n.jsx)(r.h2,{id:"deployment-av-applikasjoner-til-nye-clustere",children:"Deployment av applikasjoner til nye clustere"}),"\n",(0,n.jsx)(r.p,{children:"Vi har begynt \xe5 f\xe5 mange cluster etterhvert, og har derfor valgt \xe5 gj\xf8re om litt p\xe5 mappestrukturen i apps repoet. I dag har vi en struktur som, litt forenklet, ser slik ut:"}),"\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.img,{src:t(64562).Z+"",width:"224",height:"217"})}),"\n",(0,n.jsx)(r.p,{children:"Vi kommer til \xe5 havne p\xe5 en struktur hvor hvert cluster man \xf8nsker \xe5 deployere til er representert med en egen mappe under env:"}),"\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.img,{src:t(88286).Z+"",width:"266",height:"315"})}),"\n",(0,n.jsx)(r.p,{children:"Legg merke til at de gamle mappene kan eksistere sammen med de nye, og det skjer ikke noe med det som ligger i atkv1-dev/prod f\xf8r mappene fjernes."}),"\n",(0,n.jsx)(r.h2,{id:"\xe5pninger-til-tjenester-utenfor-skip",children:"\xc5pninger til tjenester utenfor skip"}),"\n",(0,n.jsx)(r.p,{children:"For \xe5 kunne n\xe5 tjenester som er internt p\xe5 kartverket, men utenfor skip, eller i et annet cluster m\xe5 det ogs\xe5 bestilles \xe5pninger til disse p\xe5 nytt, siden atkv3 clusteret er del av en annen brannmursone."}),"\n",(0,n.jsx)(r.p,{children:"Har man i dag tilgang til et NFS share, eller en database m\xe5 dette testes, og eventuelle \xe5pninger bestilles f\xf8r det kan fungere."}),"\n",(0,n.jsx)(r.h2,{id:"dns",children:"DNS"}),"\n",(0,n.jsx)(r.p,{children:"Dev clusteret st\xf8tter kun adresser under domene atkv3-dev.kartverket-intern.cloud for interne og atkv3-dev.kartverket.cloud for eksterne. Produksjonsclusteret st\xf8tter atkv3-prod.kartverket-intern.cloud og atkv3-prod.kartverket.cloud. Men det vil i produksjonsclusteret ogs\xe5 v\xe6re mulig \xe5 definere sine egne domener eksternt. Egene vanity URL-er som f.eks nrl.kartverket.no som allerede eksisterer p\xe5 atkv1 i dag, pekes i dag til lb01.kartverket.no m\xe5 da pekes over til ny lastbalanserer (atkv3-prod.kartverket.cloud) for \xe5 kunne n\xe5s p\xe5 atkv3."}),"\n",(0,n.jsx)(r.h2,{id:"test-clusteret-finnes-ikke-lenger",children:"Test clusteret finnes ikke lenger!"}),"\n",(0,n.jsx)(r.p,{children:"Test clusteret finnes ikke lenger, alternativet her er \xe5 bruke namespace i enten dev eller prod cluster. Har man test-tjenester som skal v\xe6re tilgjengelig for brukere utenfor kartverket, b\xf8r dette legges til produksjons clusteret, og dev clusteret st\xf8tter kun, som nevnt, adresser i domenet atkv3-dev.kartverket.cloud for ekstern tilgang, og atkv3-dev.kartverket-intern.cloud for interne."}),"\n",(0,n.jsx)(r.h2,{id:"endringer-p\xe5-argocd",children:"Endringer p\xe5 ArgoCD"}),"\n",(0,n.jsxs)(r.p,{children:["For \xe5 kunne administrere flere cluster, med f\xe6rre ArgoCD instanser har vi valgt \xe5 konsolidere alle for dev og prod til en instans for prod, og en for dev. Disse legges i sky, sammen med den nye grafana instansen. Dette gj\xf8r at vi f\xe5r en prefix for alle argo applikasjoner med clusteret, feks atkv3-KulApplikasjon eller atgcp1-KulApplikasjon, som vil kunne ligge p\xe5 samme argoinstans, men p\xe5 to forskjellige clustere. ArgoCD kan n\xe5s ",(0,n.jsx)(r.a,{href:"https://argo.kartverket.dev/",children:"HER"}),"."]}),"\n",(0,n.jsx)(r.h2,{id:"endringer-p\xe5-grafana",children:"Endringer p\xe5 Grafana"}),"\n",(0,n.jsx)(r.p,{children:"Egress fra sky koster penger, mens ingress er gratis. S\xe5 for \xe5 slippe \xe5 hente ut data fra sky cluster til on-prem for \xe5 vise det i grafana, velger vi \xe5 vise data onprem via sky. Det gj\xf8r at logger og metrikker som vises i den nye grafana visualisers i sky, men lagres fremdeles on-prem."}),"\n",(0,n.jsx)(r.admonition,{type:"note",children:(0,n.jsx)(r.p,{children:"Hva betyr dette for deg? Logger lagres fremdeles p\xe5 Kartverket men g\xe5r via Google Cloud idet man leser dem. Dere m\xe5 ha et forhold til loggenes innhold og bekrefte at dere forst\xe5r at de g\xe5r via Google Cloud og aksepterer det f\xf8r dere starter migrering til atkv3."})}),"\n",(0,n.jsx)(r.admonition,{type:"info",children:(0,n.jsxs)(r.p,{children:["Ny URL: ",(0,n.jsx)(r.a,{href:"https://monitoring.kartverket.cloud/",children:"https://monitoring.kartverket.cloud"})]})}),"\n",(0,n.jsx)(r.h3,{id:"trafikk-flyt-argocd-og-grafana",children:"Trafikk-flyt ArgoCD og Grafana"}),"\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.img,{alt:"Diagram som viser at Grafana kj\xf8rer i sky og henter data fra kartverket",src:t(37548).Z+"",width:"731",height:"421"})})]})}function d(e={}){const{wrapper:r}={...(0,A.a)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(l,{...e})}):l(e)}},64562:(e,r,t)=>{t.d(r,{Z:()=>n});const n="data:image/png;base64,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"},88286:(e,r,t)=>{t.d(r,{Z:()=>n});const n=t.p+"assets/images/2-565afcacb4639176c5e4baa91af27929.png"},37548:(e,r,t)=>{t.d(r,{Z:()=>n});const n=t.p+"assets/images/grafana-atgcp-2c18dc465c19b9b00048c7c1d0824e74.png"},11151:(e,r,t)=>{t.d(r,{Z:()=>a,a:()=>s});var n=t(67294);const A={},i=n.createContext(A);function s(e){const r=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function a(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(A):e.components||A:s(e.components),n.createElement(i.Provider,{value:r},e.children)}}}]);