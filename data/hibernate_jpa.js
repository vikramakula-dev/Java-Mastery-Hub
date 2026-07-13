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
        { code: "@Entity", note: "Marks this class as a JPA entity." },
        { code: "@Id", note: "Marks the field as the primary key." },
        { code: "@GeneratedValue", note: "Configures auto-increment for the primary key." },
        { code: "@Column", note: "Maps the field to a specific database column." }
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
    }
  ]
};
