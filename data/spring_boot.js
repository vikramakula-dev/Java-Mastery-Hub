export const springBootData = {
  title: "Spring Boot",
  concept: "An extension of the Spring framework that simplifies the setup and development of Spring applications through auto-configuration and opinionated defaults.",
  why: "Eliminates XML configuration and boilerplate code, allowing developers to build production-ready applications quickly.",
  realWorld: "Like buying a fully furnished, move-in-ready house instead of buying the land, bricks, and cement to build it yourself (Vanilla Spring).",
  seleniumMapping: "Three touchpoints for testers: the app you test is probably Spring Boot (its actuator /health endpoint is your smoke check, its properties explain environments); test frameworks sometimes use Spring's DI to wire page objects and config; and a tiny @RestController makes a perfect stub service for isolating UI tests from flaky downstream APIs.",
  commonMistakes: [
    "Not understanding how Dependency Injection (DI) and Inversion of Control (IoC) work under the hood.",
    "Putting all logic in the Controller layer instead of separating it into a Service layer.",
    "Ignoring application.properties or application.yml for configuration management."
  ],
  keyPoints: [
    "Spring's core idea is Dependency Injection: you declare what a class NEEDS (constructor parameters), the IoC container constructs and supplies it — the same inversion your DriverManager gives tests, industrialized.",
    "@SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan — one annotation on the main class boots the whole machine.",
    "Auto-configuration reads your classpath: spring-boot-starter-web on the path means an embedded Tomcat and JSON support configure themselves — convention over configuration at framework scale.",
    "Starters bundle dependency sets: spring-boot-starter-web (MVC + Tomcat + Jackson), spring-boot-starter-test (JUnit 5 + Mockito + AssertJ, at test scope) — one coordinate instead of ten.",
    "application.properties / application-{profile}.properties hold environment config; -Dspring.profiles.active=staging switches whole environments — this is WHERE the URLs and credentials your tests need actually live.",
    "@Component/@Service/@Repository mark classes for the container; @Autowired (or better, constructor injection) receives them — read these and you can navigate any Spring codebase you're testing.",
    "Actuator endpoints (/actuator/health, /metrics) are free operational APIs — a tester's readiness probe before a suite runs: assert health returns UP, skip the suite with a clear message if not.",
    "Embedded server means the app is 'java -jar app.jar' — no external Tomcat. That's why your test environment spins up as a single process CI can manage."
  ],
  examples: [
    {
      level: "Intermediate",
      title: "Simple REST API Endpoint",
      code: `import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class HelloWorldApplication {

    public static void main(String[] args) {
        SpringApplication.run(HelloWorldApplication.class, args);
    }

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, Spring Boot!";
    }
}`,
      output: "Hello, Spring Boot! (when visiting localhost:8080/hello)",
      explanation: "A complete, runnable web application in a single file.",
      walkthrough: [
        { code: "@SpringBootApplication", note: "Three annotations in one: @Configuration (this class defines beans), @EnableAutoConfiguration (set up infrastructure from the classpath), @ComponentScan (find components in this package and below). One line boots the machine." },
        { code: "@RestController", note: "@Controller + @ResponseBody: return values serialize straight to JSON instead of resolving an HTML view — the annotation for APIs and test stubs alike." },
        { code: "SpringApplication.run(...)", note: "Builds the IoC container, wires every dependency, starts embedded Tomcat — which is why the entire app is one 'java -jar' command CI can manage as a single process." }
      ]
    },
    {
      level: "Intermediate",
      title: "Dependency Injection — Constructor Style",
      code: `import org.springframework.stereotype.*;

@Service
class UserService {
    public String findName(long id) { return "Priya"; }
}

@RestController
class UserController {
    private final UserService userService;

    // Spring sees the constructor parameter and supplies the bean:
    UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users/{id}/name")
    String name(@PathVariable long id) {
        return userService.findName(id);
    }
}`,
      output: "GET /users/7/name  ->  Priya",
      explanation: "The controller never writes 'new UserService()' — it declares what it NEEDS in the constructor and the container injects it. Loose coupling, swappable implementations, trivially mockable.",
      selenium: "The exact pattern your Page Objects already use — LoginPage(WebDriver driver) — industrialized: declaring dependencies instead of constructing them is what makes both frameworks testable.",
      walkthrough: [
        { code: "@Service", note: "Marks the class as a container-managed bean (a specialization of @Component). Component scanning finds it at startup and keeps one instance ready to inject — Spring beans are singletons by default." },
        { code: "UserController(UserService userService)", note: "Constructor injection — the recommended style over field @Autowired: dependencies are explicit, final, and the class is constructible in a plain JUnit test by passing a Mockito mock. DI and testability are the same feature." },
        { code: "@PathVariable long id", note: "Binds the {id} segment of the URL into the parameter, type-converted. The web layer's job is exactly this translation; the logic lives in the injected service." }
      ]
    },
    {
      level: "Selenium-Oriented",
      title: "Health-Gate Your Suite with Actuator",
      code: `// Poll /actuator/health before starting the Selenium suite:
public static void waitForAppUp(String baseUrl, int timeoutSec) throws Exception {
    long deadline = System.currentTimeMillis() + timeoutSec * 1000L;
    while (System.currentTimeMillis() < deadline) {
        try {
            HttpURLConnection c = (HttpURLConnection)
                new URL(baseUrl + "/actuator/health").openConnection();
            c.setConnectTimeout(2000);
            c.setReadTimeout(2000);
            if (c.getResponseCode() == 200) {
                System.out.println("App is UP — starting suite");
                return;
            }
        } catch (Exception ignored) { /* not up yet */ }
        Thread.sleep(2000);
    }
    throw new IllegalStateException("App not healthy after " + timeoutSec + "s — aborting suite");
}`,
      output: "App is UP — starting suite",
      explanation: "A bounded poll against Spring Boot's free health endpoint — the suite either starts against a live app or fails fast with ONE clear infrastructure message.",
      selenium: "Kills the worst failure mode in CI: 40 Selenium tests all failing with connection errors because the deploy wasn't finished — replaced by a single honest 'app never came up'.",
      walkthrough: [
        { code: "new URL(baseUrl + \"/actuator/health\")", note: "Actuator ships this endpoint for free — 200 with {\"status\":\"UP\"} when the app and its dependencies (DB, queues) are ready. It's the app's own self-assessment, better than pinging the login page." },
        { code: "c.setConnectTimeout(2000); c.setReadTimeout(2000);", note: "The Networking module's rule applied: never poll with unbounded connections — each attempt fails fast, keeping the loop responsive." },
        { code: "throw new IllegalStateException(...)", note: "Failing the RUN here, before any test starts, converts 40 misleading red tests into one accurate message. This is a @BeforeSuite method in practice." }
      ]
    }
  ],
  interview: [
    { q: "What is Dependency Injection, and where have you already used the same idea in test automation?", a: "Objects receive their dependencies from an external source (Spring's IoC container) instead of constructing them — promoting loose coupling and swappability. The test-framework parallel: a Page Object receiving its WebDriver through the constructor instead of calling new ChromeDriver() itself IS dependency injection, hand-rolled. Spring industrializes that same inversion — drawing the parallel shows you understand the principle, not just the framework." },
    { q: "What is the difference between @Controller and @RestController?", a: "@RestController = @Controller + @ResponseBody: return values serialize straight to JSON instead of resolving to an HTML view template. For API endpoints — including any test-stub service you build — @RestController is the one you want." },
    { q: "As a tester, why would you care about the app's application.properties files?", a: "They're the source of truth for what your tests must target: server port, database URL (for JDBC validation), feature flags, and external service endpoints per profile. When a suite fails only in staging, diffing application-staging.properties against the working environment's file is a first-hour diagnostic. Testers who can read Spring config debug environment issues without waiting for a developer." },
    { q: "The UI you're testing depends on a flaky third-party API. How could a 20-line Spring Boot app make your Selenium suite stable?", a: "Build a stub: @SpringBootApplication + @RestController returning canned JSON for the endpoints the frontend calls, run it on a known port, and point the test environment's config at it. Your UI tests now exercise the frontend against deterministic responses — the flakiness of the real dependency is out of the loop, and you can even script error responses to test failure handling the real API won't produce on demand." },
    { q: "What does /actuator/health give a test suite, and how would you use it?", a: "A free readiness endpoint returning {\"status\":\"UP\"} when the app and its dependencies are healthy. Use it as a pre-suite gate: poll it (bounded retry) after the environment deploys, and only start Selenium tests once it reports UP — converting 'the whole suite failed because the app wasn't up yet' into either a clean wait or one clear infrastructure failure message." },
    { q: "What actually happens at startup thanks to @SpringBootApplication?", a: "It's three annotations in one: @Configuration (this class defines beans), @ComponentScan (find @Component/@Service/@Repository classes in this package and below), and @EnableAutoConfiguration (configure infrastructure based on what's on the classpath — Tomcat if starter-web is present). SpringApplication.run() builds the container, wires every dependency, and starts the embedded server — which is why the whole app is one java -jar command." }
  ],
  handsOn: [
    "Create a new Spring Boot project using Spring Initializr with Web and JPA dependencies.",
    "Build the 20-line stub: one @RestController returning fixed JSON, run it, and hit it with curl — then imagine pointing a frontend at it.",
    "Find application.properties in any Spring project and identify the three values a test suite would need from it.",
    "curl /actuator/health on a running Spring Boot app and script a poll-until-UP loop around it."
  ],
  memoryVis: "Spring Boot is a hotel, not a house kit: walk in with your suitcase (business logic) and the rooms are already furnished (auto-configuration), staff already hired (beans in the container), and reception (embedded Tomcat) already answering calls. @Autowired is room service delivering exactly what you asked for at the door — you never see the kitchen. The actuator is the fire-panel in the lobby: one glance tells you whether the building is okay.",
  challenges: [
    {
      title: "Spring Boot Main Class",
      prompt: "Which annotation is required on the main class of a Spring Boot application?",
      code: "___1___\npublic class Application { ... }",
      blanks: [{ label: "Main annotation", answer: ["@SpringBootApplication"] }],
      explanation: "@SpringBootApplication bundles @Configuration, @EnableAutoConfiguration, and @ComponentScan — the one annotation that boots the container, wires the beans, and starts the embedded server."
    },
    {
      title: "JSON, not web pages",
      prompt: "Fill in the annotation for a controller whose methods return JSON data directly.",
      code: `___1___
public class StubController {
    @GetMapping("/api/users/1")
    public String user() { return "{\\"name\\":\\"qa-stub\\"}"; }
}`,
      blanks: [{ label: "controller annotation with automatic body serialization", answer: ["@RestController"] }],
      explanation: "@RestController (= @Controller + @ResponseBody) serializes return values straight into the HTTP response — exactly what an API endpoint or test stub needs; plain @Controller would try to resolve an HTML view."
    },
    {
      title: "Declare, don't construct",
      prompt: "Fill in the annotation that makes this class a container-managed bean Spring can inject elsewhere.",
      code: `___1___
public class UserService {
    public String findName(long id) { return "Priya"; }
}`,
      blanks: [{ label: "stereotype annotation for a service bean", answer: ["@Service", "@Component"] }],
      explanation: "@Service (a specialization of @Component) registers the class with the IoC container during component scanning — after which any constructor that declares a UserService parameter receives the shared instance automatically."
    }
  ]
};
