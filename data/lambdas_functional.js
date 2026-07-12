export const lambdasFunctionalData = {
  title: "Lambdas & Functional Interfaces",
  concept: "A functional interface has exactly one abstract method; a lambda expression ((params) -> body) is a compact way to implement that one method inline. Method references (Class::method) are shorthand for lambdas that just call one existing method.",
  why: "Pre-Java-8 code needed a full anonymous inner class to pass behavior around — five lines of ceremony per callback. Lambdas collapse that to one readable line, and they're the foundation Streams, modern waits, and half of every current Java codebase are built on.",
  realWorld: "Like handing someone a sticky note with an instruction instead of a full printed form: same instruction, none of the paperwork — but it only works because the recipient (the functional interface) expects exactly one instruction.",
  seleniumMapping: "wait.until(d -> d.getTitle().contains(\"Home\")) — the lambda IS an ExpectedCondition. Every custom wait, every findElements().forEach(), every Stream filter in a modern Selenium framework runs on this machinery.",
  commonMistakes: [
    "Writing a full anonymous inner class for a one-method interface — verbose and outdated in Java 8+ code.",
    "Trying to use a lambda for an interface with TWO abstract methods — lambdas only work for functional interfaces, the compiler must know unambiguously which method the body implements.",
    "Modifying a local variable from inside a lambda — captured locals must be final or effectively final; the compiler blocks reassignment."
  ],
  keyPoints: [
    "A functional interface has exactly ONE abstract method (it may also have default/static methods) — that single-method constraint is what makes lambdas possible: the lambda body IS the implementation of that one method.",
    "Lambda anatomy: (params) -> expression, or (params) -> { statements; return x; }. Parameter types are inferred from the target interface — 's -> s.startsWith(\"submit\")' knows s is a String because the target is Predicate<String>.",
    "The big four built-ins, by shape: Supplier<T> = ()→T via .get() | Consumer<T> = T→void via .accept() | Function<T,R> = T→R via .apply() | Predicate<T> = T→boolean via .test(). Runnable = ()→void via .run().",
    "A lambda and an anonymous class implementing the same interface are interchangeable to the caller — the lambda is purely nicer syntax (plus it doesn't create a separate .class file or its own 'this').",
    "Method reference forms: ClassName::staticMethod, instance::method, ClassName::instanceMethod (most common with streams — WebElement::getText means 'call getText() on each element'), and ClassName::new (constructor).",
    "Use a method reference when the lambda body ONLY calls one existing method (e -> e.getText() → WebElement::getText); the moment any extra logic appears, you need a real lambda.",
    "Lambdas capture local variables by value — they must be final or effectively final. If you need a mutable counter inside a forEach, that's the signal you actually want a different construct (a loop, or a stream count()).",
    "@FunctionalInterface annotation is optional but valuable: the compiler then ERRORS if someone adds a second abstract method later, protecting every lambda written against the interface."
  ],
  examples: [
    {
      level: "Beginner",
      title: "Lambda Replacing an Anonymous Class",
      code: `import java.util.function.Predicate;

public class LambdaDemo {
    public static void main(String[] args) {
        // Old way: anonymous inner class
        Predicate<String> oldStyle = new Predicate<String>() {
            public boolean test(String s) { return s.startsWith("submit"); }
        };

        // New way: lambda
        Predicate<String> newStyle = s -> s.startsWith("submit");

        System.out.println(oldStyle.test("submitBtn"));
        System.out.println(newStyle.test("submitBtn"));
    }
}`,
      output: "true\ntrue",
      explanation: "Both do the exact same thing — the lambda is purely syntactic sugar for implementing the single abstract method of a functional interface.",
      selenium: "ExpectedConditions and custom waits are built on this exact pattern: driver -> driver.findElements(By.id(\"x\")).size() > 0 as a lambda replaces a multi-line anonymous ExpectedCondition class.",
      walkthrough: [
        { code: "Predicate<String> oldStyle = new Predicate<String>() { public boolean test(String s) {...} };", note: "The pre-Java-8 way: a full anonymous class just to implement ONE method. Five lines of ceremony around one line of logic." },
        { code: "Predicate<String> newStyle = s -> s.startsWith(\"submit\");", note: "Identical behavior. 's' needs no type — the compiler reads Predicate<String> on the left and infers it. The expression after -> is both the body and the return value. This inference against the target type is why lambdas REQUIRE a functional interface: one abstract method means zero ambiguity about what's being implemented." },
        { code: "oldStyle.test(\"submitBtn\"); newStyle.test(\"submitBtn\");", note: "From the caller's side the two are indistinguishable — both are objects whose test() runs the given logic. Lambdas change how you WRITE behavior, not how it runs." }
      ]
    },
    {
      level: "Intermediate",
      title: "The Big Four Functional Interfaces",
      code: `import java.util.function.*;

public class FunctionalInterfacesDemo {
    public static void main(String[] args) {
        Function<String, Integer> length = s -> s.length();
        Consumer<String> printer = s -> System.out.println("Value: " + s);
        Supplier<String> defaultUrl = () -> "https://example.com";
        Predicate<Integer> isPositive = n -> n > 0;

        System.out.println(length.apply("Selenium"));
        printer.accept("test complete");
        System.out.println(defaultUrl.get());
        System.out.println(isPositive.test(-5));
    }
}`,
      output: "8\nValue: test complete\nhttps://example.com\nfalse",
      explanation: "Four shapes for four jobs: transform (Function), consume (Consumer), produce (Supplier), test (Predicate). Recognizing the shape tells you which interface a method expects.",
      selenium: "Supplier<WebDriver> lazily creates a driver only when first needed; Consumer<WebElement> drives forEach loops over findElements() results; Predicate<WebElement> is what Stream.filter() takes.",
      walkthrough: [
        { code: "Function<String, Integer> length = s -> s.length();", note: "Function<T, R>: TAKES a T, RETURNS an R. Called via .apply(). The two type parameters read left-to-right as input→output." },
        { code: "Consumer<String> printer = s -> System.out.println(...);", note: "Consumer<T>: takes a T, returns NOTHING — it consumes the value for a side effect (printing, logging, clicking). Called via .accept()." },
        { code: "Supplier<String> defaultUrl = () -> \"https://example.com\";", note: "Supplier<T>: takes NOTHING, produces a T on demand via .get(). The 'on demand' part is its superpower — the value isn't computed until someone asks, which is how lazy driver creation works." },
        { code: "Predicate<Integer> isPositive = n -> n > 0;", note: "Predicate<T>: takes a T, answers true/false via .test(). This is exactly the shape Stream.filter() demands — every filter you'll ever write is a Predicate." }
      ]
    },
    {
      level: "Advanced",
      title: "Method References — Four Forms",
      code: `import java.util.*;
import java.util.function.*;

public class MethodRefs {
    public static void main(String[] args) {
        // 1. Static method:        Class::staticMethod
        Function<String, Integer> parse = Integer::parseInt;

        // 2. Instance method of a PARTICULAR object: obj::method
        String prefix = "submit_";
        Predicate<String> hasPrefix = prefix::startsWith; // careful: tests prefix.startsWith(arg)!

        // 3. Instance method of an ARBITRARY object:  Class::instanceMethod
        Function<String, String> upper = String::toUpperCase; // s -> s.toUpperCase()

        // 4. Constructor:           Class::new
        Supplier<ArrayList<String>> maker = ArrayList::new;

        System.out.println(parse.apply("42") + 1);
        System.out.println(upper.apply("chrome"));
        System.out.println(maker.get().isEmpty());
    }
}`,
      output: "43\nCHROME\ntrue",
      explanation: "A method reference is shorthand for a lambda that does nothing except call one existing method — same behavior, clearer intent.",
      selenium: "elements.stream().map(WebElement::getText) is form 3 in daily action: 'for each element, call ITS getText()'. You'll read this a hundred times in any modern framework.",
      walkthrough: [
        { code: "Function<String, Integer> parse = Integer::parseInt;", note: "Static form: equivalent to s -> Integer.parseInt(s). The argument slides into the static method's parameter." },
        { code: "Function<String, String> upper = String::toUpperCase;", note: "The 'arbitrary object' form — subtly different: toUpperCase takes NO arguments, so where does the String input go? It becomes the RECEIVER: s -> s.toUpperCase(). This is the form behind WebElement::getText and WebElement::isDisplayed in stream pipelines." },
        { code: "Supplier<ArrayList<String>> maker = ArrayList::new;", note: "Constructor form: () -> new ArrayList<>(). Collectors and factories use this shape — e.g., Collectors.toCollection(ArrayList::new)." },
        { code: "prefix::startsWith", note: "The bound-instance form captures a SPECIFIC object: the resulting predicate runs prefix.startsWith(arg) — the input is the ARGUMENT, not the receiver. Mixing up forms 2 and 3 is a favorite trick question." }
      ]
    },
    {
      level: "Selenium-Oriented",
      title: "Lambda as a Custom Wait Condition",
      code: `/*
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

// The lambda IS an ExpectedCondition<Boolean> — driver comes in, boolean comes out:
wait.until(d -> d.findElements(By.cssSelector(".spinner")).isEmpty());

// And an ExpectedCondition<WebElement> — return the element when ready:
WebElement ready = wait.until(d -> {
    WebElement el = d.findElement(By.id("submit"));
    return el.isEnabled() ? el : null;   // null = keep polling
});
*/
System.out.println("spinner gone, button ready");`,
      output: "spinner gone, button ready",
      explanation: "until() accepts a Function<WebDriver, T>: return null/false to keep polling, anything else to finish. A lambda expresses a completely custom condition in one line.",
      selenium: "This replaces the pre-Java-8 pattern of a 10-line anonymous ExpectedCondition class per custom wait — the single most visible lambda win in test code.",
      walkthrough: [
        { code: "wait.until(d -> d.findElements(...).isEmpty());", note: "until()'s parameter is a functional interface taking a WebDriver — so a lambda fits. The wait calls your lambda every 500ms; while it returns false, polling continues; true completes the wait; timeout throws. You wrote a full custom ExpectedCondition in one line." },
        { code: "return el.isEnabled() ? el : null;", note: "For non-boolean conditions, null is the 'not yet' signal — the wait keeps polling until you return a real object, which becomes until()'s return value. Returning the element itself saves a second findElement after the wait." }
      ]
    }
  ],
  interview: [
    { q: "What is a functional interface, and how does it relate to lambdas?", a: "An interface with exactly one abstract method (it may also have default or static methods with bodies). A lambda expression is a compact way to provide the implementation of that single method — the lambda IS an instance of the functional interface, just without the ceremony of an anonymous class. One abstract method is required because it's what makes the lambda's target unambiguous." },
    { q: "What is a method reference, and when would you use one over a lambda?", a: "Method reference syntax (Class::method) is shorthand for a lambda that does nothing but call one existing method. Use it whenever your lambda body is literally just 'call this one method' — WebElement::getText instead of e -> e.getText() — for readability. If the lambda needs any extra logic, you need a real lambda." },
    { q: "You write 'int count = 0;' then inside elements.forEach(e -> count++) and it won't compile. Why, and what's the right fix?", a: "Lambdas can only capture local variables that are final or effectively final — count++ reassigns it, so the compiler refuses. The band-aids (an int[1] array or AtomicInteger) work but signal the wrong tool: if you're counting matches, elements.stream().filter(...).count() expresses it directly; if you genuinely need index-based mutation, a plain for loop is the honest choice." },
    { q: "Your teammate asks why 'wait.until(d -> d.getTitle().contains(\"Home\"))' compiles when until() expects an ExpectedCondition object. Explain what the compiler is doing.", a: "ExpectedCondition is a functional interface (one abstract method: apply(WebDriver)). The compiler sees until()'s parameter type, confirms the lambda's shape matches that method's signature — WebDriver in, Boolean out — and compiles the lambda AS an ExpectedCondition instance. This 'target typing' is why the same lambda text could be a Function<WebDriver,Boolean> in another context: the interface it becomes depends on where it lands." },
    { q: "What's the difference between 'str::startsWith' and 'String::startsWith' as method references?", a: "str::startsWith binds the SPECIFIC object str as the receiver — the resulting function's input becomes the ARGUMENT: x -> str.startsWith(x). String::startsWith uses the arbitrary-instance form — the function's FIRST input becomes the receiver: (s, x) -> s.startsWith(x). Same method, different shapes, different functional interfaces they can satisfy — a classic trap question." },
    { q: "Why does Supplier<WebDriver> make sense for lazy driver initialization, versus just creating the driver in a field initializer?", a: "A field initializer runs when the class/object loads — the browser launches whether or not the test ever needs it, and in a suite where some tests are API-only that's pure waste. Supplier<WebDriver> stores the RECIPE, not the result: .get() runs new ChromeDriver() only at first actual use. Combine with a null-check-then-cache (or memoization) and you get exactly-once, on-demand creation." },
    { q: "Can a lambda implement an interface with two abstract methods? What about an abstract class with one abstract method?", a: "No to both. Two abstract methods = the compiler can't know which one the lambda body implements, so it's not a functional interface. And lambdas only target INTERFACES — an abstract class with one abstract method still requires an (anonymous) subclass, because a lambda never creates a subclass, it only supplies the single method of a functional interface. Both are precise-definition questions interviewers use to separate memorization from understanding." }
  ],
  handsOn: [
    "Rewrite an anonymous Comparator<String> (sort by length) as a lambda, then as a method reference chain using Comparator.comparing(String::length).",
    "Create a Supplier<WebDriver> that lazily instantiates a ChromeDriver only the first time .get() is called, and reuses the same instance on subsequent calls (manual memoization).",
    "Write one custom wait with wait.until(lambda) that waits for a spinner to disappear AND a button to become enabled — two conditions, one lambda."
  ],
  memoryVis: "Picture a functional interface as a wall socket with exactly one plug shape, and a lambda as a bare plug — no appliance casing (class), no brand label (name), just the live wire (logic). It fits ONLY because there's exactly one socket; two sockets (two abstract methods) and the plug wouldn't know where to go. A method reference is a pre-wired plug pulled off the shelf: the wiring already existed as a method, you're just plugging it in.",
  challenges: [
    {
      title: "Complete the lambda",
      prompt: "Rewrite this anonymous Predicate as a lambda. Fill in the missing arrow.",
      code: `Predicate<String> isSubmit = s ___1___ s.startsWith("submit");`,
      blanks: [
        { label: "lambda arrow", answer: "->" }
      ],
      explanation: "-> separates the lambda's parameter list from its body. 's -> s.startsWith(\"submit\")' reads as 'given s, return s.startsWith(\"submit\")'."
    },
    {
      title: "Pick the right functional interface",
      prompt: "This variable takes no arguments and returns a String. Fill in the correct built-in functional interface.",
      code: `___1___<String> defaultUrl = () -> "https://example.com";`,
      blanks: [
        { label: "functional interface: no args, returns a value", answer: "Supplier" }
      ],
      explanation: "Supplier<T> takes nothing and produces a T, called via .get(). Function needs an input; Consumer returns nothing; Predicate returns boolean — none of those fit here."
    },
    {
      title: "Convert to a method reference",
      prompt: "This lambda only calls one existing method. Fill in the method-reference equivalent.",
      code: `// lambda:            e -> e.getText()
Function<WebElement, String> extract = ___1___::getText;`,
      blanks: [
        { label: "the class the method belongs to", answer: "WebElement" }
      ],
      explanation: "WebElement::getText is the arbitrary-instance form: the function's input becomes the receiver — exactly e -> e.getText(). This is the single most common method reference in Selenium stream pipelines."
    }
  ]
};
