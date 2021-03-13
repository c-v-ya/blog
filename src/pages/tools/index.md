---
path: "/tools-md"
title: "Stuff I Use"
tags: "python, django, react, aws, sql, web development, blog, resume, cv, experience"
---

## Web frameworks:

- [Django](https://github.com/django/django)
- [FastAPI](https://github.com/tiangolo/fastapi)
- [Flask](https://github.com/pallets/flask)

## Libraries:

- [Black](https://black.readthedocs.io/en/stable) &mdash; _Opinionated Python formatter_
- [Loguru](https://github.com/Delgan/loguru) &mdash; _Logging made easy_
- [Celery](https://github.com/celery/celery) &mdash; _Task queue_
- [Flower](https://github.com/mher/flower) &mdash; _Monitoring for Celery_
- [Pydantic](https://github.com/samuelcolvin/pydantic) &mdash; _Data validation_
- [Backoff](https://github.com/litl/backoff) &mdash; _Retry_
- [Rich](https://github.com/willmcgugan/rich) &mdash; _Beautify console_

## Python

- [PySlackers](https://pyslackers.com/web) &mdash; _Python Slack community_
- [Patterns](https://python-patterns.guide)
- [Anti Patterns](https://docs.quantifiedcode.com/python-anti-patterns)
- [Design Patterns](http://www.mcdonaldland.info/files/designpatterns/designpatternscard.pdf)
- [Code Exmaples](https://python.hotexamples.com)

## Testing:

- [Pytest](https://github.com/pytest-dev/pytest)

### Load testing:

- [Locust](https://github.com/locustio/locust)
- [wrk](https://github.com/wg/wrk)

## Random:

- [BitWarden](https://bitwarden.com) &mdash; _Password manager_
- [Portainer](https://github.com/portainer/portainer) &mdash; _The best tool for managing docker containers_
- [ngrok](https://ngrok.com) &mdash; _Expose localhost to the internet_
- [.gitignore files](https://github.com/github/gitignore)
- [CyberChef](https://gchq.github.io/CyberChef) &mdash; _Various stuff_
- [Crontab Guru](https://crontab.guru)
- [ExcaliDraw](https://excalidraw.com) &mdash; _Diagrams_
- [carbon](https://carbon.now.sh) &mdash; _Images from code_
- [flameshot](https://github.com/flameshot-org/flameshot) &mdash; _ScreenShot with edits_
- [MailTrap](https://mailtrap.io) &mdash; _Email testing_
- [Let's Encrypt](https://letsencrypt.org) &mdash; _TLS sertificates_
- [Python algorithms](https://github.com/TheAlgorithms/Python)
- [Ventoy](https://github.com/ventoy/Ventoy) &mdash; _Multi bootable USB_
- [GitHub emojis](https://gist.github.com/rxaviers/7360908)
- [GitHub badges](https://github.com/badges/shields)
- [Keybr](https://www.keybr.com) &mdash; _Touch typing practice_
- [Every Time Zone](https://everytimezone.com)
- [Flexbox Zombies](https://mastery.games/flexboxzombies) &mdash; _Learn flexbox by playing_
- [Example Responses](https://the-internet.herokuapp.com)
- [DeepL translator](https://www.deepl.com/translator)

## Articles:

- [SSH Config File](https://nerderati.com/2011/03/17/simplify-your-life-with-an-ssh-config-file)
- [Flask with gevent](https://iximiuz.com/en/posts/flask-gevent-tutorial)

# Sutff I Google Every Time:

## Stop docker compose removing everything

    docker-compose down -v --rmi all --remove-orphans

## Load dump into Postgres docker

For `.sql` dumps:

    docker exec -i CONTAINER_NAME psql -U USER_NAME -d DB_NAME < DUMP_NAME.sql

For gzipped dumps:

    gzip -dc DUMP_NAME.gz | docker exec -i CONTAINER_NAME psql -U USER_NAME -d DB_NAME

## Kafka in Docker

### Create topic:

    kafka-topics.sh --create --topic topic \
    --partitions 4 --zookeeper $ZK --replication-factor 1
    kafka-topics.sh --describe --topic topic --zookeeper $ZK

where `ZK = 172.17.0.1:2181`

### Start producing:

    kafka-console-producer.sh --topic=topic \
    --broker-list=`broker-list.sh`

### Consume:

    kafka-console-consumer.sh --topic=topic --bootstrap-server=$HOST

where `HOST = 172.17.0.1:9092`

## Django load all fixtures

    loaddata apps/*/fixtures/*.json

## Upgrade Portainer

    docker stop portainer && docker rm portainer && docker rmi portainer/portainer-ce && docker run -d -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:latest

## Edit Prometheus config

    sudo nano /var/lib/docker/volumes/prometheus_config_data/_data/prometheus.yml

## Git commit custom date

    git commit -am "message" --date "$(date -d -10minutes)"

## Git set email for project

    git config user.email "%email%"

## Git remove from tracking but keep in directory

    git rm --cached %file_name%
    git rm --cached -r %dir_name%

## Fetch and rank live mirrorlist for Arch

As root, not sudo:

    curl -L "https://www.archlinux.org/mirrorlist/?protocol=https&ip_version=4&use_mirror_status=on" | sed -e 's/^#Server/Server/' -e '/^#/d' | rankmirrors -n 20 - > /etc/pacman.d/mirrorlist
