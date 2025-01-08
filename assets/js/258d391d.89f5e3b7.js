"use strict";(self.webpackChunkskip_docs=self.webpackChunkskip_docs||[]).push([[8627],{43006:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>l,frontMatter:()=>s,metadata:()=>r,toc:()=>d});const r=JSON.parse('{"id":"skiperator/requirements","title":"Requirements","description":"In order to deploy your applications and jobs to SKIP, you and your team need to have some prerequisites in place.","source":"@site/docs/13-skiperator/01-requirements.md","sourceDirName":"13-skiperator","slug":"/skiperator/requirements","permalink":"/docs/skiperator/requirements","draft":false,"unlisted":false,"editUrl":"https://github.com/kartverket/skip-docs/edit/main/docs/13-skiperator/01-requirements.md","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"\ud83e\udd16 Skiperator","permalink":"/docs/skiperator/"},"next":{"title":"Getting started","permalink":"/docs/skiperator/get-started"}}');var i=n(74848),o=n(28453);const s={},a="Requirements",c={},d=[{value:"Application and job requirements",id:"application-and-job-requirements",level:2},{value:"CI CD requirements",id:"ci-cd-requirements",level:2},{value:"Summary",id:"summary",level:2}];function u(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.header,{children:(0,i.jsx)(t.h1,{id:"requirements",children:"Requirements"})}),"\n",(0,i.jsx)(t.p,{children:"In order to deploy your applications and jobs to SKIP, you and your team need to have some prerequisites in place."}),"\n",(0,i.jsx)(t.h2,{id:"application-and-job-requirements",children:"Application and job requirements"}),"\n",(0,i.jsxs)(t.p,{children:["First of all your applications and jobs need to be containerized. This means that your application or job needs to be packaged in a linux container image that can be run in a Kubernetes cluster.\nIn SKIP we recommend to use the ",(0,i.jsx)(t.a,{href:"https://hub.docker.com/_/scratch",children:"scratch"})," image as a base image for your application or job. This is a minimal image that only contains the necessary files to run your application or job."]}),"\n",(0,i.jsxs)(t.p,{children:["Next the image needs to be hosted in a container registry that is accessible from the Kubernetes cluster.\nIn SKIP we use ",(0,i.jsx)(t.a,{href:"/docs/github/",children:"github"})," as our container registry. It doesn't matter if the image is publicly available or private, as long as the repository is under the Kartverket organization."]}),"\n",(0,i.jsx)(t.h2,{id:"ci-cd-requirements",children:"CI CD requirements"}),"\n",(0,i.jsxs)(t.p,{children:["In order to deploy your application you need to have set up a CI/CD pipeline that builds and pushes your container image to the container registry.\nAs previously mentioned, in SKIP we use github as the repository. You can read more about how to set up a CI/CD pipeline in the ",(0,i.jsx)(t.a,{href:"/docs/github-actions/",children:"github actions"})," documentation."]}),"\n",(0,i.jsxs)(t.p,{children:["We also need to set up Argo CD for deployment of the application. You can read more about how to set up Argo CD in the ",(0,i.jsx)(t.a,{href:"/docs/argo-cd/",children:"Argo CD"})," documentation."]}),"\n",(0,i.jsx)(t.h2,{id:"summary",children:"Summary"}),"\n",(0,i.jsx)(t.p,{children:"So to summarize, in order to use Skiperator and run your applications in SKIP you need to have the following in place:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Your application or job needs to be containerized"}),"\n",(0,i.jsx)(t.li,{children:"The container image needs to be hosted in a container registry that is accessible from the Kubernetes cluster (github)"}),"\n",(0,i.jsx)(t.li,{children:"A CI/CD pipeline that builds and pushes the container image to the container registry"}),"\n",(0,i.jsxs)(t.li,{children:["Argo CD set up for deployment of the application from a ",(0,i.jsx)(t.code,{children:"team-apps"})," repository"]}),"\n"]}),"\n",(0,i.jsxs)(t.p,{children:["Now that you have the prerequisites in place you can move on to the ",(0,i.jsx)(t.a,{href:"02-get-started",children:"Getting started"})," page to learn how to deploy your application or job to SKIP."]})]})}function l(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(u,{...e})}):u(e)}},28453:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>a});var r=n(96540);const i={},o=r.createContext(i);function s(e){const t=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),r.createElement(o.Provider,{value:t},e.children)}}}]);