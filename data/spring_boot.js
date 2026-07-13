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
        { code: "@SpringBootApplication", note: "A convenience annotation that adds @Configuration, @EnableAutoConfiguration, and @ComponentScan." },
        { code: "@RestController", note: "Marks the class as a web controller returning data rather than a view." },
        { code: "@GetMapping(\"/hello\")", note: "Maps HTTP GET requests to /hello to the sayHello method." }
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
    }
  ]
};
