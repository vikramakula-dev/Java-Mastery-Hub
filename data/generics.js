export const genericsData = {
  title: "Generics",
  concept: "Generics let classes, interfaces, and methods operate on a type chosen by the caller (<T>), with the compiler enforcing that type everywhere — compile-time type safety without casting.",
  why: "Before generics, collections held raw Objects: every read needed a cast and every wrong cast blew up at runtime as ClassCastException. Generics move that entire class of bugs to compile time, where your IDE catches them as you type.",
  realWorld: "Like labeled storage boxes: a box labeled 'WebElements only' physically refuses anything else at packing time — so you never open a box at 2am to find a sandwich where an element should be.",
  seleniumMapping: "List<WebElement> from findElements(), WebDriverWait.until(ExpectedCondition<T>), Optional<WebElement> helpers, and generic utility methods like <T> T retry(Supplier<T> action) — generics are woven through the entire Selenium API.",
  commonMistakes: [
    "Using raw types (List instead of List<String>) — compiles with a warning but silently throws away all type checking.",
    "Trying List<int> — generics require reference types; use List<Integer> and let autoboxing work.",
    "Assuming List<ChromeDriver> is a subtype of List<WebDriver> — generics are invariant; that assignment does not compile even though ChromeDriver extends WebDriver."
  ],
  keyPoints: [
    "<T> is a type parameter — a placeholder the caller fills in. List<WebElement> means 'a List that can only ever contain WebElements', enforced by the compiler, not checked at runtime.",
    "Generics exist to eliminate two things: casting on every read, and ClassCastException at runtime. The bug moves from production to your IDE.",
    "Generics only accept reference types — List<int> won't compile, List<Integer> works (autoboxing bridges the gap when you add primitives).",
    "Generics are INVARIANT: List<ChromeDriver> is NOT a List<WebDriver>, even though ChromeDriver IS a WebDriver. Wildcards exist to express those relationships.",
    "Bounded types: <T extends WebDriver> restricts T to WebDriver and its subtypes — the method can then call WebDriver methods on T. '? extends X' = read-safe producer; '? super X' = write-safe consumer (PECS: Producer Extends, Consumer Super).",
    "Type erasure: generics are a COMPILE-TIME feature — at runtime the JVM sees plain List, the type parameter is erased. That's why you can't do 'new T()' or 'instanceof List<String>'.",
    "You can write your own generic methods: 'public static <T> T firstOrDefault(List<T> list, T fallback)' — one method that works for every type, fully type-checked at each call site.",
    "The diamond operator (<>) in 'new ArrayList<>()' just tells the compiler to infer the type from the left side — same safety, less typing."
  ],
  examples: [
    {
      level: "Beginner",
      title: "Type-Safe Collections",
      code: `import java.util.*;

public class GenericsDemo {
    public static void main(String[] args) {
        List<String> browsers = new ArrayList<>();
        browsers.add("Chrome");
        // browsers.add(42); // Compile error — caught here, not at runtime
        String first = browsers.get(0); // no cast needed
        System.out.println(first.toUpperCase());
    }
}`,
      output: "CHROME",
      explanation: "The generic parameter locks the list to one type at compile time, and reads come back already typed — no casting.",
      selenium: "List<WebElement> from driver.findElements() is exactly this — the compiler guarantees every element is a WebElement, so .click() and .getText() are available without casts.",
      walkthrough: [
        { code: "List<String> browsers = new ArrayList<>();", note: "<String> is a compile-time contract: only Strings in, and everything out is already a String. The diamond <> on the right infers the type from the left — write it once." },
        { code: "// browsers.add(42);", note: "If uncommented, this fails to COMPILE. Without generics (a raw List), it would compile fine and explode later as ClassCastException at whatever distant line reads the value — the bug would be far from its cause." },
        { code: "String first = browsers.get(0);", note: "No '(String)' cast — compare pre-generics code: String s = (String) list.get(0); on every single read. Generics deleted that entire ritual and its failure mode." }
      ]
    },
    {
      level: "Intermediate",
      title: "Writing a Generic Method",
      code: `import java.util.*;

public class GenericMethod {
    public static <T> T firstOrDefault(List<T> list, T fallback) {
        return list.isEmpty() ? fallback : list.get(0);
    }

    public static void main(String[] args) {
        List<String> names = List.of("Chrome", "Firefox");
        List<Integer> counts = new ArrayList<>();

        System.out.println(firstOrDefault(names, "none"));
        System.out.println(firstOrDefault(counts, 0));
    }
}`,
      output: "Chrome\n0",
      explanation: "One method, every type: T is inferred per call site — String for the first call, Integer for the second — with full type checking at each.",
      selenium: "Framework utility methods are written exactly like this: <T> T retryOnStale(Supplier<T> action) works for WebElement, String, Boolean — any return type a retried action produces.",
      walkthrough: [
        { code: "public static <T> T firstOrDefault(List<T> list, T fallback) {", note: "The <T> BEFORE the return type declares 'this method has its own type parameter'. Then T is used three times: the list's element type, the fallback's type, and the return type — the compiler enforces all three MATCH at every call." },
        { code: "firstOrDefault(names, \"none\")", note: "The compiler infers T = String from the arguments. Passing firstOrDefault(names, 42) would not compile — the fallback must match the list's element type. That cross-parameter consistency is what plain Object parameters can't give you." },
        { code: "return list.isEmpty() ? fallback : list.get(0);", note: "Inside the method, T is opaque — you can't call String or Integer methods on it, only Object methods, because T could be anything. Bounded types (<T extends X>) are how you unlock more." }
      ]
    },
    {
      level: "Advanced",
      title: "Bounded Types — <T extends WebDriver>",
      code: `class FakeDriver { public String getName() { return "fake"; } }
class FakeChrome extends FakeDriver { }
class FakeFirefox extends FakeDriver { }

public class Bounded {
    public static <T extends FakeDriver> void launch(T driver) {
        // Because T is bounded, FakeDriver methods are callable on it:
        System.out.println("Launching: " + driver.getName());
    }

    public static void main(String[] args) {
        launch(new FakeChrome());
        launch(new FakeFirefox());
        // launch("chrome"); // Compile error — String is not a FakeDriver
    }
}`,
      output: "Launching: fake\nLaunching: fake",
      explanation: "'T extends FakeDriver' restricts which types callers may use AND unlocks FakeDriver's methods inside the method body.",
      selenium: "A driver-factory helper like <T extends WebDriver> T configure(T driver) can call driver.manage().timeouts() on any browser type and return the SAME concrete type it was given — no downcasting at the call site.",
      walkthrough: [
        { code: "<T extends FakeDriver> void launch(T driver)", note: "The bound does two jobs at once: (1) callers can only pass FakeDriver subtypes — launch(\"chrome\") is a compile error; (2) inside the method, T is KNOWN to have FakeDriver's methods, so getName() is callable. Unbounded T would only offer Object's methods." },
        { code: "launch(new FakeChrome());", note: "T is inferred as FakeChrome. If the method returned T, the caller would get a FakeChrome back — not a downgraded FakeDriver needing a cast. Preserving the caller's concrete type is the killer feature of bounded generic methods over plain 'FakeDriver' parameters." }
      ]
    },
    {
      level: "Selenium-Oriented",
      title: "Why Invariance Matters — Wildcards",
      code: `import java.util.*;

public class Wildcards {
    // Takes a list of ANY subtype of Number — read-only access
    static double sum(List<? extends Number> nums) {
        double total = 0;
        for (Number n : nums) total += n.doubleValue();
        return total;
    }

    public static void main(String[] args) {
        List<Integer> ints = List.of(1, 2, 3);
        List<Double> doubles = List.of(1.5, 2.5);
        System.out.println(sum(ints));
        System.out.println(sum(doubles));
    }
}`,
      output: "6.0\n4.0",
      explanation: "Without the wildcard, sum(List<Number>) would reject List<Integer> entirely — generics are invariant. '? extends' re-opens the door, read-only.",
      selenium: "A report method taking List<? extends TestResult> accepts List<PassedResult> and List<FailedResult> alike — one method for every result-list subtype your framework produces.",
      walkthrough: [
        { code: "List<? extends Number> nums", note: "Reads as 'a list of some unknown subtype of Number'. List<Integer> and List<Double> both match. Plain List<Number> would match NEITHER — invariance means subtype element ≠ subtype list." },
        { code: "for (Number n : nums)", note: "READING is safe: whatever the unknown subtype is, it IS a Number. But nums.add(anything) won't compile — the compiler can't prove your Integer belongs in what might be a List<Double>. Producer Extends = read-only." }
      ]
    }
  ],
  interview: [
    { q: "What does <T> mean in a generic class or method, and why not just use Object everywhere?", a: "<T> is a type parameter — a placeholder for a specific type the caller supplies. Using Object everywhere loses compile-time type checking entirely and forces manual casting (with the risk of ClassCastException at runtime). Generics give you Object's flexibility with the compiler catching type mistakes before the code ever runs." },
    { q: "Your teammate declares 'List elements = driver.findElements(By.css(\".row\"))' without a type parameter and the IDE shows a raw-type warning. Everything runs fine — why should they still fix it?", a: "The raw type silently disables ALL generic checking on that variable: elements.add(\"oops\") now compiles, and every read needs a cast that can throw ClassCastException at a line far from the real mistake. It runs fine today precisely because nothing wrong has been added YET — the warning marks the spot where a future bug becomes undetectable at compile time. List<WebElement> costs nothing and restores the safety net." },
    { q: "Why doesn't 'List<WebDriver> drivers = new ArrayList<ChromeDriver>()' compile, even though ChromeDriver implements WebDriver?", a: "Generics are invariant. If that assignment were allowed, you could then do drivers.add(new FirefoxDriver()) — legal for a List<WebDriver> — corrupting what is actually a List<ChromeDriver> underneath. The compiler forbids the assignment to prevent exactly that hole. When you need 'a list of any WebDriver subtype', the wildcard List<? extends WebDriver> expresses it safely (as read-only)." },
    { q: "What is type erasure, and what practical limitation does it explain?", a: "Generics are compile-time only: after compilation the JVM sees plain List — the <String> is erased. That's why you can't write 'new T()' (no class to instantiate at runtime), can't do 'instanceof List<String>' (the runtime can't tell List<String> from List<Integer>), and can't overload methods that differ only by type parameter. Erasure kept generics backward-compatible with pre-Java-5 bytecode — the tradeoff interviewers want you to know exists." },
    { q: "You're writing a retry utility for flaky Selenium actions. Why is 'public static <T> T retry(Supplier<T> action, int attempts)' better than a version that returns Object?", a: "The generic version returns exactly what the action produces — retry(() -> driver.findElement(locator), 3) gives a WebElement, retry(() -> el.getText(), 3) gives a String — with zero casting at any call site and compile-time verification that you use the result correctly. The Object version compiles the same calls but forces every caller to cast, reintroducing the runtime failure generics were invented to eliminate." },
    { q: "When would you use '<T extends WebDriver>' rather than just declaring the parameter as WebDriver?", a: "When you need to RETURN the same concrete type you received. 'WebDriver configure(WebDriver d)' returns a plain WebDriver — the caller who passed a ChromeDriver must cast to get Chrome-specific methods back. '<T extends WebDriver> T configure(T d)' returns T: pass a ChromeDriver, get a ChromeDriver back, no cast. The bound also lets the method body call WebDriver methods on T, which an unbounded T wouldn't allow." }
  ],
  handsOn: [
    "Write a generic method <T> void printAll(List<T> items) and call it with a List<String> and a List<Integer> — confirm one method serves both.",
    "Write <T> T firstOrDefault(List<T> list, T fallback) yourself and try to call it with mismatched types (String list, Integer fallback) — read the compile error carefully.",
    "Try 'List<Object> l = new ArrayList<String>();' and read the error — then explain out loud why the compiler is right to refuse (hint: what could you then add?)."
  ],
  memoryVis: "Picture <T> as a shape-cutter template on a box's opening: whichever shape you install (circle, square), only that shape passes — checked at the door (compile time), so the box's contents never need inspecting (no runtime casts). Type erasure means the template is removed after packing: the sealed box in the warehouse (JVM) looks like any other box.",
  challenges: [
    {
      title: "Fix the primitive-in-generics error",
      prompt: "This declaration won't compile because generics require reference types. Fill in the correct type.",
      code: `List<___1___> waitTimes = new ArrayList<>();
waitTimes.add(30); // autoboxed`,
      blanks: [
        { label: "wrapper type usable as a generic parameter", answer: "Integer" }
      ],
      explanation: "Generics only accept reference types — List<int> is a compile error. List<Integer> works, and autoboxing converts the primitive 30 into an Integer at add() time."
    },
    {
      title: "Declare a generic method",
      prompt: "Fill in the declaration piece that makes T available to this method's signature.",
      code: `public static ___1___ T firstOrDefault(List<T> list, T fallback) {
    return list.isEmpty() ? fallback : list.get(0);
}`,
      blanks: [
        { label: "the type-parameter declaration before the return type", answer: ["<T>"] }
      ],
      explanation: "<T> before the return type declares the method's own type parameter — without it, 'T' is an unknown symbol and nothing compiles. It's the method-level equivalent of class-level 'class Box<T>'."
    },
    {
      title: "Bound the type parameter",
      prompt: "Fill in the keyword that restricts T to WebDriver and its subtypes, unlocking WebDriver's methods inside the method.",
      code: `public static <T ___1___ WebDriver> T configure(T driver) {
    driver.manage().window().maximize();
    return driver;
}`,
      blanks: [
        { label: "keyword creating an upper bound", answer: "extends" }
      ],
      explanation: "'T extends WebDriver' (extends is used even for interfaces in bounds) restricts callers to WebDriver subtypes AND lets the body call driver.manage() — an unbounded T would only offer Object's methods."
    }
  ]
};
