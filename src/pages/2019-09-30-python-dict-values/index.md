---
path: "/2019-09-30-python-dict-values"
date: "2019-09-30"
title: "Getting values from a Python dictionary"
author: "Constantine Yarushkin"
description: "How to get a value from a Python dictionary and not get punched by a KeyError"
image: "sharon-mccutcheon-s4RaGIo2eYI-unsplash.jpg"
tags: "python, dictionary, beginners"
---

## How to get a value from a Python dictionary and not get punched by a KeyError

_Photo by_ [_Sharon McCutcheon_](https://unsplash.com/@sharonmccutcheon?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) _on_ [_Unsplash_](https://unsplash.com/s/photos/donut?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Let's say you have some dictionary with donuts:

```python
donuts = {'vanilla': 1, 'chocolate': 2}
```

What will happen if you get a value from this dictionary by slicing?

```python
donuts['vanilla']
1
```

But what if dictionary doesn't have such a key?

```python
donuts['blueberry']
Traceback (most recent call last):
  File "<input>", line 1, in <module>
KeyError: 'blueberry'
```

A `KeyError` exception…

So, to gracefully get a value from a dictionary you might want to use a `get()` method:

```python
donuts.get('vanilla')
1

donuts.get('blueberry')
None
```

Even more, you can provide a default value, if that is what you need:

```python
donuts.get('blueberry', 0)
0
```

I'm not saying you should never use slicing when accessing dictionary values.
If you 100% sure the key is present then why not?
Otherwise use `get()`, it might save you a ton of time later.

And even more advanced topic would be `defaultdict` from the `collections` module.
When you can assign a value to a key if that key doesn't exist.
