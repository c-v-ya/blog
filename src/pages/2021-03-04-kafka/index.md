---
path: "/2021-03-04-kafka"
date: "2021-03-04"
title: "Setting Up Kafka in Docker"
author: "Constantine Yarushkin"
description: "It's easier than it looks"
image: "anne-nygard-RaUUoAnVgcA-unsplash.jpg"
tags: "docker, kafka"
---
_Photo by_ [_Anne Nygård_](https://unsplash.com/@polarmermaid?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText) _on_ [_Unsplash_](https://unsplash.com/s/photos/envelope?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)

"Here we go, another article on setting up some thing in Docker :unamused:", you might think. This time it's Kafka. And I wouldn't write about it if it was that trivial.

Thanks to [wurstmeister](https://github.com/wurstmeister/kafka-docker), we have separate docker images for Kafka and Zookeeper. But setting this up [my way](https://dev.to/c_v_ya/dockerizing-stuff-you-need-3b7m) without docker compose is a task in and of itself.

# Zookeper

We'll need two volumes for this guy. You know how it goes, go to "Volumes" side-menu and smash the "Add volume" button. Name the first one `zookeeper_data`, and the second one - `zookeeper_conf`.

Next go to the "Containers" side menu, click the "Add container" button. Set:

- name: zookeeper
- image: wurstmeister/zookeeper:latest
- publish port: 2181:2181
- add volumes:
  - /opt/zookeeper-3.4.13/data to zookeeper_data
  - /opt/zookeeper-3.4.13/conf to zookeeper_conf

As always, a handy screenshot for you:
![Zookeeper create container](https://raw.githubusercontent.com/c-v-ya/con-con/master/screenshots/Zookeeper.png "Zookeeper create container")

Now destroy that "Deploy the container" button and wait a little.

# Kafka

This guy will need just one volume. Name it `kafka_volume`. Now pay attention when creating a container. Set:

- name: kafka
- image: wurstmeister/kafka:latest
- publish port: 9092:9092
- add volumes:
  - /kafka to kafka_data
  - **bind** /var/run/docker.sock to /var/run/docker.sock
- **env**:
  - KAFKA\_ADVERTISED\_HOST\_NAME: 172.17.0.1
  - KAFKA\_ZOOKEEPER\_CONNECT: 172.17.0.1:2181
  - ZK: 172.17.0.1:2181
  - HOST: 172.17.0.1:9092
  - KAFKA\_ADVERTISED\_PORT: 9092

`ZK` and `HOST` envs are just for shortening commands later on.

Screenshot for sanity check:
![Kafka create container](https://raw.githubusercontent.com/c-v-ya/con-con/master/screenshots/Kafka.png "Kafka create container")

And deploy.

# Communicate

There is already a [guide](https://wurstmeister.github.io/kafka-docker) on how to use this stuff, but there is a mistake in the consuming part.

## Create topic

But let's start with producing. Go to ">\_ Console" of the Kafka container. Or execute command below in your terminal session

    docker exec -it kafka /bin/bash

Once inside container create topic just as in above mentioned guide:

    kafka-topics.sh --create --topic topic \
    --partitions 4 --zookeeper $ZK --replication-factor 1
    kafka-topics.sh --describe --topic topic --zookeeper $ZK

You'll see messages about topic creation and it's description:

    Created topic topic.

    Topic: topic PartitionCount: 4 ReplicationFactor: 1 Configs:
    Topic: topic Partition: 0 Leader: 1002 Replicas: 1002 Isr: 1002
    Topic: topic Partition: 1 Leader: 1002 Replicas: 1002 Isr: 1002
    Topic: topic Partition: 2 Leader: 1002 Replicas: 1002 Isr: 1002
    Topic: topic Partition: 3 Leader: 1002 Replicas: 1002 Isr: 1002

## Consumer

The guide says to run this:

    kafka-console-consumer.sh --topic=topic --zookeeper=$ZK

But if you try to do that you'll get an error about `zookeeper is not a recognized option`.

So the correct command is this:

    kafka-console-consumer.sh --topic=topic --bootstrap-server=$HOST

It didn't freeze, it just waits for messages to come.

## Producer

Open another console or terminal session and connect to the kafka container. Execute:

    kafka-console-producer.sh --topic=topic \
    --broker-list=`broker-list.sh`

Now you can type some messages here and it'll show in another session where we have a consumer :rocket:

# Bonus

Inside [kafka_app](https://github.com/c-v-ya/con-con/tree/master/flask_app) in the project repo, you'll find two short files with producer and consumer. This is just to show how we can use Kafka in Python:

    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python consumer.py

In another terminal session:

    source venv/bin/activate
    python producer.py

Now look at the terminal with our python consumer and you'll see a topic, message key and value.

Also, if you didn't close previous sessions with the console consumer, you'll see the same message there. And publishing from the console producer will deliver a message to both console and python consumers.

---

Now you have one more tool in your toolbox! Go use this stuff :muscle:
