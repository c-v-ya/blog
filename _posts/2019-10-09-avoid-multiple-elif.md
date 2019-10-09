---
layout: post
title:  "Avoid multiple ElIf situation"
date:   2019-10-09 08:33:25 +0000
categories: jekyll update
---

## Reducing code smelling with a help from first class citizens

Recently I've encountered a situation where `elif's` stacked on top of each other like pancakes.
For example, we are parsing different file formats. Our parsers are ready and we just need a higher level interface.

```python
if file_format == 'xml':
    parse_xml(file_name)
elif file_format == 'csv':
    parse_csv(file_name)
elif file_format == 'json':
    parse_json(file_name)
else:
    parse_txt(file_name)
```

At first there were just `if` and `else`. Then things started to add up and I realized 
that multiple `elif's` was just a smelling piece of code.

To deal with that we can leverage a python concept that functions are first class citizens.
Meaning we can return them or use them as a dictionary values.
So we need to map our file formats with corresponding parsing functions:

```python
parsers = {
 'xml': parse_xml,
 'csv': parse_csv,
 'json': parse_json,
}
```

Notice that I did not include our default txt parser. It's like we rewrote 
`if` and `elif's` of our previous code. Now we need a function to return a parser for a given file format:

```python
def get_parser(file_format):
    return parsers.get(file_format, parse_txt)
```

This will return a parser function from our `parsers` dictionary for a given file format.
Or, if `file_format` is not a key of that dictionary, default `parse_txt`.
As an analogy before, it's like we rewrote the last `else` statement.

To use that we need to call `get_parser` function and we can also immediately execute it:

```python
get_parser('csv')(file_name)
````

But if you want to be more transparent, you can expand this to multiple lines:

```python
parser = get_parser('csv')
parser(file_name)
```

I think this code looks better than at the beginning of the article, although 
might not be obvious for everyone, so don't forget to place some comments :)

And I want to believe that it works a little faster because we're just getting a value
from a dictionary instead of checking every single `if` case.
