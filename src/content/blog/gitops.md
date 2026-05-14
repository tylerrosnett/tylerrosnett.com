---
title: "GitOps Good"
date: 2026-05-08
description: "A meditation on what GitOps is (and isn't)."
---

This post explores my thoughts on GitOps as a senior engineer who's day job has been implementing GitOps, at scale, for 4+ years.

## What is GitOps?

GitOps is the practice of using a git repository to express intent to a system. The system reads this intent and tries to make it so, continuously.

## What isn't GitOps?

GitOps is not Continuous Integration or Continuous Delivery. It doesn't happen in a pipeline. It happens in a repo, and in a system.

## Why does it work?

The benefits of GitOps can be expressed as the benefits of git plus the benefits of a self-healing system. 



notes - kubernetes often uses this because it's built to be an inherently self healing system

## Where does it fall short?

GitOps seems great, right? It is! But, it's not perfect.

the git in gitops is almost incedental. Google "benefits of git" and check how many of those benefits actually apply to the pattern of a user expressing intent to a self-healing system.

github is unstable....
here comes gitless gitops - aka oci, well guess what....
this fix removes some of those other benefits that come from git and adds complexity to an originally simple practice



## Is there a better way?

a lot of the benefits of git are not utilized in a typical gitops ecosystem

the system doesnt care where it gets the user's intent from


## TODO

the systems can be similar, but dont have to be the same. if the same intent is interpreted differently by 2 different systems, thats fine. If the systems are identical, and the intent from git is identical, the resulting state of the systems should eventually resolve to be identical. If those results are not identical, then the systems are different, by definition. 


you cant look at git to understand what will happen on the system. You have to know the intent AND the context of the system (1 deployment repo deploys to test and prod). this is a gap, or an issue with how we do gitops today. people say git is the "single source of truth", but the power of that statement hinges on the variablility of the systems

for gitops, imo, a given system should process intent idempotently   
the user's intent should also be context-free


gitless gitops helps unify cluster dependency to just OCI, eliminate git. also get image and supply chain security tooling for intent. 
however, if git is down, git drives oci creation so still no changes. well, at least clusters can come up, right? 




what if the gitops tools watched git for changes, but cached them in oci automatically. then if git is down, the cache is there.
