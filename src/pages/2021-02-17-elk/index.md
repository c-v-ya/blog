---
path: "/2021-02-17-elk"
date: "2021-02-17"
title: "Setting Up Local ELK Stack"
author: "Constantine Yarushkin"
description: "Taming ElasticSearch, Logstash and Kibana"
image: "chandler-cruttenden-sDrnyCEAAiI-unsplash.jpg"
tags: "docker"
---

_Photo by_ [_Chandler Cruttenden_](https://unsplash.com/@chanphoto?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) _on_ [_Unsplash_](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

As I promised in the [previous post](https://dev.to/c_v_ya/monitoring-apps-with-docker-containers-1oak), here we'll take a look at how to spin up an [ELK](https://www.elastic.co/what-is/elk-stack). Let's go! :rocket:

## Elastic

Straight to the point: open [Portainer](https://www.portainer.io/). Go to "Containers" and smash the "Add container" button. Then look at the screenshot below and fill values for Name, Image, Ports and Volumes. Maybe change Restart Policy to Unless stopped. One mild difference is that you need to click on "Advanced mode" in order to be able to pull an image from Elastic hub. In the screenshot it says "Simple mode" since I already chose advanced.

![Elastic create container](https://raw.githubusercontent.com/c-v-ya/con-con/master/screenshots/Elastic.png "Elastic create container")

Then hit the "Deploy the container" button and wait a little.

Almost nothing new, if you've read my first article about [dockerizing stuff you need](https://dev.to/c_v_ya/dockerizing-stuff-you-need-3b7m). You did read that, right? :thinking:

Here I'm not creating any volumes just because. But you most definitely can. Just map it to `/usr/share/elasticsearch/data`.

## Kibana

First create a volume, for example `kibana_data`. Then create container as on the screenshot below:

![Kibana create container](https://raw.githubusercontent.com/c-v-ya/con-con/master/screenshots/Kibana.png "Kibana create container")

## Logstash

Man, am I tired to repeat this :sweat_smile: Create volume and compare the stuff you're typing with a screenshot:

![alt text](https://raw.githubusercontent.com/c-v-ya/con-con/master/screenshots/Logstash.png "Logstash create container")

Deploy and wait.

Next, configuring.

```
sudo nano /var/lib/docker/volumes/logstash_data/_data/config/logstash.yml
```

Don't know what is this, but it's important:

```
http.host: "0.0.0.0"
xpack.monitoring.elasticsearch.hosts: [ "http://172.17.0.1:9200" ]
```

Now pipeline. I have zero explanation why it was necessary to separate main and pipeline configs, but when I was first figuring it out it took me 3 hours of swear, frustration and eye strain. Maybe it's somewhere in documentation but it's buried so good I couldn't find it.

```
sudo nano /var/lib/docker/volumes/logstash_data/_data/pipeline/logstash.conf
```

I went with this config below since I don't need beat or w/e it is called. I just want to POST logs to Logstash. And you can always configure that as you wish by referencing the [official documentation](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html).

```
input {
  http {
    port => 5044
  }
}

output {
  stdout {
    codec => json
  }
  elasticsearch {
    hosts => ["http://172.17.0.1:9200"]
    index => "logstash-%{+YYYY}"
  }
}
```

Now we try this! Simple `curl -XPUT 'http://127.0.0.1:5044/' -d 'log'` will suffice. Now navigate to http://0.0.0.0:5601/app/management. It's under "Management" / "Stack management" inside the toast menu. Choose "Index Management" below "Data" from the side menu. You can see our "logstash-2021" index. Or whatever year you live in. That means it has data!

![Kibana Index Management](https://raw.githubusercontent.com/c-v-ya/con-con/master/screenshots/Kibana-Index-Management.png "Kibana Index Management")

Go to http://0.0.0.0:5601/app/discover. It's "Kibana" / "Discover" inside the toast menu. And what we'll see? Right, one hit we've just sent!

![Kibana Discover](https://raw.githubusercontent.com/c-v-ya/con-con/master/screenshots/Kibana-Discover.png "Kibana Discover")

Here you can filter everything as you'd like :penguin:

---

Hope you've learned something new from this article. And now you're a master of local deployment with Docker and a help from Portainer! Cheers and happy coding!
