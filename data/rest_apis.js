export const restApisData = {
  title: "REST APIs",
  concept: "Representational State Transfer (REST) is an architectural style for designing networked applications using standard HTTP methods.",
  why: "Provides a standardized, scalable, and stateless way for different systems (frontend, mobile, other microservices) to communicate over the web.",
  realWorld: "Like a restaurant menu where you (client) order an item using a specific name (URL) and the waiter (API) brings you exactly what you asked for (JSON response).",
  seleniumMapping: "The hybrid pattern that defines modern SDET work: seed test data with a fast API POST, drive the UI with Selenium, then verify side effects with an API GET — API for speed and setup, UI for what users actually see. RestAssured is the Java tool that makes those API calls read like sentences.",
  commonMistakes: [
    "Using GET requests to modify data instead of POST/PUT.",
    "Returning 200 OK for everything, even when errors occur, instead of using proper HTTP status codes.",
    "Using verbs in URLs (e.g., /getUsers) instead of nouns (e.g., GET /users)."
  ],
  keyPoints: [
    "The verb map: GET reads (safe, idempotent), POST creates, PUT replaces the whole resource, PATCH updates part of it, DELETE removes. PUT vs PATCH is the guaranteed comparison question.",
    "Status code families: 2xx success (200 OK, 201 Created, 204 No Content), 3xx redirects, 4xx client errors (400 bad request, 401 unauthenticated, 403 forbidden, 404 not found), 5xx server errors. Testers assert codes BEFORE bodies.",
    "401 vs 403 — the tester's distinction: 401 means 'who are you?' (missing/bad credentials); 403 means 'I know who you are, and no' (authenticated but unauthorized). Each is a different test case.",
    "Stateless: every request carries everything needed (auth token included) — no server session memory. This is why API tests are naturally parallel-safe and why a token must ride along on every call.",
    "Resources are nouns, verbs come from HTTP: GET /api/users/123, not /getUser?id=123 — recognizing (and flagging) verb-URLs is API design literacy.",
    "RestAssured reads as given/when/then: given() sets headers/body/auth, when() fires the method+URL, then() asserts status and body — the BDD shape for API calls in Java.",
    "JSON path assertions drill into responses: body(\"data.user.email\", equalTo(...)) — asserting specific FIELDS, not string-comparing whole payloads (which breaks on field ordering and timestamps).",
    "The hybrid test recipe: POST to create the test user (fast, deterministic), Selenium logs in through the UI (what users experience), GET verifies resulting state — each layer tested where it's strongest."
  ],
  examples: [
    {
      level: "Intermediate",
      title: "REST Controller in Spring Boot",
      code: `import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.notFound().build(); // 404
        }
        return ResponseEntity.ok(user); // 200
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.save(user);
        return ResponseEntity.status(201).body(savedUser); // 201 Created
    }
}`,
      output: "N/A (API Endpoints)",
      explanation: "A standard REST controller handling GET and POST requests.",
      walkthrough: [
        { code: "@RequestMapping(\"/api/users\")", note: "Sets the base URL for all endpoints in this controller — resources are NOUNS; the HTTP method supplies the verb." },
        { code: "@PathVariable", note: "Extracts values from the URL path (e.g., the id in /api/users/1)." },
        { code: "@RequestBody", note: "Deserializes the incoming JSON request body into a Java object." },
        { code: "ResponseEntity.status(201).body(savedUser)", note: "201 Created — not a generic 200 — is the correct creation response, and precisely what your API test should assert." }
      ]
    },
    {
      level: "Intermediate",
      title: "RestAssured GET — Status, Then Fields",
      code: `import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class GetUserTest {
    @Test
    public void userEndpointReturnsCorrectData() {
        given()
            .baseUri("https://reqres.in")
            .header("Accept", "application/json")
        .when()
            .get("/api/users/2")
        .then()
            .statusCode(200)
            .body("data.id", equalTo(2))
            .body("data.email", containsString("@reqres.in"))
            .body("data.first_name", not(emptyString()));
    }
}`,
      output: "Test passes: 200 OK with all three field assertions green",
      explanation: "The given/when/then chain: arrange the request, fire the verb, assert status first and then drill into the JSON with dot-paths.",
      selenium: "The API sibling of a Selenium assertion — same Arrange-Act-Assert shape, no browser: this is the test you write for the backend half of a hybrid suite.",
      walkthrough: [
        { code: "given().baseUri(...).header(...)", note: "The Arrange stage: base URL, headers, auth tokens, query params, request body — everything about the request EXCEPT sending it." },
        { code: ".when().get(\"/api/users/2\")", note: "The Act stage: verb + path fires the actual HTTP call. Swap .get for .post/.put/.delete — the chain shape never changes." },
        { code: ".then().statusCode(200).body(\"data.id\", equalTo(2))", note: "Assert the status BEFORE the body — a 500 makes body assertions meaningless noise. JSON dot-paths walk nesting; Hamcrest matchers (equalTo, containsString, hasItem) express the condition." }
      ]
    },
    {
      level: "Selenium-Oriented",
      title: "POST, Extract the ID, Round-Trip Verify",
      code: `String payload = """
    { "name": "qa-user", "job": "sdet" }""";

// Create, and capture the generated id:
String id =
    given()
        .baseUri("https://reqres.in")
        .contentType("application/json")
        .body(payload)
    .when()
        .post("/api/users")
    .then()
        .statusCode(201)
        .body("name", equalTo("qa-user"))
        .extract().path("id");

System.out.println("Created id: " + id);

// The hybrid pattern from here:
// 1. This POST seeded the data (fast, deterministic)
// 2. Selenium drives the UI as that user (what customers see)
// 3. A final GET /api/users/{id} verifies resulting state`,
      output: "Created id: 981",
      explanation: "extract().path() pulls values out of the response for follow-up calls — the create → capture → verify chain every data-driven API test needs.",
      selenium: "This is 'use the API to ARRANGE state' made concrete: seconds of setup instead of minutes of UI clicking, then Selenium tests only what genuinely needs a browser.",
      walkthrough: [
        { code: "String payload = \"\"\" ... \"\"\";", note: "A text block (Modern Java module) holding the JSON — readable, no escape characters, exactly the pairing these two modules were designed for." },
        { code: ".extract().path(\"id\")", note: "After assertions pass, extract() switches the chain from asserting to HARVESTING — path(\"id\") pulls the generated id for the next request. Chaining calls through extracted values is the backbone of API test flows." },
        { code: ".statusCode(201).body(\"name\", equalTo(\"qa-user\"))", note: "Assert BEFORE extracting: if creation failed, you want the clear 201-mismatch failure here — not a null id producing a confusing error three calls later." }
      ]
    }
  ],
  interview: [
    { q: "What is the difference between PUT and PATCH — and what does it mean for the tests you'd write?", a: "PUT replaces the ENTIRE resource (omitted fields become null/default); PATCH updates only the fields sent. Test implications differ: for PUT, assert that unsent fields were reset — the case teams forget; for PATCH, assert that unsent fields were PRESERVED. The same request body against the two verbs produces different correct outcomes, which makes it a great source of real bugs." },
    { q: "Why should REST APIs be stateless, and how does that property help your test suite specifically?", a: "Each request carries everything needed (including the auth token), so servers keep no session memory — enabling load balancing and horizontal scaling. For tests: statelessness means API calls can run massively parallel with no session bleed between threads, and any failing request is reproducible as a single standalone curl — no 'you had to do these 6 calls first in this session' debugging." },
    { q: "You POST a new user and get 200 OK with an empty body, and your test passes. Why is this test weak, and what should it assert?", a: "It only proved the server didn't error. Strong version: assert 201 Created specifically (the semantics of creation), extract the new resource's id or Location header, then GET that resource and assert the fields round-trip correctly. Bonus: POST the same payload again and assert the duplicate-handling behavior (409 or idempotency). Status-code-only tests pass while the API silently saves nothing." },
    { q: "Your UI test needs a user with 3 orders in a specific state. Compare creating that through the UI versus through the API.", a: "UI route: log in, click through checkout three times — minutes per test, breaks whenever any page changes, and failures in SETUP masquerade as test failures. API route: three POSTs — sub-second, versioned contract, failure messages that say exactly what broke. Rule of thumb worth saying verbatim: use the UI to TEST the UI, use the API to ARRANGE state. That sentence is the hybrid-testing philosophy interviewers listen for." },
    { q: "Walk through asserting on a nested JSON response with RestAssured — say the response is {\"data\":{\"user\":{\"email\":\"qa@x.com\",\"roles\":[\"ADMIN\"]}}}.", a: "given().header(\"Authorization\", \"Bearer \" + token).when().get(\"/api/users/42\").then().statusCode(200).body(\"data.user.email\", equalTo(\"qa@x.com\")).body(\"data.user.roles\", hasItem(\"ADMIN\")). JSON path walks the nesting with dots, hasItem handles arrays. The alternative — string-comparing the whole body — breaks on field ordering, whitespace, and timestamps; field-level assertions are the durable pattern." },
    { q: "A login endpoint returns 401 for bad passwords and 403 for locked accounts. A teammate says 'same thing, both denied.' As the tester, why do you insist they're different test cases?", a: "401 means authentication failed (credentials wrong — 'who are you?'); 403 means authentication succeeded but authorization denied (valid identity, forbidden action — 'no, YOU can't'). They exercise different code paths: credential checking vs account-state/permission checking, with different security logging, lockout counters, and user messaging behind them. Collapsing them into 'denied' would let a bug swap one for the other undetected — the distinction IS the coverage." }
  ],
  handsOn: [
    "Design a set of REST endpoints (URLs and methods) for a simple library system handling books and authors.",
    "Write a RestAssured test against any public API (e.g., reqres.in): assert status, one nested field, and one array element.",
    "Build the hybrid loop once: POST to create data, drive one Selenium step against it, GET to verify the result.",
    "Take a passing 'status code only' API test and strengthen it: extract the id, round-trip a GET, assert three fields."
  ],
  memoryVis: "REST is a well-run mailroom: the address identifies the RESOURCE (nouns — /users/123), the envelope's stamp is the VERB (GET reads, POST drops off something new, DELETE shreds), and the receipt code is the status (2xx delivered, 4xx your addressing mistake, 5xx the mailroom's fault). Stateless means every envelope carries its own ID papers — the clerk remembers nothing between visits, which is precisely why a thousand clerks can work in parallel.",
  challenges: [
    {
      title: "HTTP Status Code for Creation",
      prompt: "Which HTTP status code is most appropriate when a new resource is successfully created via a POST request?",
      code: "return ResponseEntity.status(___1___).body(newResource);",
      blanks: [{ label: "HTTP Status Code", answer: ["201"] }],
      explanation: "201 Created is the standard response for successful creation — asserting 201 specifically (not just 'some 2xx') is what makes an API creation test precise."
    },
    {
      title: "Complete the RestAssured chain",
      prompt: "Fill in the RestAssured method that begins the assertion section of the call.",
      code: `given().header("Authorization", token)
.when().get("/api/users/42")
.___1___().statusCode(200).body("data.user.email", equalTo("qa@x.com"));`,
      blanks: [{ label: "the assertion stage of given/when/then", answer: ["then"] }],
      explanation: "RestAssured's BDD chain: given() arranges (headers, body, auth), when() acts (verb + URL), then() asserts (status, JSON paths). The three-stage shape mirrors Arrange-Act-Assert."
    },
    {
      title: "Authenticated vs authorized",
      prompt: "A valid, logged-in user calls an admin-only endpoint. Fill in the status code the API should return.",
      code: `// Valid token, insufficient role:
assertEquals(___1___, response.getStatusCode());`,
      blanks: [{ label: "status for 'authenticated but not allowed'", answer: ["403"] }],
      explanation: "403 Forbidden = identity confirmed, permission denied. 401 would mean the credentials themselves failed — the two codes exercise entirely different code paths and are separate test cases."
    }
  ]
};
