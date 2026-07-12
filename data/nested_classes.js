export const nestedClassesData = {
  title: "Nested Classes",
  concept: "Classes defined within another class for logical grouping and encapsulation.",
  why: "Useful for helper classes, listeners, and encapsulating logic.",
  realWorld: "Configuration properties tied strictly to a specific manager.",
  seleniumMapping: "Page Object Model inner components, custom ExpectedConditions.",
  commonMistakes: "Memory leaks with non-static inner classes keeping outer instance alive.",
  keyPoints: [
    "Four kinds: static nested (no outer instance needed), inner/non-static (requires an outer instance), local (defined inside a method), anonymous (declared and instantiated in one expression).",
    "A non-static inner class instance secretly holds a reference to its outer instance (Outer.this) — that hidden reference is both how it accesses outer fields AND a classic memory-leak source.",
    "Static nested classes can access the outer class's private STATIC members, but not instance members — there is no outer object to read from.",
    "The Builder pattern uses a static nested class precisely because the Builder must exist BEFORE any outer instance does — it's constructing one.",
    "Anonymous classes implement an interface inline: new ExpectedCondition<Boolean>() { ... }. If the interface has exactly one abstract method, a lambda can replace it.",
    "Nesting is encapsulation at the class level: a private static nested class says 'this type is an implementation detail of its outer class' — nobody else should depend on it."
  ],
  examples: [
    { 
      level: "Beginner", 
      title: "Non-Static Inner Class", 
      code: `class Outer {
  class Inner {
    void show() { System.out.println("Inner"); }
  }
}
public class Main {
  public static void main(String[] args) {
    Outer.Inner in = new Outer().new Inner();
    in.show();
  }
}`, 
      output: "Inner", 
      explanation: "Requires instance of outer class.", 
      selenium: "Helper component in a Page Object." 
    },
    { 
      level: "Beginner", 
      title: "Static Nested Class", 
      code: `class Outer {
  static class Nested {
    void show() { System.out.println("Nested"); }
  }
}
public class Main {
  public static void main(String[] args) {
    Outer.Nested n = new Outer.Nested();
    n.show();
  }
}`, 
      output: "Nested", 
      explanation: "Does not require outer instance.", 
      selenium: "Static constants or builder patterns." 
    },
    { 
      level: "Intermediate", 
      title: "Local Inner Class", 
      code: `class Outer {
  void method() {
    class Local {
      void show() { System.out.println("Local"); }
    }
    new Local().show();
  }
}`, 
      output: "Local", 
      explanation: "Class inside a method block.", 
      selenium: "Temporary data structure for a specific test method." 
    },
    { 
      level: "Intermediate", 
      title: "Anonymous Inner Class", 
      code: `interface Greeting { void say(); }
public class Main {
  public static void main(String[] args) {
    Greeting g = new Greeting() {
      public void say() { System.out.println("Hi"); }
    };
    g.say();
  }
}`, 
      output: "Hi", 
      explanation: "Class without a name, declared and instantiated at once.", 
      selenium: "Custom ExpectedConditions implementation." 
    },
    { 
      level: "Intermediate", 
      title: "Shadowing", 
      code: `class Outer {
  int x = 1;
  class Inner {
    int x = 2;
    void show() {
      System.out.println(x); // 2
      System.out.println(Outer.this.x); // 1
    }
  }
}`, 
      output: "2\n1", 
      explanation: "Accessing hidden outer variables.", 
      selenium: "Resolving variable name collisions." 
    },
    { 
      level: "Advanced", 
      title: "Nested Interfaces", 
      code: `class Outer {
  interface NestedIntf { void doIt(); }
}
class Impl implements Outer.NestedIntf {
  public void doIt() { System.out.println("Done"); }
}`, 
      output: "Done", 
      explanation: "Interfaces inside classes.", 
      selenium: "Grouped contract definitions." 
    },
    { 
      level: "Advanced", 
      title: "Builder Pattern", 
      code: `class User {
  private String name;
  private User(Builder b) { this.name = b.name; }
  public static class Builder {
    private String name;
    public Builder setName(String n) { name = n; return this; }
    public User build() { return new User(this); }
  }
}`, 
      output: "User built", 
      explanation: "Uses static nested class for object creation.", 
      selenium: "Building complex test data objects." 
    },
    { 
      level: "Advanced", 
      title: "Anonymous Thread", 
      code: `public class Main {
  public static void main(String[] args) {
    new Thread(new Runnable() {
      public void run() { System.out.println("Anon Thread"); }
    }).start();
  }
}`, 
      output: "Anon Thread", 
      explanation: "Quick thread creation.", 
      selenium: "Quick async tasks." 
    },
    { 
      level: "Selenium-Oriented", 
      title: "Private Inner Class", 
      code: `public class Page {
  private class Locators {
    static final String BTN = "#submit";
  }
  public void click() {
    System.out.println("Clicking " + Locators.BTN);
  }
}`, 
      output: "Clicking #submit", 
      explanation: "Encapsulating locators within Page class.", 
      selenium: "Organizing Page Factory locators." 
    },
    { 
      level: "Selenium-Oriented", 
      title: "Anonymous ExpectedCondition", 
      code: `/* ExpectedCondition<Boolean> cond = new ExpectedCondition<Boolean>() {
  public Boolean apply(WebDriver d) {
    return d.getTitle().length() > 0;
  }
}; */`, 
      output: "Condition evaluated", 
      explanation: "Custom wait condition.", 
      selenium: "WebDriverWait custom rules." 
    }
  ],
  interview: [
    { q: "Static vs Non-Static inner class?", a: "Static doesn't need outer instance, cannot access non-static outer members." },
    { q: "You want a Builder class scoped specifically to a TestUser class, so it doesn't clutter the top-level namespace. Should it be a static nested class or a non-static inner class, and why?", a: "Static nested class — a Builder doesn't need access to a specific TestUser INSTANCE (there isn't one yet; it's building one), and using non-static would force you to have an outer TestUser object before you could even create the Builder, which defeats the purpose. This is exactly the shape of the Builder Pattern example in the Design Patterns module." },
    { q: "A page-specific ExpectedCondition is only ever used inside one Page Object class and nowhere else in the framework. What's the case for making it a private static nested class instead of its own top-level file?", a: "It keeps the condition's implementation physically close to its only usage, avoids polluting the framework's package with a class nobody else needs to know about, and 'private' signals clearly that it's an implementation detail, not part of the framework's public API. Top-level classes should generally be reserved for things multiple files actually need to reference." },
    { q: "You define a non-static inner class inside a long-lived Singleton class, and instances of that inner class end up preventing the Singleton (and everything it references) from being garbage collected even after you're 'done' with the inner instance. Why does this happen?", a: "Every non-static inner class instance secretly holds a reference back to its outer instance (accessible via Outer.this) — as long as ANY inner instance is reachable, the outer instance can't be garbage collected, and if the outer is a long-lived Singleton, this can accidentally pin memory indefinitely. This is precisely the memory-leak risk called out in this module's Common Mistakes." },
    { q: "What's a local class (defined inside a method body), and when would using one actually be justified in test automation code?", a: "A local class is defined entirely within a method and is only visible/usable inside that method — justified when you need a small, throwaway implementation of an interface (like a custom Comparator) that's genuinely only relevant to one method's logic and would be noise anywhere else. In practice, a lambda often replaces this need if the interface is functional (single abstract method)." },
    { q: "Can a static nested class access the outer class's private static fields? Can it access the outer class's private instance fields? Explain the distinction.", a: "Yes to static fields (it belongs to the class itself, and static members are shared at the class level regardless of nesting), no to instance fields (there's no implicit outer object reference for a static nested class to use, since it doesn't require an outer instance to exist at all)." },
    { q: "An anonymous inner class implementing ExpectedCondition<Boolean> is 8 lines long inside a wait() call. A teammate suggests converting it to a lambda. When is that suggestion valid, and when would it not be?", a: "Valid if ExpectedCondition (or whatever interface is being implemented) has exactly one abstract method — that's the definition of a functional interface, which is what makes lambda conversion possible. If the anonymous class overrides multiple methods or needs its own additional state/fields beyond the single method body, it can't become a lambda and must stay an anonymous (or named) class." },
    { q: "Why might a framework deliberately use a private static nested class instead of a separate top-level class for a simple data-holder like 'TestResult' used only within a Reporter class?", a: "It communicates intent clearly to anyone reading the code: TestResult is an implementation detail of Reporter, not something other classes should depend on directly, and nesting it prevents accidental external usage while keeping related code physically co-located — a form of encapsulation applied at the class-organization level, not just the field level." }
  ],
  handsOn: ["Refactor a Page Object to use a static nested Builder."],
  memoryVis: "Outer.this maintains reference, which can cause leaks.",
  challenges: [
    {
      title: "Choose the right nested class type",
      prompt: "This Builder doesn't need an outer instance to exist first. Fill in the modifier that lets it be created independently.",
      code: `public class TestUser {
    ___1___ class Builder {
        public TestUser build() { return new TestUser(); }
    }
}`,
      blanks: [
        { label: "modifier removing the need for an outer instance", answer: "static" }
      ],
      explanation: "A static nested class doesn't require an outer instance to exist first — exactly what a Builder needs, since you're constructing the outer object, not modifying an existing one."
    },
    {
      title: "Reference the enclosing instance explicitly",
      prompt: "Fill in the reference used inside a non-static inner class to access the specific outer object that created it.",
      code: `class Outer {
    int id = 5;
    class Inner {
        void show() { System.out.println(___1___.id); }
    }
}`,
      blanks: [
        { label: "reference to the enclosing outer instance", answer: "Outer.this" }
      ],
      explanation: "Outer.this explicitly refers to the specific outer instance that created this inner instance — needed when the inner class has its own field with the same name, or for clarity."
    }
  ]
};
