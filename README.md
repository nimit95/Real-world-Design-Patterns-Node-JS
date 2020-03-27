## Real World Design Patterns using NodeJs APIs

Here you will find the 23 (Gof) design patterns implemented in Javascript using the ES6 classes eith NodeJs Apis. Also I have put an extra effort to make abstract classes as well. These files can be used to learn design patterns as well as Node Apis, You can use the [**docs.md**](docs.md) tto get overview of all examples.

Follows the list of patterns separed by type:

### Creational Patterns
Creational patterns are ones that create objects for you, rather than having you instantiate objects directly. This gives your program more flexibility in deciding which objects need to be created for a given case.

- **Abstract factory:** provide an interface for creating families of related or dependent objects without specifying their concrete classes.
- **Builder:** separate the construction of a complex object from its representation, allowing the same construction process to create various representations.
- **Factory method:** define an interface for creating a single object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.
- **Prototype:** specify the kinds of objects to create using a prototypical instance, and create new objects from the 'skeleton' of an existing object, thus boosting performance and keeping memory footprints to a minimum.
- **Singleton:** ensure a class has only one instance, and provide a global point of access to it.

### Structural Patterns
These concern class and object composition. They use inheritance to compose interfaces and define ways to compose objects to obtain new functionality.

- **Adapter:** allows classes with incompatible interfaces to work together by wrapping its own interface around that of an already existing class.
- **Bridge:** decouples an abstraction from its implementation so that the two can vary independently.
- **Composite:** composes zero-or-more similar objects so that they can be manipulated as one object.
- **Decorator:** dynamically adds/overrides behaviour in an existing method of an object.
- **Facade:** provides a simplified interface to a large body of code.
- **Flyweight:** reduces the cost of creating and manipulating a large number of similar objects.
- **Proxy:** provides a placeholder for another object to control access, reduce cost, and reduce complexity.