---
path: "/2021-02-07-monitoring"
date: "2021-02-07"
title: "Monitoring Apps with Docker Containers"
author: "Constantine Yarushkin"
description: ""
image: "ibrahim-boran-iYkqHp5cGQ4-unsplash.jpg"
tags: "docker"
---

_Photo by_ [_Ibrahim Boran_](https://unsplash.com/@ibrahimboran?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) _on_ [_Unsplash_](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

I already [wrote](https://dev.to/c_v_ya/dockerizing-stuff-you-need-3b7m) about my flow when I deploy one container per service and use it for all of my projects. So it's easier to get a development process up to speed.

This time I'll tell you about connecting containerized services so they can talk to each other. And we'll start with somewhat easy things like [Prometheus](https://prometheus.io/) and [Grafana](https://grafana.com/). And after that it will be a no-brainer for us to spin up an [ELK](https://www.elastic.co/what-is/elk-stack) stack. Let's go! :rocket:

# Side Note

All code examples and configs are available on my GitHub [repo](https://github.com/c-v-ya/con-con).

# Metrics

If you didn't know what Prometheus is used for - it collects various metrics from a service. And a little side thing we need to do before setting up our [God of Fire](https://en.wikipedia.org/wiki/Prometheus) is to create a service we'll be monitoring. I chose it to be a simple Flask app because it requires almost zero efforts.

## Flask App

Create a `flask_app` directory and put next two files there:

```python
# flask_app/app.py
from flask import Flask
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
metrics = PrometheusMetrics(app)
```

```python
# flask_app/wsgi.py
from app import app
```

Also create `requirements.txt` right next to previous two:

```
click==7.1.2
Flask==1.1.2
itsdangerous==1.1.0
Jinja2==2.11.3
MarkupSafe==1.1.1
prometheus-client==0.9.0
prometheus-flask-exporter==0.18.1
Werkzeug==1.0.1
```

Then create `Dockerfile`, same place:

```Dockerfile
FROM python:3.9

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

EXPOSE 8000

RUN apt-get update \
  && apt-get install -y build-essential \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && apt-get clean -y && rm -rf /var/lib/apt/lists/* \
  && pip install --upgrade pip

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENTRYPOINT ["gunicorn", "wsgi:app", "--bind", "0.0.0.0:8000"]
```

That's quite mouthful but all it does is:

- creating an image from python 3.9;
- opens up port 8000;
- updates everything;
- and installs our great app.

Now we build!

    docker build . -t flask_app

And now we run!!

    docker run -d -p 8000:8000 flask_app --name flask_app

And on http://0.0.0.0:8000/metrics we can see a bunch of stuff!!1 :muscle:

## Prometheus

It's time to start metering. Open ~~my~~ our favorite tool to manage containers - [Portainer](https://www.portainer.io/). And first, create a volume. Actually, two volumes. If you've read my previous article you know how it goes. But in case you didn't (why didn't you tho?) - go to "Volumes" tab and hit that blue "Add volume" button. First volume will be used for Prometheus data. So let's name it `prometheus_data`. Second will be used for Prometheus config, therefore the name `prometheus_config_data`.

"Why data for config?" you might ask. Well, because apparently you can't access the Prometheus container via the Portainer console button. Or I'm just stupid :man_shrugging: But we need a way to edit config files without rebuilding container every time. Thus volume for config files.

Creating container, finally. Go to "Containers" and smash the "Add container" button. Then look at the screenshot below and fill values for Name, Image, Ports and Volumes. Maybe change Restart Policy to Unless stopped.

![Prometheus create container](https://dev-to-uploads.s3.amazonaws.com/i/cabzkava29o452v2picn.png)

Then hit the "Deploy the container" button and wait a little.

## Configure Prometheus

Since we ~~don't know how to~~ can't connect to a Prometheus container we will edit it's config file via terminal session. If you're using [nano](https://nano.org/) like I do then just execute next line and make it look the same as below:

    sudo nano /var/lib/docker/volumes/prometheus_config_data/_data/prometheus.yml

```
# my global config
global:
  scrape_interval:     15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
  - static_configs:
    - targets:
      # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: 'prometheus'

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
    - targets: ['localhost:9090']

  - job_name: 'flask_app'
    metrics_path: '/metrics'
    static_configs:
    - targets: ['172.17.0.1:8000']
```

It's the same default config but with additional `job_name` at the end. I decided to be explicit with `metrics_path` here, showing that we can change that if we need to. But **the most important part** is `targets`! You can just believe me that on Linux your host machine's IP address will be `172.17.0.1` for your docker containers. Or you can visit a "Network" tab in Portainer and take a look at "IPV4 IPAM Gateway" for a `bridge` interface.

Now restart Prometheus container and visit http://0.0.0.0:9090/targets. You should see "State" `UP` for both targets.

If we refresh our Great Flask App that serves us 404 on http://0.0.0.0:8000/ and then go to [graph](http://0.0.0.0:9090/graph?g0.expr=flask_http_request_total&g0.tab=0&g0.stacked=0&g0.range_input=1h) for total requests, we should see.. well.. a graph for total requests.

Cool, eh? Let's make it beautiful! :hamster:

## Grafana

Again, create a volume, for example `grafana_data`. Then create container as on screenshot below

![Grafana create container](https://raw.githubusercontent.com/c-v-ya/con-con/master/screenshots/Grafana.png "Grafana create container")

Hit deploy, wait and go to http://0.0.0.0:3000/. Default login/password is admin/admin. You can change that after login.

Configure data source on http://0.0.0.0:3000/datasources. Or locate "Data Sources" tab hovering on :gear: sign on the left. Then click the blue "Add data source" button, select "Prometheus". **Very important**, as before, "URL" parameter inside the "HTTP" section should be `172.17.0.1:9090`. Because Grafana can't access Prometheus container by host name. So we tell it (her?) to connect to our host machine IP address on the port where Prometheus is running. Then smash "Save & Test". As always, you can try to set "URL" to `prometheus_container_name:port` and after saving observe "HTTP Error Bad Gateway".

Now we can hover over :heavy_plus_sign: sign and click on "Dashboard" under "Create". Or just visit http://0.0.0.0:3000/dashboard/new. Then smash "Add new panel". On the right side change "Title" to whatever your heart desires. I chose simple "Flask Total Requests". Below graph set "Metrics" to `flask_http_request_total`. Here is a handy screenshot for you:

![Grafana create dashboard](https://raw.githubusercontent.com/c-v-ya/con-con/master/screenshots/Grafana-Dashboard.png "Grafana create dashboard")

Then click "Apply" in the top right corner. And now you have Grafana which makes beautiful graphs from Prometheus data which monitors your application!

In the [next article](https://dev.to/c_v_ya/setting-up-local-elk-stack-2708) we will set up ELK. But I guess you already know how to do that :wink:
