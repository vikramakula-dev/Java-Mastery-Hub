export const capstoneProjectsData = {
  title: "Capstone Projects",
  concept: "Structured, multi-step projects that combine everything you've learned — OOPS, Collections, Exceptions, Design Patterns — into something that resembles a real Selenium automation framework, not an isolated code snippet.",
  why: "Interviews increasingly ask 'walk me through how you'd design a framework' instead of syntax trivia. Knowing individual concepts isn't the same as knowing how they fit together — capstones close that gap.",
  realWorld: "Like the difference between knowing individual chess moves and having played full games. Isolated topics are moves; a capstone is a game where you have to sequence them under real constraints.",
  seleniumMapping: "Every capstone below is a scaled-down version of a real automation framework component that shows up in production test suites and in system-design-style interview questions.",
  keyPoints: [
    "Each project is broken into milestones — build them in order, since later milestones depend on earlier ones compiling and working correctly.",
    "Every milestone names exactly which prior module's concepts it exercises, so you can jump back and review before attempting it.",
    "These are DESIGN exercises: the goal is correct structure and clean separation of responsibility, not just code that happens to run.",
    "Talk through your design out loud (or write it down) before coding — 'I'll have a DriverFactory, a base Page class, and Page Objects per screen' is exactly the kind of answer that scores well in system-design interview rounds.",
    "You will not be able to literally run these programs in this browser-based app (there's no real JVM here) — treat the code and expected structure as a reference to build and run locally in your own IDE."
  ],
  projects: [
    {
      title: "Project 1: Mini Page Object Model Framework",
      difficulty: "Intermediate",
      summary: "Build a minimal but complete POM framework for a fictional login + dashboard flow: a BasePage, two Page Objects, and a runnable test class — no external test runner required.",
      outcome: "A working mental (and written) model of how real Selenium frameworks are structured: driver management, page classes, and test classes each with one clear job.",
      milestones: [
        {
          title: "1. Design the DriverManager",
          uses: "OOPS (Encapsulation, Static) + Design Patterns (Singleton + ThreadLocal)",
          task: "Create a DriverManager class with a private ThreadLocal<WebDriver>, plus static setDriver(), getDriver(), and quitDriver() methods.",
          hint: "Reuse the ThreadLocal Singleton pattern from the Design Patterns module directly — this is the same class, just given a permanent home in your framework."
        },
        {
          title: "2. Build a BasePage",
          uses: "OOPS (Inheritance, Constructors)",
          task: "Create an abstract BasePage class that stores a WebDriver reference in its constructor and exposes a protected waitForElement(By locator) helper method that every page class can reuse.",
          hint: "Every Page Object you write next should EXTEND BasePage — that's how they all get driver access and the wait helper for free."
        },
        {
          title: "3. Build LoginPage and DashboardPage",
          uses: "OOPS (Encapsulation) + Exception Handling",
          task: "LoginPage: private WebElement fields for username/password/submit, a public login(String, String) method returning a new DashboardPage. DashboardPage: a public isLoaded() method that returns a boolean, catching NoSuchElementException internally instead of letting it escape.",
          hint: "login() returning a DashboardPage models real navigation — the test class chains .login(...).isLoaded() without ever touching a locator."
        },
        {
          title: "4. Write the Test Class",
          uses: "Exception Handling (finally) + everything above",
          task: "Write a class with a main() method that: gets a driver from DriverManager, constructs a LoginPage, calls login(), asserts the returned DashboardPage.isLoaded() is true, and calls DriverManager.quitDriver() in a finally block.",
          hint: "This is the payoff step — if milestones 1-3 are structured correctly, this class should be short and read almost like plain English."
        }
      ]
    },
    {
      title: "Project 2: Test Data Manager with Collections + File I/O",
      difficulty: "Intermediate",
      summary: "Build a utility that reads test data from an in-memory structure (simulating a CSV/properties file), stores it using the right Collection type for the job, and exposes clean lookup methods.",
      outcome: "Confidence choosing the right Collection for a given access pattern, and a reusable TestDataManager most frameworks need on day one.",
      milestones: [
        {
          title: "1. Model a single row of test data",
          uses: "OOPS (Class & Object) + Wrapper Classes",
          task: "Create a TestRecord class with fields like id (Integer), username (String), and role (String), plus a constructor and a readable toString().",
          hint: "Keep this class dumb — it just holds data. All the logic belongs in the manager class you build next."
        },
        {
          title: "2. Store records with the right Collection",
          uses: "Collections Framework (Map vs List)",
          task: "Build a TestDataManager with a Map<Integer, TestRecord> keyed by id for O(1) lookup by ID, AND a List<TestRecord> for iterating 'all records with role=ADMIN'.",
          hint: "This milestone is really about justifying Map vs List: fast lookup by a unique key needs a Map; 'give me everything matching a condition' needs iteration over a List (or a Stream)."
        },
        {
          title: "3. Add filtering with Streams",
          uses: "Collections Framework (Java 8 Streams)",
          task: "Add a method getByRole(String role) that uses list.stream().filter(...).collect(Collectors.toList()) to return matching records.",
          hint: "This is the same filter/forEach pattern from the Collections module's Streams example, applied to a real object instead of Strings."
        },
        {
          title: "4. Handle missing data safely",
          uses: "Exception Handling (custom exceptions)",
          task: "Create a checked TestDataNotFoundException, and make a getById(int id) method throw it (with a clear message) when the Map lookup returns null, instead of letting callers hit a silent NullPointerException later.",
          hint: "This mirrors the Exception Handling module's Custom Exceptions example — failing loudly and specifically beats failing silently three lines later."
        }
      ]
    },
    {
      title: "Project 3: Cross-Browser Test Runner (Factory + Multithreading)",
      difficulty: "Advanced",
      summary: "Design (on paper/pseudocode + real class skeletons) a runner that can launch the same test logic against multiple browsers, sequentially and then conceptually in parallel.",
      outcome: "The ability to explain — and partially implement — how parallel cross-browser execution actually works under the hood, which is one of the most common 'advanced' Selenium interview topics.",
      milestones: [
        {
          title: "1. Build the DriverFactory",
          uses: "Design Patterns (Factory) + Interfaces",
          task: "Write a DriverFactory.createDriver(String browserName) that returns a WebDriver (the interface type), switching on \"chrome\"/\"firefox\" to return the concrete driver.",
          hint: "Reuse the Factory Pattern example directly. The return type being the WebDriver interface — not a concrete class — is what makes step 3 possible."
        },
        {
          title: "2. Run one test against one browser",
          uses: "Exception Handling (finally) + Project 1's Page Objects",
          task: "Write a runTest(String browserName) method: get a driver from the factory, run a simple scripted flow (or reuse Project 1's LoginPage), and quit the driver in a finally block.",
          hint: "Get this working for a single browser first — parallelism on top of broken sequential logic just gives you broken logic, faster."
        },
        {
          title: "3. Run the same test against 2-3 browsers sequentially",
          uses: "Collections (List) + control flow",
          task: "Put browser names in a List<String>, loop over it, and call runTest(browserName) for each — confirm each run is fully isolated (no shared driver state).",
          hint: "This proves your DriverFactory and runTest() are stateless and reusable before you add threads into the mix."
        },
        {
          title: "4. Make it parallel",
          uses: "Multithreading (ExecutorService, Runnable) + Design Patterns (ThreadLocal)",
          task: "Replace the sequential loop with an ExecutorService thread pool: submit one runTest(browserName) task per browser as a Runnable, and call shutdown() after submitting all tasks.",
          hint: "This is exactly why DriverManager needed ThreadLocal in Project 1 — without it, these parallel tasks would silently share one driver and corrupt each other's runs. Connect that dot out loud in an interview and you'll stand out."
        }
      ]
    }
  ],
  interview: [
    { q: "Walk me through how you'd design a Selenium automation framework from scratch.", a: "Start with driver lifecycle: a DriverManager using ThreadLocal so tests can run in parallel safely. Add a DriverFactory for cross-browser support. Structure pages with the Page Object Model, each page extending a BasePage that holds shared wait logic. Keep test data separate in a TestDataManager backed by the right Collection for the access pattern. Wrap risky operations in specific exception handling, always cleaning up in finally. That's driver management, browser flexibility, page structure, data management, and reliability — the five pillars interviewers listen for." },
    { q: "How do you handle test data in a large test suite?", a: "Externalize it — don't hardcode values in test methods. Load it into a typed object (not raw Strings/Maps everywhere), pick the right Collection for how it's accessed (Map for lookup-by-key, List for iteration/filtering), and fail loudly with a custom exception when expected data is missing rather than letting a NullPointerException surface far from the real cause." },
    { q: "What's the benefit of combining Factory and ThreadLocal for driver management?", a: "Factory decouples 'which browser' from the test code — tests just ask for a driver. ThreadLocal decouples 'which thread' from the driver instance — parallel tests never collide. Together, a test simply calls DriverManager.getDriver() and gets the correct, isolated, correctly-typed browser instance regardless of which browser or how many threads are running." }
  ],
  handsOn: [
    "Actually implement Project 1 end-to-end in a real IDE (IntelliJ/Eclipse) with the Selenium Java bindings on the classpath, and run it against a real page.",
    "Extend Project 2 by adding a getByRole() overload that accepts a Predicate<TestRecord> for arbitrary filtering instead of just role.",
    "Extend Project 3 to collect pass/fail results from each parallel task using Future<Boolean> instead of fire-and-forget Runnables."
  ],
  memoryVis: "Think of the three projects as concentric circles: Project 1 is the skeleton (how pages and drivers relate), Project 2 is the data flowing through that skeleton, Project 3 is running many copies of the skeleton at once without them tripping over each other."
};
