export const jdbcData = {
  title: "JDBC (Java Database Connectivity)",
  concept: "An API that allows Java applications to interact with relational databases.",
  why: "It provides a standard interface for connecting to databases, executing SQL statements, and retrieving results.",
  realWorld: "Like a universal remote control (JDBC) that can operate any TV brand (database) as long as you have the right adapter (JDBC Driver).",
  seleniumMapping: "Database validation is the other half of end-to-end testing: submit a form in the UI with Selenium, then query the DB with JDBC to assert the row actually landed correctly — UI says 'saved', the database proves it. Most SDET job descriptions list exactly this.",
  commonMistakes: [
    "Not closing connections, statements, or result sets, leading to resource leaks.",
    "Using Statement instead of PreparedStatement, causing SQL Injection vulnerabilities.",
    "Hardcoding database credentials in the source code."
  ],
  keyPoints: [
    "The core chain: DriverManager.getConnection(url, user, pass) → Connection → PreparedStatement → executeQuery() → ResultSet. Recite it; then say all three are AutoCloseable and belong in try-with-resources.",
    "PreparedStatement over Statement, always: ? placeholders are sent separately from the SQL, so injection is structurally impossible — concatenating user input into a Statement string is the textbook vulnerability.",
    "ResultSet starts BEFORE the first row: rs.next() both advances and reports whether a row exists — while (rs.next()) is the iteration idiom, and a single-row check is if (rs.next()).",
    "Column access by name (rs.getString(\"email\")) beats by index (rs.getString(2)) — indexes silently break when the SELECT list changes.",
    "executeQuery() returns a ResultSet (SELECT); executeUpdate() returns an int row-count (INSERT/UPDATE/DELETE) — using the wrong one throws at runtime.",
    "try-with-resources closes ResultSet, Statement, and Connection in reverse order automatically — the leak-proof pattern from the Java IO module applied to sockets-to-the-database.",
    "The SDET pattern: UI action via Selenium → JDBC SELECT for the affected row → assert DB state matches what the UI claimed. Credentials come from config, never hardcoded.",
    "Connection pooling (HikariCP) matters in production apps; for test validation a plain short-lived connection per check is usually fine — know the distinction."
  ],
  examples: [
    {
      level: "Intermediate",
      title: "Querying a Database",
      code: `import java.sql.*;

public class JdbcExample {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/mydb";
        String user = "root";
        String password = "password";

        String query = "SELECT id, name FROM users WHERE age > ?";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             PreparedStatement pstmt = conn.prepareStatement(query)) {
             
            pstmt.setInt(1, 18);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                System.out.println("ID: " + rs.getInt("id") + ", Name: " + rs.getString("name"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}`,
      output: "ID: 1, Name: Alice\nID: 2, Name: Bob",
      explanation: "A simple JDBC program using try-with-resources to ensure connections are closed safely.",
      walkthrough: [
        { code: "Connection conn = DriverManager.getConnection(url, user, password);", note: "Establishes a connection to the database." },
        { code: "PreparedStatement pstmt = conn.prepareStatement(query)", note: "Prepares the SQL query, making it safe from SQL injection." },
        { code: "pstmt.setInt(1, 18);", note: "Sets the first placeholder (?) in the query to 18." },
        { code: "ResultSet rs = pstmt.executeQuery();", note: "Executes the query and stores the result." }
      ]
    }
  ],
  interview: [
    { q: "What is the difference between Statement and PreparedStatement?", a: "PreparedStatement is precompiled and protects against SQL injection by sending parameters (?) separately from the SQL text; Statement executes raw strings and is vulnerable the moment user input is concatenated in. PreparedStatement also performs better on repeated execution because the database caches the plan. There is no interview-acceptable reason to use Statement with dynamic values." },
    { q: "Your Selenium test registers a user and the UI shows 'Success' — but how do you PROVE the registration actually worked? Walk through the full validation.", a: "UI success only proves the front end rendered a message. The end-to-end proof: after the Selenium flow, open a JDBC connection, run SELECT email, status, created_at FROM users WHERE email = ? with the test email, assert a row exists (if (rs.next())), and assert each column matches what was entered. Then clean up the test row. This UI-plus-DB assertion is exactly what 'database validation' means in SDET job descriptions." },
    { q: "A teammate builds queries with 'SELECT * FROM users WHERE name = '\" + userInput + \"'\". Demonstrate the attack, then the fix.", a: "Input like: anything' OR '1'='1 turns the WHERE clause into a tautology returning every row — and '; DROP TABLE users; --' can be catastrophic where multi-statements are enabled. Fix: PreparedStatement with ? placeholders — pstmt.setString(1, userInput) transmits the value out-of-band from the SQL, so it can never be parsed as SQL. As a tester, injection attempts belong in YOUR negative test suite too." },
    { q: "Why does 'while (rs.next())' work as the row-iteration idiom — where does the cursor start?", a: "A fresh ResultSet's cursor sits BEFORE the first row. next() advances one row and returns true if a row is there — so the first call enters row one, and the loop naturally ends when next() returns false past the last row. For asserting exactly one row exists: if (rs.next()) plus a follow-up assertFalse(rs.next()) — a subtle but complete single-row validation." },
    { q: "Your DB validation intermittently fails: the row 'isn't there' right after the UI says saved — but it appears seconds later. What's happening and how do you fix the test?", a: "The application commits asynchronously (queue, async worker, replica lag) — the UI confirms before the row is durably visible to your connection. Fix like a wait problem, not a Thread.sleep problem: poll the SELECT with a bounded retry (the FluentWait mindset applied to JDBC) until the row appears or a timeout fails the test with a clear message. Same synchronization discipline as Selenium waits, different resource." },
    { q: "executeQuery vs executeUpdate — and what does each return?", a: "executeQuery is for SELECT and returns a ResultSet to iterate; executeUpdate is for INSERT/UPDATE/DELETE and returns an int count of affected rows — which is itself an assertion opportunity: assertEquals(1, rowsUpdated) proves the update touched exactly the intended row. Calling the wrong one throws SQLException at runtime, a category of bug the method names exist to prevent." }
  ],
  handsOn: [
    "Write a JDBC program to insert a new record into a MySQL table, asserting executeUpdate returned 1.",
    "Build the full SDET loop on a local DB: Selenium submits a form → JDBC SELECT asserts the row → DELETE cleans up in @AfterMethod.",
    "Deliberately write an injectable Statement query, break it with a quote-input, then fix it with PreparedStatement — seeing the attack once makes the lesson permanent."
  ],
  memoryVis: "Picture a phone call to the records office: DriverManager dials (Connection), you fill out a request form with blanks (PreparedStatement's ?), the clerk mails back a stack of index cards with a bookmark sitting BEFORE the first card (ResultSet) — next() flips to the following card and tells you if one was there. Hang up when done (try-with-resources hangs up for you, even if you faint mid-call).",
  challenges: [
    {
      title: "Preventing SQL Injection",
      prompt: "Which interface should you use to execute parameterized queries?",
      code: "___1___ pstmt = conn.prepareStatement(\"SELECT * FROM users WHERE id = ?\");",
      blanks: [{ label: "Interface name", answer: ["PreparedStatement"] }],
      explanation: "PreparedStatement sends parameter values separately from the SQL text, making injection structurally impossible — and it's precompiled for repeat performance."
    },
    {
      title: "Advance the cursor",
      prompt: "Fill in the ResultSet method that both moves to the next row AND reports whether one exists.",
      code: `ResultSet rs = pstmt.executeQuery();
while (rs.___1___()) {
    System.out.println(rs.getString("email"));
}`,
      blanks: [{ label: "cursor-advance method returning boolean", answer: ["next"] }],
      explanation: "The cursor starts BEFORE the first row; next() advances and returns true while rows remain — which is why while (rs.next()) is the universal iteration idiom."
    },
    {
      title: "Bind the parameter",
      prompt: "Fill in the call that safely binds the test email to the first ? placeholder.",
      code: `PreparedStatement pstmt = conn.prepareStatement(
    "SELECT status FROM users WHERE email = ?");
pstmt.___1___(1, "qa.test@example.com");`,
      blanks: [{ label: "typed setter for the first placeholder", answer: ["setString"] }],
      explanation: "setString(1, value) binds the value to placeholder #1 (JDBC parameters are 1-indexed) — transmitted separately from the SQL, so no input can ever be parsed as SQL."
    }
  ]
};
