---
path: "/2019-11-04-why-context-manager-is-useful"
date: "2019-11-04"
title: "Why Context Manager is useful"
author: "Constantine Yarushkin"
description: "How not to think about consequences when acquiring resources"
image: "efe-yagiz-soysal-XcJDpwrbMyg-unsplash.jpg"
---

## How not to think about consequences when acquiring resources

Imagine this: you automated some actions on a webpage via Selenium
and it works fine. But there are times when it might crash.
You don't want to `if` every single step that can go wrong.

Very graceful solution would be a Context Manager. You've already
used it when opened files. That `with open` is the Context Manager.
It tries to acquire a resource and closes it if something goes wrong,
releasing the given resource.

Let's get back to our example with Selenium. When it crashes browser
window doesn't close, leaving it hang until you close it. Would it be
awesome if that window would close if the program crashed?

There are couple ways to implement Context Manager in Python.
First is the class definition:

```python
from settings import web_driver

class ContextDriver:
    def __init__(self):
        self.driver = web_driver

    def __enter__(self):
        return self.driver

    def __exit__(self):
        self.driver.close()
```

The driver in the settings is a simple Firefox selenium web driver:

```python
from selenium import webdriver

web_driver = webdriver.Firefox()
```

And that's it! Now you can write `with ContextDriver() as driver`
and use that `driver` to perform automation. So if anything goes wrong
it will close the browser window.

Now, writing a class for such an easy task is redundant, in my opinion.
Luckily, in Python we have a useful decorator:

```python
from contextlib import contextmanager
from settings import web_driver

@contextmanager
def ContextDriver():
    try:
        yield web_driver
    finally:
        web_driver.close()
```

Neat, isn't it? In fact, I first wrote this Context Manager via decorator
when encountered this problem at work. And spent quiet some time rewriting
it as a class for this article. This doesn't mean you should know only
how to do it with decorator, even though it's much easier. There are times
when you will need a class and in one of the later articles I'll show that.

And there is one more way to define a Context Manager. Just import closing
and use `with closing(driver) as…` This works with everything that has
a `close()` method. But I'm not a big fan of this.

So now you know why and how to use a Context Manager! But just knowing
is not enough. Try it in your next project. Or even in your current one!
That way you will be confident that you can implement this wherever
it's suitable. Also, this is one of the topics technical interviewers
like to ask about.
