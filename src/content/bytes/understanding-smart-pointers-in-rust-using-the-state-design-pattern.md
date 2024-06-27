---
title: Understanding Smart Pointers in Rust Using the State Design Pattern
createdAt: 2023-12-01
updatedAt: 2023-12-01
category: rust
summary: Why Smart Pointers and what they do?
tags: smart pointers in rust, smart pointers, rust, state design pattern
author: Roopesh Saravanan
image: none
---

Think of smart pointers as a data structure. In the case of `Box`, the pointer variable will hold the reference to the object on the heap. The value can be accessed by referencing the variable with the `*` operator.

Apart from `Box`, there are other smart pointers,

- Rc
- RefCell
- Arc and more

As you see in the title, I will explain the smart pointers, especially the `Box`, `Rc`, and `RefCell`, using the state design pattern. Let’s understand the smart pointers in Rust using the state design pattern in this byte.

Let me give you a glimpse of what a state design pattern is. In a state design pattern, every possible state will have separate classes that implement the state interface. This way, every time there is a state transition, the state object will be replaced by a new state object that corresponds to the next state.

To explain the state design pattern, I took the vending machine example from the video titled “Computer Without Memory" from the “Computerphile” YouTube channel.

Here's the representation of the `VendingMachine` struct and its implementation:

```
#[derive(Debug)]
struct VendingMachine {
    state: VendingMachineState,
}

impl VendingMachine {
}
```

Alright, there can be any possible state for a vending machine. I have three states in my mind:

- Idle state
- Has Coin state
- Sold state

For simplicity, I am going to start with the idle state. Before that, let me define a trait `VendingMachineState` that the `IdleState` struct will implement.

```
trait VendingMachineState {
}
```

Also, the flow would be like this:

- Person A inserts a coin
- Select what he or she wants
- And the machine will dispense the selected item

So the `VendingMachineState` trait will have three methods:

```
trait VendingMachineState {
    fn insert(&self);
    fn select(&self);
    fn dispense(&self);
}
```

As I said before, I'll start with the `IdleState` struct and implement the `insert` method.

```
struct IdleState;

impl VendingMachineState for IdleState {
    fn insert(&self) {
        println!("Coin inserted. Select item.");
        // logic to set next state
    }
    fn select(&self) {
        // will implement later
    }
    fn dispense(&self) {
        // will implement later
    }
}

```

As you see, the `IdleState` struct implements the `VendingMachineState` trait, and we implemented the `insert` method. Going back to the implementation of the `VendingMachine` struct, at the start, the state should point to the `IdleState`, right?

```
impl VendingMachine {
    fn new() -> VendingMachine {
        VendingMachine {
            state: IdleState,
        }
    }
}
```

What would happen after inserting a coin? The user should be able to select the item, right? For that, the state of the machine should change. As I said before, the next state would be `HasCoinState`. Before going into the details of the state transition, let us see what the main function looks like.

```
fn main() {
    let mut vending_machine = VendingMachine::new();
    vending_machine.insert();
}
```

As you see, we intialize `vending_machine` and call the `insert` method. So that means I am going to define the `insert` method in the `VendingMachine` struct so that it will call the `insert` method on the state object (`IdleState`).

```
impl VendingMachine {
    // ...

    fn insert(&mut self) {
        self.state.insert();
    }
}
```

Alright, let's now talk about the state transition. The `insert` method in the `IdleState` struct is going to change the state. To accomplish this, I am going to define a method named `set_state` in the `VendingMachine` struct.

```
impl VendingMachine {
    // ...

    fn set_state(&mut self, state: VendingMachineState>) {
        self.state = state;
    }
}
```

`set_state` will accept the type of `VendingMachineState` trait as an argument and set it to the state variable. Let's call the `set_state` method inside the `IdleState` struct's `insert` method:

```
impl VendingMachineState for IdleState {
    fn insert(&self, vending_machine: &mut VendingMachine) {
        println!("Coin inserted. Select item.");
        vending_machine.set_state(IdleState);
    }
}
```

The changes in the above code are:

- Changed the insert method to accept `vending_machine` of type `VendingMachine` as an argument (so that we can call set_state)
- I called set_state by passing IdleState to it. But ideally, we need to pass the next state, which is `HasCoinState`. Though we didn't defined `HasCoinState`, I am passing `IdleState` for now

Alright, here's the complete code of what we have discussed till now:

```
use std::fmt::Debug;

trait VendingMachineState: Debug {
    fn insert(&self, vending_machine: &mut VendingMachine);
}

#[derive(Debug)]
struct IdleState;

impl VendingMachineState for IdleState {
    fn insert(&self, vending_machine: &mut VendingMachine) {
        println!("Coin inserted. Select item.");
        vending_machine.set_state(IdleState);
    }
}

#[derive(Debug)]
struct VendingMachine {
    state: VendingMachineState,
}

impl VendingMachine {
    fn new() -> VendingMachine {
        VendingMachine {
            state: IdleState,
        }
    }

    fn set_state(&mut self, state: VendingMachineState) {
        self.state = state;
    }

    fn insert(&mut self) {
        self.state.insert(self);
    }
}

fn main() {
    let mut vending_machine = VendingMachine::new();
    vending_machine.insert();
    println!("{:?}", vending_machine.state)
}
```

If you try to run the code, it will throw a bunch of errors. This is the time to discuss smart pointers. If you want, come back after 5 minutes by taking a quick break.

Along with the `dyn` keyword error, you'll face another error stating that the `state` doesn't have a size known at compile time. Firstly, we'll fix both of these errors.

## Smart Pointers

### Box

