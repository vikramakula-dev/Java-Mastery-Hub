export const introductionData = {
  title: "Introduction to Java",
  concept: "Java is a high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible.",
  why: "It's platform-independent ('Write Once, Run Anywhere'), robust, secure, and widely used in enterprise applications.",
  realWorld: "Like an electrical outlet that works identically regardless of the country, provided you have the right adapter (JVM).",
  seleniumMapping: "Selenium WebDriver bindings for Java are the most popular, providing robust automation capabilities.",
  commonMistakes: [
    "Forgetting the main method signature exactly as 'public static void main(String[] args)'",
    "Missing semicolons at the end of statements",
    "File name mismatch with the public class name"
  ],
  keyPoints: [
    "Compilation flow: .java source → javac compiler → .class bytecode → JVM executes it. Bytecode is what makes Java platform-independent.",
    "JDK ⊃ JRE ⊃ JVM: the JDK contains the compiler and tools, the JRE contains the libraries needed to run, the JVM actually executes bytecode.",
    "main() must be exactly 'public static void main(String[] args)': public so the JVM can call it, static so no object is needed, void because it returns nothing.",
    "Java is strongly typed — every variable has a declared type checked at compile time. The 8 primitives are byte, short, int, long, float, double, char, boolean; everything else is a reference type.",
    "One public class per file, and the file name must match that class name exactly (Case-Sensitive.java).",
    "String is not a primitive — it is a class, and String objects are immutable.",
    "Control flow (if/else, switch, for, while) decides WHICH code runs; methods decide HOW code is reused."
  ],
  examples: [
    {
      level: "Beginner",
      title: "Hello World",
      code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      output: "Hello, World!",
      explanation: "The entry point of any Java application.",
      selenium: "Every Selenium script starts in a main method or a TestNG/JUnit annotated method.",
      walkthrough: [
        { code: "public class HelloWorld {", note: "Declares a class named HelloWorld. 'public' means it is visible everywhere. The file MUST be named HelloWorld.java." },
        { code: "public static void main(String[] args) {", note: "The JVM looks for this exact signature to start the program. 'static' lets the JVM call it without creating an object; 'String[] args' receives command-line arguments." },
        { code: "System.out.println(\"Hello, World!\");", note: "System is a class, out is its static PrintStream field, println() prints the text plus a newline. Every statement ends with a semicolon." },
        { code: "}", note: "Closing braces end the method and the class. Every '{' needs a matching '}'." }
      ]
    },
    {
      level: "Beginner",
      title: "Variables and Data Types",
      code: `public class Variables {
    public static void main(String[] args) {
        int age = 25;
        double salary = 50000.50;
        boolean isEmployed = true;
        char grade = 'A';
        System.out.println("Age: " + age + ", Salary: " + salary);
    }
}`,
      output: "Age: 25, Salary: 50000.5",
      explanation: "Java is strongly typed. Variables must be declared with their type.",
      selenium: "Used to store URLs, timeouts, and element states.",
      walkthrough: [
        { code: "int age = 25;", note: "Declares an integer variable. 'int' holds whole numbers (32-bit). Declaration = type + name + optional initial value." },
        { code: "double salary = 50000.50;", note: "'double' holds decimal numbers (64-bit floating point). Note the output prints 50000.5 — trailing zeros are dropped." },
        { code: "boolean isEmployed = true;", note: "'boolean' holds only true or false. In Selenium you use this constantly: element.isDisplayed() returns a boolean." },
        { code: "char grade = 'A';", note: "'char' holds a single character in SINGLE quotes. Double quotes would make it a String and fail to compile." },
        { code: "System.out.println(\"Age: \" + age + ...);", note: "The + operator concatenates strings with other types — Java auto-converts the numbers to text." }
      ]
    },
    {
      level: "Beginner",
      title: "If-Else Statement",
      code: `public class ControlFlow {
    public static void main(String[] args) {
        int browserVersion = 100;
        if (browserVersion > 90) {
            System.out.println("Browser is supported.");
        } else {
            System.out.println("Please update browser.");
        }
    }
}`,
      output: "Browser is supported.",
      explanation: "Conditional execution of code blocks.",
      selenium: "Used to check if an element is displayed before clicking."
    },
    {
      level: "Intermediate",
      title: "Switch Statement",
      code: `public class SwitchExample {
    public static void main(String[] args) {
        String browser = "CHROME";
        switch (browser) {
            case "CHROME":
                System.out.println("Initialize ChromeDriver");
                break;
            case "FIREFOX":
                System.out.println("Initialize FirefoxDriver");
                break;
            default:
                System.out.println("Invalid browser");
        }
    }
}`,
      output: "Initialize ChromeDriver",
      explanation: "A cleaner alternative to multiple if-else conditions.",
      selenium: "Crucial for cross-browser testing setup."
    },
    {
      level: "Intermediate",
      title: "For Loop",
      code: `public class Loops {
    public static void main(String[] args) {
        for (int i = 1; i <= 3; i++) {
            System.out.println("Attempt: " + i);
        }
    }
}`,
      output: "Attempt: 1\nAttempt: 2\nAttempt: 3",
      explanation: "Executes a block of code a specific number of times.",
      selenium: "Used to retry a failed element interaction (e.g., StaleElementReferenceException).",
      walkthrough: [
        { code: "for (int i = 1; i <= 3; i++) {", note: "Three parts separated by semicolons: initialization (runs once), condition (checked BEFORE every iteration), update (runs AFTER every iteration)." },
        { code: "int i = 1", note: "Loop counter, scoped to the loop only — 'i' does not exist after the loop ends." },
        { code: "i <= 3", note: "Loop continues while this is true. When i becomes 4, the check fails and the loop exits — so the body runs exactly 3 times." },
        { code: "i++", note: "Shorthand for i = i + 1. Runs after each iteration of the body." }
      ]
    },
    {
      level: "Intermediate",
      title: "While Loop",
      code: `public class WhileLoop {
    public static void main(String[] args) {
        int count = 0;
        while (count < 2) {
            System.out.println("Loading...");
            count++;
        }
    }
}`,
      output: "Loading...\nLoading...",
      explanation: "Executes a block as long as a condition is true.",
      selenium: "Used in custom explicit waits (polling for a condition)."
    },
    {
      level: "Intermediate",
      title: "Arrays",
      code: `public class ArraysExample {
    public static void main(String[] args) {
        String[] browsers = {"Chrome", "Firefox", "Edge"};
        System.out.println("First browser: " + browsers[0]);
    }
}`,
      output: "First browser: Chrome",
      explanation: "Stores a fixed-size sequential collection of elements.",
      selenium: "Often replaced by Collections in Selenium, but useful for static data."
    },
    {
      level: "Advanced",
      title: "Methods",
      code: `public class MethodsExample {
    public static void main(String[] args) {
        System.out.println(greet("Selenium"));
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}`,
      output: "Hello, Selenium!",
      explanation: "Reusable blocks of code.",
      selenium: "Every step in a Page Object Model should be a method.",
      walkthrough: [
        { code: "public static String greet(String name) {", note: "Method declaration: 'String' before the name is the RETURN type (this method must return a String). '(String name)' is the parameter — the input the caller supplies." },
        { code: "return \"Hello, \" + name + \"!\";", note: "'return' sends a value back to the caller and ends the method. The returned type must match the declared return type." },
        { code: "System.out.println(greet(\"Selenium\"));", note: "Calls greet() with the argument \"Selenium\"; the returned string is passed straight into println. Argument = actual value, parameter = the variable that receives it." }
      ]
    },
    {
      level: "Advanced",
      title: "Method Overloading",
      code: `public class Overloading {
    public static void click(String element) {
        System.out.println("Clicking " + element);
    }
    
    public static void click(String element, int timeout) {
        System.out.println("Waiting " + timeout + "s, then clicking " + element);
    }
    
    public static void main(String[] args) {
        click("LoginBtn");
        click("SubmitBtn", 5);
    }
}`,
      output: "Clicking LoginBtn\nWaiting 5s, then clicking SubmitBtn",
      explanation: "Multiple methods with the same name but different parameters.",
      selenium: "Useful for utility methods (e.g., wait with default timeout vs custom timeout)."
    },
    {
      level: "Selenium-Oriented",
      title: "Basic Class Structure for Tests",
      code: `public class LoginTest {
    // Simulated WebDriver setup
    public void setup() {
        System.out.println("Opening Browser");
    }
    
    public void testLogin() {
        System.out.println("Entering credentials...");
        System.out.println("Clicking Login...");
    }
    
    public void teardown() {
        System.out.println("Closing Browser");
    }
    
    public static void main(String[] args) {
        LoginTest test = new LoginTest();
        test.setup();
        test.testLogin();
        test.teardown();
    }
}`,
      output: "Opening Browser\nEntering credentials...\nClicking Login...\nClosing Browser",
      explanation: "Structuring logic into setup, test, and teardown phases.",
      selenium: "The foundation of all test scripts (often handled by TestNG annotations)."
    }
  ],
  interview: [
    { q: "What is JVM, JRE, and JDK?", a: "JDK is the full development kit. JRE provides the environment to run Java. JVM is the engine that actually executes the bytecode." },
    { q: "Why is Java architecture neutral?", a: "Java code is compiled into platform-independent bytecode, which the JVM translates to machine code." },
    { q: "Your Selenium test suite runs fine on your machine but fails with 'ChromeDriver executable needs to be in PATH' on a teammate's laptop. What's actually going wrong, and how does Java's platform independence relate?", a: "Java's bytecode is platform-independent, but native binaries like chromedriver.exe are NOT — they're OS-specific executables Selenium shells out to, completely outside the JVM. The fix is either adding the driver to PATH on every machine or using WebDriverManager (which auto-downloads the correct driver binary per OS), not a Java language fix." },
    { q: "A test file is named LoginTest.java but the public class inside is called LoginTests (with an 's'). What happens when you try to compile it, and why does this rule exist?", a: "Compilation fails with 'class LoginTests is public, should be declared in a file named LoginTests.java'. The rule exists because the JVM locates classes by filename — mismatched names would make class loading ambiguous, so javac enforces the match for any public class." },
    { q: "You write 'if (browser = \"chrome\")' instead of 'if (browser.equals(\"chrome\"))' in a test. What actually happens?", a: "This won't even compile for a boolean check on a String, because = is assignment, not comparison, and assigning a String to a boolean context is a type mismatch. For primitives like int this is a classic silent bug (assignment 'succeeds' and the if is always true) — it's exactly why interviewers ask about == vs = vs .equals()." },
    { q: "A teammate hardcodes 'Thread.sleep(5000)' after every click in a test suite of 200 tests. Using only Introduction-level concepts, how would you explain why this is a problem and what control-flow construct fixes it?", a: "Fixed sleeps waste time when the page loads fast and still fail when it's slow — a while loop that polls a condition (an element's presence) is what you actually want, which is the manual version of what Selenium's WebDriverWait automates later. It's the same 'while (condition) { check again }' shape covered in the While Loop example, just applied to element state instead of a counter." },
    { q: "Why does Java require every variable to have a declared type, and how does that show up when you write Selenium tests?", a: "Strong typing means the compiler catches type mistakes before the code runs — e.g., trying to store getText() (a String) into an int variable fails at compile time instead of surfacing as a confusing runtime error mid-test-suite. In Selenium code this shows up constantly: WebElement, By, Duration are all specific types, not generic 'variables'." },
    { q: "What's the entry point of a Java program, and how does that relate to how TestNG or JUnit actually run your tests?", a: "public static void main(String[] args) is the entry point for a plain Java application, but TestNG/JUnit tests don't have a main method at all — the test runner (via reflection) locates and invokes @Test-annotated methods directly. Understanding main() is still foundational because it's how you'd run a quick standalone Java program to sanity-check logic outside a test framework." },
    { q: "If method overloading is resolved at compile time, why does it matter for writing Selenium utility methods like a custom 'click' helper?", a: "Because the compiler picks the overload based on the declared (compile-time) types of the arguments, you get predictable, fast dispatch with zero runtime ambiguity — click(String locator) and click(String locator, int timeoutSeconds) can coexist safely, and callers get IDE autocomplete showing exactly which signatures exist." }
  ],
  handsOn: [
    "Write a Java program that accepts a username and prints a welcome message.",
    "Create a simple calculator using a switch statement."
  ],
  memoryVis: "Think of Java code as a script (source code), the compiler as a translator making it a universal language (bytecode), and JVM as the local actor who performs it perfectly everywhere.",
  challenges: [
    {
      title: "Complete the main method",
      prompt: "Fill in the two blanks to make this a valid, runnable Java entry point.",
      code: `public class Entry {
    public ___1___ void main(String[] args) {
        System.out.println("Started");
    }
}`,
      blanks: [
        { label: "modifier so the JVM can call this without an object", answer: "static" }
      ],
      explanation: "'static' lets the JVM invoke main() before any object of the class exists — that's the whole reason this specific signature is required."
    },
    {
      title: "Fix the comparison",
      prompt: "This code is meant to check if browserVersion is at least 90. Fill in the missing operator.",
      code: `int browserVersion = 95;
if (browserVersion ___1___ 90) {
    System.out.println("Supported");
}`,
      blanks: [
        { label: "comparison operator for \"at least\"", answer: [">=", "gte"] }
      ],
      explanation: "'>=' means greater-than-or-equal — 95 >= 90 is true, so \"Supported\" prints. Using '>' alone would incorrectly exclude exactly 90."
    },
    {
      title: "Complete the for loop",
      prompt: "Fill in the loop update expression so this prints Attempt: 1 through Attempt: 3 (3 lines total).",
      code: `for (int i = 1; i <= 3; ___1___) {
    System.out.println("Attempt: " + i);
}`,
      blanks: [
        { label: "loop update expression", answer: ["i++", "i = i + 1", "i+=1"] }
      ],
      explanation: "i++ increments i by 1 after each iteration. Without an update, the loop would never reach the exit condition and would run forever."
    }
  ]
};
