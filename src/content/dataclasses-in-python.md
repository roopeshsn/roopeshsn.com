---
title: Dataclasses in Python
createdAt: 2023-10-25
updatedAt: 2023-10-25
category: python
summary: What's the need for Dataclasses in Python?
tags: dataclasses, python, dataclasses in python
author: Roopesh Saravanan
---

Dataclasses are a kind of data structure using classes (classes that hold data). Let's see how to use dataclasses in this byte!

## Dataclasses

Let me define a class named `User` and a constructor that will create a member `name` and assign the `name` argument to it.

```
class User:
    def __init__(self, name):
        self.name = name
```

When I create an object `user` of the class `User` and try to print the object, the default string representation (the class name and the memory address of the object) will be printed.

```
user = User("Roopesh")
print(user)

>> <__main__.User object at 0x7f53c09c6510>
```

The task is to print a meaningful statement. To tackle this, the `__str__` method can be defined in the class like this:

```
class User:
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return f"[User] {self.name}"


user = User("Roopesh")
print(user)

>> [User] Roopesh
```

As you can see above, a full message is printed. Alright, the next task is related to comparing two objects. If I try to create another user object with the same name like this `user1 = User("Roopesh")` and compare it with the `user` object like this `print(user == user1)` then I'll get `False` because Python will use the default equality comparison, which compares the memory addresses of the objects. To tackle this, a `__eq__` method can be defined to compare objects based on the `name` variable, like this:

```
class User:
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return f"[User] {self.name}"

    def __eq__(self, other):
        return self.name == other.name

user = User("Roopesh")
user1 = User("Roopesh")
print(user == user1)
```

So far, we have seen defining [special methods](https://docs.python.org/3/reference/datamodel.html#specialnames) (`__init__`, `__str__`, and more). Dataclasses are designed to simplify the creation of classes that primarily store data, and they automatically add commonly used special methods, reducing the need for us to write boilerplate code.

```
from dataclasses import dataclass

@dataclass
class User:
    name: str

user = User("Roopesh")
print(user)
```

As you see above, there are no special methods defined (including the constructor) for the `User` class, which is defined using the `@dataclass` decorator. In summary, as said before, `dataclasses` are designed to be yet another data structure by utilizing classes.

When I scrolled over the [documentation](https://docs.python.org/3/library/dataclasses.html#module-dataclasses), I found a couple of things interesting. I'll share those in the following and leave others for you to look over.

### asdict

Dataclasses can be converted to dictionaries using the `asdict` function:

```
from dataclasses import dataclass, asdict

@dataclass
class Point:
     x: int
     y: int

@dataclass
class C:
     mylist: list[Point]

p = Point(10, 20)
c = C([Point(0, 0), Point(10, 4)])

print(asdict(c))

>> {'mylist': [{'x': 0, 'y': 0}, {'x': 10, 'y': 4}]}
```

As you see, the variable name is used as a key in the dict conversion.

### make_dataclass

A Dataclass can be created using `make_dataclass`:

```
from dataclasses import dataclass, make_dataclass, field

Point = make_dataclass('Point',
                   [('x', int, field(default=0)),
                    ('y', int, field(default=0))],
                   namespace={'add_one_to_x': lambda self: setattr(self, 'x', self.x + 1)})


origin = Point()
print(origin)
origin.add_one_to_x()
print(origin)

>> Point(x=0, y=0)
>> Point(x=1, y=0)
```

In the above code snippet, when the `add_one_to_x` method is called on an instance of Point, it increments the x value by 1.

## @classmethod decorator

`@classmethod` decorator will correspond to a class itself instead of instance-specific. Meaning classmethod can act as an alternative constructor to create instances.

```
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

    @classmethod
    def create_origin(cls):
        return cls(0, 0)

origin = Point.create_origin()
point = Point(3, 4)

print(origin)
print(point)

>> Point(x=0, y=0)
>> Point(x=3, y=4)
```

As you see `create_origin` method will act as a constructor to create an instance of a class when defined using `@classmethod` decorator.
