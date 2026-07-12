export const jvmData = {
  title: "Java Virtual Machine (JVM)",
  concept: "Engine that executes Java bytecode, providing platform independence.",
  why: "Crucial for tuning memory and optimizing heavy parallel test suites.",
  realWorld: "Allocating 4GB RAM (-Xmx4g) to a Jenkins agent running tests.",
  seleniumMapping: "Preventing OutOfMemoryErrors when handling large data providers or parallel grids.",
  commonMistakes: "Not freeing resources (like driver.quit()), leading to heap exhaustion.",
  keyPoints: [
    "Memory map: Stack (per-thread; method frames + local primitives + references), Heap (all objects, shared), Metaspace (class metadata). 'Stack vs Heap?' is a guaranteed interview question.",
    "Each thread gets its OWN fixed-size stack; all threads SHARE one heap — which is why 20 parallel test threads multiply heap pressure but not stack pressure.",
    "StackOverflowError = too-deep/infinite recursion exhausting one thread's stack. OutOfMemoryError = heap exhausted. Different memory areas, different fixes.",
    "-Xmx sets max heap (e.g., -Xmx4g on a Jenkins agent). Raising it can mask a leak longer, not fix it — and bigger heaps mean longer GC pauses.",
    "The ClassLoader loads .class bytecode at runtime — Class.forName(\"com.pages.LoginPage\") is how frameworks instantiate classes from config strings, and ClassNotFoundException traces back to it.",
    "Reflection can read/invoke private members at runtime (setAccessible) — powerful for testing legacy internals, but string-based and fragile: renames break it silently with no compile error.",
    "Shutdown hooks (Runtime.addShutdownHook) run on normal JVM exit — a backstop for driver.quit() — but NOT on force-kill (kill -9), so CI agents still need external cleanup.",
    "System properties (System.getProperty(\"os.name\")) drive OS-conditional logic — like choosing the right driver binary per platform."
  ],
  examples: [
    { 
      level: "Beginner", 
      title: "System Properties", 
      code: `System.out.println(System.getProperty("os.name"));
System.out.println(System.getProperty("java.version"));`, 
      output: "Windows 10\n17.0.1", 
      explanation: "Reading environment properties.", 
      selenium: "Conditional driver logic based on OS." 
    },
    { 
      level: "Beginner", 
      title: "Memory Allocation", 
      code: `Runtime r = Runtime.getRuntime();
System.out.println("Free: " + r.freeMemory());`, 
      output: "Free: 123456789", 
      explanation: "Checking available memory.", 
      selenium: "Logging memory stats." 
    },
    { 
      level: "Intermediate", 
      title: "StackOverflowError", 
      code: `public class Main {
  static void recurse() { recurse(); }
  public static void main(String[] args) { recurse(); }
}`, 
      output: "StackOverflowError", 
      explanation: "Exhausting thread stack space.", 
      selenium: "Infinite loops in page object navigation." 
    },
    { 
      level: "Intermediate", 
      title: "OutOfMemoryError", 
      code: `/* List<byte[]> list = new ArrayList<>();
while(true) list.add(new byte[1048576]); */`, 
      output: "OutOfMemoryError: Java heap space", 
      explanation: "Exhausting heap space.", 
      selenium: "Loading massive files into memory." 
    },
    { 
      level: "Intermediate", 
      title: "ClassLoader", 
      code: `System.out.println(String.class.getClassLoader());
System.out.println(Main.class.getClassLoader());`, 
      output: "null\nAppClassLoader", 
      explanation: "How JVM loads classes.", 
      selenium: "Dynamic class loading for plugins." 
    },
    { 
      level: "Advanced", 
      title: "Reflection: Methods", 
      code: `import java.lang.reflect.Method;
Method[] m = String.class.getDeclaredMethods();
System.out.println(m[0].getName());`, 
      output: "length", 
      explanation: "Inspecting classes at runtime.", 
      selenium: "Custom test frameworks." 
    },
    { 
      level: "Advanced", 
      title: "Reflection: Invoke", 
      code: `/* Method m = obj.getClass().getDeclaredMethod("privateMethod");
m.setAccessible(true);
m.invoke(obj); */`, 
      output: "Method executed", 
      explanation: "Executing private methods.", 
      selenium: "Testing internal API logic." 
    },
    { 
      level: "Advanced", 
      title: "Shutdown Hook", 
      code: `Runtime.getRuntime().addShutdownHook(new Thread(() -> {
  System.out.println("Shutting down");
}));`, 
      output: "Shutting down (on exit)", 
      explanation: "Code that runs on JVM exit.", 
      selenium: "Ensuring driver.quit() is called if JVM crashes." 
    },
    { 
      level: "Advanced", 
      title: "ThreadMXBean", 
      code: `import java.lang.management.*;
ThreadMXBean tb = ManagementFactory.getThreadMXBean();
System.out.println(tb.getThreadCount());`, 
      output: "5", 
      explanation: "Monitoring thread usage.", 
      selenium: "Profiling parallel runs." 
    },
    { 
      level: "Selenium-Oriented", 
      title: "-Xmx Parameter", 
      code: `/* Run via CLI: java -Xmx2G -jar tests.jar */`, 
      output: "Max Heap: 2GB", 
      explanation: "Setting JVM max memory.", 
      selenium: "Configuring Jenkins job for TestNG runs." 
    }
  ],
  interview: [
    { q: "Stack vs Heap?", a: "Stack is for method executions and local primitives; Heap is for dynamically allocated objects." },
    { q: "A Jenkins job running 20 parallel Selenium test threads intermittently dies with 'java.lang.OutOfMemoryError: Java heap space,' but the same suite runs fine with 5 threads. What's your diagnostic approach, and what's the likely fix?", a: "Each thread likely holds its own WebDriver instance plus accumulated page data (DOM snapshots, screenshots in memory) — 20 threads simultaneously multiplies memory footprint by 4x versus 5 threads, and the default heap size (-Xmx) wasn't sized for that. Diagnose with a heap dump (jmap) or a profiler to confirm what's actually accumulating, then either increase -Xmx appropriately or reduce thread count/pool size to match available memory." },
    { q: "You see 'StackOverflowError' in a recursive helper method that walks a nested menu structure to find a deeply nested link. Why does this happen, and what's the fix beyond 'just increase stack size'?", a: "Each recursive call adds a new frame to the thread's call stack, and sufficiently deep (or infinite/buggy) recursion exhausts the fixed-size stack allocated per thread. While -Xss can increase stack size as a stopgap, the more robust fix is converting the recursion to an iterative approach (using an explicit Stack/Queue data structure) which isn't bounded by call-stack depth, or verifying the recursion actually has a correct base case and isn't infinite due to a logic bug." },
    { q: "Why does 'System.gc()' being called explicitly in test teardown code NOT guarantee memory is freed before the next test starts, and why do experienced engineers avoid relying on it?", a: "System.gc() is merely a HINT to the JVM that garbage collection would be a good idea right now — the JVM is completely free to ignore it, defer it, or run a partial collection, so there's no guarantee it actually reclaims anything before your next line of code executes. Relying on it creates flaky, non-deterministic behavior; the better fix is addressing the actual reference leak (e.g., properly nulling out or removing ThreadLocal WebDriver references) rather than hoping GC cleans up after a leak." },
    { q: "A colleague says 'let's just set -Xmx8g for our CI agents to fix all our memory issues.' What's the problem with treating a large heap size as the default fix?", a: "A bigger heap can mask a real leak longer (it takes more accumulated garbage to trigger OOM) without fixing the underlying cause, and it also means GC pauses can be longer when they do occur (more memory to scan/compact), potentially slowing down test execution. Increasing heap size is a legitimate tool for genuinely memory-hungry workloads, but it shouldn't substitute for finding and fixing an actual leak." },
    { q: "Explain what 'ClassLoader' does and why understanding it matters when a framework dynamically loads Page Object classes by name (e.g., from a config file) rather than importing them directly.", a: "The ClassLoader is responsible for finding and loading .class bytecode into the JVM at runtime — Class.forName(\"com.framework.pages.LoginPage\") uses it to load a class purely from a String name, which is how frameworks implement plugin-style or config-driven Page Object instantiation without hardcoded imports. Misconfigured classpaths or multiple classloaders (common in some plugin architectures) can cause confusing 'ClassNotFoundException' or 'class loaded by different loader' errors that trace back to this mechanism." },
    { q: "Why would you use Java's Reflection API to invoke a private method in a legacy internal class during testing, and what's the tradeoff of doing so?", a: "Reflection (via setAccessible(true) and Method.invoke()) lets you bypass normal access control to test internal logic that has no public entry point, useful for legacy code you can't easily refactor. The tradeoff is fragility — reflection-based tests break silently on any internal rename/refactor (no compiler warning, since it's all string-based lookups) and run slower than direct calls, so it should be a last resort, not a habit." },
    { q: "A shutdown hook registered via 'Runtime.getRuntime().addShutdownHook(...)' is meant to call driver.quit() if the JVM is killed unexpectedly. Under what circumstances will this hook NOT run, and why does that matter for CI reliability?", a: "Shutdown hooks don't run if the JVM is killed forcibly (kill -9 on Unix, or the process being terminated abruptly by the OS/CI system rather than exiting normally) — they only run on 'normal' shutdown paths including uncaught exceptions and Ctrl+C. This matters because a CI system that force-kills a hung job won't trigger cleanup, meaning orphaned browser processes can still accumulate on CI agents even with a shutdown hook in place, requiring separate agent-level cleanup as a backstop." },
    { q: "Why does understanding Stack vs Heap help explain why passing a large List<WebElement> into a recursive method (one call per element) is riskier than passing it into a simple for-loop?", a: "The List object itself lives on the Heap regardless of how you iterate it, but each recursive call adds a stack frame holding its own local variables/parameters — deep recursion (proportional to list size) risks StackOverflowError for a large enough list, while a for-loop uses a constant, small amount of stack space regardless of how many elements it processes. This is a concrete case where the abstract Stack/Heap distinction has a direct, practical performance and correctness consequence." }
  ],
  handsOn: ["Write a shutdown hook that forces driver.quit() if a test suite terminates abruptly."],
  memoryVis: "Heap (Objects), Stack (Methods/Locals), Metaspace (Class Metadata).",
  challenges: [
    {
      title: "Read a JVM system property",
      prompt: "Fill in the System method used to read a JVM property like the OS name.",
      code: `String os = System.___1___("os.name");
System.out.println(os);`,
      blanks: [
        { label: "System method reading a JVM property", answer: "getProperty" }
      ],
      explanation: "System.getProperty(key) reads JVM system properties like os.name or java.version — useful for OS-conditional driver logic in a cross-platform test suite."
    },
    {
      title: "Register cleanup for abrupt termination",
      prompt: "Fill in the Runtime method that registers code to run if the JVM shuts down.",
      code: `Runtime.getRuntime().___1___(new Thread(() -> {
    System.out.println("Cleaning up before exit");
}));`,
      blanks: [
        { label: "method registering a cleanup thread for JVM shutdown", answer: "addShutdownHook" }
      ],
      explanation: "addShutdownHook registers a thread that runs on normal JVM shutdown (including uncaught exceptions), useful as a backstop to force driver.quit() — though it will NOT run if the process is force-killed (kill -9)."
    },
    {
      title: "Fix the unbounded recursion",
      prompt: "This recursive method has no way to stop and will throw StackOverflowError. Fill in the missing base case check.",
      code: `void recurse(int depth) {
    if (depth ___1___ 0) return; // base case
    recurse(depth - 1);
}`,
      blanks: [
        { label: "comparison operator for the base case", answer: ["<=", "=="] }
      ],
      explanation: "Every recursive method needs a base case that stops the recursion — without one, each call adds a new stack frame until the fixed-size thread stack is exhausted, throwing StackOverflowError."
    }
  ]
};
