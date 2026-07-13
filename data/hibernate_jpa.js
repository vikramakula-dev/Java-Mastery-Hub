export const hibernateJpaData = {
  title: "Hibernate & JPA",
  concept: "JPA (Java Persistence API) is a specification for Object-Relational Mapping (ORM) in Java. Hibernate is the most popular implementation of JPA.",
  why: "Reduces boilerplate JDBC code and allows developers to interact with the database using Java objects instead of SQL strings.",
  realWorld: "Like a bilingual translator that converts your Java object thoughts seamlessly into SQL database actions without you needing to speak SQL.",
  seleniumMapping: "You'll meet Hibernate from the OUTSIDE: the app under test uses it, so its behaviors (generated IDs, lazy loading, caching delays) explain weird test observations — and test-data setup utilities sometimes reuse the app's entities to seed the database faster than any UI flow could.",
  commonMistakes: [
    "N+1 Select Problem: Loading related entities inefficiently, resulting in hundreds of extra queries.",
    "Misunderstanding Cascade Types, leading to accidental deletions of related data.",
    "Eager loading (FetchType.EAGER) everything, causing massive memory usage."
  ],
  keyPoints: [
    "ORM in one line: classes ↔ tables, objects ↔ rows, fields ↔ columns. You work with Java objects; Hibernate writes the SQL.",
    "JPA is the SPECIFICATION (annotations + interfaces like EntityManager); Hibernate is the dominant IMPLEMENTATION. Code against JPA, run on Hibernate — same relationship as SLF4J to Logback.",
    "The core annotations: @Entity (this class maps to a table), @Id (primary key), @GeneratedValue (DB assigns it), @Column (name/nullable tweaks) — enough to read most entity classes you'll encounter.",
    "EntityManager verbs: persist (insert), find (select by id), merge (update), remove (delete) — the CRUD vocabulary in object terms.",
    "LAZY vs EAGER fetching: lazy loads associations only when touched — efficient, but touching them after the session closes throws LazyInitializationException, a stack trace every Java tester eventually meets.",
    "The N+1 problem: load 100 orders (1 query), then touch each order's customer (100 more queries) — the app 'works' but hammers the DB. Fixed with JOIN FETCH. As a tester, this is a PERFORMANCE finding you can name precisely.",
    "JPQL queries entities, not tables: SELECT u FROM User u WHERE u.active = true — class and field names, translated to SQL by Hibernate.",
    "Why SDETs care: generated-ID behavior explains why your JDBC validation needs the row's natural key not a guessed id; Hibernate's write-behind flushing explains rows appearing 'late'; and entity-based seeding utilities beat UI-based test setup by orders of magnitude."
  ],
  examples: [
    {
      level: "Intermediate",
      title: "JPA Entity Mapping",
      code: `import javax.persistence.*;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    // Getters and Setters omitted for brevity
}`,
      output: "N/A (Mapping configuration)",
      explanation: "An example of mapping a Java class to a database table using JPA annotations.",
      walkthrough: [
        { code: "@Entity", note: "Registers the class with the persistence provider — without it, every other annotation here is inert decoration and Hibernate ignores the class entirely." },
        { code: "@Id", note: "Marks the primary key field — every entity must have exactly one identity." },
        { code: "@GeneratedValue(strategy = GenerationType.IDENTITY)", note: "The DATABASE assigns the id at insert time — which is why tests can never predict ids and must look rows up by natural keys they controlled (like a unique email)." },
        { code: "@Column(name = \"first_name\", nullable = false)", note: "Maps the Java field to its column and carries constraints. camelCase field, snake_case column — the mapping layer absorbing the two worlds' naming conventions." }
      ]
    },
    {
      level: "Intermediate",
      title: "EntityManager CRUD — persist, find, remove",
      code: `// Inside a transaction (framework-managed or manual):
EntityManager em = entityManagerFactory.createEntityManager();
em.getTransaction().begin();

Employee emp = new Employee();
emp.setFirstName("Priya");
em.persist(emp);                     // INSERT (id assigned on flush/commit)

em.getTransaction().commit();
System.out.println("Generated id: " + emp.getId());

Employee found = em.find(Employee.class, emp.getId());   // SELECT by pk
System.out.println("Found: " + found.getFirstName());

em.getTransaction().begin();
em.remove(found);                    // DELETE
em.getTransaction().commit();`,
      output: "Generated id: 42\nFound: Priya",
      explanation: "The four verbs of entity life: persist (insert), find (select by id), merge (update), remove (delete) — SQL written for you.",
      selenium: "Test-data utilities built on the app's own entities seed data WITH all the app's rules (defaults, cascades, audit columns) — data the app could genuinely have produced, unlike a hand-written INSERT that skips half the columns.",
      walkthrough: [
        { code: "em.persist(emp);", note: "Queues the INSERT — but Hibernate may not flush the SQL until commit (write-behind). This gap between 'persist returned' and 'row visible to other connections' is exactly why external JDBC validations sometimes need a polling retry." },
        { code: "em.getTransaction().commit();", note: "The moment SQL is guaranteed flushed and durable. After commit, emp.getId() carries the database-generated id — read it here if a follow-up API call needs it." },
        { code: "em.find(Employee.class, emp.getId());", note: "Primary-key lookup — checks the persistence context cache first, then the database. This caching is also why an app can briefly show stale data your SQL says is updated: the reverse illusion of write-behind." }
      ]
    },
    {
      level: "Advanced",
      title: "JPQL — Querying Objects, Not Tables",
      code: `// JPQL speaks in ENTITY and FIELD names, not tables and columns:
List<Employee> active = em.createQuery(
        "SELECT e FROM Employee e WHERE e.status = :status ORDER BY e.firstName",
        Employee.class)
    .setParameter("status", "ACTIVE")
    .getResultList();

active.forEach(e -> System.out.println(e.getFirstName()));

// Single result, safely:
Long count = em.createQuery(
        "SELECT COUNT(e) FROM Employee e WHERE e.status = :status", Long.class)
    .setParameter("status", "ACTIVE")
    .getSingleResult();
System.out.println("Active employees: " + count);`,
      output: "Anil\nPriya\nActive employees: 2",
      explanation: "JPQL looks like SQL but targets the object model — Employee the class, e.status the field — and Hibernate translates to the real table/column SQL underneath.",
      selenium: "Reading test state through the app's model: 'how many ACTIVE employees exist right now' as a typed query, with named parameters giving the same injection safety as PreparedStatement.",
      walkthrough: [
        { code: "SELECT e FROM Employee e", note: "Employee is the CLASS (capitalized, as in Java), not the employees table — the mapping annotations handle the translation. Returned objects are full managed entities, not raw rows." },
        { code: ".setParameter(\"status\", \"ACTIVE\")", note: "Named parameters (:status) are JPQL's PreparedStatement placeholders — values bound separately from the query text, injection-safe by construction, and more readable than positional ?1." },
        { code: ".getSingleResult()", note: "For exactly-one-row queries like COUNT. Throws NoResultException if nothing matches and NonUniqueResultException for multiple — loud failures instead of silent nulls." }
      ]
    }
  ],
  interview: [
    { q: "What is the difference between JPA and Hibernate?", a: "JPA is a specification — the annotations (@Entity, @Id) and interfaces (EntityManager) — while Hibernate is the most widely used implementation doing the actual work. Code written against JPA can theoretically swap implementations (EclipseLink) without changing source. Same facade-vs-implementation relationship as SLF4J to Logback." },
    { q: "What is the N+1 problem, and how would you spot it as a tester?", a: "Loading N parent entities takes 1 query, then lazily touching each one's association fires N additional queries — 1+N total, invisible in dev with 10 rows, brutal in production with 10,000. As a tester you spot it in enabled SQL logs (hibernate.show_sql) or APM traces: a single page load emitting hundreds of near-identical SELECTs. Fix on the dev side is JOIN FETCH or entity graphs; being able to NAME the pattern turns 'this page is slow' into an actionable defect report." },
    { q: "Your JDBC validation can't find a row the app claims it saved via Hibernate — but the row appears if you check a moment later. Give two Hibernate-specific explanations.", a: "(1) Write-behind flushing: Hibernate batches SQL and flushes at transaction commit — between 'save() returned' in app logs and the actual COMMIT, your external connection sees nothing. (2) Second-level/query caching on reads can make the APP show stale data while the DB is actually updated — the reverse illusion. Both are fixed in tests the same way as UI waits: poll with a bounded retry instead of asserting instantly." },
    { q: "What is LazyInitializationException and why does it matter to test automation?", a: "It's thrown when code touches a LAZY association after the Hibernate session that loaded the entity has closed — the proxy has no live connection to load through. Testers meet it two ways: as a frequent production bug class worth targeting with tests (any screen that renders a lazy collection outside its transaction), and in their own test-data utilities if they reuse app entities outside a session. It's the flagship symptom of lazy loading's contract." },
    { q: "Why would a test framework seed data through the app's JPA entities instead of raw SQL INSERTs?", a: "Entities carry the app's own rules: generated IDs, default values, cascades, validation, and audit columns all happen exactly as production writes do — raw SQL can silently miss a column or bypass a cascade, creating test data the app itself could never have produced. The trade-off: entity seeding couples tests to the app's model. Both approaches are defensible; knowing WHY you chose one is what interviews check." },
    { q: "What does @GeneratedValue mean for how you write assertions?", a: "The database assigns the ID at insert time — your test can't predict it. So DB validations must look rows up by a NATURAL key you controlled (the unique email you registered), not by guessing IDs; and if you need the generated ID for a follow-up API call, read it back from the created row or the creation response. Asserting against hardcoded IDs is the brittle-test smell this annotation should trigger." }
  ],
  handsOn: [
    "Create an Employee entity and use EntityManager to persist a new employee to the database.",
    "Enable hibernate.show_sql=true in any sample project, load a list page, and count the queries — hunt for an N+1.",
    "Write the polling version of a DB assertion (retry SELECT until row appears or timeout) and use it after a Hibernate-backed save."
  ],
  memoryVis: "Hibernate is a diplomatic interpreter between two countries: Java (objects) and SQL (tables). @Entity is the passport, @Id the passport number, and the EntityManager the embassy handling arrivals (persist), lookups (find), and departures (remove). Lazy loading is the interpreter saying 'I'll fetch that file only if you ask' — helpful, unless the embassy has already closed for the day (LazyInitializationException).",
  challenges: [
    {
      title: "Primary Key Annotation",
      prompt: "Which annotation is used to mark a field as the primary key of an entity?",
      code: "___1___\nprivate Long id;",
      blanks: [{ label: "Annotation for primary key", answer: ["@Id"] }],
      explanation: "@Id marks the entity's primary key; paired with @GeneratedValue, the database assigns it at insert time — which is why tests must look rows up by natural keys instead."
    },
    {
      title: "Mark the class as persistent",
      prompt: "Fill in the annotation that tells JPA this class maps to a database table.",
      code: `___1___
@Table(name = "employees")
public class Employee { }`,
      blanks: [{ label: "annotation making a class a JPA entity", answer: ["@Entity"] }],
      explanation: "@Entity registers the class with the persistence provider — without it, @Table and @Id are inert decorations and Hibernate ignores the class entirely."
    },
    {
      title: "Insert through the object model",
      prompt: "Fill in the EntityManager method that queues a new entity for INSERT.",
      code: `Employee emp = new Employee();
emp.setFirstName("Priya");
em.getTransaction().begin();
em.___1___(emp);
em.getTransaction().commit();`,
      blanks: [{ label: "EntityManager verb for saving a NEW entity", answer: ["persist"] }],
      explanation: "persist() queues the INSERT for a new entity (merge() is for updating detached ones). The SQL may not flush until commit — Hibernate's write-behind, and the reason external DB checks sometimes need a polling retry."
    }
  ]
};
