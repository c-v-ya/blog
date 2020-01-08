---
layout: post
title:  "SQL Cursor via Context Manager"
date:   2020-01-08 18:41:12 +0000
---

## Automatically closing database connection with Context Manager

If you don't know what a Context Manager is I recommend you to read about them. Dan Bader wrote a good article. But since you are here, why not read [my post](https://cos-of-me.github.io/blog/2019/11/04/why-context-manager-is-useful.html)?

Now, it's nothing special to write a cursor. You need a driver and credentials to connect to the database. In this example I'll use MySQL driver. My credentials are stored in `settings.py` (not in plain text but environment variables) as a dictionary.

First, we need to provide a driver and credentials to our cursor:

```python
import mysql.connector as connector

from settings import DATABASE

class Cursor:
    def __init__(self,
                 host=DATABASE.get('HOST'),
                 user=DATABASE.get('USER'),
                 password=DATABASE.get('PASSWORD'),
                 db_name=DATABASE.get('NAME'),
                 driver=connector,
        ):
        self.driver = driver
        self.connection = self.driver.connect(
                          host=host,
                          user=user,
                          password=password,
                          database=db_name
        )
        self.cursor = self.connection.cursor()
```

Now we need to provide methods of a Context Manager to our class:

```python
class Cursor:
    def __init__(...)
    def __enter__(self):
        return self.cursor
    def __exit__(self, ext_type, exc_value, traceback):
        self.cursor.close()
        if isinstance(exc_value, Exception):
            self.connection.rollback()
        else:
            self.connection.commit()
        self.connection.close()
```

And finally, we need to return something from the database, when it is needed:

```python
class Cursor:
    def __init__(...)
    def __iter__(self):
        for item in self.cursor:
            yield item
    def __enter__(...)
    def __exit__(...)
```

Done. Usage is a simple `with Cursor() as cursor:`

I've never bothered to simplify it via `@contextmanager` decorator because this implementation work perfectly fine for me. And I'm not sure if we can apply that decorator to a class.

I'd like to use ORM because it makes things so much easier and faster. But sometimes ORM is an overkill and you need to interact with DB manually.

Hope you find this helpful if you ever need to write a custom Cursor.
