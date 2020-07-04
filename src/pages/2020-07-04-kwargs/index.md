---
path: "/2020-07-04-kwargs"
date: "2020-07-04"
title: "** or arguments unpacking in Python"
author: "Constantine Yarushkin"
description: "How you could use arguments unpacking"
image: "markus-spiske-n2M2g5G7b88-unsplash.jpg"
---

# How you could use arguments unpacking

_Photo by_ [_Markus Spiske_](https://unsplash.com/@markusspiske?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) _on_ [_Unsplash_](href="https://unsplash.com/s/photos/items?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

We all know `*args` and `**kwargs` in function parameters. It says that `args` are positional arguments however many you want to provide. And `kwargs` are keyword arguments, however many as well. We aren't limited to name them `args` and `kwargs`, it's just everyone do it and it's convenient to name them this way.

```python
def foo(a, b, *args, **kwargs):
    print(a)
    print(b)
    print([arg for arg in args])
    print([f'{k}: {v}' for k, v in kwargs.items()])

foo(1, 2, 3, 4, f=5, g=6)
1
2
[3, 4]
['f: 5', 'g: 6']
```

`1` and `2` are our required arguments. `3` and `4` would be our `args`. `f=5` and `g=6` are `kwargs`.

But the cool thing I started to implement not so long ago is arguments unpacking. Basically, you tell your function to get a list or dictionary of arguments and use values (or keys and values) as parameters.

```python
foo(*[1, 2])
1
2
[]
[]

foo(1, 2, **{'f': 3})
1
2
[]
['f: 3']
```

In some weird scenario you might need a bunch of arguments in your function. So instead of declaring all those parameters you could use `**kwargs`. And instead of writing every parameter on function call you could use arguments unpacking.

Also, you can use unpacking as a dictionary update.

```python
pets = {'cat': 1, 'dog': 1}
{'cat': 1, 'dog': 1}

animals = {'pig': 2, 'cow': 1, **pets}
{'pig': 2, 'cow': 1, 'cat': 1, 'dog': 1}
```

My use case for this was filtering a Django query. I had a bunch of filters but they all had a few common ones. So my code looked something like this:

```python
finished_filter = {
    'cakes__status': CakeStatus.FINISHED, #  much more like this
}
Store.objects.annotate(
    finished=Count('cakes', filter=Q(**finished_filter),
    ready_to_ship=Count('cakes', filter=Q(**finished_filter, cakes__ready_to_ship=True)
)
```

You get the idea.

I think it's a really powerful tool but as always, don't abuse that power.
