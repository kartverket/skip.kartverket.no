"use strict";(self.webpackChunkskip_docs=self.webpackChunkskip_docs||[]).push([[3437],{9879:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>h,contentTitle:()=>r,default:()=>c,frontMatter:()=>s,metadata:()=>a,toc:()=>l});var a=n(26288),o=n(74848),i=n(28453);const s={title:"20 teams on SKIP: What we've learned along the way",description:"We recently passed an important milestone, onboarding our 20th team on Kartverket's platform. On the occasion of this achievement we're going to look back at the decisions we made that led us to building a successful platform. In this tech blog we are showcasing the the secrets to our success - the decisions that have had the biggest impact.\n",slug:"20-teams-on-skip",authors:[{name:"Eline Henriksen",title:"Product Owner and Platform Developer",url:"https://eliine.dev",image_url:"https://github.com/eliihen.png"}],tags:["learnings","kubernetes"],image:"/img/20-teams-on-skip.jpeg",hide_table_of_contents:!1},r=void 0,h={authorsImageUrls:[void 0]},l=[{value:"Principles matter",id:"principles-matter",level:2},{value:"Encourage collaboration",id:"encourage-collaboration",level:2},{value:"Make time for innovation",id:"make-time-for-innovation",level:2},{value:"Communication is key",id:"communication-is-key",level:2},{value:"Branding is important",id:"branding-is-important",level:2},{value:"Using the cloud is a long journey",id:"using-the-cloud-is-a-long-journey",level:2},{value:"Autonomy and platform as a product",id:"autonomy-and-platform-as-a-product",level:2},{value:"Abstractions save time",id:"abstractions-save-time",level:2},{value:"Build forward- and backwards compatibility",id:"build-forward--and-backwards-compatibility",level:2},{value:"Documentation is key",id:"documentation-is-key",level:2},{value:"Learn from others",id:"learn-from-others",level:2},{value:"Conclusion",id:"conclusion",level:2}];function d(e){const t={a:"a",code:"code",em:"em",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Cake with text saying 20 teams on SKIP and DASK",src:n(70953).A+"",width:"1182",height:"666"})}),"\n",(0,o.jsx)(t.p,{children:"We recently passed an important milestone, onboarding our 20th team on\nKartverket's platform. Since we started a few years ago we've been working hard\nto build a platform that drives positive change at Kartverket, and we're proud\nof the results we've got. Our research shows that users are happy with the\ntechnology and support they get, and that they're able to deliver faster and\nmore securely than before."}),"\n",(0,o.jsx)(t.p,{children:"Building a platform is not easy, and it requires re-thinking a lot of assumptions\nheld in your organization. It's therefore easy to lose your way and to end up\nwith something that doesn't deliver on the high standards you've set for\nyour organization. Like everyone that starts with something new we've made\nmistakes along the way, we've had to change course multiple times and most\nimportantly we've learned a lot in our journey."}),"\n",(0,o.jsx)(t.p,{children:"On the occasion of this achievement we're going to look back at the decisions we\nmade that led us to building a successful platform. In this tech blog we are\nshowcasing the secrets to our success - the decisions that have had the\nbiggest impact."}),"\n",(0,o.jsx)(t.h2,{id:"principles-matter",children:"Principles matter"}),"\n",(0,o.jsx)(t.p,{children:"When you set out to create something new, you have the privilege of setting\nsome standards that encourage best practices. While this is possible to do for\nan existing system, in practice it will mean a lot of work to get to the\npoint where you're able to enforce these standards. It's much easier to start\nwith a clean slate."}),"\n",(0,o.jsx)(t.p,{children:"For our platform, we decided on a set of principles that we wanted to follow.\nSome of these are:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:[(0,o.jsx)(t.strong,{children:"Stateless"}),": Our clusters are stateless, which means that we can easily\nreplace them if something goes wrong. All configuration is held in a GitOps\nrepository and all state is held in external systems like managed databases,\nobject storage, etc. This significantly reduces operational complexity and\nrecovery time. If a cluster fails we can easily replace or revert it by\napplying the configuration from the GitOps repository without worrying about\nlosing state, or doing time-consuming data recovery operations."]}),"\n",(0,o.jsxs)(t.li,{children:[(0,o.jsx)(t.strong,{children:"Ownership"}),": For each application, there is a clear owner. This owner is\nresponsible for the application and maintains and supports it.  This way we're\nable to avoid the \"tragedy of the commons\", where no one is responsible for\nan application. If an app has unclear or short-term ownership, you simply\ndon't get to use the platform. We're not an orphanage."]}),"\n",(0,o.jsxs)(t.li,{children:[(0,o.jsx)(t.strong,{children:"Financing"}),": You use the platform? You also need to pay for its continued\nsupport and development. We're working towards a chargeback model where your\ndepartment is billed for the resources they use as a way to ensure that the\nplatform is sustainable. Until this is ready, we expose the costs of the\nresources used by each team and then negotiate with the departments on how to\ncover these costs, but this is time-consuming work."]}),"\n",(0,o.jsxs)(t.li,{children:[(0,o.jsx)(t.strong,{children:"Secure by default"}),": We enforce security best practices by default. Examples\nof this are zero trust networking with Network Policies, where no app can talk\nto another without explicitly allowing this. Some applications will need to opt\nout of some of these defaults, and they can do so by altering their\nconfiguration. But the defaults are secure, which is especially useful for\nteams that are new to Kubernetes."]}),"\n"]}),"\n",(0,o.jsx)(t.p,{children:"All teams that are onboarded on SKIP are given an introduction to these\nprinciples and are expected to follow them. This means that being able to use\nthe modern platform is contingent on the teams being able to prioritize\nmodernizing their applications and working in sustainable ways, which helps push\nfor positive change."}),"\n",(0,o.jsx)(t.h2,{id:"encourage-collaboration",children:"Encourage collaboration"}),"\n",(0,o.jsx)(t.p,{children:"It's easy for a product team to ask the platform team for help when they're\nstuck. We're always happy to help, but we also have a heavy workload of exciting\nthings we're working on. Therefore it's much better when platform users can help\neach other, as this facilitates collaboration and learning. This is why we\nhighly encourage teams to help each other out - to build a community around the\nplatform."}),"\n",(0,o.jsx)(t.p,{children:"In practice this is done through a single Slack channel where all teams that are\nusing the platform are invited. This is a great place to ask questions, share\nexperiences, and learn from each other - and it's a place where all new features\nand changes are announced. We used to have many different channels for different\nteams, but we found that this was not as effective for building a community as\na channel where everyone can help each other out."}),"\n",(0,o.jsx)(t.p,{children:"And a final tip: As a platform developer, sometimes it's better to wait a little\nwhile before responding to questions in these channels to allow the community to\nhelp each other out before you jump in and help."}),"\n",(0,o.jsx)(t.h2,{id:"make-time-for-innovation",children:"Make time for innovation"}),"\n",(0,o.jsx)(t.p,{children:"It's easy to get bogged down in the day-to-day work of keeping the platform\nrunning. This is why it's important to set aside time for innovation, this\nis something we take very seriously."}),"\n",(0,o.jsx)(t.p,{children:"On SKIP we have dedicated innovation days where we work on new features,\nimprovements, and other things that we think will make the platform better. This\nis an extraordinarily successful initiative, and we've seen many great features\ncome out of these days. It's also a great way to build team morale and to build\na culture of learning and innovation."}),"\n",(0,o.jsx)(t.p,{children:"In practice we have two days in a row of dedicated innovation work every other\nmonth. We used to have one day every month, but we found that this was not\nenough time to really get into the flow of things so we started doing two\ndays every 2 months, which worked better. We also have a rule that you can't\nwork on anything that's on the roadmap, as this is work that we're already going\nto do. This is a great way to get new ideas and to work on things that might not\notherwise get done."}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Innovation work",src:n(11294).A+"",width:"1875",height:"519"})}),"\n",(0,o.jsx)(t.p,{children:"There's a little bit of structure around these days, but not too much."}),"\n",(0,o.jsx)(t.p,{children:"First, it is understood by everyone that these days are for things that are\n\"useful for Kartverket\". This means that you can't work on your own pet project,\nbut it's vague enough that you can work on pretty much anything that you think\nwill be useful for the organization."}),"\n",(0,o.jsx)(t.p,{children:'Then, a week before the innovation day we will have a "pitching session", where\neveryone who has an idea can pitch it to the rest of the team. This is a great\nway to get feedback on your idea and to get others to join you in working on it.'}),"\n",(0,o.jsx)(t.p,{children:"Finally, we have a \"show and tell\" session at the end of the last day where\neveryone shows what they've been working on. This way we can share our\nexperiences and discuss if this work can be improved and put into production.\nWe encourage everyone to show something, even if it's not finished or you did\nvideo lessons, as this creates discussion and further ideas."}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Demo time!",src:n(81495).A+"",width:"2364",height:"1330"})}),"\n",(0,o.jsxs)(t.p,{children:["There's plenty of examples of features that are results of work done on these\ndays. On-premise Web Application Firewall with Wasm, Grafana features, open\nsource tools like ",(0,o.jsx)(t.a,{href:"https://github.com/kartverket/skiperator",children:"Skiperator"})," and\n",(0,o.jsx)(t.a,{href:"https://github.com/kartverket/skyline",children:"Skyline"})," as well as this very website!"]}),"\n",(0,o.jsx)(t.p,{children:"No one has time to prioritize innovation, and we're no different. But we\nprioritize it anyway, because we know that it's important to keep improving and\nto keep learning."}),"\n",(0,o.jsx)(t.h2,{id:"communication-is-key",children:"Communication is key"}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"SKIPs kommunikasjonsstrategi",src:n(71099).A+"",width:"980",height:"865"})}),"\n",(0,o.jsx)(t.p,{children:"Unfortunately a lot of infrastructure teams don't prioritize communication very\nwell. This is a mistake. Communication is key to building a successful platform."}),"\n",(0,o.jsx)(t.p,{children:"Your users exist in the context of all the platform features that you have\nshipped and the changes you will ship in the future. Not informing them and\nkeeping them up to date with what's going on is a surefire way to lose their\ntrust and to make them unhappy."}),"\n",(0,o.jsx)(t.p,{children:"It starts with simply informing users of the new features that ship. This can be\ndone through a Slack channel, a newsletter, a blog or a town hall meeting. We\nuse a combination of all of these, but the most important thing is that you\ninform your users of what's coming. An added benefit of this is helps push\nadoption of new features and excitement around the platform by showcasing\ninnovation."}),"\n",(0,o.jsx)(t.p,{children:"The next step is informing users on what will ship and when. This will help\nusers plan their work and to know what to expect, but it also helps users feel\ninvolved when they see their requests being planned. This can be done through a\nroadmap, a technical forum, or a blog. We use a combination of all of these, but\nthe easiest way to do this is to have a roadmap that you keep up to date on a\nregular basis."}),"\n",(0,o.jsx)(t.p,{children:"Now for the hard part: When things go wrong, you need to communicate this as\nwell. Product teams will want to know when their applications are affected by\noutages or other issues, and they will want to know what you're doing to fix it.\nThis can be done through a status page, a Slack channel, or postmortems. Again,\nwe use a mix of these so that we can reach as many users as possible at the\nright time."}),"\n",(0,o.jsx)(t.p,{children:"Do these things and you will have happy users that feel informed."}),"\n",(0,o.jsx)(t.h2,{id:"branding-is-important",children:"Branding is important"}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"SKIP logo",src:n(15942).A+"",width:"580",height:"452"})}),"\n",(0,o.jsx)(t.p,{children:'Do you think Spotify would be as successful if it was called "Music Player"?\nDo you think Apple would be as successful if it was called "Computer Company"?\nOf course not. Branding is important. It builds a sense of identity and\ncommunity around your platform.'}),"\n",(0,o.jsx)(t.p,{children:"This is especially important for a platform team, as you're not just building a\nproduct, you're building a community. You want your users to feel like they're\npart of something bigger, and you want them to feel excited to use the platform."}),"\n",(0,o.jsx)(t.p,{children:"When you're starting out, you want to drive adoption. Here a brand really helps\nas it's easier to talk about a good brand in a positive way. It's also easier to\nget leadership buy-in when you have a strong brand."}),"\n",(0,o.jsx)(t.p,{children:"This holds true when you're more established as well. When you grow larger than\nyour ability to talk to everyone, a brand helps you communicate your values and\nintent to your users, which will drive organic growth from teams that want to\nwork with you."}),"\n",(0,o.jsx)(t.p,{children:"A minimum viable brand is a logo, a name, and a color scheme. This is something\nyou should think deeply about, as it's something that will stick with you for a\nlong time. After this you can think about a website, merchandise like stickers\nand t-shirts, and a mascot. These things are not necessary, but they can help\nbuild a sense of identity and community around your platform."}),"\n",(0,o.jsx)(t.h2,{id:"using-the-cloud-is-a-long-journey",children:"Using the cloud is a long journey"}),"\n",(0,o.jsx)(t.p,{children:"As a platform team, it's our responsibility to push for modern, user-friendly\nand secure solutions. This generally means using public cloud solutions like\nGoogle Cloud Platform. But for most organizations, pushing this narrative incurs\nsignificant friction and to some extent fear due to legal and cost concerns.\nThis is understandable, as the known is always more comfortable than the\nunknown, and it's a view that's hard to change."}),"\n",(0,o.jsx)(t.p,{children:"This is why it's important to take a long-term view on this. You're not going to\nmove everything to the cloud overnight, and you're not going to convince\neveryone to get on board with this idea overnight. It's a long journey, and you\nneed to be patient and persistent."}),"\n",(0,o.jsxs)(t.p,{children:["We've spent years pushing for the cloud, and we're still not there. You're going\nto have to participate in many (",(0,o.jsx)(t.em,{children:"many!"}),") meetings, and you're going to have to\nfight for every little thing over and over again. But it's necessary. Once\neveryone has a clear understanding of the risks and how to mitigate them, you\nwill be able to formulate a document guiding the organization's teams on how to\nget to the cloud from a compliance point of view."]}),"\n",(0,o.jsx)(t.p,{children:"If you asked me for any recommendations on how to get to the cloud as easily as\npossible, it would be to first get leadership buy-in across the organization.\nThis is important, as it will make any large initiative like cloud migration\neasier. After this and a competent platform team is in place, you can start\npushing for the cloud technologies and eventually cloud migration. Here you need\nto talk directly with the legal team, not via other people.  Have\nrepresentatives of the platform team sit down with the lawyers and talk through\nthe risks and how to mitigate them.  This is the only way you can combine the\ntechnical and legal aspects of this work. Working in silos and not talking to\neach other is a surefire way to fail."}),"\n",(0,o.jsx)(t.h2,{id:"autonomy-and-platform-as-a-product",children:"Autonomy and platform as a product"}),"\n",(0,o.jsx)(t.p,{children:"Your platform is a product, and so you need to work as a product team. This\nmeans continuously improving your product, listening to your users, and building\nthe features that they need."}),"\n",(0,o.jsx)(t.p,{children:'Research-based literature like "Team Topologies" establishes the importance of\nautonomous teams in modern organizations. Traditional top-down organizations are\njust not going to be able to have as close of a relationship with their\nstakeholders as a team that is able to proactively understand the needs of their\nusers and make their own decisions that push continuous improvement of their\nproducts. This is why it\'s important, even for infrastructure teams, to be able\nto own their roadmap and make decisions on what to build when.'}),"\n",(0,o.jsx)(t.p,{children:"As a team you're obviously limited to the amount of resources you have and not\nable to do everything, so understanding the needs of your stakeholders and\nprioritizing them is essential. You need to do research to know the needs of\nyour users; sometimes requests don't align well with the actual needs. Just\nbecause someone asks loudly for something, doesn't mean it's the right fit for\nyour platform. Saying yes to everything does not result in a good product. Dare\nto challenge assumptions and ask why."}),"\n",(0,o.jsx)(t.h2,{id:"abstractions-save-time",children:"Abstractions save time"}),"\n",(0,o.jsx)(t.p,{children:"It should go without saying that a platform team's job is to make tools that\nmake product teams' jobs easier. But it really can't be said enough. The better\nthe tooling you provide, the less you have to do support. This is a win-win for\neveryone."}),"\n",(0,o.jsxs)(t.p,{children:["When building tools, think about how you can abstract away complexity. This can\nbe done in many ways, but we've had great success building an operator that\nabstracts away the complexity of managing applications on Kubernetes. The\noperator is called ",(0,o.jsx)(t.a,{href:"https://github.com/kartverket/skiperator",children:"Skiperator"})," and\nmakes deploying applications on Kubernetes as easy as writing a configuration\nmanifest."]}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-yaml",children:"apiVersion: skiperator.kartverket.no/v1alpha1\nkind: Application\nmetadata:\n  namespace: sample\n  name: sample-two\nspec:\n  image: nginxinc/nginx-unprivileged\n  port: 80\n  replicas: 2\n  ingresses:\n    - foo.com\n    - bar.com\n"})}),"\n",(0,o.jsx)(t.p,{children:'The key takeaway here is that abstractions like Skiperator are designed to speak\nthe language of the user. There is no mention of NetworkPolicies or Istio\nVirtualServices in the configuration, as these are things that the user\ngenerally doesn\'t have any knowledge of. Instead, the user can specify things\nlike "I want to expose this service to the internet" or "I want to run this job\nevery day at midnight". This simplifies the user experience of Kubernetes, which\nis a complex system, and makes it easier for users to get started.'}),"\n",(0,o.jsx)(t.p,{children:"Work smarter not harder."}),"\n",(0,o.jsx)(t.h2,{id:"build-forward--and-backwards-compatibility",children:"Build forward- and backwards compatibility"}),"\n",(0,o.jsx)(t.p,{children:"We've had multiple experiences where we've weighed our options and decided to\nmake a breaking change. Just recently we asked our users to migrate their apps\nfrom one cluster to another in order to improve the architecture of the\nplatform. Multiple options were considered, but in the end the scale of the\nchanges meant that upgrading the clusters in-place would not be practical, so\nwe commissioned new clusters with the new architecture and asked users to\nmigrate their apps."}),"\n",(0,o.jsx)(t.p,{children:"In our case, we had a simple way to migrate, only requiring moving a config file\nfrom one directory to another to make the change. But even so, this was a time\nconsuming process for our users, and a laborious process for us to support.\nThis is because even though the change was simple, it was still a change that\nrequired testing and validation, and it was a change that was not necessarily\nthe highest priority for the teams that were asked to make it. So even though\nthe change was simple, it took months."}),"\n",(0,o.jsx)(t.p,{children:"If you ask your users to make changes to their applications, you're asking a\nteam that is already busy to do more work. Any changes you ask them to make\nwill take time, as it would not necessarily be the highest priority for them.\nTherefore avoiding breaking changes should be a primary goal, so wherever\npossible building in forward and backwards compatibility by inferring as much as\npossible from the existing configuration is a good thing."}),"\n",(0,o.jsx)(t.p,{children:"When building operators, don't change or remove fields that are in use. Use\ndefault values for new fields, and use lists of objects instead of raw values\nlike lists of strings as they are easier to extend."}),"\n",(0,o.jsx)(t.h2,{id:"documentation-is-key",children:"Documentation is key"}),"\n",(0,o.jsx)(t.p,{children:"One thing we keep hearing from our users is the need for more and better\ndocumentation. This is understandable. When you're using a platform, you don't\nwant to have to ask for help all the time - you want to be able to discover\nplatform features and implement them yourself with the support of good\ndocumentation."}),"\n",(0,o.jsx)(t.p,{children:"The point here is that as a platform team you need to prioritize documentation.\nA task is not done until it has been documented. This way announcing new\nfeatures will always include a link to the documentation where users can dive\ndeeper into the feature and how to use it, like the example below."}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"A Slack thread announcing a new SKIP feature",src:n(88917).A+"",width:"808",height:"651"})}),"\n",(0,o.jsx)(t.p,{children:"The bigger challenge here is preventing documentation from going stale. It's\ntoo easy to forget about updating documentation to reflect changes in the\ncode. Here we can share a few tips from our experience:"}),"\n",(0,o.jsx)(t.p,{children:"First, the obvious way to keep docs up to date is to allocate time to update\nthem. One way we do this is that a few times a year we will do a documentation\ngrooming session where we huddle together and review documentation, rewriting it\nwhen we find out of date information."}),"\n",(0,o.jsx)(t.p,{children:'A more interesting way to keep docs up to date is changing how you respond to\nquestions. Instead of answering questions immediately, we should be asking\nourselves: "How can we make sure that this question never gets asked again?". In\nour case we spend some time to write documentation or improve existing\ndocumentation and reply with a link to the documentation page. This is a triple\nwin, as you will now have more updated documentation, save time in the future by\nbeing able to refer to the improved docs instead of writing a lengthy response\nand the user will now know where to look for answers.'}),"\n",(0,o.jsx)(t.h2,{id:"learn-from-others",children:"Learn from others"}),"\n",(0,o.jsx)(t.p,{children:"When building a platform you'll quickly learn that you don't have all the\nanswers. You might discuss how to implement a feature with your team, but you\nmight not have the experience to know what works well in this context. When you\nget into this situation, an outside perspective can be crucial to avoid making\ncostly mistakes."}),"\n",(0,o.jsx)(t.p,{children:"One great advantage of working in the public sector is that we can ask other\npublic sector platform teams for advice and learn from their experiences. We can\nalso share our experiences with others, which is usually interesting. Invest\nsome time in building these relationships of mutual benefit."}),"\n",(0,o.jsx)(t.p,{children:(0,o.jsx)(t.img,{alt:"Public PaaS presentation",src:n(19270).A+"",width:"384",height:"512"})}),"\n",(0,o.jsxs)(t.p,{children:["I also want to give special credit to Hans Kristian Flaatten and the ",(0,o.jsx)(t.a,{href:"https://offentlig-paas.no/",children:"Public\nPaaS"})," network here. Having a shared forum to discuss\nplatform issues is a strong asset and helps the Norwegian public sector get\nahead and stay competitive."]}),"\n",(0,o.jsx)(t.p,{children:"Even if you work in the private sector, you can still learn from other\norganizations. Honestly, if you want to learn from someone's experiences it\nnever hurts to ask. Teams generally want to help each other out, and it's\nusually possible to make a trade of some sort. I suggest to offer to give a talk\non your experiences and ask if they can do the same. It's a win-win for both\nparties."}),"\n",(0,o.jsx)(t.h2,{id:"conclusion",children:"Conclusion"}),"\n",(0,o.jsxs)(t.p,{children:["You may think building a platform is mostly technology, and we've written a lot\nabout technology in ",(0,o.jsx)(t.a,{href:"/blog/hybrid-kubernetes-in-production-part-1",children:"previous blog\nposts"}),". But it's important to\nremember that building a platform is also about building a community, and\ncommunities have expectations and needs that go beyond technology. This is a\nstrength, and not a weakness, as if you're able to inspire and motivate your\nusers you will be able to build a platform that is sustainable and that drives\npositive change in your organization."]}),"\n",(0,o.jsx)(t.p,{children:"Best of luck in your endeavors!"})]})}function c(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},71099:(e,t,n)=>{n.d(t,{A:()=>a});const a=n.p+"assets/images/communication-6c3f011dc5e4d434f5ac4d176aeaa455.png"},88917:(e,t,n)=>{n.d(t,{A:()=>a});const a=n.p+"assets/images/feature-announcement-d2be617a77a4405371baaaa9ea729934.png"},11294:(e,t,n)=>{n.d(t,{A:()=>a});const a=n.p+"assets/images/innovation-day-results-629acf89fb2ba68b2ff271fe8e07432f.png"},19270:(e,t,n)=>{n.d(t,{A:()=>a});const a=n.p+"assets/images/public-paas-c5adabedea2208a72bc881ee34d23662.png"},81495:(e,t,n)=>{n.d(t,{A:()=>a});const a=n.p+"assets/images/show-and-tell-2b3a7d820d2d83410db38ba2e98bc45c.jpeg"},15942:(e,t,n)=>{n.d(t,{A:()=>a});const a=n.p+"assets/images/skip-brand-017598d9204f22b0562dfc8c2836f8b0.png"},70953:(e,t,n)=>{n.d(t,{A:()=>a});const a=n.p+"assets/images/20-teams-on-skip-8c9349cb994bc6629c8ce8b8f815ec0a.jpeg"},28453:(e,t,n)=>{n.d(t,{R:()=>s,x:()=>r});var a=n(96540);const o={},i=a.createContext(o);function s(e){const t=a.useContext(i);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),a.createElement(i.Provider,{value:t},e.children)}},26288:e=>{e.exports=JSON.parse('{"permalink":"/blog/20-teams-on-skip","source":"@site/blog/2024-07-26-20-teams-on-skip.md","title":"20 teams on SKIP: What we\'ve learned along the way","description":"We recently passed an important milestone, onboarding our 20th team on Kartverket\'s platform. On the occasion of this achievement we\'re going to look back at the decisions we made that led us to building a successful platform. In this tech blog we are showcasing the the secrets to our success - the decisions that have had the biggest impact.\\n","date":"2024-07-26T00:00:00.000Z","tags":[{"inline":true,"label":"learnings","permalink":"/blog/tags/learnings"},{"inline":true,"label":"kubernetes","permalink":"/blog/tags/kubernetes"}],"readingTime":17.53,"hasTruncateMarker":true,"authors":[{"name":"Eline Henriksen","title":"Product Owner and Platform Developer","url":"https://eliine.dev","image_url":"https://github.com/eliihen.png","imageURL":"https://github.com/eliihen.png","socials":{},"key":null,"page":null}],"frontMatter":{"title":"20 teams on SKIP: What we\'ve learned along the way","description":"We recently passed an important milestone, onboarding our 20th team on Kartverket\'s platform. On the occasion of this achievement we\'re going to look back at the decisions we made that led us to building a successful platform. In this tech blog we are showcasing the the secrets to our success - the decisions that have had the biggest impact.\\n","slug":"20-teams-on-skip","authors":[{"name":"Eline Henriksen","title":"Product Owner and Platform Developer","url":"https://eliine.dev","image_url":"https://github.com/eliihen.png","imageURL":"https://github.com/eliihen.png"}],"tags":["learnings","kubernetes"],"image":"/img/20-teams-on-skip.jpeg","hide_table_of_contents":false},"unlisted":false,"nextItem":{"title":"Scaling with Argo CD: Introducing the Apps Repo Architecture","permalink":"/blog/introducing-apps-repositories"}}')}}]);