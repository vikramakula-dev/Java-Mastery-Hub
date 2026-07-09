export const advancedJavaData = {
  title: "Advanced Java",
  concept: "The Java language features beyond core OOP that show up in modern, senior-level code: Generics, Lambdas & Functional Interfaces, the Streams API in depth, Optional, and method references.",
  why: "This is where 'I know Java syntax' turns into 'I write Java the way experienced engineers write Java.' Modern Selenium codebases (Java 8+) lean on these constantly — a candidate who only knows for-loops and raw types reads as junior immediately.",
  realWorld: "If OOP is learning to build with individual bricks, this module is learning power tools — the same house gets built, but faster, safer, and in a style experienced builders recognize instantly.",
  seleniumMapping: "Generics type List<WebElement> safely. Lambdas replace anonymous ExpectedCondition classes. Streams filter/transform findElements() results in one line. Optional wraps 'element might not exist' without null checks scattered everywhere.",
  commonMistakes: [
    "Using raw types (List instead of List<String>) — compiles with a warning but throws away all compile-time type safety.",
    "Writing a full anonymous inner class for a one-method interface instead of a lambda — verbose and outdated in Java 8+ code.",
    "Calling Optional.get() without checking isPresent() first — reintroduces the exact NullPointerException Optional exists to prevent.",
    "Chaining too many Stream operations into one unreadable line instead of breaking them up or naming intermediate steps."
  ],
  keyPoints: [
    "Generics (<T>) give compile-time type safety on collections and custom classes — List<WebElement> won't let you accidentally .add(\"text\") to it; the compiler catches it, not a runtime ClassCastException.",
    "A Functional Interface has exactly ONE abstract method (may have default/static methods too) — this single-method constraint is what makes lambdas possible; the lambda IS the implementation of that one method.",
    "Built-in functional interfaces to know cold: Runnable (no args, no return), Supplier<T> (no args, returns T), Consumer<T> (takes T, no return), Function<T,R> (takes T, returns R), Predicate<T> (takes T, returns boolean).",
    "Lambda syntax (params) -> expression is shorthand for implementing a functional interface's method — ExpectedCondition<Boolean> condition = driver -> driver.getTitle().contains(\"Home\"); replaces a whole anonymous class.",
    "Streams: intermediate operations (filter, map, sorted) are LAZY and return a new Stream; terminal operations (forEach, collect, count) are EAGER and actually trigger the pipeline. Nothing runs until a terminal op is called.",
    "map() transforms each element into something else (WebElement → String via getText()); filter() removes elements that don't match a condition; collect() gathers results back into a List/Set/Map.",
    "Optional<T> is a container that may or may not hold a value — designed to replace returning null and force callers to explicitly handle the empty case instead of forgetting a null check.",
    "Method references (Class::method) are shorthand for a lambda that just calls one existing method — WebElement::getText instead of e -> e.getText(). Four forms exist: static, instance-of-particular-object, instance-of-arbitrary-object (most common with streams), and constructor (Class::new).",
    "var (local type inference, Java 10+) lets the compiler infer the type from the right-hand side — var driver = new ChromeDriver(); still gives driver the compile-time type ChromeDriver, it's not 'dynamic typing' like JavaScript."
  ],
  examples: [
    {
      level: "Beginner",
      title: "Generics — Type-Safe Collections",
      code: `import java.util.*;

public class GenericsDemo {
    public static void main(String[] args) {
        List<WebElementStub> elements = new ArrayList<>();
        elements.add(new WebElementStub("Login"));
        // elements.add("raw string"); // Compile error — caught here, not at runtime
        for (WebElementStub e : elements) {
            System.out.println(e.getLabel());
        }
    }
}
class WebElementStub {
    private String label;
    public WebElementStub(String label) { this.label = label; }
    public String getLabel() { return label; }
}`,
      output: "Login",
      explanation: "The generic type <WebElementStub> locks the list to one type at compile time — the commented line would fail to compile, not crash at runtime with a ClassCastException.",
      selenium: "List<WebElement> from driver.findElements() is exactly this — the compiler guarantees every element in the list is actually a WebElement.",
      walkthrough: [
        { code: "List<WebElementStub> elements = new ArrayList<>();", note: "The generic parameter <WebElementStub> is a compile-time contract: only WebElementStub objects may go in, and anything read back out is already typed as WebElementStub — no casting needed." },
        { code: "// elements.add(\"raw string\");", note: "If uncommented, this fails to COMPILE — the error is caught by you, in your IDE, before the code ever runs. Without generics (using a raw List), this would compile fine and blow up later as a ClassCastException at runtime." },
        { code: "for (WebElementStub e : elements) {", note: "No cast needed here either — 'e' is already known to be a WebElementStub. Pre-Java-5 code without generics needed '(WebElementStub) list.get(i)' everywhere." }
      ]
    },
    {
      level: "Intermediate",
      title: "Lambda Expression Replacing an Anonymous Class",
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
        { code: "Predicate<String> oldStyle = new Predicate<String>() { public boolean test(String s) {...} };", note: "The pre-Java-8 way: a full anonymous class just to implement ONE method. Verbose, but explicit about what's happening." },
        { code: "Predicate<String> newStyle = s -> s.startsWith(\"submit\");", note: "Identical behavior, four words instead of four lines. 's' is the parameter (type inferred as String from the Predicate<String> declaration), the expression after -> is the method body, and its value is implicitly returned." },
        { code: "oldStyle.test(\"submitBtn\"); newStyle.test(\"submitBtn\");", note: "Calling .test(...) on either works identically — from the caller's side, a lambda and an anonymous class implementing the same interface are indistinguishable." }
      ]
    },
    {
      level: "Intermediate",
      title: "Functional Interfaces — Function, Consumer, Supplier",
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
      explanation: "Four of the most common built-in functional interfaces, each shaped for a different job: transform, consume, produce, or test.",
      selenium: "Supplier<WebDriver> is a common pattern for lazily creating a driver only when first needed; Consumer<WebElement> is used in forEach loops over findElements() results.",
      walkthrough: [
        { code: "Function<String, Integer> length = s -> s.length();", note: "Function<T, R> takes a T (String) and returns an R (Integer). Called via .apply(value) — TAKES something, RETURNS something." },
        { code: "Consumer<String> printer = s -> System.out.println(...);", note: "Consumer<T> takes a T and returns NOTHING (void). Called via .accept(value) — it 'consumes' the input to produce a side effect, like printing." },
        { code: "Supplier<String> defaultUrl = () -> \"https://example.com\";", note: "Supplier<T> takes NO arguments and returns a T. Called via .get() — it 'supplies' a value, useful for lazy/deferred creation." },
        { code: "Predicate<Integer> isPositive = n -> n > 0;", note: "Predicate<T> takes a T and returns boolean. Called via .test(value) — this is exactly what Stream.filter() expects as its argument." }
      ]
    },
    {
      level: "Advanced",
      title: "Streams — Chained map/filter/collect",
      code: `import java.util.*;
import java.util.stream.*;

public class StreamsDemo {
    public static void main(String[] args) {
        List<String> rawTexts = List.of("  Login  ", "Sign Up", "", "Logout", "  ");

        List<String> cleaned = rawTexts.stream()
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .map(String::toUpperCase)
            .collect(Collectors.toList());

        System.out.println(cleaned);
    }
}`,
      output: "[LOGIN, SIGN UP, LOGOUT]",
      explanation: "A four-stage pipeline: trim whitespace, drop empty strings, uppercase what's left, collect into a new List. Each stage transforms the stream without mutating the original list.",
      selenium: "This is the real-world shape of processing driver.findElements(...).stream().map(WebElement::getText) — clean up raw scraped page text in one readable pipeline instead of a manual loop with an if/else and a temp list.",
      walkthrough: [
        { code: "rawTexts.stream()", note: "Converts the List into a Stream — a lazy pipeline. rawTexts itself is never modified; streams never mutate their source." },
        { code: ".map(String::trim)", note: "map() transforms EACH element into something else — here, a trimmed version of itself. String::trim is a method reference, shorthand for s -> s.trim()." },
        { code: ".filter(s -> !s.isEmpty())", note: "filter() removes elements where the lambda returns false — empty strings (like the original \"\" and \"  \" after trimming) are dropped here." },
        { code: ".map(String::toUpperCase)", note: "A SECOND map stage — streams support chaining as many transformations as needed, each one operating on the output of the previous stage." },
        { code: ".collect(Collectors.toList());", note: "The TERMINAL operation — this is what actually triggers the whole pipeline to run and gathers the results into a real List. Before this line, nothing above has executed yet." }
      ]
    },
    {
      level: "Advanced",
      title: "Optional — Avoiding Null Checks",
      code: `import java.util.Optional;

public class OptionalDemo {
    public static Optional<String> findAttribute(boolean exists) {
        return exists ? Optional.of("data-testid") : Optional.empty();
    }

    public static void main(String[] args) {
        Optional<String> attr = findAttribute(false);

        String result = attr.orElse("attribute-not-found");
        System.out.println(result);

        attr.ifPresentOrElse(
            v -> System.out.println("Found: " + v),
            () -> System.out.println("Nothing here, moving on.")
        );
    }
}`,
      output: "attribute-not-found\nNothing here, moving on.",
      explanation: "Optional forces the caller to explicitly decide what happens in the empty case — orElse(default) and ifPresentOrElse(...) both handle 'no value' without an if (x != null) check anywhere.",
      selenium: "A helper like getAttributeSafely(WebElement, String) can return Optional<String> instead of null, making it impossible for a caller to forget to handle a missing attribute — the compiler-adjacent API design nudges you toward correctness.",
      walkthrough: [
        { code: "return exists ? Optional.of(\"data-testid\") : Optional.empty();", note: "Optional.of(value) wraps a non-null value; Optional.empty() represents 'nothing here' explicitly, as a real object — not as null pointing at nothing." },
        { code: "String result = attr.orElse(\"attribute-not-found\");", note: "orElse(default) unwraps the Optional: returns the real value if present, otherwise the default. One line replaces 'if (x != null) { ... } else { ... }'." },
        { code: "attr.ifPresentOrElse(v -> ..., () -> ...);", note: "Takes two lambdas: what to do WITH the value if present, what to do if empty. Both branches are handled explicitly, right where you're using the Optional — much harder to accidentally forget the empty case than a bare null check." }
      ]
    },
    {
      level: "Selenium-Oriented",
      title: "Streams Over findElements() Results",
      code: `/*
List<WebElement> rows = driver.findElements(By.cssSelector(".result-row"));

List<String> visibleTitles = rows.stream()
    .filter(WebElement::isDisplayed)
    .map(row -> row.findElement(By.className("title")))
    .map(WebElement::getText)
    .filter(text -> !text.isBlank())
    .collect(Collectors.toList());

long errorCount = rows.stream()
    .filter(row -> row.getAttribute("class").contains("error"))
    .count();
*/
List<String> visibleTitles = List.of("Result A", "Result B");
long errorCount = 1;
System.out.println(visibleTitles);
System.out.println("Errors: " + errorCount);`,
      output: "[Result A, Result B]\nErrors: 1",
      explanation: "Real Selenium code (commented, since there's no live browser here) showing the exact pattern: filter visible elements, extract nested text, collect into a clean List, and separately count matches with a Predicate.",
      selenium: "This single pattern — findElements().stream().filter(...).map(...).collect(...) — replaces dozens of lines of manual for-loops with null checks and temp ArrayLists that used to be standard in pre-Java-8 Selenium frameworks.",
      walkthrough: [
        { code: "rows.stream().filter(WebElement::isDisplayed)", note: "WebElement::isDisplayed is a method reference — shorthand for row -> row.isDisplayed(). Filters out elements that exist in the DOM but aren't visible, a very common Selenium need." },
        { code: ".map(row -> row.findElement(By.className(\"title\")))", note: "A lambda (not a method reference, since it takes an argument beyond just calling one method) that finds a NESTED element inside each row." },
        { code: ".map(WebElement::getText).filter(text -> !text.isBlank())", note: "Chained map then filter: extract text, then drop any that turned out blank. Order matters — filtering by isBlank() before extracting text wouldn't make sense." },
        { code: "rows.stream().filter(row -> row.getAttribute(\"class\").contains(\"error\")).count()", note: "A completely separate pipeline reusing the same 'rows' list — .count() is a terminal operation returning a long, perfect for 'how many elements match this condition' assertions." }
      ]
    }
  ],
  interview: [
    { q: "What is a functional interface, and how does it relate to lambdas?", a: "An interface with exactly one abstract method (it may also have default or static methods with bodies). A lambda expression is a compact way to provide the implementation of that single method — the lambda IS an instance of the functional interface, just without the ceremony of an anonymous class." },
    { q: "What's the difference between map() and filter() in a Stream?", a: "map() transforms each element into something else (same count in, same count out, different values) — like WebElement to String. filter() removes elements that don't satisfy a condition (same or fewer elements out, same type) — like keeping only visible elements." },
    { q: "Why use Optional instead of just returning null?", a: "Optional makes 'this might not have a value' part of the method's signature and type system, forcing callers to explicitly handle the empty case (via orElse, ifPresent, etc.) instead of relying on everyone remembering to null-check. It converts a runtime risk (NullPointerException) into a compile-time-visible contract." },
    { q: "What is a method reference, and when would you use one over a lambda?", a: "Method reference syntax (Class::method) is shorthand for a lambda that does nothing but call one existing method. Use it whenever your lambda body is literally just 'call this one method' — WebElement::getText instead of e -> e.getText() — for readability. If the lambda needs any extra logic, you need a real lambda." },
    { q: "Are Stream operations lazy or eager? Why does it matter?", a: "Intermediate operations (filter, map, sorted) are lazy — they just build up a pipeline description and don't touch any data. Terminal operations (collect, forEach, count) are eager and actually trigger execution. It matters because you can build a complex, reusable pipeline definition that costs nothing until you actually call a terminal operation on it." },
    { q: "What does <T> mean in a generic class or method, and why not just use Object everywhere?", a: "<T> is a type parameter — a placeholder for a specific type the caller supplies. Using Object everywhere loses compile-time type checking entirely and forces manual casting (with the risk of ClassCastException at runtime). Generics give you Object's flexibility with the compiler catching type mistakes before the code ever runs." }
  ],
  handsOn: [
    "Rewrite a for-loop that manually filters and collects strings starting with a given prefix into an equivalent 3-line Stream pipeline using filter() and collect().",
    "Write a generic method <T> T firstOrDefault(List<T> list, T fallback) that returns the first element or a fallback if the list is empty — practice writing your own generic method, not just using built-in generic classes.",
    "Create a Supplier<WebDriver> that lazily instantiates a ChromeDriver only the first time .get() is called, and reuses the same instance on subsequent calls (a simple manual memoization).",
    "Write a method that returns Optional<String> for 'first error message on the page, if any' and call it using both orElse() and ifPresentOrElse()."
  ],
  memoryVis: "Picture a Stream as a factory conveyor belt: raw items go in one end, each station (map, filter) does one transformation as the belt moves, and nothing actually happens until someone at the far end (the terminal operation) starts collecting the output into a box.",
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
      title: "Complete the Stream terminal operation",
      prompt: "Fill in the method that actually gathers the stream's results into a real List.",
      code: `List<String> cleaned = names.stream()
    .map(String::trim)
    .___1___(Collectors.toList());`,
      blanks: [
        { label: "terminal operation that builds a List", answer: "collect" }
      ],
      explanation: "collect(Collectors.toList()) is the terminal operation that triggers the whole lazy pipeline and materializes the result into an actual List."
    },
    {
      title: "Unwrap an Optional safely",
      prompt: "Fill in the method that returns the value if present, or a fallback if empty — without ever risking a NullPointerException.",
      code: `Optional<String> attr = findAttribute();
String result = attr.___1___("attribute-not-found");`,
      blanks: [
        { label: "safe unwrap-with-default method", answer: "orElse" }
      ],
      explanation: "orElse(default) returns the wrapped value if present, otherwise the default — calling .get() directly without checking isPresent() first would risk NoSuchElementException on an empty Optional."
    }
  ]
};
