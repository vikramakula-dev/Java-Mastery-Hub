export const swingData = {
  title: "Java Swing",
  concept: "Lightweight GUI toolkit built on top of AWT.",
  why: "Creating custom QA tools, test runner interfaces.",
  realWorld: "Data generation tools for manual testers.",
  seleniumMapping: "Building custom execution dashboards.",
  commonMistakes: "Updating GUI outside the Event Dispatch Thread (EDT).",
  keyPoints: [
    "Swing is single-threaded by design: ALL component updates must happen on the Event Dispatch Thread (EDT). Touching a JLabel from another thread 'usually works' — until it corrupts rendering intermittently in production.",
    "Long work (like launching a Selenium suite from a button click) must NOT run on the EDT — it freezes the whole UI until done. Run it on a background thread.",
    "SwingWorker is the purpose-built bridge: doInBackground() runs off the EDT, done()/process() are automatically called back ON the EDT — no manual thread juggling.",
    "SwingUtilities.invokeLater(() -> label.setText(...)) is the manual way to hop back onto the EDT from any thread.",
    "Swing components are 'lightweight' — pure Java objects on the heap, garbage-collected normally, no native handles to dispose (unlike AWT peers).",
    "QA relevance: Swing is how you build internal test-launcher dashboards — a dropdown of suites + Run button + live progress — for teammates who don't use the command line."
  ],
  examples: [
    { 
      level: "Beginner", 
      title: "JFrame", 
      code: `import javax.swing.*;
JFrame f = new JFrame("App");
f.setSize(300, 300);
f.setVisible(true);`, 
      output: "Window appears", 
      explanation: "Basic Swing window.", 
      selenium: "Custom tool creation." 
    },
    { 
      level: "Beginner", 
      title: "JButton & Action", 
      code: `/* JButton b = new JButton("Run Test");
b.addActionListener(e -> System.out.println("Running...")); */`, 
      output: "Running...", 
      explanation: "Handling button clicks.", 
      selenium: "Triggering a test suite." 
    },
    { 
      level: "Intermediate", 
      title: "JTextField", 
      code: `/* JTextField tf = new JTextField("Enter URL");
f.add(tf); */`, 
      output: "Input field", 
      explanation: "Text input box.", 
      selenium: "Accepting environment URL." 
    },
    { 
      level: "Intermediate", 
      title: "JOptionPane", 
      code: `JOptionPane.showMessageDialog(null, "Test Passed!");`, 
      output: "Alert Box", 
      explanation: "Simple dialog popup.", 
      selenium: "Notifying tester of completion." 
    },
    { 
      level: "Intermediate", 
      title: "JComboBox", 
      code: `/* String[] envs = {"QA", "STAGING"};
JComboBox<String> cb = new JComboBox<>(envs); */`, 
      output: "Dropdown", 
      explanation: "Select from options.", 
      selenium: "Environment selection." 
    },
    { 
      level: "Advanced", 
      title: "JTable", 
      code: `/* String[][] data = { {"Test1", "Pass"} };
String[] cols = {"Test", "Status"};
JTable t = new JTable(data, cols); */`, 
      output: "Data Grid", 
      explanation: "Displaying tabular data.", 
      selenium: "Showing test results." 
    },
    { 
      level: "Advanced", 
      title: "JProgressBar", 
      code: `/* JProgressBar pb = new JProgressBar(0, 100);
pb.setValue(50); */`, 
      output: "Progress 50%", 
      explanation: "Visual progress indicator.", 
      selenium: "Showing suite execution progress." 
    },
    { 
      level: "Advanced", 
      title: "GridLayout", 
      code: `/* f.setLayout(new java.awt.GridLayout(2, 2)); */`, 
      output: "Grid UI", 
      explanation: "Organizing components.", 
      selenium: "Structuring custom forms." 
    },
    { 
      level: "Selenium-Oriented", 
      title: "SwingWorker", 
      code: `/* SwingWorker<Void, Void> worker = new SwingWorker<>() {
  protected Void doInBackground() { // Run Selenium here
    return null;
  }
}; worker.execute(); */`, 
      output: "Async execution", 
      explanation: "Running heavy tasks off the EDT.", 
      selenium: "Keeping UI responsive during test run." 
    },
    { 
      level: "Selenium-Oriented", 
      title: "Simple Test Runner", 
      code: `/* JButton btn = new JButton("Run WebDriver");
btn.addActionListener(e -> new Thread(() -> {
  // WebDriver code
}).start()); */`, 
      output: "WebDriver starts", 
      explanation: "Triggering tests via UI.", 
      selenium: "Building executable jars for manual QA." 
    }
  ],
  interview: [
    { q: "What is the EDT in Swing?", a: "Event Dispatch Thread, where all GUI updates must happen." },
    { q: "You build a small internal Swing dashboard that lets QA engineers pick a test suite from a dropdown and click 'Run,' which internally kicks off a long Selenium test run. If you call the Selenium run directly inside the button's ActionListener, what breaks?", a: "The button's click handler runs on the Event Dispatch Thread (EDT), and a long-running Selenium suite would block the EDT for the whole duration — freezing the entire UI (no repaints, no other button clicks) until it finishes. The fix is running the Selenium suite on a separate background thread (or via SwingWorker) and only touching Swing components back on the EDT when reporting progress/results." },
    { q: "Why does Swing specifically require GUI updates to happen on the EDT, and what actually goes wrong if you update a JLabel's text from a background thread instead?", a: "Swing components aren't thread-safe by design — concurrent access from multiple threads can corrupt internal component state or cause unpredictable rendering glitches, race conditions, or exceptions that are hard to reproduce. Updating a JLabel from a background thread might 'seem to work' most of the time, which makes it a particularly dangerous bug: it can pass testing and then intermittently fail in production." },
    { q: "What Swing utility is specifically designed to run a long background task and safely publish progress/results back to the EDT, and why is it better than manually managing threads yourself?", a: "SwingWorker — its doInBackground() runs off the EDT (safe for long work like a Selenium run), while done() and process() automatically marshal back onto the EDT for you, handling the thread-safety concern correctly without you manually writing SwingUtilities.invokeLater() calls everywhere. It's the purpose-built tool for exactly this 'long task + UI update' pattern." },
    { q: "You're asked to justify why a QA team would build a small Swing 'test launcher' app internally instead of just using command-line Maven/Gradle commands. What's a legitimate answer?", a: "A GUI launcher can lower the barrier for less technical stakeholders (manual QA, product managers) to trigger specific test suites, view real-time pass/fail status, and see recent run history without needing to know CLI flags or navigate a terminal — it trades a bit of engineering effort for accessibility to non-engineers, which can be a genuine ROI win depending on team composition." },
    { q: "If a Swing dashboard needs to display live progress ('Test 15 of 50 running...') while Selenium tests execute in the background, what specific mechanism keeps the UI responsive during that update?", a: "The background thread (or SwingWorker) computes/tracks progress, but the actual UI update (setting a JProgressBar's value or a JLabel's text) must be dispatched onto the EDT — typically via SwingWorker's publish()/process() methods or SwingUtilities.invokeLater(() -> label.setText(...)) — ensuring the EDT stays free to keep repainting and responding to other interactions between updates." },
    { q: "Why is 'lightweight, JVM-heap-managed' (as noted in this module's Mental Model) a meaningful distinction between Swing and native OS UI toolkits when thinking about resource usage?", a: "Swing components are pure Java objects rendered by Java itself (not delegated to native OS widgets), so they live entirely on the JVM heap and are garbage collected like any other object — no native handles to leak or explicitly dispose of, unlike some AWT components that do wrap native peers. This makes Swing's memory behavior more predictable and GC-friendly for a long-running internal tool." }
  ],
  handsOn: ["Build a Swing app that takes a URL and opens it in Chrome using WebDriver."],
  memoryVis: "Swing components are lightweight and managed entirely by JVM heap.",
  challenges: [
    {
      title: "Keep long work off the EDT",
      prompt: "Fill in the Swing utility class purpose-built for running a long background task and safely reporting back to the UI thread.",
      code: `___1___<Void, String> worker = new ___1___<Void, String>() {
    protected Void doInBackground() { runSeleniumSuite(); return null; }
};
worker.execute();`,
      blanks: [
        { label: "utility class for background work + safe UI updates", answer: "SwingWorker" }
      ],
      explanation: "SwingWorker runs doInBackground() off the Event Dispatch Thread (safe for long work like a Selenium run) while safely marshaling any UI updates back onto the EDT for you."
    },
    {
      title: "Name the thread all UI updates must run on",
      prompt: "Fill in the name of the single thread responsible for all Swing rendering and event handling.",
      code: `// All JLabel/JButton updates must happen on the ___1___
// Doing it from a background thread risks corrupted rendering`,
      blanks: [
        { label: "the thread Swing requires for UI updates", answer: ["Event Dispatch Thread", "EDT"] }
      ],
      explanation: "Swing components aren't thread-safe — the Event Dispatch Thread (EDT) is the one thread allowed to touch them, which is why long-running work must happen elsewhere and report back via SwingWorker or SwingUtilities.invokeLater()."
    }
  ]
};
