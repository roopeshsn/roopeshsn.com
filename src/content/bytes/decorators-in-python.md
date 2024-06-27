---
title: Decorators in Python
createdAt: 2023-08-26
updatedAt: 2023-10-25
category: python
summary: What's the need for decorators in Python?
tags: decorators, python, decorators in python
author: Roopesh Saravanan
image: none
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

The concept we saw so far will apply to class decorators too, but the catch is extending the behaviour of classes instead of functions. I have a class named `User` that will have a constructor to initialize the variable `name`,

```
class User:
    def __init__(self, name):
        self.name = name
```

Say I need to log a message whenever a new user is created. The simplest solution is to add a `print` statement inside the constructor so that whenever an object is created, the constructor is called, which will initialize a variable `name` and print the message:

```
class User:
    def __init__(self, name):
        self.name = name
        print(f"[User] {self.name} is created!")
```

But we are going to get the same result in the decorator way:

```
def logger(cls):
    def log(self, message):
        print(f"[{cls.__name__}] {message}")

    cls.log = log
    return cls

```

A function named `logger` will dynamically add a method named `log` to the class that is passed to the logger function (in this case, `User`). Here's the complete code:

```
def logger(cls):
    def log(self, message):
        print(f"[{cls.__name__}] {message}")

    cls.log = log
    return cls

@logger
class User:
    def __init__(self, name):
        self.name = name
        self.log(f"{self.name} is created!")

customer = User("Roopesh")
```

In the above code snippet, the logger function (decorator) is applied to the class `User`. When the `User` class is defined, the decorator is called with `cls` referring to the `User` class.
