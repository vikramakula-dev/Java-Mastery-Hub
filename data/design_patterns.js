export const designPatternsData = {
  title: "Design Patterns",
  concept: "Design patterns are proven, reusable solutions to common software design problems. They're not code you copy-paste — they're a shared vocabulary for structuring code.",
  why: "Interviewers use design patterns to test whether you can structure a real automation framework, not just write syntax. Almost every mature Selenium framework leans on 3-4 of these patterns.",
  realWorld: "Like architectural blueprints — a 'load-bearing wall' pattern solves the same structural problem whether it's a house or an office building. You recognize the shape and apply it.",
  seleniumMapping: "Singleton → one WebDriver instance per thread. Factory → picking ChromeDriver vs FirefoxDriver at runtime. Builder → constructing complex test data or DesiredCapabilities. Page Object Model → structuring every page as a class.",
  commonMistakes: [
    "Using Singleton for WebDriver without ThreadLocal — parallel tests then share one browser and corrupt each other's state.",
    "Overusing patterns where a plain class would do — patterns solve real recurring problems, not everything.",
    "Confusing Factory (creates concrete objects) with Builder (assembles a complex object step-by-step) — they solve different problems."
  ],
  keyPoints: [
    "Patterns are grouped into 3 families: Creational (how objects get created — Singleton, Factory, Builder), Structural (how classes/objects compose — Adapter, Decorator), Behavioral (how objects communicate — Strategy, Observer). Selenium interviews mostly probe Creational + Page Object Model.",
    "Singleton guarantees exactly one instance of a class exists, with a single global access point — but in multi-threaded test runs you need ThreadLocal<T>, not a plain static field, or parallel threads will share (and corrupt) the same driver.",
    "Factory Pattern hides 'which concrete class to instantiate' behind a method — the caller asks for 'a browser' and gets a ChromeDriver or FirefoxDriver back without an if/else scattered through test code.",
    "Builder Pattern constructs a complex object step-by-step via chained method calls, avoiding constructors with 8 parameters. Selenium's own ChromeOptions and DesiredCapabilities are built this way.",
    "Page Object Model (POM) is itself a pattern: each web page becomes a class, its elements become fields, its user actions become methods. It's really Encapsulation + Abstraction applied to test automation.",
    "Page Factory (@FindBy + PageFactory.initElements()) is Selenium's built-in helper that lazily initializes POM fields using annotations instead of manual findElement() calls.",
    "Strategy Pattern lets you swap an algorithm at runtime — e.g. swapping wait strategies (poll every 500ms vs poll every 2s) without changing the calling code.",
    "Interview framing that works: 'I use Singleton with ThreadLocal for driver management, Factory for cross-browser instantiation, and POM for page structure' is a complete, credible answer to 'how would you design a framework?'"
  ],
  examples: [
    {
      level: "Beginner",
      title: "Singleton Pattern (Naive)",
      code: `public class ConfigManager {
    private static ConfigManager instance;
    private String baseUrl = "https://example.com";

    private ConfigManager() {}

    public static ConfigManager getInstance() {
        if (instance == null) {
            instance = new ConfigManager();
        }
        return instance;
    }

    public String getBaseUrl() { return baseUrl; }

    public static void main(String[] args) {
        ConfigManager c1 = ConfigManager.getInstance();
        ConfigManager c2 = ConfigManager.getInstance();
        System.out.println(c1 == c2);
        System.out.println(c1.getBaseUrl());
    }
}`,
      output: "true\nhttps://example.com",
      explanation: "Only one ConfigManager ever exists. c1 and c2 are the SAME object — the reference check with == is true.",
      selenium: "Storing global test config (base URL, environment, credentials) that every test needs without passing it around manually.",
      walkthrough: [
        { code: "private static ConfigManager instance;", note: "A single static field holds the one-and-only instance. 'static' means it belongs to the class, not to any object — so it can exist before any object does." },
        { code: "private ConfigManager() {}", note: "A PRIVATE constructor. This is the core trick: nobody outside this class can write 'new ConfigManager()' — the compiler blocks it. The only way in is getInstance()." },
        { code: "if (instance == null) { instance = new ConfigManager(); }", note: "Lazy initialization: the object is created only the first time it's needed, not at class-load time. This version is NOT thread-safe — two threads could both pass the null check simultaneously and create two instances." },
        { code: "return instance;", note: "Every subsequent call returns the SAME object — that's what the c1 == c2 check proves." }
      ]
    },
    {
      level: "Intermediate",
      title: "Thread-Safe Singleton with ThreadLocal (Selenium Driver Manager)",
      code: `import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class DriverManager {
    private static final ThreadLocal<WebDriver> driverThreadLocal = new ThreadLocal<>();

    private DriverManager() {}

    public static void setDriver() {
        if (driverThreadLocal.get() == null) {
            driverThreadLocal.set(new ChromeDriver());
        }
    }

    public static WebDriver getDriver() {
        return driverThreadLocal.get();
    }

    public static void quitDriver() {
        if (driverThreadLocal.get() != null) {
            driverThreadLocal.get().quit();
            driverThreadLocal.remove();
        }
    }
}`,
      output: "(No console output — used across test threads)",
      explanation: "This is the REAL pattern used in production Selenium frameworks — one WebDriver per thread, not one WebDriver globally.",
      selenium: "Enables parallel test execution: each test thread gets an isolated browser instance via getDriver(), with zero risk of one test's actions leaking into another's browser.",
      walkthrough: [
        { code: "private static final ThreadLocal<WebDriver> driverThreadLocal = new ThreadLocal<>();", note: "Not a single WebDriver — a ThreadLocal WRAPPER around one. Each thread that calls .set()/.get() on this gets its own private copy, invisible to other threads." },
        { code: "driverThreadLocal.set(new ChromeDriver());", note: "Called once per test thread (typically in an @BeforeMethod). Creates a browser scoped to the calling thread only." },
        { code: "public static WebDriver getDriver() { return driverThreadLocal.get(); }", note: "Every test method calls this to get ITS thread's driver. Two tests running in parallel calling getDriver() at the same instant get two different ChromeDriver objects." },
        { code: "driverThreadLocal.get().quit(); driverThreadLocal.remove();", note: "Teardown: quit() closes the browser, remove() clears the ThreadLocal slot. Skipping remove() in a reused thread pool leaks memory — a real interview follow-up question." }
      ]
    },
    {
      level: "Intermediate",
      title: "Factory Pattern (Cross-Browser Driver Factory)",
      code: `import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class DriverFactory {
    public static WebDriver createDriver(String browserName) {
        switch (browserName.toLowerCase()) {
            case "chrome":
                return new ChromeDriver();
            case "firefox":
                return new FirefoxDriver();
            default:
                throw new IllegalArgumentException("Unsupported browser: " + browserName);
        }
    }

    public static void main(String[] args) {
        WebDriver driver = DriverFactory.createDriver("chrome");
        System.out.println(driver.getClass().getSimpleName());
    }
}`,
      output: "ChromeDriver",
      explanation: "The caller never writes 'new ChromeDriver()' directly — it asks the factory for 'a driver' by name and gets the right concrete type back.",
      selenium: "Reading the browser name from a config file or TestNG parameter and instantiating the matching driver — this is exactly how cross-browser test suites are structured.",
      walkthrough: [
        { code: "public static WebDriver createDriver(String browserName) {", note: "Return type is the INTERFACE (WebDriver), not a concrete class — callers depend on the abstraction, never the implementation. This is polymorphism doing the real work underneath the Factory pattern." },
        { code: "switch (browserName.toLowerCase()) {", note: "The ONLY place in the whole framework that knows about ChromeDriver/FirefoxDriver by name. Add EdgeDriver later and you touch exactly one method." },
        { code: "default: throw new IllegalArgumentException(...);", note: "Fails loudly on a typo'd browser name instead of silently returning null — a null WebDriver would NPE confusingly three lines later instead of here, at the source." },
        { code: "WebDriver driver = DriverFactory.createDriver(\"chrome\");", note: "The test code is now browser-agnostic — swap the string to \"firefox\" and every subsequent line of the test is unchanged." }
      ]
    },
    {
      level: "Advanced",
      title: "Builder Pattern (Test Data Builder)",
      code: `public class TestUser {
    private final String username;
    private final String email;
    private final String role;

    private TestUser(Builder builder) {
        this.username = builder.username;
        this.email = builder.email;
        this.role = builder.role;
    }

    public String toString() {
        return username + " <" + email + "> [" + role + "]";
    }

    public static class Builder {
        private String username = "guest";
        private String email = "guest@example.com";
        private String role = "USER";

        public Builder username(String username) { this.username = username; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public TestUser build() { return new TestUser(this); }
    }

    public static void main(String[] args) {
        TestUser admin = new TestUser.Builder()
            .username("admin")
            .email("admin@example.com")
            .role("ADMIN")
            .build();
        System.out.println(admin);
    }
}`,
      output: "admin <admin@example.com> [ADMIN]",
      explanation: "Chained method calls assemble the object step by step, each returning 'this' so calls can be strung together — readable even with many optional fields.",
      selenium: "Building test data objects (users, form payloads, DesiredCapabilities) where most fields have sensible defaults and only a few need overriding per test.",
      walkthrough: [
        { code: "private TestUser(Builder builder) { ... }", note: "TestUser's own constructor is PRIVATE — the only way to create one is through Builder.build(). This forces every TestUser to be fully, correctly assembled." },
        { code: "public Builder username(String username) { this.username = username; return this; }", note: "Each setter returns 'this' (the Builder itself) instead of void — that's what makes .username(...).email(...).role(...) chainable in a single expression." },
        { code: "private String username = \"guest\"; ...", note: "Builder fields have sensible DEFAULTS. Callers only override what they care about — compare to a constructor with 8 positional parameters where you must supply all of them in the right order." },
        { code: "new TestUser.Builder().username(\"admin\")....build()", note: "Reads almost like a sentence. .build() is the final step that hands the assembled data to TestUser's private constructor and returns the finished, immutable object." }
      ]
    },
    {
      level: "Selenium-Oriented",
      title: "Page Object Model with Page Factory",
      code: `import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class LoginPage {
    private WebDriver driver;

    @FindBy(id = "username")
    private WebElement usernameField;

    @FindBy(id = "password")
    private WebElement passwordField;

    @FindBy(id = "loginBtn")
    private WebElement loginButton;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    public void login(String user, String pass) {
        usernameField.sendKeys(user);
        passwordField.sendKeys(pass);
        loginButton.click();
    }
}`,
      output: "(No console output — this is a reusable page class, not a runnable program)",
      explanation: "Every page becomes a class: its elements are private fields, its user actions are public methods. Tests call login(...) — they never touch locators directly.",
      selenium: "The single most common structural pattern in every serious Selenium framework — it's what makes tests survive a UI redesign: one class changes, not fifty tests.",
      walkthrough: [
        { code: "@FindBy(id = \"username\")\nprivate WebElement usernameField;", note: "Declarative locator: instead of manually calling driver.findElement(By.id(\"username\")) everywhere, the annotation says WHERE this element lives. It's still private — encapsulation again." },
        { code: "PageFactory.initElements(driver, this);", note: "Called once in the constructor. It scans all @FindBy fields and lazily wires them up — the actual findElement() calls happen the first time a field is used, not at construction." },
        { code: "public void login(String user, String pass) { ... }", note: "A PUBLIC action method — this is the only thing test code calls. If the login button's ID ever changes, you edit ONE @FindBy annotation, not every test that logs in." },
        { code: "usernameField.sendKeys(user);", note: "Inside the class, fields are used directly, exactly like Selenium's own findElement() result — PageFactory made them behave the same way, just resolved lazily." }
      ]
    }
  ],
  interview: [
    { q: "Why use Singleton with ThreadLocal for WebDriver instead of a plain static field?", a: "A plain static WebDriver is shared across ALL threads. In parallel test execution, two threads would drive the SAME browser simultaneously, causing StaleElementReferenceException and cross-test interference. ThreadLocal gives each thread its own private driver instance while keeping a single access point." },
    { q: "What's the difference between Factory and Builder patterns?", a: "Factory decides WHICH concrete class to instantiate (e.g., ChromeDriver vs FirefoxDriver) based on some input, and returns it fully built. Builder assembles ONE complex object step-by-step through chained calls, useful when an object has many optional fields." },
    { q: "Is Page Object Model a design pattern?", a: "It's a structural pattern specific to test automation, built from more fundamental OOP principles — mainly Encapsulation (locators are private) and Abstraction (public action methods hide the mechanics). It is not one of the classic Gang-of-Four patterns, but interviewers treat it as 'the' pattern for Selenium." },
    { q: "How would you design a Selenium framework from scratch? What patterns would you use?", a: "Singleton + ThreadLocal for WebDriver lifecycle management, Factory for cross-browser driver creation, Page Object Model (with Page Factory) for page structure, and possibly Builder for test data setup. This combination covers driver management, browser flexibility, maintainable page structure, and clean test data — the four recurring problems every framework hits." },
    { q: "Why must a Singleton's constructor be private?", a: "To block 'new ClassName()' from outside the class entirely — the compiler enforces it. If the constructor were public, anyone could create additional instances, breaking the 'exactly one instance' guarantee that defines Singleton." }
  ],
  handsOn: [
    "Convert a plain static WebDriver field into a ThreadLocal-based DriverManager and verify (conceptually) that two parallel threads would get different driver instances.",
    "Write a ShapeFactory that returns Circle, Square, or Triangle objects (all implementing a common Shape interface) based on a string input — the classic Factory Pattern warm-up before applying it to WebDriver.",
    "Build a TestDataBuilder for an 'Order' object with fields like customerName, items, discountCode — most with defaults — using the chained-builder style shown above.",
    "Refactor one of the OOPS module's 'LoginPage' encapsulation examples into a full Page Object class with @FindBy fields and a login() action method."
  ],
  memoryVis: "Picture Singleton as a hotel's single reception desk (one instance, one door in) — but ThreadLocal gives every guest (thread) their own private room key that only they can use. Factory is a vending machine: you press a button (input) and get the matching product (object) without seeing how it's made. Builder is ordering a custom sandwich — you specify only what you want changed from the default, and each choice hands you back the same tray to keep adding to.",
  challenges: [
    {
      title: "Block direct instantiation",
      prompt: "Fill in the access modifier that forces every caller to go through getInstance() instead of 'new'.",
      code: `public class ConfigManager {
    private static ConfigManager instance;
    ___1___ ConfigManager() {}
    public static ConfigManager getInstance() {
        if (instance == null) instance = new ConfigManager();
        return instance;
    }
}`,
      blanks: [
        { label: "modifier blocking 'new ConfigManager()' from outside", answer: "private" }
      ],
      explanation: "A private constructor is the core Singleton trick — the compiler blocks 'new ConfigManager()' anywhere outside the class, leaving getInstance() as the only way to obtain the object."
    },
    {
      title: "Give every thread its own driver",
      prompt: "Fill in the type that gives each thread an isolated WebDriver instead of one shared globally.",
      code: `private static final ___1___<WebDriver> driverThreadLocal = new ___1___<>();`,
      blanks: [
        { label: "type giving each thread its own private value", answer: "ThreadLocal" }
      ],
      explanation: "ThreadLocal<WebDriver> is what makes Singleton-style driver management safe under parallel test execution — each thread gets its own isolated instance instead of racing to share one."
    },
    {
      title: "Return the interface type from a Factory",
      prompt: "Fill in the return type that keeps callers decoupled from the concrete browser class.",
      code: `public static ___1___ createDriver(String browserName) {
    if (browserName.equals("chrome")) return new ChromeDriver();
    return new FirefoxDriver();
}`,
      blanks: [
        { label: "return type: the shared interface, not a concrete class", answer: "WebDriver" }
      ],
      explanation: "Returning the WebDriver interface (not ChromeDriver specifically) means every caller only depends on the abstraction — swapping in a new browser later requires touching only the factory's switch logic, not caller code."
    },
    {
      title: "Chain a Builder method",
      prompt: "Fill in what a Builder's setter should return so calls can be chained together.",
      code: `public Builder username(String username) {
    this.username = username;
    return ___1___;
}`,
      blanks: [
        { label: "reference returned to enable chaining", answer: "this" }
      ],
      explanation: "Returning 'this' (the Builder itself) from every setter is what makes .username(...).email(...).role(...) chainable in one expression instead of separate statements."
    }
  ]
};
