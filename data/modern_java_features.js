export const modernJavaFeaturesData = {
  title: "Modern Java Features (9-21+)",
  concept: "The evolution of Java after version 8, introducing language enhancements that reduce verbosity, improve performance, and modernize syntax.",
  why: "Keeps Java competitive with newer languages like Kotlin and Go, allowing developers to write cleaner, more maintainable code.",
  realWorld: "Like upgrading from a manual transmission car (pre-Java 9) to an automatic with cruise control (Modern Java) — it gets you to the same place, but with much less effort.",
  seleniumMapping: "Records replace Object[][] DataProvider boilerplate with named, typed test data; text blocks hold JSON payloads for API tests without escape soup; switch expressions give the driver factory compile-checked browser coverage; var declutters WebDriverWait declarations.",
  commonMistakes: [
    "Ignoring Records and continuing to write massive boilerplate POJOs.",
    "Concatenating large strings instead of using Text Blocks.",
    "Not taking advantage of Virtual Threads for high-throughput concurrent applications."
  ],
  keyPoints: [
    "var (Java 10): LOCAL variable type inference — the compiler locks the type from the initializer. Still fully static typing (var s = getText() is a String forever), locals-only, initializer required.",
    "Records (Java 14+): 'record User(String name, String role) {}' auto-generates constructor, accessors, value-based equals/hashCode, and toString — a one-line immutable data carrier. Accessors are name(), NOT getName().",
    "Text Blocks (Java 15+): triple-quote multi-line strings — JSON/SQL/HTML payloads with no \\n or \\\" escaping; incidental indentation is stripped automatically.",
    "Switch expressions (Java 14+): 'case X ->' returns a value, no break, no fall-through — and over enums the compiler enforces exhaustiveness: add a constant and every unhandled switch FAILS TO COMPILE. Free refactoring safety.",
    "Pattern Matching for instanceof (Java 16+): 'if (obj instanceof String s)' tests AND casts in one step — the s variable is bound and typed inside the block.",
    "List.of/Set.of/Map.of (Java 9): concise IMMUTABLE collections — add/remove throws UnsupportedOperationException, nulls rejected. Perfect for shared expected-values lists in parallel tests.",
    "New String helpers: isBlank() (true for whitespace-only — what scraped getText() checks actually need), strip() (Unicode-aware trim), repeat(n), lines().",
    "Virtual Threads (Java 21): JVM-managed lightweight threads — millions of concurrent blocking calls without exhausting OS threads. Name it as 'the big Java 21 feature' even if you haven't used it in anger."
  ],
  examples: [
    {
      level: "Intermediate",
      title: "Records (Java 14+)",
      code: `// Old way: Class with private fields, constructor, getters, equals, hashCode, toString...

// Modern way:
public record User(Long id, String username, String email) {
    // That's it! 
}

public class RecordExample {
    public static void main(String[] args) {
        User user = new User(1L, "alice123", "alice@example.com");
        System.out.println(user.username()); // Accessor is username(), not getUsername()
        System.out.println(user); // Beautifully formatted toString() automatically
    }
}`,
      output: "alice123\nUser[id=1, username=alice123, email=alice@example.com]",
      explanation: "Records provide a compact syntax for declaring classes that are transparent holders for shallowly immutable data.",
      walkthrough: [
        { code: "public record User(...)", note: "Declares a record. All fields are implicitly final." },
        { code: "user.username()", note: "Notice that records generate accessors matching the field name, without the 'get' prefix." }
      ]
    },
    {
      level: "Intermediate",
      title: "Text Blocks (Java 15+)",
      code: `public class TextBlocks {
    public static void main(String[] args) {
        String json = """
                {
                    "name": "Alice",
                    "role": "Admin",
                    "active": true
                }
                """;
        System.out.println(json);
    }
}`,
      output: "{\n    \"name\": \"Alice\",\n    \"role\": \"Admin\",\n    \"active\": true\n}",
      explanation: "Using triple quotes allows for multi-line strings without explicit \n or + concatenation.",
      walkthrough: [
        { code: "\"\"\"", note: "Opens and closes a text block. Great for JSON, SQL, or HTML." }
      ]
    },
    {
      level: "Advanced",
      title: "Pattern Matching for instanceof (Java 16+)",
      code: `public class PatternMatching {
    public static void process(Object obj) {
        // Old way: 
        // if (obj instanceof String) { 
        //     String s = (String) obj; 
        //     System.out.println(s.length()); 
        // }

        // Modern way:
        if (obj instanceof String s) {
            System.out.println("String length: " + s.length());
        } else {
            System.out.println("Not a string");
        }
    }
}`,
      output: "N/A",
      explanation: "Combines testing if an object is of a specific type with casting it to a new variable.",
      walkthrough: [
        { code: "instanceof String s", note: "If obj is a String, it is automatically cast and bound to the variable 's' in the scope of the if block." }
      ]
    }
  ],
  interview: [
    { q: "Is 'var' dynamic typing? A teammate says it makes Java like JavaScript — correct them precisely.", a: "No — var is compile-time type INFERENCE. The compiler reads the initializer, locks the type permanently, and enforces it everywhere: var s = element.getText() is a String forever, and s = 42 won't compile. JavaScript defers typing to runtime; Java's var only removes the WRITTEN type, never the type itself. Also: locals-only, initializer required." },
    { q: "Your Object[][] DataProvider rows keep breaking when someone reorders columns. How do records fix this?", a: "Replace positional rows with a record: record LoginCase(String user, String pass, boolean valid) {} — fields are accessed by NAME (case.user()), so column order can't break anything, types are checked at compile time, and the generated toString makes each TestNG invocation self-describing in reports: LoginCase[user=hacker, ...] instead of [Ljava.lang.Object;@1a2b3c." },
    { q: "What does a switch EXPRESSION give you over the old switch statement — especially during refactoring?", a: "It returns a value directly (no temp variable + break dance), arrow cases can't fall through (the forgotten-break bug is structurally impossible), and over enums the compiler enforces exhaustiveness. The refactoring payoff: add SAFARI to your Browser enum and every switch expression not handling it fails to COMPILE — the compiler hands you a checklist of every place needing an update." },
    { q: "When would you use a record instead of a class, and what do you lose?", a: "Records are for immutable data carriers — test credentials, API response snapshots — where the type IS its data: constructor, accessors, value-based equals/hashCode, and toString for one line. You lose mutability (no setters, by design), inheritance (records can't extend classes), and hidden state. Behavior-heavy or mutable types stay classes; data in/data out becomes a record." },
    { q: "Why do List.of() collections throw on add(), and when is that exactly what a test framework wants?", a: "They're immutable — the exception IS the contract enforcing itself. That's ideal for shared fixed data: supported browsers, expected dropdown options, environment names. Immutable means thread-safe to share across parallel tests with zero synchronization, and no test can corrupt another's expected values. Need a mutable copy? new ArrayList<>(List.of(...)) makes the intent explicit." },
    { q: "An interviewer asks 'what Java version do you work with?' — construct the strong answer.", a: "Name an LTS, anchor it with features and use cases: 'We're on 17 — records for immutable test data instead of POJO boilerplate, text blocks for JSON payloads in API tests, switch expressions in our driver factory for compile-checked browser coverage, var to cut declaration noise.' Version + features + concrete uses proves currency; a bare 'Java 8' quietly dates your whole profile." }
  ],
  handsOn: [
    "Refactor a traditional Java POJO class into a Java Record.",
    "Rewrite an ugly multi-line SQL string using Java Text Blocks.",
    "Convert one Object[][] DataProvider to return records — compare the test method's readability and the report output.",
    "Write a switch expression over a Browser enum, add a new constant WITHOUT updating the switch, and read the compile error — that error is the feature."
  ],
  memoryVis: "Modern Java is decluttering a workshop you already know: var removes labels you wrote twice, records replace hand-made boxes with a stamping machine, switch arrows remove the tripwire (fall-through) between workbenches, and text blocks pin the blueprint to the wall as-is instead of describing it line by line.",
  challenges: [
    {
      title: "Record Syntax",
      prompt: "What keyword is used to declare an immutable data carrier class in modern Java?",
      code: "public ___1___ Point(int x, int y) {}",
      blanks: [{ label: "Keyword", answer: ["record"] }],
      explanation: "The 'record' keyword is used to create these compact data classes — constructor, accessors, equals/hashCode, and toString all generated from the header."
    },
    {
      title: "No break, no fall-through",
      prompt: "Fill in the token that makes this a value-returning switch case with no fall-through.",
      code: `return switch (browser) {
    case CHROME  ___1___ "chromedriver";
    case FIREFOX ___1___ "geckodriver";
};`,
      blanks: [{ label: "the arrow case separator", answer: ["->"] }],
      explanation: "The arrow form produces the case's value directly — no break statements, and fall-through (the old switch's classic bug) is structurally impossible."
    },
    {
      title: "Test-and-cast in one step",
      prompt: "Fill in the variable binding that pattern matching adds to instanceof.",
      code: `if (obj instanceof String ___1___) {
    System.out.println(___1___.length());
}`,
      blanks: [{ label: "the bound, already-cast variable name", answer: ["s"] }],
      explanation: "Pattern matching binds the tested object to a new typed variable in one step — 'instanceof String s' replaces the old test-then-cast two-liner, and s is in scope wherever the test is true."
    }
  ]
};
