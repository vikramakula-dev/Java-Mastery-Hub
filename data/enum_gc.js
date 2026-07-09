export const enumGcData = {
  title: "Enums & Garbage Collection",
  concept: "Enums for fixed constants; GC for automated memory management.",
  why: "Enums represent browser types well. GC prevents OOM errors.",
  realWorld: "Environment configs (DEV, QA). Reclaiming memory from old tests.",
  seleniumMapping: "BrowserType enum, cleaning up unused WebDriver objects.",
  commonMistakes: "System.gc() does not guarantee immediate collection.",
  examples: [
    { 
      level: "Beginner", 
      title: "Basic Enum", 
      code: `enum Day { MON, TUE, WED }
public class Main {
  public static void main(String[] args) {
    Day d = Day.MON;
    System.out.println(d);
  }
}`, 
      output: "MON", 
      explanation: "Defining simple constants.", 
      selenium: "Defining Environment types." 
    },
    { 
      level: "Beginner", 
      title: "Enum in Switch", 
      code: `Day d = Day.TUE;
switch(d) {
  case MON: System.out.println("Monday"); break;
  case TUE: System.out.println("Tuesday"); break;
}`, 
      output: "Tuesday", 
      explanation: "Using enums for flow control.", 
      selenium: "Driver factory logic." 
    },
    { 
      level: "Intermediate", 
      title: "Enum values()", 
      code: `for(Day d : Day.values()) {
  System.out.println(d);
}`, 
      output: "MON\nTUE\nWED", 
      explanation: "Iterating through enum constants.", 
      selenium: "Validating against a list of allowed values." 
    },
    { 
      level: "Intermediate", 
      title: "Enum with Fields", 
      code: `enum Browser {
  CHROME("chrome.exe"), FIREFOX("geckodriver.exe");
  private String driver;
  Browser(String d) { this.driver = d; }
  public String getDriver() { return driver; }
}`, 
      output: "chrome.exe", 
      explanation: "Enums can have state and behavior.", 
      selenium: "Browser configuration." 
    },
    { 
      level: "Intermediate", 
      title: "EnumSet", 
      code: `import java.util.EnumSet;
EnumSet<Day> weekend = EnumSet.of(Day.SAT, Day.SUN);`, 
      output: "Set created", 
      explanation: "High-performance set for Enums.", 
      selenium: "Groups of specific configurations." 
    },
    { 
      level: "Advanced", 
      title: "Enum with Abstract Methods", 
      code: `enum Operation {
  ADD { int apply(int x, int y) { return x+y; } };
  abstract int apply(int x, int y);
}`, 
      output: "Polymorphism in Enums", 
      explanation: "Constant-specific behavior.", 
      selenium: "Different login strategies per environment." 
    },
    { 
      level: "Advanced", 
      title: "System.gc() Hint", 
      code: `public class Main {
  public static void main(String[] args) {
    System.gc(); // Suggests GC
  }
}`, 
      output: "GC requested", 
      explanation: "Requesting JVM to run GC (not guaranteed).", 
      selenium: "Attempting cleanup between test suites." 
    },
    { 
      level: "Advanced", 
      title: "finalize() Method", 
      code: `class Resource {
  @Override
  protected void finalize() throws Throwable {
    System.out.println("Cleanup");
  }
}`, 
      output: "Cleanup (maybe)", 
      explanation: "Called by GC before destroying object (deprecated in Java 9).", 
      selenium: "Old way to close browser; avoid it." 
    },
    { 
      level: "Advanced", 
      title: "WeakReference", 
      code: `import java.lang.ref.WeakReference;
WeakReference<Object> weak = new WeakReference<>(new Object());`, 
      output: "Object can be GC'd", 
      explanation: "Does not prevent GC.", 
      selenium: "Caching heavy test data temporarily." 
    },
    { 
      level: "Selenium-Oriented", 
      title: "Browser Enum Factory", 
      code: `enum Browsers {
  CHROME, EDGE;
  public void start() {
    System.out.println("Starting " + this.name());
  }
}`, 
      output: "Starting CHROME", 
      explanation: "Factory pattern using Enums.", 
      selenium: "Instantiating drivers based on Enum." 
    }
  ],
  interview: [
    { q: "Why is String worse than Enum?", a: "Enums provide compile-time type safety." },
    { q: "A framework uses 'String browser = \"chrom\";' (typo) to select a browser, and the typo isn't caught until a NullPointerException happens deep inside a switch statement's default case at runtime. How would an Enum have caught this earlier?", a: "With an enum BrowserType { CHROME, FIREFOX, EDGE }, writing BrowserType.CHROM simply wouldn't compile — the typo becomes a compile-time error instead of a runtime failure discovered only when that code path executes. This is the single biggest practical argument for enums over string constants in framework config." },
    { q: "You need each environment (DEV, QA, PROD) to have its own base URL and timeout value, not just a name. How do you model this with an enum instead of a separate lookup Map<String, Config>?", a: "Give the enum a constructor and fields: enum Environment { DEV(\"https://dev.app.com\", 10), QA(\"https://qa.app.com\", 20); private final String url; private final int timeout; ... }. This keeps each environment's data bundled with its constant, type-safe, and impossible to accidentally look up with a wrong key — unlike a Map, which compiles fine even with a typo'd key that returns null." },
    { q: "A test suite runs 500 short-lived tests, each creating a WebDriver and quitting it. Occasionally, memory usage climbs over the run and eventually OOMs. What's the GC-related first thing to check, and why doesn't 'just call System.gc()' reliably fix it?", a: "First check for a leak: are all drivers actually being quit (references released) properly, are ThreadLocal driver references being removed after use, and are any static collections (like a cache) growing unbounded across tests? System.gc() is only a REQUEST — the JVM is free to ignore it, and even if honored, GC can't collect objects that are still reachable (i.e., actually leaked, not just unfortunately-timed), so it doesn't fix a real leak." },
    { q: "Why would 'switch (browserType)' on a String be more error-prone in production than 'switch (browserType)' on a BrowserType enum, beyond just the typo issue?", a: "A String switch has no way to warn you if you forgot to handle a valid case — the compiler doesn't know what the 'universe' of valid strings is. An enum switch can be checked by static analysis tools (and some IDEs warn) if you're missing a case for one of the enum's known values, catching an incomplete implementation before it ships." },
    { q: "Explain, in terms of reachability, why a WebDriver instance held in a static field never gets garbage collected even after driver.quit() is called.", a: "GC reclaims objects that are UNREACHABLE from any active reference chain (starting from GC roots like static fields, active thread stacks, etc.) — a static field itself is a GC root, so as long as the class is loaded, that reference keeps the object reachable regardless of whether quit() closed the actual browser process. quit() releases OS resources; it doesn't null out the Java reference, so you'd still want driver = null (or better, a proper lifecycle via ThreadLocal.remove()) to let GC actually reclaim it." },
    { q: "Can an enum implement an interface? Give a concrete Selenium framework use case for why you might want this.", a: "Yes — enum BrowserType implements DriverSupplier { CHROME { public WebDriver get() { return new ChromeDriver(); } }, FIREFOX { public WebDriver get() { return new FirefoxDriver(); } } } lets each enum constant provide its OWN implementation of an interface method. This effectively replaces a switch-based Factory pattern with type-safe, self-contained per-constant behavior — a genuinely elegant use of enums beyond simple constants." },
    { q: "What does it mean that 'enums are implicitly Singletons' in Java, and why does that make them safe to compare with == (unlike Integer or String)?", a: "Each enum constant is guaranteed by the JVM to have exactly ONE instance for the entire application lifetime — there's no way to create a second CHROME. Because of that guarantee, == (reference comparison) is always safe and correct for enums, unlike Integer (cached only in a range) or String (pool vs heap ambiguity) where == is a known trap." },
    { q: "A long-running Selenium Grid hub process shows steadily increasing memory over days despite individual test sessions completing normally. What GC-related concept explains why this might not show up in short local test runs?", a: "This points to a slow memory leak — objects that stay reachable (e.g., an ever-growing cache, a listener never unregistered, ThreadLocal values never removed in a reused thread pool) accumulate slowly enough that a short local run (minutes) never surfaces it, but a long-running process (days) eventually exhausts heap. It's why memory profiling under sustained load, not just quick local testing, matters for infrastructure like a Grid hub." }
  ],
  handsOn: ["Create an Enum for Environments with URL fields."],
  memoryVis: "Enums are Singletons; GC removes unreferenced objects from Heap.",
  challenges: [
    {
      title: "Declare a type-safe constant set",
      prompt: "Fill in the keyword for declaring a fixed set of named constants like browser types.",
      code: `___1___ BrowserType { CHROME, FIREFOX, EDGE }`,
      blanks: [
        { label: "keyword declaring a fixed set of constants", answer: "enum" }
      ],
      explanation: "enum defines a fixed, type-safe set of constants — unlike a String constant, BrowserType.CHROM (a typo) simply won't compile, catching the mistake immediately instead of at runtime."
    },
    {
      title: "Give an enum constant its own data",
      prompt: "Fill in the missing piece so each environment constant carries its own base URL.",
      code: `enum Environment {
    DEV("https://dev.app.com"), QA("https://qa.app.com");
    private final String url;
    Environment(String url) { this.___1___ = url; }
}`,
      blanks: [
        { label: "keyword referring to the current enum instance's field", answer: "this" }
      ],
      explanation: "this.url assigns the constructor parameter to the instance's own field — each enum constant (DEV, QA) gets its own constructor call and therefore its own stored url value."
    },
    {
      title: "Request garbage collection (with the right expectation)",
      prompt: "Fill in the call that REQUESTS garbage collection, understanding it isn't guaranteed to run immediately.",
      code: `System.___1___();
// Not guaranteed to run immediately — this is only a hint to the JVM`,
      blanks: [
        { label: "method requesting (not forcing) garbage collection", answer: "gc" }
      ],
      explanation: "System.gc() only hints to the JVM that now would be a good time to collect garbage — the JVM is free to ignore it entirely, so real leaks should never be 'fixed' by calling this."
    }
  ]
};
