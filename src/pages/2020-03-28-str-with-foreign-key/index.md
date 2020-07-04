---
path: "/2020-03-28-str-with-foreign-key"
date: "2020-03-28"
title: "Why ForeignKey reference in Django model's __str__ method is a bad idea"
author: "Constantine Yarushkin"
description: "Cutting database queries by not referencing Foreign Keys"
image: "israel-palacio-ImcUkZ72oUs-unsplash.jpg"
---

# Cutting database queries by not referencing Foreign Keys

_Photo by_ [_israel palacio_](https://unsplash.com/@othentikisra?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) _on_ [_Unsplash_](https://unsplash.com/@othentikisra?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

So you have a model with foreign key:

```python
from django.db import models
from .models import Author

class Book(models.Model):
    name = models.CharField(...)
    author = models.ForeignKey(to=Author,...)
```

Now you want to see an `author` in your admin panel. Easy, right? Just add:

```python
def __str__(self):
    return f'{self.id} {self.author.name}'
```

What this will do is hit our database for an author name for every row present on a page. Imagine there are 100 rows. That's 100 more hits. This problem is known as the `n+1 query`.

The solution is quiet easy. If that's a `ForeignKey`, you need to use `select_related` on your `queryset`. If that's a `ManyToMany` field, then you need a `prefetch_related` method. And, by the way, that's the difference between those two methods. It's a common interview question.

But in our case it's not a simple query. If you really want to fix that you would need to dig deeper into how Django admin works and provide custom `queryset` to the view.

When I encountered this problem the solution that has been accepted was just removing the reference to `ForeingKey` from the `__str__` method ¯\\\_(ツ)\_/¯

_A little ToDo for myself: find a way to solve this via select_\__related_.
