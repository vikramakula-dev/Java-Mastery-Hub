export const streamsOptionalData = {
  title: "Streams & Optional",
  concept: "The Streams API processes collections as declarative pipelines — filter, transform, collect — instead of manual loops. Optional<T> is a container that may or may not hold a value, replacing null returns with an explicit, compiler-visible 'might be empty' contract.",
  why: "Loops with temp lists and if-nests bury WHAT you're doing under HOW; a stream pipeline reads as the intent itself. And null — the 'billion-dollar mistake' — hides emptiness until a NullPointerException surfaces far from its cause; Optional makes emptiness part of the method signature.",
  realWorld: "A stream is a factory conveyor belt: items flow past stations (filter rejects, map transforms) and nothing moves until someone at the end (the terminal operation) hits the START button. Optional is a gift box that's honest about possibly being empty — you must open it deliberately instead of assuming.",
  seleniumMapping: "findElements().stream().filter(WebElement::isDisplayed).map(WebElement::getText).collect(toList()) — the modern replacement for every scrape-and-collect loop. Optional<WebElement> is how clean frameworks type 'this element might not exist'.",
  commonMistakes: [
    "Calling Optional.get() without checking isPresent() first — reintroduces the exact exception Optional exists to prevent.",
    "Forgetting the terminal operation — a pipeline of filter/map with no collect/forEach/count compiles happily and does absolutely nothing (streams are lazy).",
    "Reusing a consumed stream — a Stream can be traversed ONCE; a second terminal operation throws IllegalStateException. Re-call .stream() on the source collection instead.",
    "Chaining ten operations into one unreadable line — break pipelines at each stage; readability is the point."
  ],
  keyPoints: [
    "Intermediate operations (filter, map, sorted, distinct, limit) are LAZY — they build a pipeline description and return a new Stream. Terminal operations (collect, forEach, count, anyMatch, findFirst) are EAGER — they trigger the whole pipeline. Nothing runs until a terminal op is called.",
    "map() transforms each element (same count out, new values — WebElement→String); filter() keeps only elements matching a Predicate (fewer out, same type). Interviewers love asking the difference.",
    "collect(Collectors.toList()) materializes results into a List; also know toSet(), joining(\", \"), groupingBy(), and counting().",
    "Streams never mutate their source — the original collection is untouched; the pipeline produces new results. This immutability is why streams compose safely.",
    "A stream is single-use: after a terminal operation it's consumed. Call .stream() on the collection again for a second pass.",
    "Optional.of(x) wraps a non-null value (throws if null), Optional.ofNullable(x) tolerates null, Optional.empty() is the explicit 'nothing'. Unwrap with orElse(default), orElseGet(supplier), orElseThrow(), or act with ifPresent()/ifPresentOrElse().",
    "Optional's real power is API design: a method returning Optional<WebElement> FORCES every caller to handle absence — versus a null return that callers forget to check until production throws NPE.",
    "Numeric shortcuts: mapToInt(String::length).sum(), .average(), .max() — IntStream avoids boxing overhead for math over collections.",
    "findFirst() returns an Optional — the API's own admission that 'first matching element' might not exist. Streams and Optional are designed to interlock."
  ],
  examples: [
    {
      level: "Beginner",
      title: "Chained map / filter / collect",
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
      explanation: "A four-stage pipeline: trim, drop empties, uppercase, collect. Each stage transforms the flow without touching the original list.",
      selenium: "This is the shape of processing findElements(...).stream().map(WebElement::getText) — cleaning scraped page text in one readable pipeline instead of a loop with an if and a temp list.",
      walkthrough: [
        { code: "rawTexts.stream()", note: "Converts the List into a Stream — a lazy pipeline. rawTexts itself is never modified; streams never mutate their source." },
        { code: ".map(String::trim)", note: "map() transforms EACH element into something new — here a trimmed copy. String::trim is a method reference, shorthand for s -> s.trim(). Still lazy: nothing has executed yet." },
        { code: ".filter(s -> !s.isEmpty())", note: "filter() keeps elements where the Predicate is true — the empty strings (\"\" and \"  \" after trimming) are dropped here. Note the ORDER matters: trim before filter, or \"  \" would survive." },
        { code: ".collect(Collectors.toList());", note: "The TERMINAL operation — this line actually runs the whole pipeline, pulling each element through all stages, and gathers survivors into a real List. Delete this line and the program does nothing at all: lazy pipelines without a terminal op never execute." }
      ]
    },
    {
      level: "Intermediate",
      title: "Optional — Making Absence Explicit",
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
      explanation: "Optional forces the caller to decide what happens in the empty case — orElse and ifPresentOrElse both handle 'no value' without a single null check.",
      selenium: "A helper like Optional<WebElement> findIfPresent(By locator) makes 'element might not exist' part of the type — impossible for a caller to forget, unlike a null return.",
      walkthrough: [
        { code: "return exists ? Optional.of(\"data-testid\") : Optional.empty();", note: "Optional.of(value) wraps a value that must not be null; Optional.empty() represents 'nothing' as a real object. The method's SIGNATURE now advertises possible absence — callers can't claim surprise." },
        { code: "String result = attr.orElse(\"attribute-not-found\");", note: "orElse(default) unwraps: the value if present, the default if empty. One line replaces if (x != null) {...} else {...}. Sibling worth knowing: orElseGet(supplier) computes the default lazily — use it when the default is expensive to build." },
        { code: "attr.ifPresentOrElse(v -> ..., () -> ...);", note: "Both branches handled explicitly at the point of use — a Consumer for the value, a Runnable for emptiness. Compare .get(), which throws NoSuchElementException on empty and should only follow an isPresent() check (or better, be avoided for these richer methods)." }
      ]
    },
    {
      level: "Advanced",
      title: "findFirst, anyMatch, count — Terminal Variety",
      code: `import java.util.*;
import java.util.stream.*;

public class Terminals {
    public static void main(String[] args) {
        List<String> statuses = List.of("PASS", "PASS", "FAIL", "SKIP", "PASS");

        long failures = statuses.stream().filter(s -> s.equals("FAIL")).count();

        boolean anySkipped = statuses.stream().anyMatch(s -> s.equals("SKIP"));

        Optional<String> firstFail = statuses.stream()
            .filter(s -> s.equals("FAIL"))
            .findFirst();

        System.out.println("failures=" + failures);
        System.out.println("anySkipped=" + anySkipped);
        System.out.println(firstFail.orElse("no failures"));
    }
}`,
      output: "failures=1\nanySkipped=true\nFAIL",
      explanation: "Three terminal operations, three result shapes: a count, a boolean, and an Optional — pick the one matching the question you're asking.",
      selenium: "Assertions map straight onto these: count() of error rows, anyMatch(WebElement::isDisplayed) for 'is any spinner visible', findFirst() for 'the first enabled submit button — if any'.",
      walkthrough: [
        { code: ".filter(...).count()", note: "count() answers 'how many match' as a long — no list built, no memory wasted collecting elements you only wanted to tally." },
        { code: ".anyMatch(s -> s.equals(\"SKIP\"))", note: "anyMatch short-circuits: it stops at the FIRST match instead of scanning everything — on a 10,000-element stream that matters. Siblings: allMatch / noneMatch." },
        { code: ".findFirst();", note: "Returns Optional<String>, not String — the API itself admits there might be no match, and the compiler makes you handle it. This is Streams and Optional interlocking by design: no null sneaks out of a pipeline." }
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
      explanation: "Real Selenium shape (commented since there's no live browser here): filter visible rows, extract nested text, collect — plus a second independent pipeline counting error rows.",
      selenium: "This single pattern replaces dozens of lines of manual for-loops with null checks and temp ArrayLists that were standard in pre-Java-8 frameworks.",
      walkthrough: [
        { code: "rows.stream().filter(WebElement::isDisplayed)", note: "Method reference doing the first cut: elements in the DOM but hidden are dropped. WebElement::isDisplayed is e -> e.isDisplayed() — a Predicate<WebElement> by shape." },
        { code: ".map(row -> row.findElement(By.className(\"title\")))", note: "A real lambda (not a method reference — there's an argument involved) diving into each row for a NESTED element. map() = one row in, one title element out." },
        { code: ".map(WebElement::getText).filter(text -> !text.isBlank())", note: "Chained transformation then cleanup. Order is forced by types: after map to String, the filter's parameter is a String — each stage's output type feeds the next stage's input." },
        { code: "rows.stream()...count()", note: "A second, separate pipeline on the SAME source list — legal because each .stream() call creates a fresh stream. Reusing the FIRST stream object here would throw IllegalStateException: streams are single-use." }
      ]
    }
  ],
  interview: [
    { q: "What's the difference between map() and filter() in a Stream?", a: "map() transforms each element into something else (same count in, same count out, different values) — like WebElement to String via getText(). filter() removes elements that don't satisfy a Predicate (same type out, potentially fewer elements) — like keeping only visible elements. One changes WHAT the elements are; the other changes WHICH elements remain." },
    { q: "Are Stream operations lazy or eager? Why does it matter?", a: "Intermediate operations (filter, map, sorted) are lazy — they build a pipeline description and touch no data. Terminal operations (collect, forEach, count) are eager and trigger execution. It matters practically: a pipeline without a terminal operation silently does NOTHING (a real bug people ship), and laziness lets short-circuiting ops like anyMatch/findFirst stop early instead of processing the whole source." },
    { q: "Why use Optional instead of just returning null?", a: "Optional makes 'this might not have a value' part of the method's signature and type system, forcing callers to explicitly handle the empty case (orElse, ifPresent, orElseThrow) instead of relying on everyone remembering to null-check. It converts a runtime landmine (NullPointerException far from the cause) into a compile-time-visible contract at the exact call site." },
    { q: "A teammate writes 'optional.get()' everywhere and says 'it works fine.' What do you tell them?", a: "get() on an empty Optional throws NoSuchElementException — they've rebuilt the null problem with a different exception name. It 'works fine' only until the first empty case in production. The fix costs nothing: orElse(default) when there's a sensible fallback, orElseThrow(() -> new MeaningfulException(...)) when absence is truly an error — which at least fails with a message that explains itself." },
    { q: "You run 'Stream<String> s = list.stream(); s.count(); s.forEach(...)' and get IllegalStateException. Why?", a: "A stream is single-use: count() is a terminal operation that consumed it, and the subsequent forEach finds a closed pipeline. The fix is calling list.stream() again for the second operation — streams are cheap views over the source, not reusable containers. This trips up people who treat a Stream like a List." },
    { q: "Your scraped list has 10,000 rows and you only need to know whether ANY row has class 'error'. Compare filter().count() > 0 versus anyMatch() — which is better and why?", a: "anyMatch(predicate) — it short-circuits at the first match, potentially checking one element instead of all 10,000, while filter().count() > 0 processes the entire stream to build a full count you then throw away. Same answer, very different work. Knowing which terminal op matches the QUESTION (existence vs quantity vs retrieval) is the real skill streams reward." },
    { q: "How would you design a Selenium helper for 'element may legitimately not exist' — and why is Optional<WebElement> better than the try/catch or findElements().isEmpty() idioms it replaces?", a: "Optional<WebElement> findIfPresent(By locator) { var found = driver.findElements(locator); return found.isEmpty() ? Optional.empty() : Optional.of(found.get(0)); } — findElements returns an empty list rather than throwing, so no exception-based control flow. Callers then write findIfPresent(popup).ifPresent(WebElement::click): the optional-popup case handles itself in one line, and no caller can FORGET the element might be absent, because the type won't let them." }
  ],
  handsOn: [
    "Rewrite a for-loop that collects strings starting with a given prefix into a 3-line Stream pipeline with filter() and collect().",
    "Write Optional<String> firstErrorMessage() for 'first error banner on the page, if any' and consume it with both orElse() and ifPresentOrElse().",
    "Take a List<String> of prices like \"$10.50\" and produce the total as a double in ONE pipeline: map to strip '$', mapToDouble to parse, then .sum().",
    "Deliberately write a pipeline with no terminal operation, confirm nothing happens, then add .count() and watch it run — laziness is best learned by seeing it."
  ],
  memoryVis: "The conveyor belt: raw items enter, each station (map transforms, filter ejects rejects) does one job as items flow past, and the belt only MOVES when someone at the end presses START (the terminal operation). Optional is the last box off the belt: sealed, possibly empty, and honest about it — you check the label (isPresent/orElse) instead of reaching in blind (get) and cutting your hand on nothing.",
  challenges: [
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
      prompt: "Fill in the method that returns the value if present, or a fallback if empty — without ever risking an exception.",
      code: `Optional<String> attr = findAttribute();
String result = attr.___1___("attribute-not-found");`,
      blanks: [
        { label: "safe unwrap-with-default method", answer: "orElse" }
      ],
      explanation: "orElse(default) returns the wrapped value if present, otherwise the default — calling .get() on an empty Optional would throw NoSuchElementException instead."
    },
    {
      title: "Keep only visible elements",
      prompt: "Fill in the Stream operation that keeps only elements matching a condition.",
      code: `List<WebElement> visible = rows.stream()
    .___1___(WebElement::isDisplayed)
    .collect(Collectors.toList());`,
      blanks: [
        { label: "operation that keeps matching elements", answer: "filter" }
      ],
      explanation: "filter() takes a Predicate and keeps only elements where it returns true — WebElement::isDisplayed is the predicate here. map() would be wrong: it transforms elements rather than selecting them."
    }
  ]
};
