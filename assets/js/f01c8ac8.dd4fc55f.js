"use strict";(self.webpackChunkskip_docs=self.webpackChunkskip_docs||[]).push([[2469],{66405:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>h,frontMatter:()=>r,metadata:()=>o,toc:()=>a});const o=JSON.parse('{"id":"argo-cd/configuring-apps-repositories-with-configjson","title":"Configuring apps repositories with config.json","description":"Using Argo CD to deploy and dynamically set up new environments by adding new directories in your apps-repo is a super convenient way to spin up new test environments, but it also introduces some challenges. Since projects in Argo CD are dynamically created as new directories in your apps repo are discovered, the settings on those projects have until now been pre-defined by SKIP. This gives you sane default behaviours like auto sync enabled on dev but not on prod and generally no good ways to change that behaviour.","source":"@site/docs/09-argo-cd/07-configuring-apps-repositories-with-configjson.md","sourceDirName":"09-argo-cd","slug":"/argo-cd/configuring-apps-repositories-with-configjson","permalink":"/docs/argo-cd/configuring-apps-repositories-with-configjson","draft":false,"unlisted":false,"editUrl":"https://github.com/kartverket/skip-docs/edit/main/docs/09-argo-cd/07-configuring-apps-repositories-with-configjson.md","tags":[],"version":"current","sidebarPosition":7,"frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"ArgoCD Notifications","permalink":"/docs/argo-cd/argocd-notifications"},"next":{"title":"\ud83d\udd2d Observability","permalink":"/docs/observability/"}}');var t=s(74848),i=s(28453);const r={},d="Configuring apps repositories with config.json",c={},a=[{value:"Supported options",id:"supported-options",level:2}];function l(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"configuring-apps-repositories-with-configjson",children:"Configuring apps repositories with config.json"})}),"\n",(0,t.jsxs)(n.p,{children:["Using ",(0,t.jsx)(n.a,{href:"/docs/argo-cd/",children:"Argo CD"})," to deploy and dynamically set up new environments by adding new directories in your ",(0,t.jsx)(n.a,{href:"/docs/argo-cd/hva-er-et-apps-repo",children:"apps-repo"})," is a super convenient way to spin up new test environments, but it also introduces some challenges. Since projects in Argo CD are dynamically created as new directories in your apps repo are discovered, the settings on those projects have until now been pre-defined by SKIP. This gives you sane default behaviours like auto sync enabled on dev but not on prod and generally no good ways to change that behaviour."]}),"\n",(0,t.jsxs)(n.p,{children:["It\u2019s possible to configure the settings of a directory within your apps-repo by adding a special file called ",(0,t.jsx)(n.code,{children:"config.json"})," . When this file is present, a set of pre-defined options can be provided to configure the way that directory is synced by Argo CD."]}),"\n",(0,t.jsxs)(n.p,{children:["The below example of a ",(0,t.jsx)(n.code,{children:"config.json"})," file enables automatic syncing of the directory that it resides in."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-javascript",children:'{\n  "tool": "directory",\n  "autoSync": true\n}\n'})}),"\n",(0,t.jsxs)(n.p,{children:["Only placement in root directories of namespaces are supported. For example ",(0,t.jsx)(n.code,{children:"dev/foo-main/config.json"})," or ",(0,t.jsx)(n.code,{children:"env/atkv1-dev/foo-main/config.json"})," ."]}),"\n",(0,t.jsx)(n.p,{children:"No special action is needed after the file is added to a directory in the apps repo. Argo CD will locate it automatically and update the project settings accordingly."}),"\n",(0,t.jsx)(n.h2,{id:"supported-options",children:"Supported options"}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:(0,t.jsx)(n.strong,{children:"Key"})}),(0,t.jsx)(n.th,{children:(0,t.jsx)(n.strong,{children:"Type"})}),(0,t.jsx)(n.th,{children:(0,t.jsx)(n.strong,{children:"Description"})})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsxs)(n.td,{children:[(0,t.jsx)(n.code,{children:"tool"})," (required)"]}),(0,t.jsxs)(n.td,{children:[(0,t.jsx)(n.code,{children:"directory"})," / ",(0,t.jsx)(n.code,{children:"kustomize"})," / ",(0,t.jsx)(n.code,{children:"helm"})]}),(0,t.jsxs)(n.td,{children:["Which tool should Argo CD use to sync this directory? The \u201cDirectory\u201d option supports yaml and jsonnet files. See also ",(0,t.jsx)(n.a,{href:"https://argo-cd.readthedocs.io/en/latest/user-guide/application_sources/",children:"tools"})," ."]})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"autoSync"})}),(0,t.jsxs)(n.td,{children:["boolean ( ",(0,t.jsx)(n.code,{children:"true"})," / ",(0,t.jsx)(n.code,{children:"false"})," )"]}),(0,t.jsxs)(n.td,{children:["When set to ",(0,t.jsx)(n.code,{children:"true"})," , the directory is automatically synced when changes are detected. The default value is ",(0,t.jsx)(n.code,{children:"true"})," in dev and ",(0,t.jsx)(n.code,{children:"false"})," in prod."]})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"prune"})}),(0,t.jsxs)(n.td,{children:["boolean ( ",(0,t.jsx)(n.code,{children:"true"})," / ",(0,t.jsx)(n.code,{children:"false"})," )"]}),(0,t.jsxs)(n.td,{children:["When enabled, Argo CD will automatically remove resouces that are no longer present in Git. Default is ",(0,t.jsx)(n.code,{children:"true"})," . See ",(0,t.jsx)(n.a,{href:"https://argo-cd.readthedocs.io/en/latest/user-guide/auto_sync/#automatic-pruning",children:"prune"})," . Only used when ",(0,t.jsx)(n.code,{children:"autoSync"})," is ",(0,t.jsx)(n.code,{children:"true"})]})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"allowEmpty"})}),(0,t.jsxs)(n.td,{children:["boolean ( ",(0,t.jsx)(n.code,{children:"true"})," / ",(0,t.jsx)(n.code,{children:"false"})," )"]}),(0,t.jsxs)(n.td,{children:["Safety mechanism. When ",(0,t.jsx)(n.code,{children:"prune"})," is enabled it deletes resources automatically, but it will not allow empty syncs (delete all) unless ",(0,t.jsx)(n.code,{children:"allowEmpty"})," also is enabled. Default is ",(0,t.jsx)(n.code,{children:"false"})," . See ",(0,t.jsx)(n.a,{href:"https://argo-cd.readthedocs.io/en/latest/user-guide/auto_sync/#automatic-pruning-with-allow-empty-v18",children:"allowEmpty"})," . Only used when ",(0,t.jsx)(n.code,{children:"autoSync"})," is ",(0,t.jsx)(n.code,{children:"true"})]})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"selfHeal"})}),(0,t.jsxs)(n.td,{children:["boolean ( ",(0,t.jsx)(n.code,{children:"true"})," / ",(0,t.jsx)(n.code,{children:"false"})," )"]}),(0,t.jsxs)(n.td,{children:["When changes are made on the cluster directly, Argo will not revert them unless ",(0,t.jsx)(n.code,{children:"selfHeal"})," is provided. Default is ",(0,t.jsx)(n.code,{children:"true"})," . See ",(0,t.jsx)(n.a,{href:"https://argo-cd.readthedocs.io/en/latest/user-guide/auto_sync/#automatic-self-healing",children:"self heal"})," . Only used when ",(0,t.jsx)(n.code,{children:"autoSync"})," is ",(0,t.jsx)(n.code,{children:"true"})]})]})]})]})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>r,x:()=>d});var o=s(96540);const t={},i=o.createContext(t);function r(e){const n=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),o.createElement(i.Provider,{value:n},e.children)}}}]);