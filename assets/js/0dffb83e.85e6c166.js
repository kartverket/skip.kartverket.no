"use strict";(self.webpackChunkskip_docs=self.webpackChunkskip_docs||[]).push([[75],{3905:function(t,e,n){n.d(e,{Zo:function(){return d},kt:function(){return g}});var r=n(7294);function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function l(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?l(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function p(t,e){if(null==t)return{};var n,r,a=function(t,e){if(null==t)return{};var n,r,a={},l=Object.keys(t);for(r=0;r<l.length;r++)n=l[r],e.indexOf(n)>=0||(a[n]=t[n]);return a}(t,e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);for(r=0;r<l.length;r++)n=l[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(a[n]=t[n])}return a}var o=r.createContext({}),u=function(t){var e=r.useContext(o),n=e;return t&&(n="function"==typeof t?t(e):i(i({},e),t)),n},d=function(t){var e=u(t.components);return r.createElement(o.Provider,{value:e},t.children)},m={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},k=r.forwardRef((function(t,e){var n=t.components,a=t.mdxType,l=t.originalType,o=t.parentName,d=p(t,["components","mdxType","originalType","parentName"]),k=u(n),g=a,s=k["".concat(o,".").concat(g)]||k[g]||m[g]||l;return n?r.createElement(s,i(i({ref:e},d),{},{components:n})):r.createElement(s,i({ref:e},d))}));function g(t,e){var n=arguments,a=e&&e.mdxType;if("string"==typeof t||a){var l=n.length,i=new Array(l);i[0]=k;var p={};for(var o in e)hasOwnProperty.call(e,o)&&(p[o]=e[o]);p.originalType=t,p.mdxType="string"==typeof t?t:a,i[1]=p;for(var u=2;u<l;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}k.displayName="MDXCreateElement"},3208:function(t,e,n){n.r(e),n.d(e,{frontMatter:function(){return p},contentTitle:function(){return o},metadata:function(){return u},toc:function(){return d},default:function(){return k}});var r=n(7462),a=n(3366),l=(n(7294),n(3905)),i=["components"],p={sidebar_position:3},o="Roadmap",u={unversionedId:"roadmap",id:"roadmap",isDocsHomePage:!1,title:"Roadmap",description:"Thinnest viable platform for SKIP",source:"@site/docs/roadmap.md",sourceDirName:".",slug:"/roadmap",permalink:"/docs/roadmap",editUrl:"https://github.com/kartverket/skip-docs/edit/main/docs/roadmap.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Bruk av Helm",permalink:"/docs/getting-started/helm"}},d=[{value:"Thinnest viable platform for SKIP",id:"thinnest-viable-platform-for-skip",children:[]}],m={toc:d};function k(t){var e=t.components,n=(0,a.Z)(t,i);return(0,l.kt)("wrapper",(0,r.Z)({},m,n,{components:e,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"roadmap"},"Roadmap"),(0,l.kt)("h2",{id:"thinnest-viable-platform-for-skip"},"Thinnest viable platform for SKIP"),(0,l.kt)("p",null,"F\xf8lgende tooling har v\xe6rt tenkt som en del av TVP for produksjonsbruk."),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Kildekodekontroll"),(0,l.kt)("th",{parentName:"tr",align:null},"Gitlab"),(0,l.kt)("th",{parentName:"tr",align:null},"Oppe"),(0,l.kt)("th",{parentName:"tr",align:null}))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"CI/CD"),(0,l.kt)("td",{parentName:"tr",align:null},"Gitlab"),(0,l.kt)("td",{parentName:"tr",align:null},"P\xe5g\xe5ende"),(0,l.kt)("td",{parentName:"tr",align:null},"Registrerer saker fortl\xf8pende i eget issue-board")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Applikasjonsversjonering"),(0,l.kt)("td",{parentName:"tr",align:null},"Helm"),(0,l.kt)("td",{parentName:"tr",align:null},"Oppe"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Secret-management"),(0,l.kt)("td",{parentName:"tr",align:null},"Hashicorp Vault"),(0,l.kt)("td",{parentName:"tr",align:null},"P\xe5g\xe5ende"),(0,l.kt)("td",{parentName:"tr",align:null},"Har v\xe6rt litt problemer med bruk av Vault i DSA. Manuell registrering av kubernetes-secrets som workaround")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Intern provisjonering av DNS"),(0,l.kt)("td",{parentName:"tr",align:null},"External DNS"),(0,l.kt)("td",{parentName:"tr",align:null},"Oppe"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Logging av Tools-cluster"),(0,l.kt)("td",{parentName:"tr",align:null},"ELK (Logzilla)"),(0,l.kt)("td",{parentName:"tr",align:null},"Oppe"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Monitorering av tools-cluster"),(0,l.kt)("td",{parentName:"tr",align:null},"Prometheus og Grafana"),(0,l.kt)("td",{parentName:"tr",align:null},"Oppe"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Logging av applikasjoner p\xe5 plattform"),(0,l.kt)("td",{parentName:"tr",align:null},"ELK"),(0,l.kt)("td",{parentName:"tr",align:null},"P\xe5g\xe5ende"),(0,l.kt)("td",{parentName:"tr",align:null},"Stort behov for dette blant pilotteamene")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Innsyn i clustre"),(0,l.kt)("td",{parentName:"tr",align:null},"Botkube"),(0,l.kt)("td",{parentName:"tr",align:null},"P\xe5g\xe5ende"),(0,l.kt)("td",{parentName:"tr",align:null},"Stort behov for dette blant pilotteamene")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Image-registry og sikkerhetsscanning"),(0,l.kt)("td",{parentName:"tr",align:null},"Harbour"),(0,l.kt)("td",{parentName:"tr",align:null},"Oppe"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Service Mesh"),(0,l.kt)("td",{parentName:"tr",align:null},"Analyse"),(0,l.kt)("td",{parentName:"tr",align:null},"Ikke startet"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Metrikker for applikasjoner"),(0,l.kt)("td",{parentName:"tr",align:null},"Analyse"),(0,l.kt)("td",{parentName:"tr",align:null},"Ikke startet"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Verkt\xf8y for IaC"),(0,l.kt)("td",{parentName:"tr",align:null},"Terraform"),(0,l.kt)("td",{parentName:"tr",align:null},"S\xe5vidt startet"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null}),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Sikkerhetsscanning av tredjepartsavhengigheter"),(0,l.kt)("td",{parentName:"tr",align:null},"Owasp Dep. Track"),(0,l.kt)("td",{parentName:"tr",align:null},"Ikke startet (finnes utenfor SKIP)"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Pen.testing for applikasjoner"),(0,l.kt)("td",{parentName:"tr",align:null},"Owasp Zap"),(0,l.kt)("td",{parentName:"tr",align:null},"Ikke startet (finnes utenfor SKIP)"),(0,l.kt)("td",{parentName:"tr",align:null})),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},"Statisk kodeanalyse"),(0,l.kt)("td",{parentName:"tr",align:null},"SonarQube"),(0,l.kt)("td",{parentName:"tr",align:null},"Ikke startet (finnes utenfor SKIP)"),(0,l.kt)("td",{parentName:"tr",align:null})))))}k.isMDXComponent=!0}}]);