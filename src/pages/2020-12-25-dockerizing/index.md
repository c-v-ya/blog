---
path: "/2020-12-25-dockerizing"
date: "2020-12-25"
title: "Dockerizing stuff you need"
author: "Constantine Yarushkin"
description: "Fast set up for local development"
image: "dominik-luckmann-SInhLTQouEk-unsplash.jpg"
tags: "docker"
---

_Photo by_ [_Dominik Lückmann_](https://unsplash.com/@exdigy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) _on_ [_Unsplash_](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

When we develop something we all need to use some services such as PostgreSQL, Redis, RabbitMQ and many-many others. But I don't like the idea of installing each and every one of them on my local machine. So the idea of dockerizing everything looks very appealing.

In this article I'll show how to deploy three mentioned services locally with docker. And, as a bonus, easy way of configuring and monitoring our containers park via Portainer.

# Bonus first

Portainer is such a great and powerful tool that I just love! Let's set it up and ease our next steps.

You need to create a volume with a simple terminal command

    $ docker volume create portainer_data

and deploy Portainer

    $ docker run -d -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce

All of this you can find in [deploy section](https://documentation.portainer.io/v2.0/deploy/linux/#deploy-portainer-in-docker) on the official documentation.

Then finish the initial setup. Again, everything is described in the [docs](https://documentation.portainer.io/v2.0/deploy/initial/)

After it's done you can navigate to [localhost:9000](http://localhost:9000) and see the Portainer dashboard.

Now you can monitor your containers, attach to them, check logs, see and remove unused images and volumes, and do everything you could do from the terminal. But you don't need to google or remember those lengthy commands.

Allright, let's go!

# PostgreSQL

As we need to have a persistent storage for our DB let's create a volume. Go to "Volumes" tab in Portainer and push that "Add volume" button. Give it a name, e.g. `pg_data` and hit "Create the volume".

Then go to the "Containers" tab and smash the "Add container" button.
Set `Name: pg`, `Image: postgres:latest`, on "Manual network port publishing" click plus sign and enter `5432` for both "host" and "container".

Next in the "Advanced container settings" section leave everything as is on "Command and logging tab". Move to the "Volumes" tab, hit plus sign and map `/var/lib/postgresql/data` to our `pg_data` volume. After that to the "Env" tab. Set `POSTGRES_PASSWORD` to, well, root password for the database. Let's say it will be `password`. I also like to set `unless stopped` on the "Restart policy" tab. Now we are ready to smash that "Deploy the container" button above our advanced settings section.

Here is an example screenshot:

![Postgres create container](https://dev-to-uploads.s3.amazonaws.com/i/qfvj9baubw83umlgtjv7.png)

Where do I get those variables and values? Docker Hub! Just open the service page and it's all there.

Also you can do everything by hand, but I don't remember how to create a volume with a custom name and map that to a container.

And we can now connect to Postgres via `localhost:5432` as `postgres` user and `password` password!

# Redis

If Postgres was quite a handful, Redis is much easier. The steps are similar.

1. Create volume
2. Create container
   - from `redis:latest`
   - with port binding `6379:6379`;
   - map created volume to `/data`;
   - and, optionally, set restart policy.

Boom, done!

# RabbitMQ

Next in line is Rabbit. It's so easy I don't even want to repeat :grinning:

1. Create volume
2. Create container
   - from `rabbitmq:3-management`
   - with port bindings `5672:5672` and `15672:15672` for management;
   - map created volume to `/var/lib/rabbitmq`;
   - and, if you want, set restart policy.

And again, done! :tada:

# Summary

When using docker you can free yourself from the need to install every service you need. Not to mention if you need different versions of the same thing.

Hope this will ease your struggles with containers (if any) and you'll be able to focus on writing quality code!
