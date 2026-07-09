export const oopsData = {
  title: "Object-Oriented Programming (OOP)",
  concept: "OOP is a paradigm based on 'objects' which contain data and methods. The four main pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction.",
  why: "Provides structure, reusability, and encapsulation, making complex software easier to maintain.",
  realWorld: "Like a blueprint (Class) creating houses (Objects).",
  seleniumMapping: "Page Object Model (POM) relies entirely on OOPS concepts like classes for pages and encapsulation for locators.",
  commonMistakes: [
    "Forgetting to initialize objects, leading to NullPointerException.",
    "Making instance variables public, violating encapsulation."
  ],
  keyPoints: [
    "The 4 pillars: Encapsulation (hide data behind methods), Inheritance (reuse via parent-child), Polymorphism (one interface, many forms), Abstraction (expose what, hide how).",
    "Class = blueprint, Object = instance created with 'new'. The reference variable lives on the stack; the object lives on the heap.",
    "Constructor: same name as class, no return type, runs once at 'new'. If you write no constructor, Java adds a default no-arg one — but ONLY if you wrote none at all.",
    "Overloading = same method name, different parameters, resolved at COMPILE time. Overriding = subclass redefines a parent method, resolved at RUNTIME. This distinction is a guaranteed interview question.",
    "'WebDriver driver = new ChromeDriver()' is polymorphism: parent-type reference, child-type object. Swap ChromeDriver for FirefoxDriver and no other code changes.",
    "'static' members belong to the class, not objects — shared by all instances, accessible without 'new'.",
    "'this' = current object; 'super' = immediate parent. 'this.name = name' resolves constructor parameter shadowing.",
    "Java supports single inheritance for classes (one parent) but multiple inheritance of type via interfaces."
  ],
  examples: [
    {
      level: "Beginner",
      title: "Class & Object",
      code: `public class Car {
    String color = "Red";
    public void drive() { System.out.println("Driving..."); }
    public static void main(String[] args) {
        Car myCar = new Car();
        System.out.println(myCar.color);
        myCar.drive();
    }
}`,
      output: "Red\nDriving...",
      explanation: "A class defines properties and behaviors. An object is an instance of a class.",
      selenium: "Every page in a web app is represented as a Class. You create objects of this class in tests.",
      walkthrough: [
        { code: "String color = \"Red\";", note: "An instance variable (field). Every Car object gets its own copy, stored inside the object on the heap." },
        { code: "public void drive() { ... }", note: "An instance method — behavior that operates on a specific object. You need a Car object to call it." },
        { code: "Car myCar = new Car();", note: "'new Car()' allocates the object on the heap and runs the constructor. 'myCar' is just a reference (pointer) to it, stored on the stack." },
        { code: "System.out.println(myCar.color);", note: "The dot operator accesses the object's field through the reference. Prints this object's color value." },
        { code: "myCar.drive();", note: "Calls the method ON that object. Inside drive(), 'this' refers to myCar." }
      ]
    },
    {
      level: "Beginner",
      title: "Constructors",
      code: `public class User {
    String username;
    public User(String name) {
        this.username = name;
    }
    public static void main(String[] args) {
        User u = new User("admin");
        System.out.println(u.username);
    }
}`,
      output: "admin",
      explanation: "Constructors initialize objects when they are created.",
      selenium: "Used in Page Classes to initialize the WebDriver via PageFactory.initElements().",
      walkthrough: [
        { code: "public User(String name) {", note: "A constructor: same name as the class, NO return type (not even void). Runs automatically when 'new User(...)' is called." },
        { code: "this.username = name;", note: "'this.username' is the object's field; 'name' is the constructor parameter. Without 'this.', 'name = name' would assign the parameter to itself and the field would stay null." },
        { code: "User u = new User(\"admin\");", note: "Creates the object and immediately passes \"admin\" to the constructor — the object is never in a half-initialized state." }
      ]
    },
    {
      level: "Intermediate",
      title: "Encapsulation",
      code: `public class LoginPage {
    private String usernameLocator = "id=user";
    public String getLocator() { return usernameLocator; }
    public void setLocator(String loc) { this.usernameLocator = loc; }
    public static void main(String[] args) {
        LoginPage page = new LoginPage();
        System.out.println(page.getLocator());
    }
}`,
      output: "id=user",
      explanation: "Hiding internal state and requiring all interaction to be performed through an object's methods.",
      selenium: "Locators in Page Object Model should be private, accessed only via public action methods.",
      walkthrough: [
        { code: "private String usernameLocator = \"id=user\";", note: "'private' means only THIS class can touch the field. Other classes cannot do page.usernameLocator — it won't compile." },
        { code: "public String getLocator() { return usernameLocator; }", note: "A getter: the controlled, public way to READ the private data. You could add logging or validation here later without changing callers." },
        { code: "public void setLocator(String loc) { ... }", note: "A setter: the controlled way to WRITE it. This gate is the whole point of encapsulation — you decide what changes are allowed." }
      ]
    },
    {
      level: "Intermediate",
      title: "Inheritance",
      code: `class BaseTest {
    public void setup() { System.out.println("Browser opened"); }
}
public class LoginTest extends BaseTest {
    public void test() { System.out.println("Testing login"); }
    public static void main(String[] args) {
        LoginTest t = new LoginTest();
        t.setup();
        t.test();
    }
}`,
      output: "Browser opened\nTesting login",
      explanation: "A class inherits properties and methods from another class.",
      selenium: "Test classes inherit from a BaseTest class that handles WebDriver setup and teardown."
    },
    {
      level: "Intermediate",
      title: "Polymorphism (Method Overriding)",
      code: `class Browser {
    public void launch() { System.out.println("Launching generic browser"); }
}
class Chrome extends Browser {
    @Override
    public void launch() { System.out.println("Launching Chrome"); }
    public static void main(String[] args) {
        Browser b = new Chrome();
        b.launch();
    }
}`,
      output: "Launching Chrome",
      explanation: "A subclass provides a specific implementation of a method declared in its parent class.",
      selenium: "WebDriver driver = new ChromeDriver(); uses polymorphism.",
      walkthrough: [
        { code: "class Chrome extends Browser {", note: "'extends' makes Chrome a subclass — it inherits everything from Browser and may override its methods." },
        { code: "@Override", note: "Annotation asking the compiler to verify this really overrides a parent method. Catches typos like 'lanuch()' at compile time — always use it." },
        { code: "Browser b = new Chrome();", note: "THE key line: the reference type is the parent (Browser), the actual object is the child (Chrome). Exactly like WebDriver driver = new ChromeDriver()." },
        { code: "b.launch();", note: "At runtime the JVM checks the ACTUAL object type (Chrome) and calls its version — 'Launching Chrome', not the parent's. This is dynamic method dispatch / runtime polymorphism." }
      ]
    },
    {
      level: "Intermediate",
      title: "Abstraction (Abstract Classes)",
      code: `abstract class Report {
    abstract void generate();
}
class HTMLReport extends Report {
    void generate() { System.out.println("HTML Report Generated"); }
    public static void main(String[] args) {
        Report r = new HTMLReport();
        r.generate();
    }
}`,
      output: "HTML Report Generated",
      explanation: "Hiding implementation details and showing only functionality.",
      selenium: "Abstracting complex browser interactions behind simple method calls like click()."
    },
    {
      level: "Advanced",
      title: "Super Keyword",
      code: `class Parent {
    int timeout = 10;
}
class Child extends Parent {
    int timeout = 20;
    void printTimeouts() {
        System.out.println("Child: " + timeout + ", Parent: " + super.timeout);
    }
    public static void main(String[] args) {
        new Child().printTimeouts();
    }
}`,
      output: "Child: 20, Parent: 10",
      explanation: "Used to refer to immediate parent class instance variable or method.",
      selenium: "Used to call parent class constructor in Page Objects if needed."
    },
    {
      level: "Advanced",
      title: "This Keyword",
      code: `public class Element {
    String name;
    public Element(String name) {
        this.name = name;
    }
    public void click() {
        System.out.println("Clicked " + this.name);
    }
    public static void main(String[] args) {
        new Element("SubmitButton").click();
    }
}`,
      output: "Clicked SubmitButton",
      explanation: "Refers to the current object.",
      selenium: "Used heavily when initializing WebElements in constructors to avoid variable shadowing."
    },
    {
      level: "Selenium-Oriented",
      title: "Static Keyword",
      code: `public class Config {
    public static String url = "https://example.com";
    public static void main(String[] args) {
        System.out.println("Testing on: " + Config.url);
    }
}`,
      output: "Testing on: https://example.com",
      explanation: "Static members belong to the class, not instances.",
      selenium: "Often used for global configuration data, ThreadLocal WebDriver instances."
    },
    {
      level: "Selenium-Oriented",
      title: "Method Overloading (Compile-Time Poly)",
      code: `public class WaitUtils {
    public void waitFor(String element) {
        System.out.println("Waiting 10s for " + element);
    }
    public void waitFor(String element, int seconds) {
        System.out.println("Waiting " + seconds + "s for " + element);
    }
    public static void main(String[] args) {
        WaitUtils w = new WaitUtils();
        w.waitFor("Logo");
        w.waitFor("Popup", 30);
    }
}`,
      output: "Waiting 10s for Logo\nWaiting 30s for Popup",
      explanation: "Multiple methods, same name, different parameters.",
      selenium: "Creating custom wait utilities with optional timeout parameters."
    }
  ],
  interview: [
    { q: "What is Polymorphism?", a: "The ability of a variable, function, or object to take on multiple forms (Overloading & Overriding)." },
    { q: "Difference between Abstraction and Encapsulation?", a: "Abstraction hides complexity (shows what it does). Encapsulation hides data (protects how it does it)." },
    { q: "Your framework has 50 Page Object classes, each with its own private WebDriver field initialized in its own constructor. What OOP problem does this create, and how would you fix it?", a: "This duplicates setup logic 50 times and makes a shared change (like adding logging) require editing 50 files — the fix is Inheritance: create a BasePage class that holds the WebDriver field and shared logic (waits, navigation helpers), and have every Page Object extend it. This is the single most common OOP-in-Selenium interview question." },
    { q: "You call driver.findElement(By.id(\"btn\")).click() and get a NullPointerException because findElement returned before the constructor finished setting up @FindBy fields. Which OOP concept explains why PageFactory.initElements() must run inside the constructor?", a: "Constructors run once, at object creation, before any other method can be called on the object — PageFactory.initElements() must execute there so the @FindBy-annotated fields are wired up before any test code tries to use them. Calling it later (e.g., in a random helper method) risks the fields being null exactly when a test needs them." },
    { q: "A junior developer makes all fields in a Page Object public to 'make testing easier.' Why is this a design mistake even though it technically works?", a: "It breaks Encapsulation — any test class can now directly manipulate locators or bypass the page's action methods, meaning validation, waits, or logging inside those methods get skipped inconsistently across the codebase. Keeping fields private and exposing only intentional public methods (login(), search()) is what makes a framework maintainable at scale." },
    { q: "Explain how 'WebDriver driver = new ChromeDriver();' is polymorphism, and why a framework author would deliberately choose to write code this way instead of 'ChromeDriver driver = new ChromeDriver();'", a: "The reference type is the parent interface (WebDriver), the object type is the concrete class (ChromeDriver) — classic runtime polymorphism. Writing it this way means every line of code AFTER this one only depends on the WebDriver interface, so switching to FirefoxDriver later requires changing exactly one line, not every method call in the file." },
    { q: "Two Page Object classes, LoginPage and SignupPage, both need a waitForElement() helper. Should you use Inheritance (both extend BasePage) or copy the method into both classes? Why?", a: "Inheritance — copying the method means any bug fix or improvement (like adding a configurable timeout) has to be manually applied in every copy, and copies inevitably drift out of sync. A shared BasePage with one implementation is both DRY and guarantees consistent wait behavior across the whole framework." },
    { q: "You override equals() on a custom TestUser class but forget to override hashCode(). What breaks, and which OOP principle is violated?", a: "Putting TestUser objects in a HashSet or as HashMap keys breaks silently — two 'equal' objects (per your equals()) can land in different hash buckets and the collection won't recognize them as duplicates. This violates the equals/hashCode contract: objects that are equal MUST have equal hash codes, which is really an API contract layered on top of encapsulation and abstraction." },
    { q: "In an interview, you're asked 'why not just use one giant utility class with static methods for everything instead of OOP with multiple classes?' How do you answer?", a: "Static utility methods can't hold per-page state (like which WebDriver instance or which element locators belong to which page), can't be overridden for different implementations, and don't scale — a giant class becomes an unmaintainable dumping ground. OOP with Page Objects gives you natural boundaries: each class owns its own state and behavior, and Inheritance/Polymorphism let you reuse and extend without duplicating logic." },
    { q: "Why is 'this' needed in a constructor like 'public LoginPage(WebDriver driver) { this.driver = driver; }' but not always needed elsewhere?", a: "It's needed here because the parameter name (driver) and the field name (driver) are identical — without 'this.', 'driver = driver' assigns the parameter to itself and the field stays null. Java only requires 'this.' to disambiguate when a local name shadows a field; if you named the parameter 'wd' instead, 'driver = wd' would work without 'this.'." }
  ],
  handsOn: [
    "Create a BasePage class with common WebDriver methods.",
    "Implement encapsulation by creating a User class with private fields and public getters/setters."
  ],
  memoryVis: "Imagine inheritance as a family tree, encapsulation as a capsule protecting medicine, polymorphism as a person acting as employee at work and parent at home.",
  challenges: [
    {
      title: "Enforce encapsulation",
      prompt: "This locator field should not be directly accessible from outside the class. Fill in the access modifier.",
      code: `public class LoginPage {
    ___1___ String usernameLocator = "id=user";
    public String getLocator() { return usernameLocator; }
}`,
      blanks: [
        { label: "access modifier restricting to this class only", answer: "private" }
      ],
      explanation: "'private' means only LoginPage itself can touch usernameLocator directly — everyone else must go through getLocator(). That gate is the point of encapsulation."
    },
    {
      title: "Complete the polymorphic assignment",
      prompt: "Fill in the reference type so this line demonstrates the same polymorphism as WebDriver driver = new ChromeDriver().",
      code: `class Browser {}
class Chrome extends Browser {}

___1___ b = new Chrome();`,
      blanks: [
        { label: "reference type (the parent class)", answer: "Browser" }
      ],
      explanation: "The reference type is the PARENT (Browser); the object type is the CHILD (Chrome). This is exactly the shape of 'WebDriver driver = new ChromeDriver()' — parent-type reference, child-type object."
    },
    {
      title: "Fix constructor parameter shadowing",
      prompt: "The parameter 'name' and the field 'name' share an identifier. Fill in the missing keyword so the field actually gets assigned.",
      code: `public class Element {
    String name;
    public Element(String name) {
        ___1___.name = name;
    }
}`,
      blanks: [
        { label: "keyword referring to the current object", answer: "this" }
      ],
      explanation: "Without 'this.', writing 'name = name' assigns the parameter to itself — the field stays null. 'this.name' explicitly targets the object's field."
    }
  ]
};
