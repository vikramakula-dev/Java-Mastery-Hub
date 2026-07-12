export const stringsData = {
  title: "Strings",
  concept: "Strings are objects that represent sequences of characters.",
  why: "Used everywhere in Java for text manipulation.",
  realWorld: "A sequence of letters like a word or sentence in a book.",
  seleniumMapping: "Validating text on web elements (e.g., driver.findElement(...).getText().equals(\"Expected\")).",
  commonMistakes: [
    "Using == instead of .equals() to compare strings.",
    "Concatenating strings in a loop instead of using StringBuilder, which can cause performance issues."
  ],
  keyPoints: [
    "Strings are IMMUTABLE — every 'modification' (concat, replace, toUpperCase) creates a NEW object; the original never changes.",
    "String literals go into the String Pool (one shared copy); 'new String(\"a\")' forces a separate heap object. That's why == can be false while .equals() is true.",
    "== compares references (same object?); .equals() compares content. Always compare strings with .equals() or .equalsIgnoreCase().",
    "StringBuilder is mutable and fast for building strings in loops; StringBuffer is the same but synchronized (thread-safe, slower).",
    "Know these methods cold: length(), charAt(), substring(), indexOf(), split(), trim(), contains(), replace(), toLowerCase().",
    "Selenium returns Strings everywhere: getText(), getAttribute(), getCurrentUrl(), getTitle() — assertions on them are string comparisons, so .equals()/.contains() matter daily."
  ],
  examples: [
    { level: "Beginner", title: "String Literal vs new String()", code: "String s1 = \"Hello\";\nString s2 = new String(\"Hello\");\nSystem.out.println(s1 == s2);\nSystem.out.println(s1.equals(s2));", output: "false\ntrue", explanation: "s1 uses the String pool, s2 creates a new object in the heap memory.", selenium: "This is exactly why assertions on getText() must use .equals(), never ==.",
      walkthrough: [
        { code: "String s1 = \"Hello\";", note: "A literal goes into the String Constant Pool — a shared region where identical literals are stored ONCE. A second literal \"Hello\" elsewhere would reuse this exact object." },
        { code: "String s2 = new String(\"Hello\");", note: "'new' FORCES a fresh object on the general heap, bypassing the pool — same characters, different object. This is why 'new String(...)' is almost never what you want in real code." },
        { code: "System.out.println(s1 == s2);", note: "== compares REFERENCES (are these the same object?). Pool object vs heap object → false, despite identical content. Strings returned by getText() behave like s2 — never pool-shared." },
        { code: "System.out.println(s1.equals(s2));", note: "equals() compares CONTENT character by character → true. The rule that falls out: == asks 'same object?', equals() asks 'same text?' — assertions always want the second question." }
      ]
    },
    { level: "Beginner", title: "String Length", code: "String s = \"Java\";\nSystem.out.println(s.length());", output: "4", explanation: "Returns the number of characters in the string.", selenium: "" },
    { level: "Beginner", title: "String Concatenation", code: "String s1 = \"Hello\";\nString s2 = \" World\";\nSystem.out.println(s1 + s2);", output: "Hello World", explanation: "Concatenates two strings using the + operator.", selenium: "" },
    { level: "Intermediate", title: "String equals()", code: "String s1 = \"Java\";\nString s2 = \"Java\";\nSystem.out.println(s1.equals(s2));", output: "true", explanation: "Compares the actual content of the strings, not the memory reference.", selenium: "Used to verify if the actual text of an element matches expected text." },
    { level: "Intermediate", title: "String equalsIgnoreCase()", code: "String s1 = \"Java\";\nString s2 = \"java\";\nSystem.out.println(s1.equalsIgnoreCase(s2));", output: "true", explanation: "Compares content ignoring case differences.", selenium: "Useful for validation when casing might change." },
    { level: "Intermediate", title: "String contains()", code: "String s = \"Selenium WebDriver\";\nSystem.out.println(s.contains(\"Web\"));", output: "true", explanation: "Checks if a substring exists within the string.", selenium: "Used to check if a page title contains a specific keyword." },
    { level: "Intermediate", title: "String substring()", code: "String s = \"Selenium WebDriver\";\nSystem.out.println(s.substring(9));\nSystem.out.println(s.substring(0, 8));", output: "WebDriver\nSelenium", explanation: "Extracts a part of the string starting from the specified index.", selenium: "" },
    { level: "Advanced", title: "String split()", code: "String s = \"apple,banana,orange\";\nString[] fruits = s.split(\",\");\nSystem.out.println(fruits[1]);", output: "banana", explanation: "Splits a string into an array of strings based on a delimiter.", selenium: "" },
    { level: "Advanced", title: "String replace()", code: "String s = \"I love Java\";\nSystem.out.println(s.replace(\"Java\", \"Selenium\"));", output: "I love Selenium", explanation: "Replaces occurrences of a target string with a replacement string.", selenium: "" },
    { level: "Advanced", title: "String format()", code: "String name = \"John\";\nint age = 30;\nString formatted = String.format(\"My name is %s and I am %d years old.\", name, age);\nSystem.out.println(formatted);", output: "My name is John and I am 30 years old.", explanation: "Creates a formatted string using placeholders.", selenium: "" },
    { level: "Selenium-Oriented", title: "Extracting dynamic numbers", code: "String text = \"Showing 1 to 10 of 500 entries\";\nString totalStr = text.split(\"of\")[1].replace(\"entries\", \"\").trim();\nint total = Integer.parseInt(totalStr);\nSystem.out.println(total);", output: "500", explanation: "Common pattern to extract total numbers from a pagination text.", selenium: "Extracting specific numbers from web element text to perform assertions.",
      walkthrough: [
        { code: "text.split(\"of\")", note: "Splits into [\"Showing 1 to 10 \", \" 500 entries\"] — index [1] grabs everything AFTER 'of'. split() takes a regex, so splitting on '.' or '|' would need escaping (\\\\., \\\\|) — a classic gotcha." },
        { code: ".replace(\"entries\", \"\").trim()", note: "Two-step cleanup: remove the trailing word, then trim() strips the surrounding spaces. Order matters less here, but skipping trim() leaves \" 500 \" and the parse below throws NumberFormatException — invisible whitespace is the #1 cause of 'but it looks right!' parse failures." },
        { code: "Integer.parseInt(totalStr)", note: "Only NOW is the string pure digits and safe to parse. The full pattern — locate, strip, trim, parse — is the standard recipe for every number you'll ever pull out of UI text." }
      ]
    },
    { level: "Selenium-Oriented", title: "Trimming whitespace", code: "String text = \"  Login Successful   \";\nSystem.out.println(text.trim());", output: "Login Successful", explanation: "Removes leading and trailing whitespaces.", selenium: "Cleaning up text retrieved from getText() before asserting, to avoid failures due to invisible spaces." }
  ],
  interview: [
    { q: "String vs StringBuilder vs StringBuffer?", a: "String is immutable. StringBuilder is mutable and not thread-safe (faster). StringBuffer is mutable and thread-safe (slower)." },
    { q: "What is String Constant Pool?", a: "A special memory region in the heap where Java stores literal string values to optimize memory." },
    { q: "An assertion 'Assert.assertTrue(actualText == expectedText)' passes in one test run and fails in another with the exact same visible text on screen. What's going on?", a: "== compares object references, not content — if actualText came from element.getText() (a new String object from the heap, not the pool) while expectedText is a literal, they can have identical characters but different references, so == is unreliable for content comparison. The fix is always .equals() or .equalsIgnoreCase() for string comparisons in assertions." },
    { q: "Your test builds a large HTML report by concatenating hundreds of strings with '+' inside a loop, and the test suite becomes noticeably slower as more tests run. What's the root cause and the fix?", a: "Because Strings are immutable, every '+' concatenation in the loop creates an entirely new String object and discards the old one, so N concatenations create roughly N intermediate objects — O(n²) work for building an n-character result. StringBuilder mutates one internal buffer instead, making it O(n) — always use StringBuilder for concatenation inside loops." },
    { q: "You extract a price from the page with getText(), like '$1,234.99', and need to convert it to a double for a calculation. Walk through the String methods you'd chain to make that safe.", a: "First strip non-numeric formatting: replace(\"$\", \"\").replace(\",\", \"\") to get \"1234.99\", then trim() to remove any stray whitespace, then Double.parseDouble(...) to convert. Skipping the cleanup step causes NumberFormatException at the parse call, which is a very common real Selenium bug." },
    { q: "Why does 'new String(\"Chrome\") == \"Chrome\"' evaluate to false, but 'new String(\"Chrome\").equals(\"Chrome\")' evaluate to true?", a: "The literal \"Chrome\" lives in the String Constant Pool (one shared object), but 'new String(...)' explicitly forces creation of a separate object on the heap outside the pool — so == (reference comparison) sees two different objects and returns false. .equals() compares character content, which is identical, so it returns true. This is the canonical == vs .equals() trap question." },
    { q: "You need to check if a dynamically generated element ID like 'submit_48291' matches the pattern 'submit_<number>' without knowing the number in advance. Which String/related approach handles this cleanly?", a: "matches() with a regex like \"submit_\\\\d+\", or more simply startsWith(\"submit_\") if you don't need to validate the suffix is purely numeric. For locator strategies this maps directly to XPath's starts-with() or CSS's [id^='submit_'] attribute selectors covered in the Locators interview track." },
    { q: "A test does 'if (pageTitle.toLowerCase() == \"dashboard\")' and it never evaluates true even when the title is visibly 'Dashboard'. Name both bugs in this line.", a: "Two separate bugs: (1) == should be .equals() since string comparison needs content equality, not reference equality, and (2) toLowerCase() converts to lowercase but the literal being compared is \"dashboard\" — that part is actually fine, but combined with == it still fails. Corrected: pageTitle.equalsIgnoreCase(\"dashboard\") is the idiomatic one-line fix for both issues." },
    { q: "Why is String immutability actually a useful property for multi-threaded Selenium test execution, rather than just a performance quirk?", a: "Immutable objects are inherently thread-safe — since a String's internal character data can never change after creation, multiple threads can read and share the same String (like a base URL constant) without any synchronization or risk of one thread seeing a partially-modified value. This matters directly in parallel test execution where config strings are read by many threads simultaneously." },
    { q: "You split a comma-separated string of test data 'admin,manager,,viewer' using split(\",\") and expect 4 elements but sometimes get fewer. What's happening?", a: "split(\",\") on a string with a trailing empty segment can drop trailing empty strings by default (Java's split() removes trailing empty strings unless you pass a negative limit), and consecutive delimiters like the double comma here do produce an empty-string element in the middle, which is correctly kept — the trailing-drop behavior is the surprising part interviewers probe for." }
  ],
  handsOn: [
    "Write a method to reverse a string without using built-in reverse methods.",
    "Write a program to check if a string is a palindrome."
  ],
  memoryVis: "Strings are placed in a special memory pool called the String Constant Pool. If a string is created using `new`, it is placed in the general heap space.",
  challenges: [
    {
      title: "Fix the unreliable comparison",
      prompt: "This assertion is unreliable for comparing text scraped from a page. Fill in the correct method call.",
      code: `String actual = element.getText();
if (actual.___1___("Login Successful")) {
    System.out.println("Match");
}`,
      blanks: [
        { label: "correct String comparison method", answer: [".equals", "equals"] }
      ],
      explanation: "== compares object references and is unreliable for Strings not guaranteed to be pool-cached (like getText() results); .equals() compares actual character content, which is what an assertion needs."
    },
    {
      title: "Complete the efficient loop concatenation",
      prompt: "Fill in the class that should be used instead of repeated String '+' concatenation inside a loop.",
      code: `___1___ sb = new ___1___();
for (String name : names) {
    sb.append(name).append(", ");
}
System.out.println(sb.toString());`,
      blanks: [
        { label: "mutable string-building class", answer: "StringBuilder" }
      ],
      explanation: "Strings are immutable, so '+' in a loop creates a new object every iteration (O(n²) total work). StringBuilder mutates one internal buffer instead, making it O(n)."
    },
    {
      title: "Clean scraped price text before parsing",
      prompt: "Fill in the missing method call that strips the dollar sign before Double.parseDouble() runs.",
      code: `String priceText = "$49.99";
String cleaned = priceText.___1___("$", "");
double price = Double.parseDouble(cleaned);`,
      blanks: [
        { label: "method that swaps one substring for another", answer: "replace" }
      ],
      explanation: "replace(\"$\", \"\") removes the currency symbol so parseDouble() receives a pure numeric string — skipping this step throws NumberFormatException."
    }
  ]
};
