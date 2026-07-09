export const exceptionHandlingData = {
  title: "Exception Handling",
  concept: "A mechanism to handle runtime errors, ensuring the normal flow of the application is maintained.",
  why: "Prevents the program from crashing abruptly and allows for graceful recovery or logging of errors.",
  realWorld: "Having a spare tire in your car. If a tire blows out (exception), you switch to the spare (handling) and keep driving.",
  seleniumMapping: "Handling timeouts, missing elements (NoSuchElementException), and unexpected popups during automation.",
  commonMistakes: [
    "Catching a generic Exception instead of specific ones (e.g., catching Exception instead of ArithmeticException).",
    "Leaving a catch block empty (swallowing the exception)."
  ],
  keyPoints: [
    "Hierarchy: Throwable → Error (JVM problems, don't catch) and Exception → checked (compile-time, must handle: IOException) vs unchecked/RuntimeException (NullPointerException, ArithmeticException).",
    "Checked vs unchecked is THE interview question: checked = compiler forces try/catch or throws; unchecked = programming bugs, no forced handling.",
    "try/catch/finally: finally runs ALWAYS (even after return or an exception) — that's why driver.quit() belongs in finally or @AfterMethod.",
    "throw = actually throwing one exception object; throws = method signature declaring it MIGHT throw. Another guaranteed question.",
    "Catch specific exceptions first, general last — an unreachable catch block won't compile.",
    "try-with-resources (try (FileReader f = ...)) auto-closes resources — the modern replacement for finally cleanup.",
    "Selenium exceptions to name-drop: NoSuchElementException, StaleElementReferenceException, TimeoutException, ElementClickInterceptedException — and know WHEN each occurs."
  ],
  examples: [
    { level: "Beginner", title: "Basic Try-Catch", code: "try {\n    int result = 10 / 0;\n} catch (ArithmeticException e) {\n    System.out.println(\"Cannot divide by zero!\");\n}", output: "Cannot divide by zero!", explanation: "The try block contains code that might throw an exception. The catch block handles it.", selenium: "",
      walkthrough: [
        { code: "try {", note: "Wraps the 'risky' code. If any line inside throws, execution jumps OUT of the try immediately — lines after the failing one never run." },
        { code: "int result = 10 / 0;", note: "Integer division by zero throws ArithmeticException at runtime (an unchecked exception — the compiler doesn't force you to handle it). Note: 10.0 / 0 with doubles would NOT throw; it gives Infinity." },
        { code: "} catch (ArithmeticException e) {", note: "Runs only if the try threw this exact type (or a subclass). 'e' is the exception object — e.getMessage() gives \"/ by zero\", e.printStackTrace() shows where it happened." },
        { code: "System.out.println(\"Cannot divide by zero!\");", note: "The program RECOVERS and continues after the catch instead of crashing — that's the whole point of exception handling." }
      ] },
    { level: "Beginner", title: "Multiple Catch Blocks", code: "try {\n    int[] arr = new int[2];\n    arr[5] = 10;\n} catch (ArithmeticException e) {\n    System.out.println(\"Math error\");\n} catch (ArrayIndexOutOfBoundsException e) {\n    System.out.println(\"Index out of bounds!\");\n}", output: "Index out of bounds!", explanation: "You can handle different exceptions in different ways.", selenium: "" },
    { level: "Beginner", title: "The Finally Block", code: "try {\n    int x = 5 / 0;\n} catch (Exception e) {\n    System.out.println(\"Error\");\n} finally {\n    System.out.println(\"Always executes\");\n}", output: "Error\nAlways executes", explanation: "The finally block always runs, whether an exception occurred or not. Useful for cleanup.", selenium: "Closing a browser or a database connection even if the test fails.",
      walkthrough: [
        { code: "int x = 5 / 0;", note: "Throws ArithmeticException, so control jumps to catch." },
        { code: "} catch (Exception e) {", note: "Catching the broad 'Exception' type catches almost everything — fine for demos, but in real code catch the specific type so you don't hide unrelated bugs." },
        { code: "} finally {", note: "Runs in EVERY scenario: exception thrown, no exception, even if try or catch has a 'return' statement. Only System.exit() or a JVM crash skips it." },
        { code: "System.out.println(\"Always executes\");", note: "This is where cleanup goes — in Selenium, driver.quit() lives here so the browser closes even when the test fails." }
      ] },
    { level: "Intermediate", title: "Throwing an Exception", code: "public void checkAge(int age) {\n    if (age < 18) {\n        throw new IllegalArgumentException(\"Age must be 18 or older\");\n    }\n}\n// checkAge(15);", output: "Exception in thread \"main\" java.lang.IllegalArgumentException: Age must be 18 or older", explanation: "The throw keyword is used to explicitly throw a single exception.", selenium: "",
      walkthrough: [
        { code: "if (age < 18) {", note: "Validation logic: the method refuses bad input instead of silently working with it — 'fail fast'." },
        { code: "throw new IllegalArgumentException(\"...\");", note: "'throw' (no s) throws ONE exception object you create with 'new'. IllegalArgumentException is unchecked, so callers aren't forced to catch it. 'throw' immediately ends the method — like a return, but signaling failure." },
        { code: "// checkAge(15);", note: "The caller gets the exception. If nobody up the call stack catches it, the JVM prints the stack trace and the thread dies — that's the output shown." }
      ] },
    { level: "Intermediate", title: "Throws Keyword", code: "public void readFile() throws IOException {\n    FileReader file = new FileReader(\"notexist.txt\");\n    BufferedReader fileInput = new BufferedReader(file);\n    // ...\n}", output: "", explanation: "The throws keyword is used in a method signature to declare that it might throw exceptions.", selenium: "" },
    { level: "Intermediate", title: "Custom Exceptions", code: "class InvalidLoginException extends Exception {\n    public InvalidLoginException(String message) {\n        super(message);\n    }\n}\n// throw new InvalidLoginException(\"Bad credentials\");", output: "", explanation: "Creating a user-defined exception by extending Exception or RuntimeException.", selenium: "" },
    { level: "Advanced", title: "Try-with-Resources", code: "try (Scanner scanner = new Scanner(new File(\"test.txt\"))) {\n    while (scanner.hasNext()) {\n        System.out.println(scanner.nextLine());\n    }\n} catch (FileNotFoundException e) {\n    System.out.println(\"File not found\");\n}", output: "File not found (if missing)", explanation: "Automatically closes resources that implement AutoCloseable, eliminating the need for a finally block to close them.", selenium: "",
      walkthrough: [
        { code: "try (Scanner scanner = new Scanner(...)) {", note: "The resource is declared INSIDE the parentheses. Anything implementing AutoCloseable qualifies (files, streams, DB connections). Java guarantees close() is called when the block exits — success or failure." },
        { code: "while (scanner.hasNext()) { ... }", note: "Normal use of the resource. No close() call anywhere in your code — no leak even if this loop throws." },
        { code: "} catch (FileNotFoundException e) {", note: "FileNotFoundException is a CHECKED exception — the compiler forces you to catch it or declare 'throws'. That compile-time pressure is the defining trait of checked exceptions." }
      ] },
    { level: "Advanced", title: "Catching Multiple Exceptions", code: "try {\n    // Some code\n} catch (IOException | SQLException ex) {\n    System.out.println(\"Handling either IO or SQL exception\");\n}", output: "", explanation: "Since Java 7, you can catch multiple exceptions in a single block to reduce code duplication.", selenium: "" },
    { level: "Advanced", title: "Exception Chaining", code: "try {\n    // risky code\n    throw new NullPointerException(\"Initial cause\");\n} catch (NullPointerException e) {\n    throw new RuntimeException(\"Wrapper exception\", e);\n}", output: "", explanation: "Wrapping an exception inside another one, preserving the original cause.", selenium: "" },
    { level: "Selenium-Oriented", title: "Handling NoSuchElementException", code: "try {\n    driver.findElement(By.id(\"missing-button\")).click();\n} catch (NoSuchElementException e) {\n    System.out.println(\"Button not found, proceeding with alternative flow.\");\n    // Alternative action\n}", output: "", explanation: "Gracefully recovering when an element is not present on the page instead of failing the test.", selenium: "Checking if a dynamic popup exists and closing it, or ignoring if it doesn't." },
    { level: "Selenium-Oriented", title: "StaleElementReferenceException", code: "WebElement btn = driver.findElement(By.id(\"submit\"));\ndriver.navigate().refresh();\ntry {\n    btn.click(); // This will throw exception\n} catch (StaleElementReferenceException e) {\n    System.out.println(\"Element is stale, re-finding...\");\n    btn = driver.findElement(By.id(\"submit\"));\n    btn.click();\n}", output: "", explanation: "Elements become stale if the DOM changes after they are found. Handling this requires re-finding the element.", selenium: "Very common when testing single-page applications (SPAs) where DOM updates frequently.",
      walkthrough: [
        { code: "WebElement btn = driver.findElement(By.id(\"submit\"));", note: "'btn' holds a reference to a specific DOM node as it existed at this moment." },
        { code: "driver.navigate().refresh();", note: "The page reloads — the old DOM is destroyed and rebuilt. The node 'btn' pointed to no longer exists, even though a visually identical button is on the page." },
        { code: "btn.click(); // throws", note: "Using the dead reference throws StaleElementReferenceException. 'Stale' = the reference outlived the DOM node." },
        { code: "btn = driver.findElement(By.id(\"submit\")); btn.click();", note: "The fix is always the same: RE-FIND the element to get a fresh reference to the new node, then act on it. In real frameworks this becomes a retry loop or an ExpectedConditions.refreshed() wait." }
      ] }
  ],
  interview: [
    { q: "Checked vs Unchecked Exceptions?", a: "Checked exceptions (e.g., IOException) are checked at compile-time and must be handled or declared. Unchecked exceptions (e.g., NullPointerException) are runtime exceptions and not checked at compile-time." },
    { q: "throw vs throws?", a: "throw is used to explicitly throw an exception object. throws is used in a method declaration to indicate that the method might throw an exception." },
    { q: "A test intermittently fails with StaleElementReferenceException on a single-page application, but passes on a page reload retry. How would you make the test self-heal instead of just failing?", a: "Wrap the interaction in a small retry loop that catches StaleElementReferenceException specifically, re-finds the element, and retries the action a bounded number of times (e.g., 2-3 attempts) before giving up and letting the exception propagate. Catching it broadly as Exception would mask real bugs; catching only the specific type keeps the retry logic honest." },
    { q: "You catch NoSuchElementException around a popup-close click so the test continues if the popup doesn't appear. A teammate says this catch block is 'dangerous.' What's the legitimate concern, and how do you address it?", a: "An empty or overly broad catch silently swallows failures that might indicate a real problem (e.g., the popup selector is simply wrong, not absent) — the fix is to log inside the catch block (even if you don't rethrow) so there's a trace of what happened, and catch only the specific exception type, not a blanket Exception." },
    { q: "Should driver.quit() go inside the try block, the catch block, or the finally block of a test method? Justify your answer.", a: "finally — it must run whether the test passes, fails with an assertion error, or throws an unexpected exception; try only runs on the happy path, and catch only runs if an exception was thrown and caught there. Putting cleanup anywhere except finally risks leaking a browser process when a test fails in a way you didn't anticipate." },
    { q: "You're asked to design a custom exception hierarchy for a framework's data layer — should TestDataNotFoundException extend Exception or RuntimeException, and why does it matter for how test methods use it?", a: "Extending RuntimeException (unchecked) means test methods aren't forced to declare 'throws' or wrap every data lookup in try/catch, which is usually preferred for test code since a missing-data failure should just fail the test loudly, not require boilerplate handling everywhere. Extending Exception (checked) is more defensible when the caller is expected to meaningfully recover, which is rare in test automation." },
    { q: "A framework's BasePage constructor throws a checked exception during PageFactory initialization. What compile-time consequence does this have for every Page Object that extends BasePage?", a: "Every subclass constructor must either handle that checked exception or declare 'throws' itself, and that obligation propagates further to whatever code constructs the Page Object — checked exceptions are 'viral' up the call chain. This is one practical reason frameworks often prefer unchecked exceptions for infrastructure failures: it avoids forcing 'throws' declarations through every layer." },
    { q: "You have five different WebDriver-related exceptions you want to handle identically (log and skip). What's cleaner: five separate catch blocks, or Java 7+ multi-catch?", a: "Multi-catch — catch (NoSuchElementException | TimeoutException | StaleElementReferenceException e) { ... } — when the handling logic is truly identical, avoiding duplicated catch bodies. If the exceptions need different handling (e.g., one should retry, another should fail immediately), separate catch blocks are more honest about the different behavior." },
    { q: "Why might 'catch (Exception e) { e.printStackTrace(); }' pass code review in a prototype but get flagged in a production framework?", a: "It catches everything indiscriminately (including bugs unrelated to the intended failure mode), only prints to console instead of using the framework's logging/reporting system, and doesn't fail the test or rethrow — meaning a genuinely broken assertion downstream might report a false pass. Production code should catch specific exceptions and integrate with proper logging/reporting." },
    { q: "You wrap a NullPointerException from deep inside a third-party library call in a custom FrameworkException with a clearer message, using 'throw new FrameworkException(\"...\", e)'. Why pass the original exception 'e' instead of just the new message?", a: "That's exception chaining — passing 'e' as the cause preserves the original stack trace so debugging can trace back to the actual root failure, not just your wrapper's message. Without it, you'd see a clean but useless error that hides exactly where and why the underlying NullPointerException actually occurred." }
  ],
  handsOn: [
    "Write a method that takes a String and parses it to an integer, returning a default value of 0 if a NumberFormatException occurs.",
    "Create a custom checked exception called DataValidationException and throw it when a test input is invalid."
  ],
  memoryVis: "When an exception occurs, an Exception object is created on the heap. The JVM searches the call stack for a method containing a matching catch block. If not found, the JVM terminates.",
  challenges: [
    {
      title: "Guarantee cleanup runs",
      prompt: "Fill in the block that guarantees driver.quit() runs whether the test passes or throws.",
      code: `try {
    runTest();
} catch (Exception e) {
    logFailure(e);
} ___1___ {
    driver.quit();
}`,
      blanks: [
        { label: "block that always executes", answer: "finally" }
      ],
      explanation: "finally runs in every scenario — success, caught exception, even an uncaught exception or a return statement — making it the only safe place for guaranteed cleanup like driver.quit()."
    },
    {
      title: "Explicitly throw a validation error",
      prompt: "Fill in the keyword that explicitly throws a single exception object.",
      code: `public void checkAge(int age) {
    if (age < 18) {
        ___1___ new IllegalArgumentException("Too young");
    }
}`,
      blanks: [
        { label: "keyword that throws one exception instance", answer: "throw" }
      ],
      explanation: "'throw' (no s) actually throws one exception object at the point it's needed. 'throws' (with an s) is different — it's used in a method signature to declare what MIGHT be thrown."
    },
    {
      title: "Recover from a stale element",
      prompt: "Fill in the exception type that must be caught when a DOM element reference dies after a page refresh.",
      code: `try {
    btn.click();
} catch (___1___ e) {
    btn = driver.findElement(By.id("submit"));
    btn.click();
}`,
      blanks: [
        { label: "exception thrown by a dead element reference", answer: "StaleElementReferenceException" }
      ],
      explanation: "StaleElementReferenceException means the WebElement reference points to a DOM node that no longer exists (often after a page reload) — the fix is always the same: re-find the element to get a fresh reference."
    }
  ]
};
