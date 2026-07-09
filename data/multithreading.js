export const multithreadingData = {
  title: "Multithreading & Concurrency",
  concept: "Executing multiple threads simultaneously to maximize CPU utilization.",
  why: "Crucial for parallel test execution in Selenium and optimizing performance.",
  realWorld: "Running tests on multiple browsers at the same time to reduce execution time.",
  seleniumMapping: "Selenium Grid, ThreadLocal for managing safe WebDriver instances per thread.",
  commonMistakes: "Race conditions, Deadlocks, Modifying shared state without synchronization.",
  keyPoints: [
    "Two ways to create a thread: extend Thread, or implement Runnable (preferred — Java allows only one superclass, and Runnable separates the task from the thread).",
    "start() vs run(): start() creates a new thread which calls run(); calling run() directly just executes on the CURRENT thread. Classic trap question.",
    "Thread lifecycle: NEW → RUNNABLE → RUNNING → (BLOCKED / WAITING / TIMED_WAITING) → TERMINATED.",
    "synchronized ensures only one thread at a time runs a block/method on a given lock — prevents race conditions at the cost of speed.",
    "sleep() pauses without releasing the lock; wait() releases the lock and needs notify()/notifyAll(). Both throw InterruptedException.",
    "Runnable's run() returns nothing; Callable's call() returns a value and can throw checked exceptions — used with ExecutorService/Future.",
    "Selenium angle: parallel test execution (TestNG parallel attribute) needs ThreadLocal<WebDriver> so each thread gets its own driver — say this in interviews."
  ],
  examples: [
    { 
      level: "Beginner", 
      title: "Extending Thread", 
      code: `public class Main extends Thread {
  public void run() { System.out.println("Running"); }
  public static void main(String[] args) {
    new Main().start();
  }
}`, 
      output: "Running", 
      explanation: "Creating a thread by extending the Thread class.", 
      selenium: "Basic threading." 
    },
    { 
      level: "Beginner", 
      title: "Implementing Runnable", 
      code: `public class Main implements Runnable {
  public void run() { System.out.println("Running"); }
  public static void main(String[] args) {
    new Thread(new Main()).start();
  }
}`, 
      output: "Running",
      explanation: "Implementing Runnable interface.",
      selenium: "Preferred over extending Thread.",
      walkthrough: [
        { code: "public class Main implements Runnable {", note: "Runnable is an interface with one method: run(). Implementing it means 'this class IS a task that a thread can execute'. Preferred over extending Thread because your class stays free to extend something else." },
        { code: "public void run() { ... }", note: "The task body — what the new thread will execute. You never call run() yourself." },
        { code: "new Thread(new Main()).start();", note: "Wrap the task in a Thread and call start(). start() asks the JVM to create a real OS thread which then calls run(). Calling run() directly instead would execute on the main thread — no concurrency at all. That trap is a favorite interview question." }
      ]
    },
    { 
      level: "Beginner", 
      title: "Thread.sleep()", 
      code: `public class Main {
  public static void main(String[] args) throws InterruptedException {
    System.out.println("Wait");
    Thread.sleep(1000);
    System.out.println("Done");
  }
}`, 
      output: "Wait\n(1s delay)\nDone", 
      explanation: "Pausing thread execution.", 
      selenium: "Hardcoded waits (anti-pattern)." 
    },
    { 
      level: "Intermediate", 
      title: "Thread.join()", 
      code: `public class Main {
  public static void main(String[] args) throws Exception {
    Thread t = new Thread(() -> System.out.println("Task"));
    t.start();
    t.join();
    System.out.println("Main ended");
  }
}`, 
      output: "Task\nMain ended",
      explanation: "Waits for a thread to terminate.",
      selenium: "Wait for async setup tasks.",
      walkthrough: [
        { code: "Thread t = new Thread(() -> System.out.println(\"Task\"));", note: "The lambda IS a Runnable — since Runnable has exactly one method, '() -> ...' replaces the whole class ceremony." },
        { code: "t.start();", note: "The new thread begins running concurrently with main. Without the next line, 'Main ended' could print before 'Task' — thread scheduling order is not guaranteed." },
        { code: "t.join();", note: "The CALLING thread (main) blocks here until t finishes. This is how you impose order on concurrent work — it guarantees 'Task' prints first." },
        { code: "System.out.println(\"Main ended\");", note: "Only runs after t has terminated, so the output order is deterministic." }
      ]
    },
    { 
      level: "Intermediate", 
      title: "Synchronized Method", 
      code: `class Counter {
  int count = 0;
  public synchronized void inc() { count++; }
}`, 
      output: "Thread safe increment",
      explanation: "Prevents concurrent access.",
      selenium: "Updating shared report data safely.",
      walkthrough: [
        { code: "int count = 0;", note: "Shared mutable state — the root of all threading bugs. Two threads doing count++ simultaneously can lose updates, because count++ is really three steps: read, add, write." },
        { code: "public synchronized void inc() { count++; }", note: "'synchronized' makes the method acquire the object's lock before entering. A second thread calling inc() on the SAME object must wait until the first releases it — the read-add-write becomes atomic." },
        { code: "(the lock)", note: "Each object has one intrinsic lock. synchronized methods on the same object block each other; on different objects they don't. For a static synchronized method the lock is the Class object itself." }
      ]
    },
    {
      level: "Intermediate",
      title: "Synchronized Block",
      code: `class Counter {
  int count = 0;
  public void inc() {
    synchronized(this) { count++; }
  }
}`, 
      output: "Thread safe increment", 
      explanation: "Locks only critical section.", 
      selenium: "Finer grained locking." 
    },
    { 
      level: "Advanced", 
      title: "wait() and notify()", 
      code: `class Shared {
  synchronized void doWait() throws Exception { wait(); }
  synchronized void doNotify() { notify(); }
}`, 
      output: "Inter-thread signal", 
      explanation: "Thread communication.", 
      selenium: "Custom synchronization." 
    },
    { 
      level: "Advanced", 
      title: "ThreadLocal", 
      code: `public class Main {
  static ThreadLocal<String> tl = new ThreadLocal<>();
  public static void main(String[] args) {
    tl.set("Thread-specific data");
    System.out.println(tl.get());
  }
}`, 
      output: "Thread-specific data",
      explanation: "Isolated data per thread.",
      selenium: "Essential for WebDriver isolation in parallel runs.",
      walkthrough: [
        { code: "static ThreadLocal<String> tl = new ThreadLocal<>();", note: "One ThreadLocal variable, but each thread that touches it gets its OWN private copy of the value. The variable is shared; the values are not." },
        { code: "tl.set(\"Thread-specific data\");", note: "Sets the value for the CURRENT thread only. Another thread calling tl.get() at the same time would see its own value (or null), never this one." },
        { code: "tl.get();", note: "Reads the current thread's copy. This is exactly how parallel Selenium works: ThreadLocal<WebDriver> gives every test thread its own browser — driver.set(new ChromeDriver()) in setup, driver.get() in tests, driver.remove() in teardown to avoid leaks." }
      ]
    },
    { 
      level: "Advanced", 
      title: "ExecutorService", 
      code: `import java.util.concurrent.*;
public class Main {
  public static void main(String[] args) {
    ExecutorService ex = Executors.newFixedThreadPool(2);
    ex.submit(() -> System.out.println("Task"));
    ex.shutdown();
  }
}`, 
      output: "Task", 
      explanation: "Thread pool management.", 
      selenium: "Parallel grid execution." 
    },
    { 
      level: "Selenium-Oriented", 
      title: "Callable & Future", 
      code: `import java.util.concurrent.*;
public class Main {
  public static void main(String[] args) throws Exception {
    ExecutorService ex = Executors.newSingleThreadExecutor();
    Future<String> f = ex.submit(() -> "Result");
    System.out.println(f.get());
    ex.shutdown();
  }
}`, 
      output: "Result",
      explanation: "Returning results from threads.",
      selenium: "Fetching test data async.",
      walkthrough: [
        { code: "ExecutorService ex = Executors.newSingleThreadExecutor();", note: "A thread pool with one worker thread. Pools reuse threads instead of creating one per task — the modern way to run concurrent work (raw 'new Thread()' is rare in production code)." },
        { code: "Future<String> f = ex.submit(() -> \"Result\");", note: "The lambda here is a Callable<String> — unlike Runnable, it RETURNS a value. submit() doesn't wait; it immediately hands back a Future: a placeholder for a result that doesn't exist yet." },
        { code: "f.get();", note: "Blocks until the task finishes, then returns its value. This is the bridge from async back to sync. get() can also take a timeout to avoid waiting forever." },
        { code: "ex.shutdown();", note: "Tells the pool to finish queued tasks and then release its threads. Without this, the JVM keeps running because pool threads are non-daemon." }
      ]
    }
  ],
  interview: [
    { q: "Runnable vs Callable?", a: "Callable returns a result and can throw checked exceptions." },
    { q: "Your parallel test suite works fine with 2 threads but starts failing randomly (wrong page state, mixed-up assertions) once you scale to 8 threads. The driver is stored in a plain 'private static WebDriver driver' field. What's wrong and what's the fix?", a: "A plain static field is shared by ALL threads — with 8 threads running simultaneously, they're all reading and writing the SAME WebDriver reference, so one thread's navigate() or click() corrupts what another thread expects to see. The fix is ThreadLocal<WebDriver>, giving each thread its own private instance behind the same access point." },
    { q: "You call new Thread(myRunnable).run() instead of .start() and the test doesn't actually run in parallel. Why not, and how would you catch this bug in code review?", a: "run() just executes the Runnable's code on the CURRENT thread like a normal method call — no new thread is created. Only start() asks the JVM to spin up a real thread that then calls run() internally. In review, any '.run()' call on a Thread object (as opposed to being the implementation itself) is a red flag worth double-checking." },
    { q: "Two parallel test threads both increment a shared 'int totalTestsRun' counter without synchronization, and the final count is consistently lower than the actual number of tests. Explain the exact mechanism causing lost updates.", a: "count++ is really three steps (read the value, add 1, write it back) and isn't atomic — if Thread A reads 10, then Thread B also reads 10 before A writes back 11, both threads compute 11 and one increment is lost. Fixing it needs 'synchronized' around the increment, or better, an AtomicInteger which guarantees the read-modify-write happens as one atomic operation." },
    { q: "Why would you choose ExecutorService with a fixed thread pool over manually creating 'new Thread()' for each of 20 parallel browser sessions?", a: "Creating 20 raw threads means 20 OS threads spun up and torn down with no reuse or limit — a thread pool caps concurrency to a sane number (matching available CPU/memory), reuses threads across tasks, and gives you submit()/Future-based result handling and clean shutdown(), which raw Thread management doesn't provide." },
    { q: "A test needs to wait for a background data-setup thread to finish before starting UI assertions, but using Thread.sleep(3000) is unreliable — sometimes setup takes 5 seconds. What's the correct multithreading primitive here?", a: "Thread.join() — call setupThread.join() on the main thread, which blocks until setupThread actually completes, regardless of how long it takes, instead of guessing with a fixed sleep. If you need a return VALUE from the background work rather than just 'is it done,' Future.get() (via ExecutorService/Callable) is the better fit." },
    { q: "You're asked in an interview: 'How would you run the same test against Chrome, Firefox, and Edge simultaneously, guaranteeing no cross-contamination between browser sessions?' Walk through your design.", a: "Use an ExecutorService thread pool, submit one task per browser via a Callable/Runnable that internally uses a ThreadLocal<WebDriver> obtained from a DriverManager — combined with a Factory pattern that creates the right driver type per task. Each thread gets an isolated driver instance; the pool caps how many run at once; ThreadLocal guarantees zero shared mutable state between them." },
    { q: "What's the practical difference between sleep() and wait() beyond 'one is deprecated-feeling and one isn't' — specifically regarding the lock?", a: "sleep() pauses the current thread WITHOUT releasing any lock it holds, so other threads waiting on that same lock stay blocked the whole time. wait() releases the lock while paused, allowing other threads to acquire it and make progress, and requires notify()/notifyAll() from another thread to resume — they solve different problems (sleep = simple pause, wait = coordinated hand-off between threads)." },
    { q: "Why does calling get() on a Future block the calling thread, and how would you avoid blocking if you just want to check whether a background task is done without waiting?", a: "get() is designed to return the actual result, which doesn't exist until the task completes, so it blocks by necessity. To check without blocking, call isDone() first (returns immediately with true/false) and only call get() once you know it won't block — or use get(timeout, unit) to cap how long you're willing to wait." }
  ],
  handsOn: ["Implement ThreadLocal WebDriver manager."],
  memoryVis: "Shared Heap, separate Stacks per thread.",
  challenges: [
    {
      title: "Actually start a new thread",
      prompt: "This code doesn't create a new thread. Fill in the method that actually does.",
      code: `Thread t = new Thread(() -> System.out.println("Running"));
t.___1___();`,
      blanks: [
        { label: "method that launches a real new thread", answer: "start" }
      ],
      explanation: "start() asks the JVM to create a real thread which then calls run(). Calling run() directly just executes the code on the CURRENT thread — no concurrency at all."
    },
    {
      title: "Isolate WebDriver per thread",
      prompt: "Fill in the type that gives every thread its own private WebDriver instance for parallel execution.",
      code: `private static ___1___<WebDriver> driverStore = new ___1___<>();
driverStore.set(new ChromeDriver());`,
      blanks: [
        { label: "wrapper giving each thread its own copy", answer: "ThreadLocal" }
      ],
      explanation: "ThreadLocal<WebDriver> gives every thread its own private value behind one shared variable — the fix for parallel Selenium tests that would otherwise corrupt each other by sharing one static driver."
    },
    {
      title: "Wait for a background thread to finish",
      prompt: "Fill in the method that blocks the current thread until another thread completes.",
      code: `Thread setupThread = new Thread(this::seedTestData);
setupThread.start();
setupThread.___1___();
runAssertions();`,
      blanks: [
        { label: "method blocking until the thread finishes", answer: "join" }
      ],
      explanation: "join() blocks the calling thread until the target thread terminates — without it, runAssertions() could execute before seedTestData() finishes, causing a race condition."
    }
  ]
};
