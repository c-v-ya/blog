---
path: "/2020-05-06-django-react-redux-jwt"
date: "2020-05-06"
title: "Django + React, Redux and JWT"
author: "Constantine Yarushkin"
description: "On the way to a full stack dev"
---

# Preface

For the past 4 years I've been coding in Python and when it comes to web I always go with Django + Bootstrap and jQuery. I also know how to style a page with css but nothing super fancy. And I always stayed far away from modern SPAs and their frameworks/libraries such as React, Angular or Vue. I tried it once and the experience was horrible. I knew nothing about babel, webpack, yarn and how it all glues together. Not to mention arrow functions and destructuring in JS. But eventually I decided to try it one more time and spent I-don't-know-how-many hours watching tutorials on React. So now this is my attempt to make Django backend work with React frontend.

The goal of this article is to have a minimal backend with JSON Web Token authentication and simple frontend with login/logout functionality as well as a protected page for logged-in users only. And this is mostly for me to try to make it all work. So if and when I'll need to reproduce the steps in the future I could just review what I did and repeat the steps. And for that reason I decided to:

- leave the default SQLite database so it could be replaced with what's needed
- not to use any UI frameworks or any styles, because that would be opinionated and not suitable for every project

One more thing to note. I won't get in much details about the code listed here. There are tons of useful information out there if you want to really understand things. I'll list every resource that helped me on my way. This is just a how-to guide. And the complete code is available on my [github](https://github.com/c-v-ya/djact), as well as [gitlab](https://gitlab.com/c.v.ya/djact).

With all that out of the way, embrace yourself for a long read! And I hope it will be of any use to you :blush:

# Prerequisites

You'll need to have following packages installed on your system: python (version 3, no legacy code here :sunglasses:), pip, node, npm, yarn. I'm using the Arch linux, so commands listed should be the same or similar to any other Unix-like system.

Let's start with creating a project directory, `mkdir djact` and `cd` into it. Then create virtual environment with `python -m venv venv` and activate it - `source venv/bin/activate`.

# Creating Django project

Install Django, REST Framework and JWT handling with `pip install django djangorestframework djangorestframework-simplejwt django-cors-headers`. The last package is necessary to allow our development react server to interact with Django app. And let's save our dependencies after we install something: `pip freeze > requirements.txt`. Now start a new project `django-admin startproject djact .`. Note the `.` in the end, that's telling Django to create project in current directory.

## Apps

I like all my apps in a separate directory as well as settings. So let's make it: `mkdir djact/{apps, settings}`. And move `setting.py` in a newly created settings directory. To make `settings` a package `touch djact/settings/__init__.py` and insert following lines in there:

```python
# djact/settings/__init__.py
from .settings import *
```

Here and in every file listing first line will be a comment with a relative path to the file. Just so you know.

This way we won't need to override the `DJANGO_SETTINGS_MODULE` variable.

### Core

Now create a directory for the core app `mkdir djact/apps/core` and the app itself `python manage.py startapp core djact/apps/core`. Inside this newly created directory `mkdir {templates,templatetags}`.
Create an empty `__init__.py` and react loader templatetag `load_react.py` inside `templatetags` dir:

```python
# djact/apps/core/templatetags/load_react.py
from django import template
from django.conf import settings
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag
def load_react():
    css = load_css()
    js = load_js()
    return mark_safe(''.join(css + js))


def load_css():
    return [
        f'<link rel="stylesheet" href="/static/{asset}"/>'
        for asset in load_files('.css')
    ]


def load_js():
    return [
        f'<script type="text/javascript" src="/static/{asset}"></script>'
        for asset in load_files('.js')
    ]


def load_files(extension: str):
    files = []
    for path in settings.STATICFILES_DIRS:
        for file_name in path.iterdir():
            if file_name.name.endswith(extension):
                files.append(file_name.name)

    return files
```

I know there is a [django-webpack-loader](https://github.com/owais/django-webpack-loader) but I prefer a simpler approach like the above.

Next create `index.html` with the following content inside `templates` dir:

```jinja
{# djact/apps/core/templates/index.html #}
{% load static %}
{% load load_react %}
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8"/>
        <title>Djact</title>
        <link rel="icon" href="{% static 'favicon.ico' %}">
    </head>
    <body>
        <div id="app"></div>
        {% load_react %}
    </body>
</html>
```

### Authentication

Next we need an app for authentication, so `mkdir djact/apps/authentication` and `python manage.py startapp authentication djact/apps/authentication`. Inside this directory edit the `models.py` file:

```python
# djact/apps/authentication/models.py
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f'<{self.id}> {self.username}'
```

Next we need a serializer for users to sign up `djact/apps/authentication/serializers.py`:

```python
# djact/apps/authentication/serializers.py
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)

        instance.save()

        return instance
```

Then the view `djact/apps/authentication/views.py`:

```python
# djact/apps/authentication/views.py
from rest_framework import permissions
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer


class UserCreate(CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    serializer_class = UserSerializer


user_create = UserCreate.as_view()


class Protected(APIView):
    def get(self, request):
        return Response(data={'type': 'protected'})


protected = Protected.as_view()
```

The `Protected` view is to check that we can access the page only after logging in.

And for the urls we'll have paths to our two views and also to obtain and refresh JWT:

```python
# djact/apps/authentication/urls.py
from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from . import views

app_name = 'authentication'
urlpatterns = [
    path(
        'users/create/',
        views.user_create,
        name='sign-up'
    ),
    path(
        'token/obtain/',
        jwt_views.TokenObtainPairView.as_view(),
        name='token-create'
    ),
    path(
        'token/refresh/',
        jwt_views.TokenRefreshView.as_view(),
        name='token-refresh'
    ),
    path(
        'protected/',
        views.protected,
        name='protected'
    )
]
```

Update main `urls.py` at `djact`:

```python
# djact/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('djact.apps.authentication.urls')),
]
```

### Settings

I love the new `Pathlib` module so lets rewrite everything using this instead of `os`. I'm using `django-environ` to handle environment variables so let's install that `pip install django-environ && pip freeze > requirements.txt`. Copy `DJANGO_SECRET_KEY` from existing config so you won't need to generate a new one (although it's easy). We'll put that in a `.env` file.

```python
# djact/settings/settings.py
import pathlib
from datetime import timedelta

import environ

BASE_DIR = pathlib.Path(__file__).parent.parent
PROJECT_ROOT = BASE_DIR.parent

env = environ.Env()

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DJANGO_DEBUG', False)

ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', default=list())

# Application definition

INSTALLED_APPS = [
    'djact.apps.authentication',
    'djact.apps.core',

    'rest_framework',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'djact.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'djact.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': str(BASE_DIR.joinpath('db.sqlite3')),
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

AUTH_USER_MODEL = 'authentication.User'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),  #
}
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('JWT',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

LOGIN_URL = '/login'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/login'

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'ru'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    PROJECT_ROOT.joinpath('static'),
]

STATIC_ROOT = PROJECT_ROOT / 'public' / 'static'
pathlib.Path(STATIC_ROOT).mkdir(exist_ok=True, parents=True)

MEDIA_URL = '/media/'
MEDIA_ROOT = PROJECT_ROOT / 'public' / 'media'
pathlib.Path(MEDIA_ROOT).mkdir(exist_ok=True, parents=True)

# Logging

LOG_DIR = PROJECT_ROOT / 'log'
LOG_DIR.mkdir(exist_ok=True)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'console': {
            'format': '%(levelname)-8s %(name)-12s %(module)s:%(lineno)s\n'
                      '%(message)s'
        },
        'file': {
            'format': '%(asctime)s %(levelname)-8s %(name)-12s '
                      '%(module)s:%(lineno)s\n%(message)s'
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'console',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'formatter': 'file',
            'filename': LOG_DIR / 'django.log',
            'backupCount': 10,  # keep at most 10 files
            'maxBytes': 5 * 1024 * 1024  # 5MB
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}

LOGGING['loggers'].update(
    {app: {
        'handlers': ['console', 'file'],
        'level': 'DEBUG',
        'propagate': True,
    } for app in INSTALLED_APPS}
)

# Load dev config

if DEBUG:
    try:
        from .dev import *
    except ModuleNotFoundError:
        print('Dev config not found')
```

We can override some settings or add something related only to dev environment in `djact/settings/dev.py` that's why we need last 5 lines. My `dev.py` is looking like this:

```python
# djact/settings/dev.py
from .settings import LOGGING, INSTALLED_APPS, MIDDLEWARE

LOGGING['handlers']['file']['backupCount'] = 1

INSTALLED_APPS += ['corsheaders']
CORS_ORIGIN_ALLOW_ALL = True
MIDDLEWARE.insert(2, 'corsheaders.middleware.CorsMiddleware')

```

Here we tell Django to allow interacting with our react dev server, which will be running on different port and therefore considered as cross origin.

Our .env.example file is looking like this:

```
<!-- .env.example -->
PYTHONDONTWRITEBYTECODE=1

DJANGO_SECRET_KEY=random long string
DJANGO_DEBUG=True for dev environment|False or omit completely for production
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1:8000,0.0.0.0:8000
```

So, create a `.env` file with those variables.

Now create `urls.py` inside `djact/apps/core/` directory containing:

```python
# djact/apps/core/urls.py
from django.urls import re_path
from django.views.generic import TemplateView

app_name = 'core'
urlpatterns = [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='index'),
]
```

And update main urls file:

```python
# djact/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('djact.apps.authentication.urls')),
    path('', include('djact.apps.core.urls')),
]
```

Then run `python manage.py makemigrations` and `python manage.py migrate`.

Our directory structure should look like this:

```
.
├── djact
│   ├── apps
│   │   ├── authentication
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── __init__.py
│   │   │   ├── migrations
│   │   │   │   ├── 0001_initial.py
│   │   │   │   └── __init__.py
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   └── core
│   │       ├── admin.py
│   │       ├── apps.py
│   │       ├── __init__.py
│   │       ├── migrations
│   │       │   └── __init__.py
│   │       ├── templates
│   │       │   └── index.html
│   │       ├── templatetags
│   │       │   ├── __init__.py
│   │       │   └── load_react.py
│   │       └── urls.py
│   ├── asgi.py
│   ├── __init__.py
│   ├── settings
│   │   ├── dev.py
│   │   ├── __init__.py
│   │   └── settings.py
│   ├── urls.py
│   └── wsgi.py
├── .env
├── .env.example
├── manage.py
└── requirements.txt
```

# Creating React application

Let's `mkdir` for our React frontend and dive into it - `mkdir frontend && cd frontend`.

First initialize the frontend project with `yarn init` and answer the questions. Here is my example:

```
$ yarn init
yarn init v1.22.4
question name (frontend): djact
question version (1.0.0):
question description: Django + React
question entry point (index.js):
question repository url:
question author: Constantine
question license (MIT):
question private:
success Saved package.json
Done in 34.53s.
```

Now we can add dependencies with `yarn add react react-dom axios react-redux redux redux-thunk reselect webpack webpack-cli babel-loader @babel/core @babel/node @babel/preset-env @babel/preset-react`. And our dev dependencies with `yarn add -D eslint babel-eslint babel-polyfill eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks eslint-loader style-loader css-loader postcss-loader webpack-dev-server mini-css-extract-plugin cssnano html-webpack-plugin npm-run-all rimraf redux-immutable-state-invariant`.

## Configuring

Create `.eslintrc.js` in current directory with following content:

```js
// frontend/.eslintrc.js
module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
    sourceType: "module",
  },
  plugins: ["react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "no-debugger": "off",
    "no-console": "off",
    "no-unused-vars": "warn",
    "react/prop-types": "warn",
  },
};
```

Babel config is stored in `babel.config.js`:

```js
// frontend/babel.config.js
module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
};
```

Webpack config for dev environment stored in `webpack.config.dev.js`:

```js
// frontend/webpack.config.dev.js
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

process.env.NODE_ENV = "development";

module.exports = {
  mode: "development",
  target: "web",
  devtool: "cheap-module-source-map",
  entry: ["babel-polyfill", "./src/index"],
  output: {
    path: path.resolve(__dirname),
    publicPath: "/",
    filename: "bundle.js",
  },
  devServer: {
    stats: "minimal",
    overlay: true,
    historyApiFallback: true,
    disableHostCheck: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    https: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.API_URL": JSON.stringify("http://localhost:8000/api/"),
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      favicon: "./src/favicon.ico",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                [
                  "import",
                  { libraryName: "antd", libraryDirectory: "es", style: "css" },
                ],
              ],
            },
          },
          "eslint-loader",
        ],
      },
      {
        test: /(\.css)$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

And edit `package.json` `scripts` section to make it look like this:

```json
// frontend/package.json
{
  "name": "djact",
  "version": "1.0.0",
  "description": "Django + React",
  "scripts": {
    "start:dev": "webpack-dev-server --config webpack.config.dev.js --port 3000",
    "clean:build": "rimraf ../static && mkdir ../static",
    "prebuild": "run-p clean:build",
    "build": "webpack --config webpack.config.prod.js",
    "postbuild": "rimraf ../static/index.html"
  },
  "main": "index.js",
  "author": "Constantine",
  "license": "MIT",
  "dependencies": {
    ...
  },
  "devDependencies": {
    ...
  }
}
```

Now let's add a directory for the frontend sources: `mkdir -p src/components`. Also create entry point for React - `touch src/index.js`, with the following content:

```js
// frontend/src/index.js
import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./components/App";

render(
  <Router>
    <App />
  </Router>,
  document.getElementById("app")
);
```

Create `html` template - `touch src/index.html`:

```html
<!-- frontend/src/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Djact</title>
  </head>

  <body>
    <div id="app"></div>
  </body>
</html>
```

You can add a favicon inside `src` directory if you're fancy.

Then create the `App` component - `touch src/components/App.js`. Make it return something simple:

```js
// frontend/src/components/App.js
import React from "react";

function App() {
  return <h1>Hello from React!</h1>;
}

export default App;
```

We can now test that our app is working with `yarn start:dev`. After navigating to http://localhost:3000 we should see a "Hello from React!" greeting!

And here is a production `webpack.config.prod.js`:

```js
// frontend/webpack.config.prod.js
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

process.env.NODE_ENV = "production";

module.exports = {
  mode: "production",
  target: "web",
  devtool: "source-map",
  entry: {
    vendor: ["react", "react-dom", "prop-types"],
    bundle: ["babel-polyfill", "./src/index"],
  },
  output: {
    path: path.resolve(__dirname, "../static"),
    publicPath: "/",
    filename: "[name].[contenthash].js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
    new webpack.DefinePlugin({
      // This global makes sure React is built in prod mode.
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.API_URL": JSON.stringify("http://localhost:8000/api/"),
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      favicon: "./src/favicon.ico",
      minify: {
        // see https://github.com/kangax/html-minifier#options-quick-reference
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                [
                  "import",
                  { libraryName: "antd", libraryDirectory: "es", style: "css" },
                ],
              ],
            },
          },
          "eslint-loader",
        ],
      },
      {
        test: /(\.css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [require("cssnano")],
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
};
```

Now we can `yarn build` and see our bundled file in `static` directory. And if we start our Django app via `python manage.py runserver 0.0.0.0:8000` we would see exactly the same thing but running in production mode.

Our project directory should look like this:

```
.
├── djact
│   ├── apps
│   │   ├── authentication
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── __init__.py
│   │   │   ├── migrations
│   │   │   │   ├── 0001_initial.py
│   │   │   │   └── __init__.py
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   └── core
│   │       ├── admin.py
│   │       ├── apps.py
│   │       ├── __init__.py
│   │       ├── migrations
│   │       │   └── __init__.py
│   │       ├── templates
│   │       │   └── index.html
│   │       ├── templatetags
│   │       │   ├── __init__.py
│   │       │   └── load_react.py
│   │       └── urls.py
│   ├── asgi.py
│   ├── db.sqlite3
│   ├── __init__.py
│   ├── settings
│   │   ├── dev.py
│   │   ├── __init__.py
│   │   └── settings.py
│   ├── urls.py
│   └── wsgi.py
├── .env
├── .env.example
├── frontend
│   ├── babel.config.js
│   ├── package.json
│   ├── src
│   │   ├── components
│   │   │   └── App.js
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   └── index.js
│   ├── webpack.config.dev.js
│   ├── webpack.config.prod.js
│   └── yarn.lock
├── log
│   └── django.log
├── manage.py
├── public
│   ├── media
│   └── static
├── requirements.txt
└── static
    ├── bundle.76ba356d74f1017eda2f.js
    ├── bundle.76ba356d74f1017eda2f.js.map
    ├── favicon.ico
    ├── vendor.9245c714f84f4bbf6bdc.js
    └── vendor.9245c714f84f4bbf6bdc.js.map
```

# API service

Inside `components` directory create `axiosApi.js`:

```js
// frontend/src/components/api/axiosApi.js
import axios from "axios";

const baseURL = process.env.API_URL;
const accessToken = localStorage.getItem("access_token");

const axiosAPI = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: accessToken ? "JWT " + accessToken : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (
      error.response.status === 401 &&
      originalRequest.url === baseURL + "token/refresh/"
    ) {
      window.location.href = "/login/";
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refresh = localStorage.getItem("refresh_token");

      if (refresh) {
        const tokenParts = JSON.parse(atob(refresh.split(".")[1]));

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp > now) {
          try {
            const response = await axiosAPI.post("/token/refresh/", {
              refresh,
            });
            setNewHeaders(response);
            originalRequest.headers["Authorization"] =
              "JWT " + response.data.access;
            return axiosAPI(originalRequest);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("Refresh token is expired", tokenParts.exp, now);
          window.location.href = "/login/";
        }
      } else {
        console.log("Refresh token not available.");
        window.location.href = "/login/";
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export function setNewHeaders(response) {
  axiosAPI.defaults.headers["Authorization"] = "JWT " + response.data.access;
  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);
}

export default axiosAPI;
```

And `authenticationApi.js`:

```js
// frontend/src/components/api/authenticationApi.js
import axiosAPI, { setNewHeaders } from "./axiosApi";

export async function signUp(email, username, password) {
  const response = await axiosAPI.post("users/create/", {
    email,
    username,
    password,
  });
  localStorage.setItem("user", response.data);
  return response;
}

export async function obtainToken(username, password) {
  const response = await axiosAPI.post("token/obtain/", {
    username,
    password,
  });
  setNewHeaders(response);
  return response;
}

export async function refreshToken(refresh) {
  const response = await axiosAPI.post("token/refresh/", {
    refresh,
  });
  setNewHeaders(response);
  return response;
}

// eslint-disable-next-line
export async function logout(accessToken) {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  // TODO: invalidate token on backend
}

export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return !!token;
};
```

# Redux

First create `redux` directory under `djact/frontend/src/` and put following files there:

```js
// frontend/src/redux/configureStore.dev.js
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers";
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import thunk from "redux-thunk";

export default function configureStore(initialState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools

  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk, reduxImmutableStateInvariant()))
  );
}
```

```js
// frontend/src/redux/configureStore.prod.js
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import thunk from "redux-thunk";

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
}
```

```js
// frontend/src/redux/configureStore.js
// Use CommonJS require below so we can dynamically import during build-time.
if (process.env.NODE_ENV === "production") {
  module.exports = require("./configureStore.prod");
} else {
  module.exports = require("./configureStore.dev");
}
```

Store is configured, now to actions! Create `actions` directory inside `redux` with following files:

```js
// frontend/src/redux/actions/types.js
export const LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS";
export const LOGOUT_USER = "LOGOUT_USER";
```

```js
// frontend/src/redux/actions/auth.js
import { LOGIN_USER_SUCCESS, LOGOUT_USER } from "./types";
import { obtainToken, logout } from "../../components/api/authenticationApi";

