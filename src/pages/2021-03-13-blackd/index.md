---
path: "/2021-03-13-blackd"
date: "2021-03-13"
title: "Black in Docker"
author: "Constantine Yarushkin"
description: "Fromatting Python code remotely with PyCharm"
image: "jan-kopriva-Fkt-gbaYJMs-unsplash.jpg"
tags: "docker, black"
---

_Photo by_ [_Jan Kopřiva_](https://unsplash.com/@jxk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) _on_ [_Unsplash_](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

I'm sure you've heard about [Black](https://black.readthedocs.io/en/stable), a formatter for Python. It's opinionated, but really good. One thing I disagree with - is double quotes everywhere. I prefer single. But that is disable-able.

So, what's Docker doing here? Well, you can run Black as a service. Meaning you can skip installation on a local machine and deploy straight with containers.

# Dockerfile

I've published a final [image](https://hub.docker.com/r/ceeveeya/blackd) so you can just pull that from dockerhub. Or build it yourself. Here we go with a multi-stage build to make our container slim.

```
FROM python:3.9-alpine as builder
RUN set -eux \
        && apk add --no-cache \
                gcc \
                musl-dev \
    && pip install --upgrade pip black[d]

FROM python:alpine
COPY --from=builder /usr/local/lib/python3.9/site-packages/ /usr/local/lib/python3.9/site-packages/
COPY --from=builder /usr/local/bin/blackd /usr/local/bin/blackd
EXPOSE 45484
ENTRYPOINT ["blackd", "--bind-host", "0.0.0.0", "--bind-port", "45484"]
```

First we build a `builder` image, installing dependencies and Black itself. Then we just copy what we need from `builder` to the final image. That way we'll have around 70Mb in size.

Now you can build with:

```
docker build . -t blackd:latest
```

# Container

Let's go to "Containers" side-menu in [Portainer](https://www.portainer.io) and smash the "Add container" button. Set:

- name: blackd
- image: blackd:latest OR ceeveeya/blackd:latest
- publish port: 45484:45484

A handy screenshot:
![Blackd create container](https://raw.githubusercontent.com/c-v-ya/con-con/master/screenshots/Blackd.png "Blackd create container")

And press "Deploy".

# Usage

Now when we have working Black service all is left - to use that.

## Pycharm

Add [BlackConnect](https://plugins.jetbrains.com/plugin/14321-blackconnect) plugin and set config as on the screenshot below.

![BlackConnect config](https://raw.githubusercontent.com/c-v-ya/con-con/master/screenshots/BlackConnect.png "BlackConnect config")

## VSCode

Unfortunately, I couldn't find a similar extension for this IDE. But I'm not using VSCode for python development so.. ¯\\\_(ツ)\_/¯ Let's hope somebody will make something like BlackConnect one day :sweat_smile:

---

Now your code should be formatted every time you save it!
