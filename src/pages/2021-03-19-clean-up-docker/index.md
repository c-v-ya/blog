---
path: "/2021-03-19-clean-up-docker"
date: "2021-03-19"
title: "Cleaning Up Space after Docker"
author: "Constantine Yarushkin"
description: "Easily free up gigabytes of space!"
image: "wil-stewart-rYWz3Q88P8g-unsplash.jpg"
tags: "docker, logs"
---

_Photo by_ [_Wil Stewart_](https://unsplash.com/@wilstewart3?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [_Unsplash_](https://unsplash.com?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

You know how I love Docker and try to move [everything](https://dev.to/c_v_ya/setting-up-local-elk-stack-2708) [inside](https://dev.to/c_v_ya/setting-up-kafka-in-docker-1e8a) [containers](https://dev.to/c_v_ya/black-with-docker-596k). But a couple days ago I got a system warning that I have about 1Gb left on the root partition. That was a surprise. At the time I was in a Zoom call. And the first thing that came to my mind was "eh, must be Zoom eating up space". But in the span of 30 minutes 1Gb turned to 100Mb. So I panicked a little, turned everything off, rebooted and got angry that it was still less than 100Mb on `/`.

Imagine my amazement when I discovered that `/var/lib/docker/` was eating around 20Gb! What could it be? Turns out it was.. logs! Tons of logs from all the containers I have. And I only have around 10 running daily. Plus 5 more that I spin up when I need them. Such as Elastic, Kafka and Logstash.

Thankfully, the [solution](https://forums.docker.com/t/some-way-to-clean-up-identify-contents-of-var-lib-docker-overlay/30604/40) was quite easy:

```
sudo sh -c "truncate -s 0 /var/lib/docker/containers/*/*-json.log"
```

This will remove all the logs. That alone freed me 16Gb! My-my...

But I don't want to run this command with Crontab. Or, even worse, run it manually from time to time. There must be a way to set Docker logging policy, I thought. And there sure is. [Official documentation](https://docs.docker.com/config/containers/logging/configure) says how to configure logging and set the max number of files with their size. So, now my `/etc/docker/daemon.json` looks like this:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "1",
    "env": "os,customer"
  }
}
```

Meaning I'll have only one file under 100Mb. Which I think should be suffice for the logs.

---

Hope this will save you some time and nerves if/when you'll encounter a similar issue. So you can just focus on writing quality code :blush:
