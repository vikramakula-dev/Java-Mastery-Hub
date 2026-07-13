export const junitMockitoData = {
  title: "JUnit & Mockito",
  concept: "JUnit is a framework for writing and running unit tests in Java. Mockito is a mocking framework used alongside JUnit to isolate the code being tested by simulating its dependencies.",
  why: "Ensures code works as expected, prevents regressions when changing code, and allows testing of components in isolation.",
  realWorld: "JUnit is the driving examiner giving you a score. Mockito is the closed course that safely fakes the real world (traffic, pedestrians) so you can focus only on testing the driving skills.",
  seleniumMapping: "Two reasons SDETs need this: your FRAMEWORK's own utilities (retry logic, data parsers, locator builders) deserve unit tests that run in milliseconds without a browser — and 'JUnit vs TestNG' plus 'have you used Mockito' are standard interview probes even for Selenium-heavy roles.",
  commonMistakes: [
    "Testing multiple units/concerns in a single test method.",
    "Not asserting anything (just calling the method to get coverage).",
    "Mocking the class under test instead of its dependencies."
  ],
  keyPoints: [
    "Arrange-Act-Assert (or Given-When-Then): set up inputs and mocks, invoke the one behavior under test, assert the outcome. One behavior per test — the structure every reviewer looks for first.",
    "JUnit 5 lifecycle: @BeforeAll (static, once) → @BeforeEach → @Test → @AfterEach → @AfterAll — the same shape as TestNG's ladder with different names. @Disabled skips; @DisplayName gives readable report names.",
    "JUnit vs TestNG in one breath: same core job; TestNG adds groups, dependsOnMethods, and XML-driven suites/parallelism out of the box — which is why Selenium frameworks historically chose it; JUnit 5 owns the unit-test world and modern tooling. Know the one you use, respect the other.",
    "assertThrows(Exception.class, () -> code) is JUnit 5's exception testing — it ASSERTS the exception happens and returns it for message checks, replacing the old try/catch-fail dance.",
    "@ParameterizedTest + @CsvSource/@ValueSource is JUnit's DataProvider: one method, many inputs — @CsvSource({\"admin,true\", \"guest,false\"}) reads like a truth table.",
    "@Mock builds a fake dependency; @InjectMocks builds the REAL class under test and injects the mocks into it. The rule: never mock the class you're testing — mock its collaborators.",
    "Stub vs verify — the two Mockito verbs: when(mock.method()).thenReturn(x) scripts responses (state you feed IN); verify(mock, times(1)).method() proves an interaction happened (behavior you check CAME OUT).",
    "Why mock at all: isolation (a failure means THIS unit broke, not the database), speed (milliseconds, no I/O), and reachability (simulate errors — timeouts, exceptions — that real dependencies won't produce on demand)."
  ],
  examples: [
    {
      level: "Intermediate",
      title: "Testing with Mockito",
      code: `import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void testGetUser_Success() {
        // Arrange (Given)
        User mockUser = new User(1L, "Alice");
        when(userRepository.findById(1L)).thenReturn(mockUser);

        // Act (When)
        User result = userService.getUser(1L);

        // Assert (Then)
        assertEquals("Alice", result.getName());
        verify(userRepository, times(1)).findById(1L);
    }
}`,
      output: "Test Passed",
      explanation: "A unit test isolating UserService by mocking UserRepository.",
      walkthrough: [
        { code: "@Mock", note: "Creates a fake UserRepository so we don't hit a real database." },
        { code: "@InjectMocks", note: "Creates the real UserService and injects the fake UserRepository into it." },
        { code: "when(...).thenReturn(...)", note: "Instructs the mock how to behave when a specific method is called." },
        { code: "verify(...)", note: "Checks that the mocked method was actually called during the test." }
      ]
    }
  ],
  interview: [
    { q: "What is the difference between @Mock and @InjectMocks?", a: "@Mock creates a scripted fake of a DEPENDENCY; @InjectMocks constructs the real class under test and injects those mocks into it. The design rule behind them: the class under test is always real (its logic is what you're testing), its collaborators are fake (their behavior is controlled input). Mocking the class under test itself tests nothing but Mockito." },
    { q: "Why do we mock dependencies — give the three-part case.", a: "Isolation: a red test means THIS unit's logic broke, not that the database was down. Speed: no I/O means thousands of tests in seconds — cheap enough to run on every save. Reachability: when(repo.findById(1L)).thenThrow(new TimeoutException()) simulates failures a real dependency won't produce on demand, so error-handling paths finally get tested. All three together are the answer; any one alone is incomplete." },
    { q: "JUnit vs TestNG — you use TestNG for Selenium; why, and where does JUnit fit in the same project?", a: "TestNG's suite XML, groups, native parallel settings, and DataProvider made it the historical fit for browser-test orchestration. JUnit 5 dominates unit testing with better tooling defaults and @Nested/@ParameterizedTest ergonomics. A healthy repo often has BOTH: TestNG driving the Selenium suites, JUnit+Mockito unit-testing the framework's own utilities. Knowing they coexist — and what maps to what (@BeforeEach≈@BeforeMethod, @CsvSource≈DataProvider) — beats picking a side." },
    { q: "How do you test that a method THROWS the right exception in JUnit 5?", a: "assertThrows: NumberFormatException ex = assertThrows(NumberFormatException.class, () -> parser.parsePrice(\"abc\")); then assert on ex.getMessage() if the message matters. It fails the test if nothing (or the wrong type) is thrown, and hands back the exception for inspection — replacing the fragile old pattern of try { ...; fail(); } catch (Expected e) {}." },
    { q: "Your framework has a PriceParser.parse(String) used by dozens of Selenium tests. Make the case for unit-testing it separately with JUnit, even though the Selenium tests already 'cover' it.", a: "When a Selenium test fails, the parser is one suspect among fifty (locator? wait? environment? data?); a failing 3-millisecond JUnit test on parse(\"$1,234.99\") points at the exact defect instantly. Unit tests also cover the corner cases browser flows rarely produce on demand — empty strings, junk text, missing symbols — cheaply and deterministically. Coverage through the UI is incidental; coverage in the unit test is intentional and diagnostic." },
    { q: "when(...).thenReturn(...) vs verify(...) — when is each the right assertion?", a: "when/thenReturn is ARRANGE, not assert — it scripts a mock's response so the unit can run. verify(mock, times(1)).save(user) is the assertion, for methods whose value IS the side effect (did it save? exactly once?). Rule of thumb: assert return values with assertEquals when the method produces output; verify interactions when the method's contract is 'calls its collaborator correctly'. Verifying everything everywhere couples tests to implementation details — verify what matters, assert the rest." }
  ],
  handsOn: [
    "Write a unit test for a Calculator class using JUnit 5 assertions.",
    "Pick one real utility from your framework (a parser, a retry helper) and give it a JUnit 5 test class with a @ParameterizedTest covering 4 inputs.",
    "Write an assertThrows test for a method that should reject bad input — assert both the exception type and its message.",
    "Mock one dependency with when/thenReturn AND verify one interaction in the same test — feel the difference between scripting input and asserting behavior."
  ],
  memoryVis: "A crash-test lab: @InjectMocks is the real car being tested; @Mock builds the dummy pedestrians and fake weather (collaborators under your control); when().thenReturn() writes the scenario script ('when the light turns red...'); the assertions read the sensors on the car; and verify() checks the film afterward to confirm the brakes were actually pressed — once, not twice. JUnit is the lab protocol keeping every run identical.",
  challenges: [
    {
      title: "Mocking Behavior",
      prompt: "Complete the Mockito statement to return 'true' when authService.login() is called.",
      code: "___1___(authService.login(\"user\", \"pass\")).thenReturn(true);",
      blanks: [{ label: "Mockito setup method", answer: ["when"] }],
      explanation: "when(...).thenReturn(...) scripts the mock's response — this is the Arrange step that feeds controlled state into the unit under test."
    },
    {
      title: "Assert the exception",
      prompt: "Fill in the JUnit 5 method that asserts this call throws — and hands the exception back.",
      code: `NumberFormatException ex = ___1___(
    NumberFormatException.class,
    () -> parser.parsePrice("not-a-price"));`,
      blanks: [{ label: "JUnit 5 exception assertion", answer: ["assertThrows"] }],
      explanation: "assertThrows fails the test unless the lambda throws exactly that type — and returns the exception so you can additionally assert on its message. The modern replacement for try/fail/catch."
    },
    {
      title: "Prove the interaction happened",
      prompt: "Fill in the Mockito method that asserts the repository's save() was called exactly once.",
      code: `userService.register(newUser);
___1___(userRepository, times(1)).save(newUser);`,
      blanks: [{ label: "Mockito's interaction assertion", answer: ["verify"] }],
      explanation: "verify checks that the mock RECEIVED the call — the right assertion when a method's contract is its side effect (persisting, notifying) rather than its return value."
    }
  ]
};
