export const testngData = {
  title: "TestNG",
  concept: "TestNG is the test framework that turns Java classes into organized, configurable test suites: annotations control lifecycle, assertions decide pass/fail, DataProviders feed data, and testng.xml orchestrates what runs, in what order, on how many threads.",
  why: "Selenium only drives the browser — TestNG is what makes it a TEST: setup/teardown discipline, reporting, retries, grouping, parallelism. 'Explain your TestNG setup' appears in virtually every Selenium interview because it reveals whether you've built real suites or just scripts.",
  realWorld: "Selenium is the car; TestNG is the race organizer — deciding who drives when, in which heats, recording every lap time, and rerunning a heat when the timing equipment glitched.",
  seleniumMapping: "Your @BeforeMethod creates the driver, @Test runs the scenario, @AfterMethod quits and screenshots failures via a listener, testng.xml runs it all parallel with ThreadLocal drivers — this module IS the glue of every framework you'll describe in interviews.",
  commonMistakes: [
    "Creating the WebDriver in @BeforeClass instead of @BeforeMethod — all tests in the class then share one browser session, and one test's state pollutes the next.",
    "Using hard asserts for multi-field verification — the first failure hides every other broken field; SoftAssert exists exactly for this.",
    "Forgetting softAssert.assertAll() — without it, SoftAssert failures are silently swallowed and the test passes. The single most dangerous TestNG mistake.",
    "Overusing dependsOnMethods — long dependency chains turn one failure into a cascade of skips that hide the real state of the product."
  ],
  keyPoints: [
    "Annotation lifecycle order, outermost-in: @BeforeSuite → @BeforeTest → @BeforeClass → @BeforeMethod → @Test → @AfterMethod → @AfterClass → @AfterTest → @AfterSuite. Recite this cold — it's a guaranteed question.",
    "@BeforeMethod runs before EVERY test method (fresh driver per test = isolation); @BeforeClass runs once per class (shared, faster, riskier). Choosing between them IS the driver-lifecycle design decision.",
    "Hard assert (Assert.assertEquals) stops the test at first failure. SoftAssert collects failures and reports them all — but ONLY if you call assertAll() at the end; forget it and failures vanish silently.",
    "@DataProvider returns Object[][] — each row is one invocation of the test with those parameters. This is data-driven testing; @Parameters + testng.xml is for environment-level values (browser, URL), not data rows.",
    "testng.xml is the suite's control panel: which classes/groups run, parameters, and parallel='methods|classes|tests' with thread-count — the setting that makes ThreadLocal<WebDriver> mandatory.",
    "Listeners (ITestListener) hook into pass/fail/skip events — onTestFailure is where screenshot-on-failure lives, in ONE place instead of try/catch in every test.",
    "IRetryAnalyzer reruns a failed test N times before declaring it failed — the standard flaky-test mitigation, and a magnet for the follow-up 'isn't that hiding real bugs?' (answer: it's triage, the flake still gets logged and fixed).",
    "groups + include/exclude in testng.xml = smoke vs regression suites from the same codebase; priority orders tests within a class; dependsOnMethods skips dependents when a prerequisite fails.",
    "assertEquals(actual, expected) — TestNG's argument order is (actual, expected); reversed arguments produce backwards failure messages that mislead debugging."
  ],
  examples: [
    {
      level: "Beginner",
      title: "Annotation Lifecycle in Action",
      code: `import org.testng.annotations.*;

public class LifecycleDemo {
    @BeforeClass
    public void beforeClass() { System.out.println("BeforeClass: once per class"); }

    @BeforeMethod
    public void setUp() { System.out.println("BeforeMethod: fresh setup"); }

    @Test
    public void testLogin() { System.out.println("  Test: login"); }

    @Test
    public void testSearch() { System.out.println("  Test: search"); }

    @AfterMethod
    public void tearDown() { System.out.println("AfterMethod: cleanup"); }

    @AfterClass
    public void afterClass() { System.out.println("AfterClass: once per class"); }
}`,
      output: "BeforeClass: once per class\nBeforeMethod: fresh setup\n  Test: login\nAfterMethod: cleanup\nBeforeMethod: fresh setup\n  Test: search\nAfterMethod: cleanup\nAfterClass: once per class",
      explanation: "Two tests, and the Before/AfterMethod pair wraps EACH one while the Class pair runs once — the output IS the lifecycle diagram.",
      selenium: "Put driver creation in setUp() and driver.quit() in tearDown(): every test gets a clean browser, and a crashed test can't poison the next one.",
      walkthrough: [
        { code: "@BeforeClass", note: "Runs ONCE before any @Test in this class — for expensive shared setup that tests won't mutate (reading config, connecting to a test-data source). Putting the driver here is the classic mistake: tests then share browser state." },
        { code: "@BeforeMethod", note: "Runs before EVERY @Test — the isolation workhorse. Fresh driver per test costs seconds but means test order can never cause mystery failures. In interviews, justify the trade explicitly: 'I pay startup time to buy independence.'" },
        { code: "@AfterMethod", note: "Runs after every test EVEN IF it failed — this is where driver.quit() belongs (TestNG's equivalent of the finally-block rule from Exception Handling). A test that throws still gets its browser closed." }
      ]
    },
    {
      level: "Intermediate",
      title: "Hard Assert vs SoftAssert",
      code: `import org.testng.Assert;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

public class AssertDemo {
    @Test
    public void hardAssertStopsAtFirstFailure() {
        Assert.assertEquals("Dashboard", "Dashboard"); // passes
        // Assert.assertEquals("Cart(0)", "Cart(1)");  // would STOP the test here
        System.out.println("hard: reached the end");
    }

    @Test
    public void softAssertReportsEverything() {
        SoftAssert soft = new SoftAssert();
        soft.assertEquals("Dashboard", "Dashboard", "title");
        soft.assertEquals("Cart(0)", "Cart(1)", "cart badge");   // recorded, not thrown
        soft.assertEquals("Welcome", "Welcome!", "greeting");     // recorded too
        System.out.println("soft: still running after failures");
        soft.assertAll(); // NOW the test fails, reporting BOTH mismatches
    }
}`,
      output: "hard: reached the end\nsoft: still running after failures\n(then softAssertReportsEverything fails listing 'cart badge' AND 'greeting')",
      explanation: "Hard asserts throw immediately; SoftAssert records and keeps going, then assertAll() fails the test with the complete list.",
      selenium: "Verifying a whole page (title + cart + greeting + banner): hard assert shows you ONE broken field per run; SoftAssert shows all four in one run — four times fewer debug cycles.",
      walkthrough: [
        { code: "Assert.assertEquals(actual, expected)", note: "Throws AssertionError on mismatch — test over, remaining lines never run. Right choice for gate conditions: if login failed, checking the dashboard is meaningless. Note the order: (actual, expected) — reversing them makes failure messages lie to you." },
        { code: "SoftAssert soft = new SoftAssert();", note: "A per-test collector object (never share one across tests — it accumulates). Each soft.assertX() that fails is RECORDED, not thrown, so execution continues to the next check." },
        { code: "soft.assertAll();", note: "THE line people forget: it replays all recorded failures and fails the test with the full list. Without it, every soft failure is silently discarded and the test passes green. Interviewers ask 'what happens if you skip assertAll?' precisely because the answer — false pass — is so dangerous." }
      ]
    },
    {
      level: "Intermediate",
      title: "@DataProvider — Data-Driven Testing",
      code: `import org.testng.annotations.*;

public class LoginDataDriven {
    @DataProvider(name = "credentials")
    public Object[][] credentials() {
        return new Object[][] {
            { "admin",  "admin123",  true  },
            { "guest",  "guest123",  true  },
            { "hacker", "wrongpass", false }
        };
    }

    @Test(dataProvider = "credentials")
    public void loginTest(String user, String pass, boolean shouldSucceed) {
        System.out.println("Testing " + user + " -> expect success=" + shouldSucceed);
        // driver-based login + assertion would go here
    }
}`,
      output: "Testing admin -> expect success=true\nTesting guest -> expect success=true\nTesting hacker -> expect success=false",
      explanation: "One test method, three invocations — each Object[][] row becomes the test's parameters. Add a row, get a test, zero new code.",
      selenium: "The standard shape for login matrices, boundary values, and multi-user scenarios. In real frameworks the Object[][] is often loaded from CSV/Excel — the Java IO module's reading patterns feed directly in.",
      walkthrough: [
        { code: "@DataProvider(name = \"credentials\")", note: "A method returning Object[][]: each outer element is one test invocation, each inner array the arguments for it. The name links provider to test — they can even live in different classes (dataProviderClass) for shared test data." },
        { code: "@Test(dataProvider = \"credentials\")", note: "The test's parameter list must MATCH each row's types in order: (String, String, boolean) here. Mismatch = runtime TypeMismatchException — the wiring is by position, not by name." },
        { code: "{ \"hacker\", \"wrongpass\", false }", note: "Negative cases ride the same method — the boolean drives the assertion branch. Interview follow-up: '@DataProvider vs @Parameters?' — Parameters pulls single values from testng.xml (browser, env URL); DataProvider generates row-per-invocation data. Different tools, different jobs." }
      ]
    },
    {
      level: "Advanced",
      title: "testng.xml — Suite Control + Parallel Execution",
      code: `<!-- testng.xml -->
<suite name="RegressionSuite" parallel="methods" thread-count="3">
  <parameter name="browser" value="chrome" />

  <test name="SmokeTests">
    <groups>
      <run>
        <include name="smoke" />
        <exclude name="wip" />
      </run>
    </groups>
    <classes>
      <class name="tests.LoginTest" />
      <class name="tests.SearchTest" />
    </classes>
  </test>
</suite>`,
      output: "(Runs all methods tagged @Test(groups=\"smoke\") from both classes, 3 at a time, skipping anything tagged \"wip\")",
      explanation: "The XML is the suite's control panel: what runs (classes/groups), with what config (parameters), and how concurrently (parallel + thread-count).",
      selenium: "This file is what CI executes (mvn test -DsuiteXmlFile=testng.xml). parallel=\"methods\" with thread-count=3 is exactly why DriverManager must use ThreadLocal — three tests, three browsers, zero sharing.",
      walkthrough: [
        { code: "parallel=\"methods\" thread-count=\"3\"", note: "Runs up to 3 @Test METHODS simultaneously on a thread pool. Options: methods (max parallelism, needs perfect isolation), classes (each class sequential inside itself), tests (each <test> block on its own thread). The instant this attribute appears, a static WebDriver breaks — connect this to ThreadLocal in the same breath in interviews." },
        { code: "<parameter name=\"browser\" value=\"chrome\" />", note: "Reaches tests via @Parameters({\"browser\"}) on a setup method — environment-level config in XML, so switching the whole suite to Firefox is a one-line change with no recompile." },
        { code: "<include name=\"smoke\" /> <exclude name=\"wip\" />", note: "Group algebra: run everything tagged smoke, skip anything also tagged wip. One codebase, many suites — smoke.xml, regression.xml, nightly.xml just slice the same tests differently." }
      ]
    },
    {
      level: "Selenium-Oriented",
      title: "Listener: Screenshot on Failure + Retry Analyzer",
      code: `import org.testng.*;

public class TestListener implements ITestListener {
    @Override
    public void onTestFailure(ITestResult result) {
        System.out.println("FAILED: " + result.getName() + " — capturing screenshot");
        // File shot = ((TakesScreenshot) DriverManager.getDriver())
        //                 .getScreenshotAs(OutputType.FILE);
        // FileUtils.copyFile(shot, new File("shots/" + result.getName() + ".png"));
    }
}

class RetryAnalyzer implements IRetryAnalyzer {
    private int attempt = 0;
    private static final int MAX_RETRY = 2;

    @Override
    public boolean retry(ITestResult result) {
        return attempt++ < MAX_RETRY; // true = run it again
    }
}
// Usage: @Test(retryAnalyzer = RetryAnalyzer.class)
// Wiring: <listeners><listener class-name="TestListener"/></listeners> in testng.xml`,
      output: "FAILED: testCheckout — capturing screenshot\n(then testCheckout re-runs up to 2 more times before counting as failed)",
      explanation: "Listeners centralize cross-cutting reactions to test events; the retry analyzer gives flaky tests bounded second chances.",
      selenium: "The two most-cited framework features in interviews: 'how do you capture failure evidence?' (listener) and 'how do you handle flaky tests?' (retry — plus the honest caveat that retries are triage, not a fix).",
      walkthrough: [
        { code: "public void onTestFailure(ITestResult result)", note: "TestNG calls this automatically on every test failure — screenshot logic lives HERE once, not in try/catch blocks scattered through every test. ITestResult carries the test name, exception, and parameters for the report." },
        { code: "DriverManager.getDriver()", note: "The listener needs THIS test's driver — under parallel execution that only works because ThreadLocal returns the calling thread's own instance. Listeners are where the whole design (Design Patterns module) proves itself." },
        { code: "return attempt++ < MAX_RETRY;", note: "Called after each failure: return true to re-run. Two retries max — unbounded retries would mask real product bugs forever. Say the caveat before they ask: 'retried tests get logged and investigated; retry buys stability while the flake gets fixed, it doesn't replace fixing it.'" }
      ]
    }
  ],
  interview: [
    { q: "Recite the TestNG annotation execution order — and then explain WHERE the WebDriver should be created and destroyed, and why.", a: "BeforeSuite → BeforeTest → BeforeClass → BeforeMethod → Test → AfterMethod → AfterClass → AfterTest → AfterSuite. Driver creation belongs in @BeforeMethod and quit in @AfterMethod: every test gets a fresh, isolated browser, so no test's leftover state (logged-in session, dirty cart) can affect another, and order-dependence bugs become impossible. @BeforeClass sharing is faster but couples tests — acceptable only for read-only suites, and you should present it as a deliberate trade-off." },
    { q: "A test verifies five fields on a confirmation page using Assert.assertEquals five times. The report shows one failure. What's the problem and the fix?", a: "The first failing hard assert throws immediately — the remaining four checks never ran, so you're fixing fields one per CI cycle. Fix: SoftAssert — all five checks record their results, then assertAll() fails once with the complete list. Critical detail: forgetting assertAll() means recorded failures are silently discarded and the test false-passes; that follow-up is exactly what the interviewer wants you to volunteer." },
    { q: "What's the difference between @DataProvider and @Parameters, and when do you use each?", a: "@Parameters injects single values from testng.xml — environment-level config like browser name or base URL: one value per suite run, changeable without recompiling. @DataProvider returns Object[][] from code — each row triggers a separate invocation of the test with those arguments: it's for DATA (credential matrices, boundary values), potentially dozens of rows, often loaded from CSV/Excel. Config goes in Parameters, test data goes in DataProvider — mixing those up is the mistake the question probes." },
    { q: "You set parallel='methods' thread-count='4' in testng.xml and tests start failing randomly with sessions interfering. Walk through the root cause and the fix.", a: "Four test methods now run simultaneously, and if WebDriver lives in a plain static field they're all driving the SAME browser — one thread navigates while another clicks, producing random cross-contamination. Fix: ThreadLocal<WebDriver> in the DriverManager — each thread gets its own isolated instance behind one access point, created in @BeforeMethod, quit AND removed in @AfterMethod (remove() matters because thread pools reuse threads and stale entries leak). This is THE question connecting TestNG, Multithreading, and Design Patterns." },
    { q: "How does screenshot-on-failure work in your framework — and why a listener instead of try/catch in each test?", a: "A class implementing ITestListener overrides onTestFailure(ITestResult), grabs this thread's driver via the ThreadLocal manager, casts to TakesScreenshot, and saves the file named after result.getName(). Registered once in testng.xml <listeners>. Versus try/catch per test: zero duplication, impossible to forget on new tests, and evidence capture is uniform — cross-cutting concerns belong in one place. Same hook feeds Extent/Allure reporting." },
    { q: "Your suite has a flaky test that passes on about 70% of runs. The team wants a retry analyzer. Implement the idea and defend its risks.", a: "IRetryAnalyzer with retry() returning true while attempt++ < MAX (typically 2), attached via @Test(retryAnalyzer=...) or wired globally through an IAnnotationTransformer listener. Risk: retries can mask genuine intermittent product bugs — a real race condition also 'passes on retry'. Defense: retried-then-passed tests get flagged in reporting and tracked; retry is triage that keeps CI green while the flake's root cause (usually a missing explicit wait) gets fixed. Saying 'retry, and log every retry for investigation' is the complete answer." },
    { q: "What do groups and priority give you, and where does dependsOnMethods go wrong?", a: "groups tag tests (smoke, regression, wip) so testng.xml can slice one codebase into many suites via include/exclude — smoke on every commit, full regression nightly. priority orders methods within a class (lower runs first; default 0). dependsOnMethods skips dependents when a prerequisite fails — legitimate for true chains (create-then-delete the same record), but overuse builds cascades where one failure skips thirty tests, hiding the product's real state behind a wall of skips. Prefer independent tests; use dependencies sparingly and deliberately." }
  ],
  handsOn: [
    "Create a class with all Before/After annotations printing their names, run it with two @Test methods, and check the console against the lifecycle order — seeing it once beats memorizing.",
    "Write a SoftAssert test with two deliberate failures; run it WITH assertAll() and then WITHOUT — watch the false pass happen.",
    "Build a @DataProvider with 3 login rows and wire it to a test method; then move the provider to a separate class and connect via dataProviderClass.",
    "Write a testng.xml with two classes and parallel='methods' thread-count='2', add a println of Thread.currentThread().getName() in each test, and confirm the interleaving."
  ],
  memoryVis: "Picture a theater production: @BeforeSuite unlocks the building, @BeforeTest lights the stage, @BeforeClass sets the scenery, @BeforeMethod places props before EVERY scene, the @Test is the scene, @AfterMethod clears props, and teardown mirrors outward. The DataProvider is the script's cast list — same scene, different actors each night. Listeners are the stage manager who photographs anything that breaks, and the retry analyzer lets an actor retake a fumbled line — twice, then it's officially fumbled.",
  challenges: [
    {
      title: "Report ALL the failures",
      prompt: "Fill in the call without which SoftAssert silently discards every recorded failure.",
      code: `SoftAssert soft = new SoftAssert();
soft.assertEquals(title, "Dashboard", "title");
soft.assertEquals(cartBadge, "Cart(1)", "cart");
soft.___1___();`,
      blanks: [
        { label: "method that replays recorded failures and fails the test", answer: "assertAll" }
      ],
      explanation: "assertAll() throws with the complete list of recorded mismatches. Without it, soft failures evaporate and the test passes green — the most dangerous forgettable line in TestNG."
    },
    {
      title: "Fresh browser per test",
      prompt: "Fill in the annotation that runs setup before EVERY test method, giving each test an isolated driver.",
      code: `___1___
public void setUp() {
    DriverManager.setDriver();
}`,
      blanks: [
        { label: "annotation running before each @Test", answer: ["@BeforeMethod", "BeforeMethod"] }
      ],
      explanation: "@BeforeMethod wraps every individual test — fresh driver each time means no test inherits another's browser state. @BeforeClass would run once and force all tests in the class to share a session."
    },
    {
      title: "Wire the data to the test",
      prompt: "Fill in the @Test attribute that connects this method to its data source.",
      code: `@Test(___1___ = "credentials")
public void loginTest(String user, String pass, boolean valid) { }`,
      blanks: [
        { label: "attribute naming the data source", answer: "dataProvider" }
      ],
      explanation: "dataProvider = \"credentials\" links the test to the @DataProvider(name=\"credentials\") method — each Object[][] row becomes one invocation with those three arguments, by position."
    }
  ]
};
