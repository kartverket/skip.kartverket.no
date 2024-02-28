---
title: Crisis Management Exercises
description: >
    Crisis management and disaster recovery exercises are a great way to learn and to refine your processes and documentation! You should do it too!
slug: crisis-management-exercises
authors:
  - name: Thomas Berg
    title: Team Lead and Platform Developer
    url: https://github.com/berg-thom
    image_url: https://github.com/berg-thom.png
tags: [crisis-management, disaster-recovery, exercises]
image: /img/crisis_3.jpeg
hide_table_of_contents: false
---

![Crisis management exercise](img/crisismanagamentexercise.jpeg)

Every IT organization with some semblance of sanity has at least one crisis management or disaster recovery plan, and probably several, depending on the scope and severity of the scenario.
Ranging from "one of our more important applications is experiencing issues in production" through "everything is on fire" on to total loss of data,
a good crisis management or disaster recovery plan should help you retain business continuity or at the very least ensure a return to normal operations within the shortest possible timeframe.
But when was the last time you actually found the time to test your plans and ability to respond to a crisis?

<!--truncate-->

And we're not just talking a theoretical abstract exercise - we're talking an actual, realistic scenario involving downtime, troubleshooting, configuration and restoration of services in an actual live environment,
preferably as close to production in terms of architecture as possible. 
Before you have had the chance to test every single point of your plans, can you actually be sure that they will work?
And as times change, so do applications, configurations, hardware, architecture - even personnel. New people are added to your team, and people leave - you both need to onboard the new ones and make sure that the knowledge and skillset of people leaving are retained in some fashion.
Have your plans been updated to take all these factors into account?

Let us take you on a journey through a couple of SKIPs most recent crisis management exercises and explore what happened,
how we handled it and what we learned from it.

##  Exercise 1: Malicious actor
![Illustration of malicious actor](img/hacker3.jpeg)

The first exercise scenario revolved around a malicious actor gaining privileged access to our production Kubernetes cluster, simulated in this case by our internal sandbox cluster.
Admittedly, it was somewhat difficult to set up a realistic scenario without outright disabling some of our security tools,
so in the end we simulated a hostile takeover of the user account belonging to the person responsible for planning and running the exercise.

The first sign that something was amiss was an alert from our [Sysdig Secure](https://sysdig.com/products/platform/) toolset, a [Falco](https://falco.org)-based agent software which continually monitors our cluster 
for signs of abnormal activity according to a predefined ruleset and provides a SaaS portal for further analysis and management of threats.
After initial examination, we found that the incident was of such a nature that we engaged our crisis management plan in order to investigate, contain and mitigate the incident.
We simulated communication with the organization-level crisis management team, having regular meetings in order to keep them informed of progress.
Systematic examination of logs and audit logs soon turned up suspicious activity confined to one specific platform developer account, and the
decision was made to immediately suspend (simulated in this case) the account, removing all access to organizational systems and in effect locking it out.
Simultaneously, the malicious software was removed once enough evidence was secured in order to further analyze the actions and impact of it.
The exercise was announced as ended once we suspended the compromised user account and removed the malicious application while retaining and analyzing enough logs, forensic captures and other traces of activity.



## Exercise 2: "Everything is on fire"
![Illustration of malicious actor](img/serverroomonfire.jpeg)

The second exercise scenario was somewhat more involved, taking place over two days. The incident itself was as follows:
A software update or rogue script caused catastrophic hardware failure in production infrastructure, necessitating creation of a 
new Kubernetes cluster from scratch. Once the cluster itself and all underlying infrastructure had been created and configured, it would then be up to our platform team to 
deploy all necessary IAM configuration, service accounts, RBAC and supporting systems (Istio, ArgoCD ++) needed to deploy workloads and restore normal operations.
The exercise itself focused on this second phase of restoration, as the infrastructure configuration and cluster creation itself is done by another team, with little involvement by our platform team members. 

The failure itself was simulated by having our infrastructure team wipe our sandbox environment and present us with a clean-slate Kubernetes cluster. 
We called an all-hands meeting and set to work restoring services right away. Right at the onset, we recognized that this was a golden opportunity
both to ensure that our documentation was up-to-date, consistent and easy to follow, as well as give our three newest team members some much-needed
experience and insight into setting up our services from scratch.
We therefore decided that the newest team members would be the ones to actually execute all the 
actions outlined in our documentation, while the rest of us followed along and made notes, updated documentation and otherwise provided guidance throughout the process.

The first run-through of the recovery process took around 2-3 hours before everything was in working order. Keep in mind that we took the time to update our documentation and explain everything we did while we were working, so in a real-life scenario this would have been even quicker. Once the IAM, RBAC, Istio and ArgoCD was up and running, it was merely a matter of using ArgoCD to synchronize and deploy all relevant workloads.
Afterwards, we had a meeting to discuss the process and what experiences we gained from it. Based on the feedback from this meeting, we made further adjustments and updates to our documentation
in order to make it even easier to follow on a step-by-step basis, focusing on removing any ambiguity and put any "tribal" knowledge among our platform developers into writing.
This ensured that we are way less dependent on the knowledge and skillset of specific people, enabling any team member to contribute to recovery efforts by simply following the documentation.

The newest team members greatly enjoyed being responsible for the recovery effort itself, and expressed a wish to run through the scenario again in order to refine their skills and further improve the documentation.
Therefore, we decided to set aside most of day 2 to do just that. We had the infrastructure team tear down and setup the cluster again, and let the newest team members loose on it - this time on their own without guidance - an additional two times.
The last run-through of the exercise took between 30 and 60 minutes, a significant improvement from the initial attempt.

All in all, we considered the exercise to be a great success, with many important lessons learned and a substantial improvement in the quality of our documentation and crisis management plans.


## What did we learn?
![Illustration of malicious actor](img/whatdidwelearn.jpeg)
### Lesson 1: You are only as good as your documentation
Documentation is vitally important during a crisis, and should be detailed enough that any team member may follow it on a step-by-step basis and be able to restore normal service, even with minimal knowledge and during a stressful situation.
This ensures that you avoid being dependent upon key personnel that might or might not be available during a crisis scenario, and also ensures that you retain vital institutional knowledge even when team members move on to different tasks or even new jobs.

### Lesson 2: Logging, logging, logging! Oh, and monitoring too!
Having the ability to search through logs of all parts of our system greatly simplifies any incident management, whether the incident revolved around malicious actors or other factors.
But logs by themselves are not sufficient - you need some sort of monitoring and alerting system in order to alert on and react to abnormal situations/behaviour in your systems.
Ideally, you should be able to react on these alerts instead of messages from users - or worse, customers - that something is wrong.

### Lesson 3: Test your plans!
Merely having plans, routines and documentation is insufficient. Unless they have been thoroughly tested and their quality assured through crisis exercises in realistic scenarios and conditions, they should be treated as flawed and unreliable until the opposite is proven. 
Running crisis management exercises is a great way to expose flaws, insufficiencies and outdated documentation, and careful note-taking and postmortems should be the norm throughout the exercise in order to easily identify and update weak spots in your plans and documentation. As systems and circumstances change, so should plans and documentation too in order to reflect the new order of the day.

### Lesson 4: Communicate!
Openness and communication is critical during both exercises and real-world crisis scenarios. Plans should always involve key points of communication - who needs to be informed, whose responsibility it is to keep said people informed, and the frequency, scope and format of information to disseminate.
This also applies to communication afterwards. Anyone in your organization should be able to understand what happened, how it was solved and what lessons were learned from it. 
In Kartverket, we solve this by writing postmortems about incidents, summing up the incident itself and what we learned from it. We favour [Blameless Postmortems](https://www.atlassian.com/incident-management/postmortem/blameless), enabling us to quickly and thoroughly analayze and document all aspects of an incident without focusing on individual mistakes   and avoid passing blame.
This contributes to a culture of openness, learning and improvement. Hoarding information and disseminating it only on a "need-to-know" basis only breeds distrust and contempt, as does a culture that focuses on blaming and punishing people for mistakes instead of learning from them.
A further bonus when communicating the happenings and results of your crisis management exercises is the potential to inspire others - when people see the great results and lessons you yourselves have gained from such exercises, they might want to try it with their own systems and teams. 

### Lesson 5: Let the "newbies" handle it
Putting our newest team members in charge of the recovery operations was a great learning experience for them, as well as enabling us to quickly find flaws and shortcomings in our documentation and crisis management plans.
It is also a great confidence booster, because if they succeed, they'll gain valuable insight and positive experiences with setting up all those scary critical systems from scratch - and if they don't succeed, well, that's not their fault, it was because the documentation and training was insufficent to enable them to handle the situation!

### Lesson 6: Crisis exercises as team building
Crisis exercises are fun and contribute to better teamwork! They bring everyone together in order to achieve a common goal - get things up and running again as quickly as possible. Combine it with "pair programming" - that is, if possible make sure at least two people are working on any given task together - this helps facilitate cooperation and communication, and provides an extra set of eyes to help catch any manual errors or deviations from the plan.

## Thank you for reading!
We appreciate you taking the time to read through this blog post. We have learned quite a lot (and had lots of fun) through our approach to crisis management exercises. We hope our experiences and thoughts regarding this subject has been interesting, and that they may inspire others to start doing crisis management exercises as well.