The size of a trait object is not known at compile time. The dyn keyword is used to indicate [dynamic dispatch](https://doc.rust-lang.org/std/keyword.dyn.html#:~:text=The%20dyn%20keyword%20is%20used,the%20type%20has%20been%20erased.) when working with trait objects. Box provides a heap-allocated, fixed-size pointer to the trait object. This is particularly useful when dealing with trait objects.

```
use std::fmt::Debug;

trait VendingMachineState: Debug {
    fn insert(&self, vending_machine: &mut VendingMachine);
}

#[derive(Debug)]
struct IdleState;

impl VendingMachineState for IdleState {
    fn insert(&self, vending_machine: &mut VendingMachine) {
        println!("Coin inserted. Select item.");
        vending_machine.set_state(Box::new(IdleState));
    }
}

#[derive(Debug)]
struct VendingMachine {
    state: Box<dyn VendingMachineState>,
}

impl VendingMachine {
    fn new() -> VendingMachine {
        VendingMachine {
            state: Box::new(IdleState),
        }
    }

    fn set_state(&mut self, state: Box<dyn VendingMachineState>) {
        self.state = state;
    }

    fn insert(&mut self) {
        self.state.insert(self);
    }
}
```

I have used the `Box` smart pointer wherever I want to deal with state. This fixes the size error. But things won't start to work from here. If you try to run the above code, the compiler will throw this error:

```
error[E0502]: cannot borrow `*self` as mutable because it is also borrowed as immutable
  --> src/main.rs:34:9
   |
34 |         self.state.insert(self);
   |         ----------^------^^^^^^
   |         |          |
   |         |          immutable borrow later used by call
   |         mutable borrow occurs here
   |         immutable borrow occurs here

For more information about this error, try `rustc --explain E0502`.
```

The problem relates to ownership and borrowing. Here, the roles of Rc and RefCell come into play.

### Rc and RefCell

`Rc` stands for Reference Counted. `Rc` is used when shared ownership is needed. Think of it as a counter. The count will increase when `Rc` is cloned (`Rc::new(data)`).

`RefCell` allows us to mutate data even when it's shared among multiple references or has immutable references. But it won't allocate memory on the heap.

```
use std::cell::RefCell;
use std::rc::Rc;
use std::fmt::Debug;

trait VendingMachineState: Debug {
    fn insert(&self, vending_machine: &mut VendingMachine);
}

#[derive(Debug)]
struct IdleState;

impl VendingMachineState for IdleState {
    fn insert(&self, vending_machine: &mut VendingMachine) {
        println!("Coin inserted. Select item.");
        vending_machine.set_state(Rc::new(RefCell::new(Box::new(IdleState))));
    }
}

#[derive(Debug)]
struct VendingMachine {
    state: Rc<RefCell<Box<dyn VendingMachineState>>>,
}

impl VendingMachine {
    fn new() -> VendingMachine {
        VendingMachine {
            state: Rc::new(RefCell::new(Box::new(IdleState))),
        }
    }

    fn set_state(&mut self, state: Rc<RefCell<Box<dyn VendingMachineState>>>) {
        self.state = state;
    }

    fn insert(&mut self) {
        self.state.borrow().insert(self);
    }
}

fn main() {
    let mut vending_machine = VendingMachine::new();
    vending_machine.insert();
    println!("{:?}", vending_machine.state)
}
```

If you try to run the above code, you'll end up with another error.

```
Compiling playground v0.0.1 (/playground)
error[E0502]: cannot borrow `*self` as mutable because it is also borrowed as immutable
  --> src/main.rs:36:9
   |
36 |         self.state.borrow().insert(self);
   |         -------------------^^^^^^^^^^^^^- ... and the immutable borrow might be used here, when that temporary is dropped and runs the destructor for type `Ref<'_, Box<dyn VendingMachineState>>`
   |         |
   |         mutable borrow occurs here
   |         immutable borrow occurs here
   |         a temporary with access to the immutable borrow is created here ...

For more information about this error, try `rustc --explain E0502`.
```

Initially, I didn't know what to do, and I asked the people on Reddit. The problem is that we're currently holding `self`, but at the same time we're trying to access the immutable object, which is `state`. Here's the corrected version of the code:

```
use std::cell::RefCell;
use std::fmt::Debug;
use std::rc::Rc;

trait VendingMachineState: Debug {
    fn insert(&self, vending_machine: &VendingMachine);
}

#[derive(Debug)]
struct IdleState;

impl VendingMachineState for IdleState {
    fn insert(&self, vending_machine: &VendingMachine) {
        println!("Coin inserted. Select item.");
        vending_machine.set_state(IdleState);
    }
}

#[derive(Debug)]
struct VendingMachine {
    state: Rc<RefCell<Option<Box<dyn VendingMachineState>>>>,
}

impl VendingMachine {
    fn new() -> VendingMachine {
        VendingMachine {
            state: Rc::new(RefCell::new(Some(Box::new(IdleState)))),
        }
    }

    fn set_state<T>(&self, state: T)
    where
        T: VendingMachineState + 'static,
    {
        *self.state.borrow_mut() = Some(Box::from(state));
    }

    fn insert(&self) {
        let state = self.state.take().unwrap();
        state.insert(self);
    }
}

fn main() {
    let vending_machine = VendingMachine::new();
    vending_machine.insert();
    println!("{:?}", vending_machine.state)
}
```

Here's the [link](https://www.reddit.com/r/rust/comments/17undg3/comment/kbgko4y/?utm_source=share&utm_medium=web2x&context=3) to the reddit thread for the explanation.

Alright, here's the [permalink](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=15823ea1035cfa08c89a05a00ec95b1d) to the complete code in case you need to try it out.
