export const mavenGradleData = {
  title: "Maven & Gradle",
  concept: "Build automation and dependency management tools used primarily for Java projects.",
  why: "Manages project dependencies, standardizes the build process, and automates tasks like compiling, testing, and packaging.",
  realWorld: "Like a recipe (pom.xml or build.gradle) that tells a factory (the build tool) exactly which ingredients (libraries) to fetch and how to bake the cake (build the app).",
  seleniumMapping: "Your whole test project runs on this: selenium-java and testng arrive as pom.xml dependencies, 'mvn test' triggers Surefire which runs your testng.xml, and -Dbrowser=firefox from the CI command line reaches your driver factory. 'How does CI run your tests?' is a Maven question in disguise.",
  commonMistakes: [
    "Dependency conflicts (e.g., two libraries requesting different versions of the same transitive dependency).",
    "Not understanding the build lifecycle (e.g., trying to deploy without compiling).",
    "Editing the target/build folder directly instead of letting the tool generate it."
  ],
  keyPoints: [
    "Maven uses pom.xml and convention over configuration: src/main/java for code, src/test/java for tests — put tests in the wrong tree and 'mvn test' silently ignores them.",
    "GAV coordinates identify every artifact: groupId (org), artifactId (name), version. Your project has them AND every dependency is addressed by them.",
    "The lifecycle is sequential: validate → compile → test → package → verify → install → deploy. Running 'mvn test' executes everything up TO test; 'mvn clean' first deletes target/ for a fresh build.",
    "The SUREFIRE plugin is what actually runs your tests during 'mvn test' — point it at testng.xml via <suiteXmlFiles> and your whole TestNG suite (groups, parallel settings) drives from one command.",
    "-D system properties pass runtime config from the command line: 'mvn test -Dbrowser=firefox -Denv=staging' reaches Java via System.getProperty(\"browser\") — how one pipeline runs many configurations.",
    "Dependency scopes matter: 'test' scope (TestNG, Mockito) keeps test libraries out of production artifacts; 'compile' (default) ships everywhere.",
    "Transitive dependencies arrive automatically (selenium-java pulls dozens of jars) — version conflicts between them are resolved 'nearest wins', and 'mvn dependency:tree' is the diagnostic when two libraries fight.",
    "Gradle: same jobs, different style — build.gradle in Groovy/Kotlin, faster via incremental builds and caching. Interviews mostly want 'I can read both, my projects use X'."
  ],
  examples: [
    {
      level: "Beginner",
      title: "Maven POM Example",
      code: `<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.example</groupId>
  <artifactId>my-app</artifactId>
  <version>1.0-SNAPSHOT</version>

  <dependencies>
    <!-- Adding JUnit as a dependency -->
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.13.2</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>`,
      output: "N/A (Configuration file)",
      explanation: "A simple pom.xml that defines the project identity and adds JUnit for testing.",
      walkthrough: [
        { code: "<groupId>com.example</groupId>", note: "The organization or group that created the project." },
        { code: "<artifactId>my-app</artifactId>", note: "The unique name of the project." },
        { code: "<dependency>...</dependency>", note: "Declares a library needed by the project. Maven will download it automatically." }
      ]
    }
  ],
  interview: [
    { q: "What is the difference between Maven and Gradle?", a: "Maven uses XML and is convention-based. Gradle uses Groovy/Kotlin, is highly flexible, and offers better performance through incremental builds and build cache. The pragmatic interview answer: both fetch dependencies and standardize builds — name which one YOUR project uses and one reason." },
    { q: "Walk me through what actually happens when CI runs 'mvn clean test' on your Selenium project.", a: "clean deletes target/, then the lifecycle runs up to test: sources compile, test sources compile, and the Surefire plugin executes the configured testng.xml — which applies your groups, parameters, and parallel settings. Browser/env come in as -D properties read via System.getProperty. Being able to narrate this chain end-to-end IS the 'how do your tests run in CI' answer." },
    { q: "Your test runs fine in the IDE but 'mvn test' runs zero tests. What do you check?", a: "Three usual suspects in order: (1) tests live outside src/test/java — Maven's convention tree — so Surefire never sees them; (2) Surefire isn't pointed at testng.xml (or the class names don't match Surefire's default *Test patterns); (3) the testng/junit dependency has the wrong scope or is missing, so the provider doesn't engage. The IDE compiles and runs anything; Maven only honors its conventions." },
    { q: "Two dependencies pull different versions of the same transitive library and tests break at runtime. How do you diagnose and fix it?", a: "'mvn dependency:tree' shows the full graph and which version won (nearest-wins resolution). Fix by either excluding the unwanted transitive (<exclusions> on the offending dependency) or pinning the version explicitly in <dependencyManagement>, which overrides transitive choices project-wide. NoSuchMethodError at runtime is the classic symptom of losing this fight silently." },
    { q: "Why does the 'test' scope exist — what breaks if TestNG ships at compile scope?", a: "Scopes control classpath and packaging: test-scope artifacts are available only when compiling/running tests and are EXCLUDED from the packaged application. TestNG at compile scope bloats the production artifact and can leak test-only classes into it; conversely, putting selenium-java at test scope is correct for a pure test project. Scope is dependency hygiene interviewers use to spot who's actually maintained a pom." },
    { q: "How do you run the same suite against different environments without editing any file?", a: "-D system properties on the command line: mvn test -Denv=staging -Dbrowser=firefox, read in code via System.getProperty(\"env\") with a sensible default. Combine with Maven profiles (-Pstaging) when whole dependency/config blocks differ per environment. One binary pipeline, N configurations — the standard CI pattern." }
  ],
  handsOn: [
    "Create a new Maven project and add selenium-java + testng (test scope) in the pom.xml.",
    "Wire Surefire to your testng.xml and run 'mvn clean test' — watch which phase compiles, which runs.",
    "Run 'mvn dependency:tree' on any real project and find one transitive dependency you didn't know you had.",
    "Pass -Dbrowser=firefox on the command line and read it with System.getProperty in your driver factory."
  ],
  memoryVis: "Maven is a factory with a fixed assembly line: clean sweeps the floor, then stations run in strict order — compile, test, package — and you can stop the belt at any station. The pom.xml is the bill of materials; Maven Central is the supplier warehouse; your local ~/.m2 is the parts shelf by the belt. Surefire is the QA station that won't inspect parts left outside its inbox (src/test/java).",
  challenges: [
    {
      title: "Maven Command",
      prompt: "Which maven command removes all files generated by the previous build?",
      code: "mvn ___1___",
      blanks: [{ label: "Command to clean project", answer: ["clean"] }],
      explanation: "The 'clean' phase deletes the target directory, ensuring a fresh build — 'mvn clean test' is the standard CI incantation."
    },
    {
      title: "Keep test libraries out of production",
      prompt: "Fill in the scope that makes TestNG available for tests but excluded from the packaged artifact.",
      code: `<dependency>
  <groupId>org.testng</groupId>
  <artifactId>testng</artifactId>
  <version>7.10.2</version>
  <scope>___1___</scope>
</dependency>`,
      blanks: [{ label: "dependency scope for test-only libraries", answer: ["test"] }],
      explanation: "test scope keeps the library on the test classpath only — it never ships in the production artifact. TestNG, JUnit, and Mockito all belong here."
    },
    {
      title: "Pass config from the command line",
      prompt: "Fill in the Java call that reads -Dbrowser=firefox passed to 'mvn test'.",
      code: `String browser = System.___1___("browser", "chrome");`,
      blanks: [{ label: "method reading a -D system property (with default)", answer: ["getProperty"] }],
      explanation: "System.getProperty(\"browser\", \"chrome\") reads the -D flag with a fallback default — the bridge between the CI command line and your driver factory."
    }
  ]
};