export function loginUserSuccess(token) {
  return { type: LOGIN_USER_SUCCESS, token };
}

export function loginUser(username, password) {
  return async function (dispatch) {
    try {
      const response = await obtainToken(username, password);
      dispatch(loginUserSuccess(response.data.access));
    } catch (error) {
      console.log("Error obtaining token. " + error);
    }
  };
}

export function logoutUserSuccess() {
  return { type: LOGOUT_USER };
}

export function logoutUser() {
  return async function (dispatch) {
    await logout();
    dispatch(logoutUserSuccess());
  };
}
```

And the final step for redux is reducers themself, inside `frontend/src/redux/reducers` directory.

```js
// frontend/src/redux/reducers/initialState.js
export default {
  accessToken: localStorage.getItem("access_token"),
};
```

```js
// frontend/src/redux/reducers/auth.js
import * as types from "../actions/types";
import initialState from "./initialState";

export default function authReducer(state = initialState.accessToken, action) {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
      return action.token;
    case types.LOGOUT_USER:
      return "";
    default:
      return state;
  }
}
```

```js
// frontend/src/redux/reducers/index.js
import { combineReducers } from "redux";
import auth from "./auth";

const rootReducer = combineReducers({
  auth,
});

export default rootReducer;
```

# Components

## Authentication

We have our reducers ready and now we need to put them to use. So let's create `authentication` dir inside `frontend/src/components` and put the next three files there.

This is will be our wrapper for private routes:

```js
// frontend/src/components/authentication/PrivateRoute.js
import React from "react";
import { Redirect, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { isAuthenticated } from "../api/authenticationApi";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      )
    }
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

