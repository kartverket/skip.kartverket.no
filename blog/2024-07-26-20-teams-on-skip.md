---
title: "20 teams on SKIP: What we've learned along the way"
description: >
slug: 20-teams-on-skip
authors:
  - name: Eline Henriksen
    title: Product Owner and Platform Developer
    url: https://eliine.dev
    image_url: https://github.com/eliihen.png
tags: [kubernetes]
image: /img/apps-repo-announcment.jpeg
hide_table_of_contents: false
---

![A screenshot of Argo CD](./img/argo-3.png)

<!--truncate-->

## Principles matter

When you set out to create something new, you have the privilege of setting
some standards that encourage best practices. While this is possible to do for
an existing system, in practice it will mean a lot of work to get to the
point where you're able to enforce these standards. It's much easier to start
with a clean slate.

For our platform, we decided on a set of principles that we wanted to follow.
Some of these are:

- **Stateless**: Our clusters are stateless, which means that we can easily
  replace them if something goes wrong. All configuration is held in a GitOps
  repository and all state is held in external systems like managed databases,
  object storage, etc. This significantly reduces operational complexity, as
  means that when a cluster goes down we can easily replace or revert it by
  applying the configuration from the GitOps repository without worrying about
  losing state.
- **Ownership**: For each application, there is a clear owner. This owner is
  responsible for the application and maintains an supports the applicationa
  This way we're able to avoid the "tragedy of the commons", where no one is
  responsible for the application. If an app has unclear or short-term
  ownership, you don't get to use the platform. We're not an orphanage.
- **Financing**: You use the platform? You also pay for its continued support
  and development. While we currently we don't have a full chargeback model we
  have a "fair" model where your department is expected to pitch in a certain
  amount of money to the platform. This is a way to ensure that the platform is
  sustainable.
- **Secure by default**: We enforce security best practices by default. Examples
  of this are zero trust networking with Network Policies, where no app can talk
  to another without explicitly allowing this. Some applications will need to opt
  out of some of these defaults, and they can do so by altering their
  configuration. But the defaults are secure, which is especially useful for
  teams that are new to Kubernetes.
  
All teams that are onboarded on SKIP are given an introduction to these
principles and are expected to follow them. This means that being able to use
the modern platform is contingent on the teams being able to prioritize
modernizing their applications and working in sustainable ways, which helps push
for positive change.

## Encourage collaboration

It's easy for a product team to ask the platform team for help when they're
stuck. We're always happy to help, but we also have a heavy workload of exciting
things we're working on. Therefore it's much better when platform users can help
each other, as this facilitates collaboration and learning. This is why we
highly encourage teams to help each other out - to build a community around the
platform.

In practice this is done through a single Slack channel where all teams that are
using the platform are invited. This is a great place to ask questions, share
experiences, and learn from each other - and it's a place where all new features
and changes are announced. We used to have many different channels for different
teams, but we found that this was not as effective for building a community as
a channel where everyone can help each other out.

And a final tip: As a platform developer, sometimes it's better to wait a little
while before responding to questions in these channels to allow the community to
help each other out before you jump in and help.

## Make time for innovation

It's easy to get bogged down in the day-to-day work of keeping the platform
running. This is why it's important to set aside time for innovation, and this
is something we take very seriously. 

On SKIP we have dedicated innovation days where we work on new features,
improvements, and other things that we think will make the platform better. This
is an extraordinarily successful initiative, and we've seen many great features
come out of these days. It's also a great way to build team morale and to build
a culture of learning and innovation.

In practice we have two days in a row of dedicated innovation work every other
month. We used to have one day every month, but we found that this was not
enough time to really get into the flow of things so we started running double
days every 2 months, which worked better. We also have a rule that you can't
work on anything that's on the roadmap, as this is work that we're already going
to do. This is a great way to get new ideas and to work on things that might not
otherwise get done.

![Innovation work](<Screenshot 2024-07-24 at 13.22.07.png>)

There's a little bit of structure around these days, but not too much. 

First, it is understood by everyone that these days are for things that are
"useful for Kartverket". This means that you can't work on your own pet project,
but it's vague enough that you can work on pretty much anything that you think
will be useful for the organization. 

Then, a week before the innovation day we will have a "pitching session", where
everyone who has an idea can pitch it to the rest of the team. This is a great
way to get feedback on your idea and to get others to join you in working on it.

Finally, we have a "show and tell" session at the end of the last day where
everyone shows what they've been working on. This way we can share our
experiences and discuss if this work can be improved and put into production.
We encourage everyone to show something, even if it's not finished or you did
video lessons, as this creates discussion and further ideas.

There's plenty of examples of features that are results of work done on these
days. On-premise Web Application Firewall with Wasm, Grafana features, open
source tools like [Skiperator]](https://github.com/kartverket/skiperator) and
[Skyline](https://github.com/kartverket/skyline) as well as this very website!

No one has time to prioritize innovation, and we're no different. But we
prioritize it anyway, because we know that it's important to keep improving and
to keep learning.

## Listen to your users

## Communication is key

Unfortunately a lot of infrastructure teams don't prioritize communication very
well. This is a mistake. Communication is key to building a successful platform.

Your users exist in the context of all the platform features that you have
shipped and the changes you will ship in the future. Not informing them and
keeping them up to date with what's going on is a surefire way to lose their
trust and to make them unhappy.

It starts with simply informing users of the new things that ship. This can be
done through a Slack channel, a newsletter, a blog or a town hall meeting. We
use a combination of all of these, but the most important thing is that you
inform your users of what's coming. An added benefit of this is helps push
adoption of new features and excitement around the platform by showcasing
innovation.

The next step is informing users on what will ship when. This will help users
plan their work and to know what to expect, but it also helps users feel
involved when they see their requests being planned. This can be done through a
roadmap, a technical forum, or a blog. We use a combination of all of these, but
the easiest way to do this is to have a roadmap that you keep up to date on a
regular basis.

Now for the hard part: When things go wrong, you need to communicate this as
well. Product teams will want to know when their applications are affected by
outages or other issues, and they will want to know what you're doing to fix it.
This can be done through a status page, a Slack channel, or postmortems. Again,
we use a blend of these so that we can reach as many users as possible at the
right time.

Do these things and you will have happy users.

## Branding is important

Do you think Spotify would be as successful if it was called "Music Player"? 
Do you think Apple would be as successful if it was called "Computer Company"?
Of course not. Branding is important. It builds a sense of identity and
community around your platform.

This is especially important for a platform team, as you're not just building a
product, you're building a community. You want your users to feel like they're
part of something bigger, and you want them to feel excited to use the platform.

When you're starting out, you want to drive adoption. Here a brand really helps
as it's easier to talk about a good brand in a positive way. It's also easier to
get leadership buy-in when you have a strong brand.

This holds true when you're more established as well. When you grow larger than
your ability to talk to everyone, a brand helps you communicate your values and
intent to your users, which will drive organic growth from teams that want to
work with you.

A minimum viable brand is a logo, a name, and a color scheme. This is something
you should think deeply about, as it's something that will stick with you for a
long time. After this you can think about a website, merchandise like stickers
and t-shirts, and a mascot. These things are not necessary, but they can help
build a sense of identity and community around your platform.

## Using the cloud is scary

Talk directly with your legal team.

## Autonomy and platform as a product

Listen to your users. Build the features that they need.

It's important to be able to say "no" to requests. As an autonomous team, you
should be able to make decisions on your own based on your stakeholders' needs.
Just because someone asks loudly for something, doesn't mean it's the right
fit for your platform. Dare to challenge assumptions and ask why.

## Abstractions save time

Build technology that makes product teams' jobs easier. That saves you time as
you will need to do less support.

Work smarter not harder.

## Build forward- and backwards compatibility

If you ask your users to make changes to their applications, you're asking a
team that is already busy to do more work. Any changes you ask them to make
will take time, as it would not necessarily be the highest priority for them.
Therefore avoiding the need for changes is a good thing, so wherever possible
building in forward and backwards compatibility by inferring as much as
possible from the existing configuration is a good thing.


## Documentation is key

When responding to a query, instead of answering the question, we should be
asking ourselves: "How can we make sure that this question never gets asked
again?". In this case you can write documentation, or improve existing
documentation and reply with a link to the docs. This is a double win, as you
will save time in the future and the user will now know where to look for
answers.

## No one is irreplaceable

## Learn from others

One great advantage of working in the public sector is that we can ask other
platform teams for advice and learn from their experiences. We can also share
our experiences with others. This is a great way to learn and improve.

Even if you work in the private sector, you can still learn from other
organizations.  Honestly, if you want to learn from someone's experiences it
never hurts to ask. Teams generally want to help each other out, and it's
usually possible to make a trade of some sort. Offer to give a talk on your
experiences and ask if they can do the same. It's a win-win for both parties.
