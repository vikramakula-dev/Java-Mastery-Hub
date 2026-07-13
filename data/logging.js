export const loggingData = {
  title: "Logging",
  concept: "The practice of recording application events, errors, and information to a persistent medium (like a file or console) for debugging and monitoring.",
  why: "System.out.println is synchronous, cannot be turned off in production, and lacks severity levels. Proper logging solves all of these.",
  realWorld: "Like an airplane's black box that records exactly what happened during a flight so investigators can figure out why a crash occurred.",
  seleniumMapping: "A failed CI test at 3am has no one watching the screen — the log IS the crime scene. Framework logging (BasePage actions, listener events, driver lifecycle) turns 'NoSuchElementException somewhere' into a readable story: which page, which action, which locator, right before the failure.",
  commonMistakes: [
    "Using System.out.println() instead of a logger in production code.",
    "Logging sensitive information (like passwords or PII).",
    "Not configuring log rotation, eventually causing the disk to fill up."
  ],
  keyPoints: [
    "SLF4J is a facade (interfaces you code against); Logback or Log4j2 is the implementation behind it — swap the backend without touching a line of code. Same spec-vs-implementation shape as JPA/Hibernate.",
    "The severity ladder, least to most: TRACE → DEBUG → INFO → WARN → ERROR. Setting a level shows that level AND above — production at INFO hides DEBUG noise; a debugging session flips to DEBUG via config, no recompile.",
    "One logger per class, by convention: private static final Logger log = LoggerFactory.getLogger(ThisClass.class) — the class name in output tells you WHERE each line came from for free.",
    "Parameterized messages, always: log.info(\"Clicking {}\", locator) — the {} placeholder skips string concatenation entirely when the level is off, and never breaks. Concatenation in log calls is both slower and a code smell.",
    "log.error(\"context message\", exception) — passing the exception as the LAST argument prints the full stack trace; wrapping it into the message string loses the trace. A one-argument mistake with real debugging cost.",
    "Why System.out.println fails at scale: no levels (can't silence it), no timestamps/thread/class context, no file output or rotation, and interleaved garbage under parallel execution. 'Why not sysout?' is the standard interview opener on this topic.",
    "In parallel suites, the pattern layout's %thread field is what un-scrambles interleaved logs — each line self-identifies its test thread; MDC goes further by stamping every line with a test name or correlation id.",
    "Framework placement: log actions in BasePage helpers (every click/type logged once, uniformly), lifecycle in the TestNG listener (start/pass/fail), driver events via WebDriverListener — tests stay clean while everything is recorded."
  ],
  examples: [
    {
      level: "Intermediate",
      title: "Using SLF4J and Logback",
      code: `import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PaymentService {
    // 1. Create a logger instance for this class
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    public void processPayment(String userId, double amount) {
        logger.info("Starting payment process for user: {}", userId);
        
        try {
            // simulate payment processing
            if (amount < 0) {
                throw new IllegalArgumentException("Amount cannot be negative");
            }
            logger.debug("Payment amount {} is valid.", amount);
            
        } catch (Exception e) {
            logger.error("Payment failed for user: {}", userId, e);
        }
    }
}`,
      output: "N/A (Output depends on logging configuration)",
      explanation: "Using SLF4J to log messages at different severity levels.",
      walkthrough: [
        { code: "LoggerFactory.getLogger(...)", note: "Instantiates the logger for the specific class." },
        { code: "logger.info(...) ", note: "Logs general informational messages." },
        { code: "logger.error(..., e)", note: "Logs the error message along with the full stack trace of the exception." }
      ]
    }
  ],
  interview: [
    { q: "Why use SLF4J instead of using Log4j directly?", a: "SLF4J is a facade — program against its interfaces and the underlying implementation (Logback, Log4j2) is swappable via dependencies alone, zero code changes. It also future-proofs libraries: a library logging via SLF4J plugs into whatever backend the host application chose. Same architecture as JPA/Hibernate — spec in code, implementation in the build file." },
    { q: "Why is System.out.println unacceptable in a test framework — give the full indictment.", a: "No severity levels, so you can't silence it in CI or amplify it while debugging; no automatic context (timestamp, thread, class), which makes parallel-run output an unreadable interleaved soup; no file output, rotation, or pattern control; and it's synchronous console I/O, which measurably slows large suites. A logger fixes every one of these with one config file — this question is the standard opener and deserves a complete answer." },
    { q: "Your parallel suite's console output is scrambled across 4 threads and useless. What two logging features fix diagnosis?", a: "First, %thread in the pattern layout — every line self-identifies its thread, so grep untangles the interleaving instantly. Second, MDC (Mapped Diagnostic Context): put the test name into MDC at @BeforeMethod (MDC.put(\"test\", result.getName())) and add %X{test} to the pattern — now every line from anywhere in the stack carries which TEST produced it. Thread tells you where, MDC tells you what." },
    { q: "What's wrong with log.error(\"Failed: \" + e.getMessage()) — and what's the correct form?", a: "Two defects: string concatenation runs even when the level is disabled (waste), and worse, e.getMessage() discards the stack trace — you learn 'element not found' but not WHERE. Correct: log.error(\"Login flow failed for {}\", username, e) — placeholders for lazy formatting, exception as the final argument so the full trace prints. That last-argument convention is the detail that separates people who've actually debugged from logs." },
    { q: "Where do logging calls belong in a Page Object framework — every test? Every page method? Explain the design.", a: "Neither tests nor scattered ad hoc calls: centralize in the layers everything flows through. BasePage helpers log every click/type/wait uniformly ('Clicking loginButton on LoginPage'); the TestNG listener logs test start/pass/fail boundaries; driver-level events can be caught with a WebDriverListener. Tests stay clean business narrative, yet every run produces a complete story — the same cross-cutting-concern logic as screenshot-on-failure." },
    { q: "Production runs at INFO. A bug only reproduces with DEBUG detail. What do you do — and why does the level design make this safe?", a: "Flip the logger (or just one package: logger name='com.myframework.pages') to DEBUG in config — no recompile, no redeploy of code, because level filtering is a runtime decision. The ladder design means DEBUG statements cost almost nothing while disabled (especially with {} placeholders — arguments aren't even formatted), so the detailed logging can permanently live in the code, waiting to be switched on the day you need it." }
  ],
  handsOn: [
    "Add SLF4J and Logback to a Maven project and create a logback.xml file to write logs to a file.",
    "Add %thread and %X{test} to your pattern, run two tests in parallel, and read the difference.",
    "Write log.error both ways — message-concatenated vs exception-as-argument — and compare what reaches the log file.",
    "Add DEBUG-level logging to one BasePage method, run at INFO (silence), then flip config to DEBUG (detail) without recompiling."
  ],
  memoryVis: "Logging is the ship's logbook, not the captain shouting into the wind (System.out). Every entry is stamped — time, deck (class), sailor (thread) — and entries have ink colors by severity: pencil for TRACE, black ink for INFO, red for ERROR. The logbook survives the voyage (files, rotation); shouting doesn't. MDC is writing the voyage number on the page corner — later, one glance groups every entry from the same trip.",
  challenges: [
    {
      title: "Logging Level",
      prompt: "Which logging level should be used to record a caught exception that prevents a business process from completing?",
      code: "logger.___1___(\"Process failed\", exception);",
      blanks: [{ label: "Log level", answer: ["error"] }],
      explanation: "error is for failures needing attention — and note the exception rides as the LAST argument, which is what makes the full stack trace print."
    },
    {
      title: "Lazy formatting",
      prompt: "Fill in the placeholder token that avoids string concatenation when the log level is disabled.",
      code: `log.debug("Clicking element ___1___ on page ___1___", locator, pageName);`,
      blanks: [{ label: "SLF4J's parameter placeholder", answer: ["{}"] }],
      explanation: "The {} placeholders are only formatted if the level is actually enabled — concatenation with + builds the string every time regardless, paying the cost even when DEBUG is off."
    },
    {
      title: "One logger per class",
      prompt: "Fill in the factory call that creates this class's logger.",
      code: `private static final Logger log = LoggerFactory.___1___(LoginPage.class);`,
      blanks: [{ label: "the factory method", answer: ["getLogger"] }],
      explanation: "LoggerFactory.getLogger(LoginPage.class) names the logger after the class — every log line then carries its origin for free, and per-package level control (pages at DEBUG, everything else at INFO) becomes possible."
    }
  ]
};
