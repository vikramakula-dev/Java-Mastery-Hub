export const collectionsData = {
  title: "Collections Framework",
  concept: "Architecture to store and manipulate groups of objects.",
  why: "Essential for handling dynamic data, like multiple elements.",
  realWorld: "Managing lists of users, mapping IDs to names.",
  seleniumMapping: "List<WebElement> (findElements), Set<String> (window handles).",
  commonMistakes: "Using == instead of .equals(), ConcurrentModificationException.",
  keyPoints: [
    "Hierarchy: Collection interface → List (ordered, duplicates OK), Set (unique), Queue (FIFO). Map is separate — key-value pairs, keys unique.",
    "List: ArrayList (fast random access, backed by array) vs LinkedList (fast insert/delete at ends, backed by nodes). Default to ArrayList.",
    "Set: HashSet (no order, O(1) contains), LinkedHashSet (keeps insertion order), TreeSet (sorted, O(log n)).",
    "Map: HashMap (no order, allows one null key), LinkedHashMap (insertion order), TreeMap (sorted keys), Hashtable/ConcurrentHashMap (thread-safe, no null keys).",
    "HashMap needs correct equals() AND hashCode() on keys — the classic interview follow-up. Equal objects MUST have equal hash codes.",
    "Generics (<String>) give compile-time type safety — no casting, no ClassCastException at runtime.",
    "Modifying a collection while iterating it with for-each throws ConcurrentModificationException — use Iterator.remove() or removeIf().",
    "Selenium mapping to memorize: findElements() returns List<WebElement>; getWindowHandles() returns Set<String>; test data tables map naturally to Map<String,String>."
  ],
  examples: [
    { 
      level: "Beginner", 
      title: "ArrayList", 
      code: `import java.util.*;
List<String> list = new ArrayList<>();
list.add("A"); list.add("B");
System.out.println(list);`, 
      output: "[A, B]",
      explanation: "Dynamic array.",
      selenium: "Storing multiple WebElements.",
      walkthrough: [
        { code: "List<String> list = new ArrayList<>();", note: "Program to the interface: reference type List, concrete type ArrayList. <String> is a generic — only Strings can go in, checked at compile time. The <> (diamond) infers the type." },
        { code: "list.add(\"A\"); list.add(\"B\");", note: "add() appends to the end and grows the backing array automatically — this is what 'dynamic array' means vs. a fixed-size String[]." },
        { code: "System.out.println(list);", note: "Collections override toString(), so printing gives readable [A, B] — order is preserved because List is ordered." }
      ]
    },
    { 
      level: "Beginner", 
      title: "HashSet", 
      code: `Set<String> set = new HashSet<>();
set.add("A"); set.add("A");
System.out.println(set.size());`, 
      output: "1", 
      explanation: "Unordered collection of unique items.", 
      selenium: "Storing unique window handles." 
    },
    { 
      level: "Beginner", 
      title: "HashMap", 
      code: `Map<String, String> map = new HashMap<>();
map.put("user", "admin");
System.out.println(map.get("user"));`, 
      output: "admin",
      explanation: "Key-value pairs.",
      selenium: "Storing test data (Key=ColumnName, Value=Data).",
      walkthrough: [
        { code: "Map<String, String> map = new HashMap<>();", note: "Two generic types: key type, then value type. HashMap gives O(1) average lookup using the key's hashCode()." },
        { code: "map.put(\"user\", \"admin\");", note: "Stores the pair. Putting the same key again REPLACES the old value — keys are unique in a Map." },
        { code: "map.get(\"user\");", note: "Looks up by key. Returns null if the key is absent — a classic NullPointerException source; prefer getOrDefault() when unsure." }
      ]
    },
    { 
      level: "Intermediate", 
      title: "LinkedList", 
      code: `Queue<String> q = new LinkedList<>();
q.offer("First");
System.out.println(q.poll());`, 
      output: "First", 
      explanation: "Doubly-linked list, acts as Queue.", 
      selenium: "Task queues." 
    },
    { 
      level: "Intermediate", 
      title: "TreeSet", 
      code: `Set<Integer> set = new TreeSet<>();
set.add(3); set.add(1);
System.out.println(set);`, 
      output: "[1, 3]", 
      explanation: "Sorted unique elements.", 
      selenium: "Verifying alphabetical sort order of UI elements." 
    },
    { 
      level: "Intermediate", 
      title: "TreeMap", 
      code: `Map<Integer, String> map = new TreeMap<>();
map.put(2, "B"); map.put(1, "A");
System.out.println(map);`, 
      output: "{1=A, 2=B}", 
      explanation: "Sorted keys map.", 
      selenium: "Sorted configuration properties." 
    },
    { 
      level: "Advanced", 
      title: "Iterator", 
      code: `List<String> list = new ArrayList<>(List.of("X", "Y"));
Iterator<String> it = list.iterator();
while(it.hasNext()) System.out.print(it.next());`, 
      output: "XY", 
      explanation: "Safe iteration.", 
      selenium: "Iterating elements dynamically." 
    },
    { 
      level: "Advanced", 
      title: "Collections.sort()", 
      code: `List<Integer> list = Arrays.asList(3, 1, 2);
Collections.sort(list);
System.out.println(list);`, 
      output: "[1, 2, 3]", 
      explanation: "Sorting a list.", 
      selenium: "Sorting fetched UI texts." 
    },
    { 
      level: "Advanced", 
      title: "Java 8 Streams", 
      code: `List<String> list = Arrays.asList("A", "B");
list.stream().filter(s -> s.equals("A")).forEach(System.out::print);`, 
      output: "A",
      explanation: "Functional operations.",
      selenium: "Filtering visible elements from a list.",
      walkthrough: [
        { code: "list.stream()", note: "Turns the collection into a Stream — a pipeline of operations. The original list is never modified." },
        { code: ".filter(s -> s.equals(\"A\"))", note: "'s -> ...' is a lambda: for each element s, keep it only if the condition is true. filter is lazy — nothing runs yet." },
        { code: ".forEach(System.out::print)", note: "Terminal operation that triggers the pipeline. 'System.out::print' is a method reference, shorthand for s -> System.out.print(s). Selenium: elements.stream().filter(WebElement::isDisplayed).count()." }
      ]
    },
    { 
      level: "Selenium-Oriented", 
      title: "Window Handles (Set)", 
      code: `/* Set<String> handles = driver.getWindowHandles();
for(String h : handles) {
  driver.switchTo().window(h);
} */`, 
      output: "Switched window", 
      explanation: "Using Sets for handles.", 
      selenium: "Multi-window management." 
    }
  ],
  interview: [
    { q: "ArrayList vs LinkedList?", a: "ArrayList is fast for retrieval, LinkedList is fast for insertions/deletions." },
    { q: "You call driver.findElements(By.className(\"row\")) and get back 200 elements, then loop through with 'for (int i = 0; i < list.size(); i++) list.get(i)...'. Is this efficient? What would you change if this were a LinkedList instead of the default ArrayList?", a: "For an ArrayList this is fine — get(i) is O(1) since it's backed by an array. If it were a LinkedList, get(i) is O(n) because it has to walk the chain from the head each time, making the whole loop O(n²) — for a LinkedList you'd use an Iterator or a for-each loop instead, which walks the list once in O(n) total." },
    { q: "A test asserts that a Set<String> of window handles has exactly 3 unique entries, but the underlying data actually had 4 window handles where 2 were accidentally identical strings. Would a HashSet catch this bug or hide it?", a: "A HashSet correctly reports 3 (it silently deduplicates based on equals()/hashCode()) — this isn't 'hiding a bug,' it's Set doing exactly its job. But if your TEST intent was to verify all 4 windows are actually distinct browser windows, using a Set here masks a real problem; you'd want to assert on the raw List size or handle-uniqueness separately from a Set that intentionally collapses duplicates." },
    { q: "You store test results in a HashMap<String, TestResult> keyed by test name, then iterate it to print a summary report — but the print order is different every run, confusing stakeholders reading the report. What's the minimal fix?", a: "Switch to LinkedHashMap, which preserves insertion order while keeping the same O(1) lookup performance — HashMap makes zero guarantees about iteration order, which can even change between JVM versions. If you need alphabetical/sorted order instead of insertion order, TreeMap is the right choice." },
    { q: "Why does 'ConcurrentModificationException' happen when you try to remove elements from a List while iterating it with a for-each loop, and what are two correct ways to fix it?", a: "The for-each loop uses an Iterator internally, and modifying the list's structure directly (not through that iterator) invalidates it, causing a fail-fast check to throw on the next iteration. Fix it with Iterator.remove() (which is structure-aware), or by collecting items to remove into a separate list first and calling list.removeAll(toRemove) after the loop, or with removeIf() which handles this safely in one call." },
    { q: "You need to verify a list of prices scraped from a UI is sorted ascending. Walk through implementing this check using Collections utility methods rather than a manual loop.", a: "One clean approach: List<Double> sorted = new ArrayList<>(prices); Collections.sort(sorted); assertEquals(prices, sorted) — if the original list already equals its sorted copy, it was sorted. This avoids writing manual comparison-loop logic and reuses well-tested library code, which is generally preferred over reinventing sorting-verification logic." },
    { q: "A Map<String, List<String>> stores test data grouped by category (e.g., \"admin\" -> [\"user1\", \"user2\"]). You want to add a new user to the \"admin\" list, but the key might not exist yet. What's the cleanest one-line way to handle both cases (key exists / key doesn't exist)?", a: "map.computeIfAbsent(\"admin\", k -> new ArrayList<>()).add(\"user3\") — this atomically creates an empty list if the key is missing (using the lambda), or returns the existing list if present, then adds to whichever list is returned. The alternative (manual null-check-then-create-then-put) is more verbose and easier to get wrong." },
    { q: "Why might you choose a TreeSet over a HashSet for storing a list of unique product prices you'll need to display low-to-high, even though TreeSet operations are slower (O(log n) vs O(1))?", a: "TreeSet maintains sorted order automatically as elements are added, so displaying low-to-high requires no extra sort step — HashSet would need a separate sort operation every time you wanted ordered output. The tradeoff is worth it when you need frequent sorted access and don't need HashSet's raw insertion speed." },
    { q: "You're asked: 'findElements() returns List<WebElement>, even if only one element matches or zero match — why not have it return a single WebElement or throw an exception on zero matches, like findElement() does?' How do you answer?", a: "Returning a List (empty list on zero matches, rather than throwing) lets you check for element existence without a try/catch — 'if (driver.findElements(By.id(\"x\")).isEmpty())' is a clean existence check, whereas findElement() throwing NoSuchElementException forces exception-based control flow for the same check. It's a deliberate API design choice matching the Collections philosophy: prefer returning an empty collection over null or an exception when 'nothing found' is a valid, expected outcome." },
    { q: "Two tests run in parallel and both modify the same static List<String> sharedResults without synchronization, occasionally throwing ConcurrentModificationException or silently losing entries. What Collections-level fix addresses this directly?", a: "Replace the plain ArrayList with a thread-safe collection like Collections.synchronizedList(new ArrayList<>()) or, better, CopyOnWriteArrayList if reads vastly outnumber writes — plain ArrayList (like most standard collections) is NOT thread-safe and offers no protection against concurrent structural modification from multiple threads." }
  ],
  handsOn: ["Write a method that extracts all link texts into a List, sorts them, and prints them."],
  memoryVis: "Collections store object references in the Heap.",
  challenges: [
    {
      title: "Pick the right collection type",
      prompt: "You need to store window handles where duplicates are impossible and order doesn't matter. Fill in the interface type.",
      code: `___1___<String> handles = driver.getWindowHandles();`,
      blanks: [
        { label: "collection interface guaranteeing uniqueness", answer: "Set" }
      ],
      explanation: "Set forbids duplicates by definition — exactly what window handles need since each handle is unique. List would allow (nonsensical) duplicate handles."
    },
    {
      title: "Complete the HashMap lookup",
      prompt: "Fill in the method that retrieves a value by its key.",
      code: `Map<String, String> map = new HashMap<>();
map.put("user", "admin");
System.out.println(map.___1___("user"));`,
      blanks: [
        { label: "method to retrieve a value by key", answer: "get" }
      ],
      explanation: "get(key) returns the value mapped to that key, or null if the key isn't present. put(key, value) is for writing; get(key) is for reading."
    },
    {
      title: "Complete the Stream filter",
      prompt: "Fill in the missing Stream method that keeps only elements matching a condition.",
      code: `List<String> list = Arrays.asList("A", "B");
list.stream()
    .___1___(s -> s.equals("A"))
    .forEach(System.out::print);`,
      blanks: [
        { label: "Stream method that keeps matching elements", answer: "filter" }
      ],
      explanation: "filter() takes a lambda returning true/false and keeps only elements where it's true. It's lazy — nothing runs until a terminal operation like forEach() triggers the pipeline."
    }
  ]
};
