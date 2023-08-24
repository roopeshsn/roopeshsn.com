---
title: The Decorator Design Pattern
createdAt: 23-08-2023
category: python
summary: A deep dive into the decorator design pattern
tags: python
author: Roopesh Saravanan
---

Why the name Decorator? What's the need to use a decorator design pattern? Let's find out in this byte.

A decorator is a design pattern. The idea behind this design pattern is to not alter the underlying logic but instead add more functionality on top. That's why it is named a decorator, which will decorate an object without changing its core.

Let's understand the decorator pattern with an example. The problem statement is that if a text is passed, we need to format it with various styles, including bold, italic, etc. How can we achieve this without thinking about any design patterns? Here's a solution that solves the problem!

```python
class TextComponent:
    def __init__(self, text):
        self.text = text
        self.bold = False
        self.italic = False

    def set_bold(self):
        self.bold = True

    def set_italic(self):
        self.italic = True

    def format(self):
        formatted_text = self.text
        if self.bold:
            formatted_text = f"<b>{formatted_text}</b>"
        if self.italic:
            formatted_text = f"<i>{formatted_text}</i>"
        return formatted_text
```

A text can be made bold or italic by invoking the setter methods. Here is how we create a text with both bold and italic.

```python
text = TextComponent("Hello, World!")

text.set_bold()
text.set_italic()
text.set_color("red")

print("Formatted Text:", text.format())
```

The problem with the above approach is that as the number of formatting options increases, the code may become cluttered. Also, every time one should use setter methods for formatting options, Let's see how we can make use of the decorator pattern in this scenario.

If there is a class for a text that has a format method,

```python
class TextComponent:
    def format(self):
        pass
```

Note that the TextComponent class does not have an init method, which means it's an interface or an abstract base class. Now let me extend this class with a format method that will remove the whitespaces in a text.

```python
class PlainText(TextComponent):
    def __init__(self, text):
        self._text = text

    def format(self):
        return self._text.strip()
```

How can we add different formatting styles to the text in the PlainText class? The answer is by creating another class that extends TextComponent,

```python
class TextDecorator(TextComponent):
    def __init__(self, text_component):
        self._text_component = text_component

    def format(self):
        return self._text_component.format()
```

If I need to format a text with bold style, then I can create a class that extends TextDecorator.

```python
class BoldDecorator(TextDecorator):
    def format(self):
        return "<b>" + self._text_component.format() + "</b>"
```

Likewise for the italic style,

```python
class ItalicDecorator(TextDecorator):
    def format(self):
        return "<i>" + self._text_component.format() + "</i>"
```

Here's how I'll make a text with bold and italic:

```python
text = "Hello, World!"

formatted_text = PlainText(text)
print("Plain Text: ", formatted_text.format())

bold_formatted_text = BoldDecorator(formatted_text)
print("Bold Text: ", bold_formatted_text.format())

italic_bold_text = ItalicDecorator(BoldDecorator(formatted_text))
print("Italic Bold Text: ", italic_bold_text.format())
```

In the Decorator design pattern, an object created from a class can indeed be passed to another class (i.e., used as an argument or as an instance variable) to modify its behaviour or state. This is a key aspect of the pattern and allows for the dynamic and flexible addition of functionality to objects without altering their class structure.
