export const interfacesData = {
  title: "Interfaces",
  concept: "An Interface is a completely 'abstract class' that is used to group related methods with empty bodies. A class 'implements' an interface.",
  why: "To achieve total abstraction and multiple inheritance in Java.",
  realWorld: "A universal remote control interface: it has buttons (methods) but the TV (class) provides the actual functionality (implementation).",
  seleniumMapping: "WebDriver is an interface! ChromeDriver and FirefoxDriver are classes that implement it.",
  commonMistakes: [
    "Trying to instantiate an interface using 'new'.",
    "Failing to implement all methods defined in the interface in the implementing class."
  ],
  keyPoints: [
    "An interface is a pure contract: WHAT a class can do, not HOW. Methods are implicitly public abstract; fields are implicitly public static final.",
    "A class 'implements' an interface and must provide every abstract method — or declare itself abstract.",
    "A class extends ONE class but can implement MANY interfaces — this is how Java achieves multiple inheritance of type.",
    "Since Java 8, interfaces can have default and static methods with bodies; since Java 9, private methods too.",
    "Interface vs abstract class: interface = capability contract, no instance state, multiple allowed; abstract class = partial implementation, can hold state and constructors, single inheritance.",
    "WebDriver is an INTERFACE; ChromeDriver/FirefoxDriver/EdgeDriver implement it. That single fact is the most common Selenium-Java interview opener."
  ],
  examples: [
    {
      level: "Beginner",
      title: "Basic Interface Definition",
      code: `interface Animal {
    void sound();
}
class Dog implements Animal {
    public void sound() { System.out.println("Bark"); }
    public static void main(String[] args) {
        Animal myDog = new Dog();
        myDog.sound();
    }
}`,
      output: "Bark",
      explanation: "Defines a contract that implementing classes must fulfill.",
      selenium: "Understanding how WebDriver defines methods like get() and click()."
    },
    {
      level: "Beginner",
      title: "Multiple Interfaces",
      code: `interface Walkable { void walk(); }
interface Swimmable { void swim(); }
class Frog implements Walkable, Swimmable {
    public void walk() { System.out.println("Frog walking"); }
    public void swim() { System.out.println("Frog swimming"); }
    public static void main(String[] args) {
        Frog f = new Frog();
        f.walk(); f.swim();
    }
}`,
      output: "Frog walking\nFrog swimming",
      explanation: "A class can implement multiple interfaces, allowing multiple inheritance of type.",
      selenium: "A custom element wrapper might implement multiple behaviors."
    },
    {
      level: "Intermediate",
      title: "Interface Variables",
      code: `interface Constants {
    int TIMEOUT = 10; // implicitly public static final
}
public class TestConfig implements Constants {
    public static void main(String[] args) {
        System.out.println("Timeout is: " + TIMEOUT);
    }
}`,
      output: "Timeout is: 10",
      explanation: "Variables in interfaces are static and final by default.",
      selenium: "Sometimes used to store locator strings or constant timeout values."
    },
    {
      level: "Intermediate",
      title: "Default Methods (Java 8+)",
      code: `interface Logger {
    void log(String msg);
    default void logError(String msg) {
        System.out.println("ERROR: " + msg);
    }
}
class ConsoleLogger implements Logger {
    public void log(String msg) { System.out.println(msg); }
    public static void main(String[] args) {
        ConsoleLogger cl = new ConsoleLogger();
        cl.log("Info message");
        cl.logError("Failed to find element");
    }
}`,
      output: "Info message\nERROR: Failed to find element",
      explanation: "Allows adding new methods to interfaces without breaking implementing classes.",
      selenium: "Can provide default logging or reporting behavior in test interfaces."
    },
    {
      level: "Intermediate",
      title: "Static Methods in Interfaces",
      code: `interface Helper {
    static String getVersion() {
        return "1.0.0";
    }
}
public class Main {
    public static void main(String[] args) {
        System.out.println(Helper.getVersion());
    }
}`,
      output: "1.0.0",
      explanation: "Utility methods that belong to the interface itself.",
      selenium: "Useful for utility methods related to driver setup in an interface."
    },
    {
      level: "Advanced",
      title: "WebDriver Interface Simulation",
      code: `interface CustomDriver {
    void get(String url);
    void quit();
}
class CustomChromeDriver implements CustomDriver {
    public void get(String url) { System.out.println("Chrome loading: " + url); }
    public void quit() { System.out.println("Chrome closing"); }
}
public class Test {
    public static void main(String[] args) {
        CustomDriver driver = new CustomChromeDriver();
        driver.get("http://google.com");
        driver.quit();
    }
}`,
      output: "Chrome loading: http://google.com\nChrome closing",
      explanation: "This is exactly how Selenium works internally.",
      selenium: "WebDriver driver = new ChromeDriver(); is interface polymorphism."
    },
    {
      level: "Advanced",
      title: "Interface extending Interface",
      code: `interface A { void methodA(); }
interface B extends A { void methodB(); }
class Impl implements B {
    public void methodA() { System.out.println("A"); }
    public void methodB() { System.out.println("B"); }
    public static void main(String[] args) {
        Impl i = new Impl();
        i.methodA(); i.methodB();
    }
}`,
      output: "A\nB",
      explanation: "Interfaces can inherit from other interfaces.",
      selenium: "WebDriver extends SearchContext (which provides findElement)."
    },
    {
      level: "Selenium-Oriented",
      title: "WebElement Interface Concept",
      code: `interface Element {
    void click();
    String getText();
}
class Button implements Element {
    public void click() { System.out.println("Button clicked"); }
    public String getText() { return "Submit"; }
    public static void main(String[] args) {
        Element btn = new Button();
        btn.click();
        System.out.println(btn.getText());
    }
}`,
      output: "Button clicked\nSubmit",
      explanation: "WebElement is an interface implemented by RemoteWebElement.",
      selenium: "Interaction with all DOM elements goes through the WebElement interface."
    },
    {
      level: "Selenium-Oriented",
      title: "JavascriptExecutor Interface Cast",
      code: `interface JavaScriptExecutor {
    void executeScript(String script);
}
class FakeDriver implements JavaScriptExecutor {
    public void executeScript(String script) {
        System.out.println("Running JS: " + script);
    }
    public static void main(String[] args) {
        JavaScriptExecutor js = new FakeDriver();
        js.executeScript("window.scrollBy(0,500)");
    }
}`,
      output: "Running JS: window.scrollBy(0,500)",
      explanation: "Casting a driver instance to another interface to access specific features.",
      selenium: "((JavascriptExecutor) driver).executeScript(...) relies on this concept."
    },
    {
      level: "Selenium-Oriented",
      title: "TakesScreenshot Interface Simulation",
      code: `interface TakesScreenshot {
    void getScreenshot();
}
class ScreenDriver implements TakesScreenshot {
    public void getScreenshot() {
        System.out.println("Saving screenshot.png...");
    }
    public static void main(String[] args) {
        TakesScreenshot ts = new ScreenDriver();
        ts.getScreenshot();
    }
}`,
      output: "Saving screenshot.png...",
      explanation: "Another vital Selenium interface for taking snapshots.",
      selenium: "Casting driver to TakesScreenshot to capture test failures."
    }
  ],
  interview: [
    { q: "Why is WebDriver an interface and not a class?", a: "Because different browsers implement the interactions differently. The interface enforces a standard set of commands." },
    { q: "Can we instantiate an Interface?", a: "No, interfaces cannot be instantiated directly. You must instantiate a class that implements it." },
    { q: "You need to add a new capability (e.g., mobile gesture support) to WebDriver-like classes without breaking every existing implementation (ChromeDriver, FirefoxDriver, etc.). What Java 8+ interface feature makes this possible?", a: "Default methods — adding a new abstract method to an existing interface would force every implementing class to add an implementation or fail to compile, but a default method with a body lets existing classes keep working unchanged while new classes can override it if needed. This is literally why Selenium 4 could add new capabilities to WebDriver without breaking every browser driver." },
    { q: "A class needs to be both 'Clickable' and 'Draggable' — separate, unrelated capabilities. Why does Java's single-inheritance-for-classes rule make interfaces the right tool here instead of a class hierarchy?", a: "A class can only extend one parent class, so you can't model 'is a Clickable AND is a Draggable' through class inheritance without an awkward forced hierarchy. Interfaces solve exactly this: a class can implement both Clickable and Draggable simultaneously, since interfaces describe capabilities, not identity." },
    { q: "Why does 'List<WebElement> elements;' work when List is an interface, not a class?", a: "You never instantiate the interface itself — 'new ArrayList<>()' creates a concrete class instance, and the interface type is just the reference/variable type. This is the same interface-as-contract pattern as WebDriver driver = new ChromeDriver(), applied to collections instead of browsers." },
    { q: "Your team designs a PageComponent interface with 10 abstract methods, and every implementing class has to write boilerplate for 8 of them that rarely change. How would you redesign this using Java 8+ features?", a: "Convert the 8 rarely-changing methods to default methods with sensible default implementations, leaving only the 2 truly page-specific methods as abstract. Implementing classes then only need to override what's actually different for them — this is a common real refactor once teams learn default methods exist." },
    { q: "What's the difference between an abstract class and an interface, and when would you pick one over the other for a Selenium framework's BasePage design?", a: "An abstract class can hold state (fields) and a constructor and supports only single inheritance; an interface (pre-Java 8) was pure contract with no state, though default/static methods now blur this. For BasePage, an abstract class is usually right because it needs to hold a WebDriver field and initialize it in a constructor — pure behavior contracts (like 'Clickable') are better as interfaces." },
    { q: "Can an interface have a constructor? Why or why not?", a: "No — interfaces can't be instantiated directly, so a constructor (which runs when an object is created) has no meaning for them. Only classes that implement the interface have constructors, since only they produce actual objects." },
    { q: "Why are interface fields implicitly 'public static final', and how does this show up in real code?", a: "Interface fields are meant to be shared constants available to all implementers, not per-instance state — hence automatically public, static, and final (can't be reassigned). This is why you sometimes see constants like TIMEOUT_SECONDS defined in an interface: every implementing class gets read-only access to the same shared value." },
    { q: "You see 'public interface Runnable { void run(); }' has exactly one abstract method. Why does that single-method constraint matter beyond just being a design choice?", a: "A single abstract method is what makes an interface a 'functional interface' — eligible for lambda expressions. Runnable() { ... } as an anonymous class can be replaced with () -> { ... } as a lambda specifically because there's only one method to implement, so the compiler knows unambiguously what the lambda is for." }
  ],
  handsOn: [
    "Create an interface 'Reportable' with a method 'logResult()'. Implement it in a TestResult class."
  ],
  memoryVis: "Think of an interface as a contract. The interface says 'You must do this', but doesn't care HOW you do it.",
  challenges: [
    {
      title: "Declare an implementing class",
      prompt: "Fill in the keyword that makes ChromeDriver fulfil the WebDriver contract.",
      code: `public class ChromeDriver ___1___ WebDriver {
    public void get(String url) { /* ... */ }
}`,
      blanks: [
        { label: "keyword for fulfilling an interface contract", answer: "implements" }
      ],
      explanation: "'implements' obligates ChromeDriver to provide a real method body for every abstract method WebDriver declares — 'extends' is reserved for class-to-class inheritance."
    },
    {
      title: "Fix the illegal instantiation",
      prompt: "This line won't compile. Fill in what should replace WebDriver on the right-hand side.",
      code: `WebDriver driver = new ___1___();`,
      blanks: [
        { label: "a concrete implementing class, e.g. ChromeDriver", answer: ["ChromeDriver", "FirefoxDriver", "EdgeDriver"] }
      ],
      explanation: "Interfaces cannot be instantiated with 'new' — only concrete classes that implement them can. The reference type (left side) can stay WebDriver; the object type (right side) must be a real class."
    },
    {
      title: "Complete the functional interface method count rule",
      prompt: "Fill in the number of abstract methods a functional interface (like Runnable) must have to be usable as a lambda.",
      code: `@FunctionalInterface
interface ClickAction {
    void perform(); // exactly ___1___ abstract method
}`,
      blanks: [
        { label: "required count of abstract methods", answer: ["1", "one"] }
      ],
      explanation: "Exactly one abstract method is what makes an interface 'functional' and lambda-eligible — the lambda's body becomes the implementation of that single method."
    }
  ]
};
