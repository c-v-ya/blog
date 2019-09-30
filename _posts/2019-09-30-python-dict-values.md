---
layout: post
title:  "Getting values from a Python dictionary"
date:   2019-09-30 22:41:12 +0300
categories: jekyll update
---

## How to get a value from a Python dictionary and not get punched by a KeyError

Let's say you have some dictionary with donuts:

{% highlight python %}
donuts = {'vanilla': 1, 'chocolate': 2}
{% endhighlight %}

What will happen if you get a value from this dictionary by slicing?

{% highlight python %}
donuts['vanilla']
1
{% endhighlight %}

But what if dictionary doesn't have such a key?

{% highlight python %}
donuts['blueberry']
Traceback (most recent call last):
  File "<input>", line 1, in <module>
KeyError: 'blueberry'
{% endhighlight %}

A `KeyError` exception…

So, to gracefully get a value from a dictionary you might want to use a `get()` method:

{% highlight python %}
donuts.get('vanilla')
1

donuts.get('blueberry')
None
{% endhighlight %}

Even more, you can provide a default value, if that is what you need:

{% highlight python %}
donuts.get('blueberry', 0)
0
{% endhighlight %}

I'm not saying you should never use slicing when accessing dictionary values.
If you 100% sure the key is present then why not?
Otherwise use `get()`, it might save you a ton of time later.

And even more advanced topic would be `defaultdict` from the `collections` module.
When you can assign a value to a key if that key doesn't exist.