---
title: Decorators in Python
createdAt: 2023-08-26
category: python
summary: What's the need for decorators in Python?
tags: python
author: Roopesh Saravanan
---

Why the name Decorator? What's the need to decorate Python code? Let's find out in this byte.

Note: The decorator design pattern and the decorators in Python are not the same!

In Python, functions are treated as objects. What are its advantages?

- A function can be passed as an argument to another function.
- Functions can be assigned to variables.
- Also, a function can be defined inside another function.

Alright, let me present you with a code snippet. Take a look.

```
def memoize(func):
    cache = {}

    def wrapper(n):
        if n not in cache:
            cache[n] = func(n)
        else:
            print('from cache')
        return cache[n]

    return wrapper

def calculate_factorial(n):
    if n == 0:
        return 1
    else:
        return n * calculate_factorial(n - 1)

fact = memoize(calculate_factorial)
print(fact(5))
print(fact(5))
```

If you run the above code, the console will look like this:

```
120
from cache
120
```

Let me break it down:

- I am passing the `calculate_factorial` function as an argument to a function known as `memoize`.
- When `memoize` is called, it will return a function named `wrapper`.
- I am storing the `wrapper` function in a variable `fact`.
- Whenever I call `fact`, `wrapper` gets called.

The takeaway from the above example is that, for caching purposes, I am wrapping a function and calling a function inside it. This is the concept of a decorator. So a decorator is nothing but the wrapping of functions. The same example can be converted into a decorator.

```
def memoize(func):
    cache = {}

    def wrapper(n):
        if n not in cache:
            cache[n] = func(n)
        else:
            print('from cache')
        return cache[n]

    return wrapper

@memoize
def calculate_factorial(n):
    if n == 0:
        return 1
    else:
        return n * calculate_factorial(n - 1)

print(calculate_factorial(5))
print(calculate_factorial(5))
```

Here's the key difference between the code snippets:

```
# Before
fact = memoize(calculate_factorial)
print(fact(5))

# After
@memoize
def calculate_factorial(n):
    ...

print(calculate_factorial(5))
```

- In the first snippet, I explicitly create a memoized version of the function by calling `memoize(calculate_factorial)`.
- In the second snippet, I apply the `@memoize` decorator directly to the `calculate_factorial` function.

## Class Decorators

WIP