export default PrivateRoute;
```

```js
// frontend/src/components/authentication/LoginPage.js
import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loginUser } from "../../redux/actions/auth";

const LoginPage = ({ loginUser, history }) => {
  const [state, setState] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const login = async (event) => {
    event.preventDefault();
    const { username, password } = state;

    await loginUser(username, password);
    history.push("/");
  };

  return (
    <div>
      <h1>Login page</h1>
      <form onSubmit={login}>
        <label>
          Username:
          <input
            name="username"
            type="text"
            value={state.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Password:
          <input
            name="password"
            type="password"
            value={state.password}
            onChange={handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

LoginPage.propTypes = {
  loginUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const mapDispatchToProps = {
  loginUser,
};

export default connect(null, mapDispatchToProps)(LoginPage);
```

And the Sign Up component will be simple because I was lazy to implement this but it should be easy enough:

```js
// frontend/src/components/authentication/SignUpPage.js
import React from "react";
import { useHistory } from "react-router-dom";

const SignUpPage = () => {
  const history = useHistory();

  const handleClick = () => {
    history.push("/");
  };

  return (
    <div>
      <h1>Sign Up page</h1>
      <button onClick={handleClick}>sign up</button>
    </div>
  );
};

export default SignUpPage;
```

## Common

Common components will contain only Header. But in theory there could live everything.. you know.. common.

```js
// frontend/src/components/common/Header.js
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { NavLink, useHistory } from "react-router-dom";
import { logoutUser } from "../../redux/actions/auth";

const Header = ({ accessToken, logoutUser }) => {
  const history = useHistory();

  const handleLogout = async () => {
    await logoutUser();
    history.push("login/");
  };

  return (
    <nav>
      {accessToken ? (
        <>
          <NavLink to="/">Profile</NavLink>
          {" | "}
          <NavLink to="/logout" onClick={handleLogout}>
            Logout
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          {" | "}
          <NavLink to="/sign-up">SignUp</NavLink>
        </>
      )}
    </nav>
  );
};

Header.propTypes = {
  accessToken: PropTypes.string,
  logoutUser: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    accessToken: state.auth,
  };
}

const mapDispatchToProps = {
  logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
```

## Core

And the final piece is core components with application logic. Here we'll have our protected page:

```js
// frontend/src/components/core/ProfilePage.js
import React from "react";
import axiosAPI from "../api/axiosApi";

const ProfilePage = () => {
  const handleClick = async () => {
    const response = await axiosAPI.get("protected/");
    alert(JSON.stringify(response.data));
  };
  return (
    <div>
      <h1>Profile page</h1>
      <p>Only logged in users should see this</p>
      <button onClick={handleClick}>GET protected</button>
    </div>
  );
};

export default ProfilePage;
```

Last thing to do is to update our `App.js`:

```js
// frontend/src/components/App.js
import React from "react";
import { Route, Switch } from "react-router-dom";

import PageNotFound from "./PageNotFound";
import Header from "./common/Header";
import ProfilePage from "./core/ProfilePage";
import PrivateRoute from "./authentication/PrivateRoute";
import LoginPage from "./authentication/LoginPage";
import SignUpPage from "./authentication/SignUpPage";

function App() {
  return (
    <>
      <Header />
      <Switch>
        <PrivateRoute exact path="/" component={ProfilePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/sign-up" component={SignUpPage} />
        <Route component={PageNotFound} />
      </Switch>
    </>
  );
}

export default App;
```

Our final project structure should look like this:

```
.
├── blogpost.md
├── djact
│   ├── apps
│   │   ├── authentication
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── __init__.py
│   │   │   ├── migrations
│   │   │   │   ├── 0001_initial.py
│   │   │   │   └── __init__.py
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   └── core
│   │       ├── admin.py
│   │       ├── apps.py
│   │       ├── __init__.py
│   │       ├── migrations
│   │       │   └── __init__.py
│   │       ├── templates
│   │       │   └── index.html
│   │       ├── templatetags
│   │       │   ├── __init__.py
│   │       │   └── load_react.py
│   │       └── urls.py
│   ├── asgi.py
│   ├── db.sqlite3
│   ├── __init__.py
│   ├── settings
│   │   ├── dev.py
│   │   ├── __init__.py
│   │   └── settings.py
│   ├── urls.py
│   └── wsgi.py
├── .env
├── .env.example
├── frontend
│   ├── babel.config.js
│   ├── package.json
│   ├── src
│   │   ├── components
│   │   │   ├── api
│   │   │   │   ├── authenticationApi.js
│   │   │   │   └── axiosApi.js
│   │   │   ├── App.js
│   │   │   ├── authentication
│   │   │   │   ├── LoginPage.js
│   │   │   │   ├── PrivateRoute.js
│   │   │   │   └── SignUpPage.js
│   │   │   ├── common
│   │   │   │   └── Header.js
│   │   │   ├── core
│   │   │   │   └── ProfilePage.js
│   │   │   └── PageNotFound.js
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── index.js
│   │   └── redux
│   │       ├── actions
│   │       │   ├── auth.js
│   │       │   └── types.js
│   │       ├── configureStore.dev.js
│   │       ├── configureStore.js
│   │       ├── configureStore.prod.js
│   │       └── reducers
│   │           ├── auth.js
│   │           ├── index.js
│   │           └── initialState.js
│   ├── webpack.config.dev.js
│   ├── webpack.config.prod.js
│   ├── yarn-error.log
│   └── yarn.lock
├── log
│   └── django.log
├── manage.py
├── public
│   ├── media
│   └── static
├── requirements.txt
└── static
    ├── bundle.c86ace9a42dd5bd70a59.js
    ├── bundle.c86ace9a42dd5bd70a59.js.map
    ├── favicon.ico
    ├── vendor.0d40e04c29796a70dc89.js
    └── vendor.0d40e04c29796a70dc89.js.map
```

# Running

Now, set environment variables `export $(cat .env | xargs)`. Build the frontend part `cd frontend && yarn:build`. Create superuser for testing with `cd ../ && python manage.py createsuperuser` and follow instructions. Run Django app `python manage.py runserver` and navigate to http://localhost:8000. We should see our login page. Enter credentials you provided when created superuser and we'll get to a protected Profile page. If we click on a `GET protected` button we would see the alert with response from the server.

And that's it! If you're came all the way down here.. wow! And if you've actually implemented all of this.. WOW!! Outstanding job, my friend! Hope you've learned new things or solved a problem of yours :rocket:

Thank you and happy coding!

# Resources

As I promised at the beginning of this article, here is a list of every resource that helped me to build this whole thing:

[PluralSight](https://pluralsight.com/) courses:

- [Building Applications with React and Redux](https://app.pluralsight.com/library/courses/react-redux-react-router-es6/table-of-contents) by [Cory House](https://app.pluralsight.com/profile/author/cory-house)
- [Securing React Apps with Auth0](https://app.pluralsight.com/library/courses/react-auth0-authentication-security/table-of-contents) by [Cory House](https://app.pluralsight.com/profile/author/cory-house)
- [Advanced React.js](https://app.pluralsight.com/library/courses/reactjs-advanced/table-of-contents) by [Samer Buna](https://app.pluralsight.com/profile/author/samer-buna)

Articles:

- [110% Complete JWT Authentication with Django & React - 2020](https://hackernoon.com/110percent-complete-jwt-authentication-with-django-and-react-2020-iejq34ta) by [Stuart Leitch](https://hackernoon.com/u/Toruitas)
- [React + Redux - JWT Authentication Tutorial & Example](https://jasonwatmore.com/post/2017/12/07/react-redux-jwt-authentication-tutorial-example) by [Jason Watmore](https://jasonwatmore.com/)
- [Using JWT in Your React+Redux App for Authorization](https://levelup.gitconnected.com/using-jwt-in-your-react-redux-app-for-authorization-d31be51a50d2) by [Leizl Samano](https://levelup.gitconnected.com/@leizl.samano)
