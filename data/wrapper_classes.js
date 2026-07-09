export const wrapperClassesData = {
  title: "Wrapper Classes",
  concept: "Classes that provide a way to use primitive data types (int, boolean, etc.) as objects.",
  why: "Many data structures in Java, like ArrayList or HashMap, only work with objects, not primitives.",
  realWorld: "Like putting a raw material (primitive) inside a box (object) so it can be shipped via a delivery service (Collections framework).",
  seleniumMapping: "Converting string values extracted from web elements to numeric types for calculations or assertions.",
  commonMistakes: [
    "NullPointerException when unboxing a null wrapper object to a primitive type.",
    "Using == instead of .equals() when comparing Integer values outside the -128 to 127 caching range."
  ],
  keyPoints: [
    "Each primitive has a wrapper class: int→Integer, char→Character, double→Double, boolean→Boolean, etc. Wrappers are objects — they can be null and can go into collections.",
    "Autoboxing = primitive → wrapper automatically (Integer x = 5); unboxing = wrapper → primitive (int y = x). Unboxing null throws NullPointerException.",
    "Integer caches -128 to 127: inside that range == may be true; outside it, == compares references and fails. Always use .equals().",
    "Parsing strings to numbers is daily Selenium work: Integer.parseInt(element.getText()) to assert on counts, prices, totals.",
    "Collections cannot hold primitives — List<int> won't compile; List<Integer> works because of autoboxing."
  ],
  examples: [
    { level: "Beginner", title: "Autoboxing", code: "Integer obj = 10; // autoboxing\nSystem.out.println(obj);", output: "10", explanation: "Automatic conversion that the Java compiler makes between the primitive types and their corresponding object wrapper classes.", selenium: "" },
    { level: "Beginner", title: "Unboxing", code: "Integer obj = new Integer(10);\nint i = obj; // unboxing\nSystem.out.println(i);", output: "10", explanation: "Automatic conversion of wrapper class to primitive type.", selenium: "" },
    { level: "Intermediate", title: "Parsing Strings to Int", code: "String numStr = \"100\";\nint num = Integer.parseInt(numStr);\nSystem.out.println(num + 50);", output: "150", explanation: "Using wrapper class utility methods to convert strings to primitives.", selenium: "Extracting a number from web UI text and doing math with it." },
    { level: "Intermediate", title: "Parsing Strings to Double", code: "String priceStr = \"99.99\";\ndouble price = Double.parseDouble(priceStr);\nSystem.out.println(price);", output: "99.99", explanation: "Converting string representations of decimals to double primitives.", selenium: "Parsing product prices from an e-commerce site for validation." },
    { level: "Intermediate", title: "Wrapper Class Caching", code: "Integer a = 100;\nInteger b = 100;\nSystem.out.println(a == b);\n\nInteger x = 200;\nInteger y = 200;\nSystem.out.println(x == y);", output: "true\nfalse", explanation: "Integer caches values between -128 and 127. Values outside this range create new objects, so == evaluates to false.", selenium: "" },
    { level: "Intermediate", title: "Converting Primitive to String", code: "int id = 404;\nString idStr = String.valueOf(id);\nSystem.out.println(\"Error ID: \" + idStr);", output: "Error ID: 404", explanation: "Using String.valueOf() is a common way to convert a primitive to a String, often leveraging the wrapper class internally.", selenium: "" },
    { level: "Advanced", title: "Character Utility Methods", code: "char ch = 'A';\nSystem.out.println(Character.isDigit(ch));\nSystem.out.println(Character.isLetter(ch));\nSystem.out.println(Character.toLowerCase(ch));", output: "false\ntrue\na", explanation: "Character wrapper provides static methods for checking or manipulating char properties.", selenium: "" },
    { level: "Advanced", title: "Collections with Wrappers", code: "List<Integer> numbers = new ArrayList<>();\nnumbers.add(10); // Autoboxed\nnumbers.add(20);\nSystem.out.println(numbers);", output: "[10, 20]", explanation: "Generics in Java collections require objects, so wrapper classes are used instead of primitives.", selenium: "" },
    { level: "Advanced", title: "Boolean Parsing", code: "String flag = \"true\";\nboolean b = Boolean.parseBoolean(flag);\nSystem.out.println(b);", output: "true", explanation: "Converts a string to a boolean. Returns true if the string is equal to \"true\" (ignoring case).", selenium: "" },
    { level: "Selenium-Oriented", title: "Validating sorted prices", code: "String p1Str = \"$10.50\".replace(\"$\", \"\");\nString p2Str = \"$15.00\".replace(\"$\", \"\");\ndouble p1 = Double.parseDouble(p1Str);\ndouble p2 = Double.parseDouble(p2Str);\nSystem.out.println(p1 <= p2);", output: "true", explanation: "Converting UI strings to doubles to logically verify if items are sorted by price.", selenium: "Verifying 'Sort by Price: Low to High' functionality." },
    { level: "Selenium-Oriented", title: "Extracting integers for assertions", code: "String resultText = \"You have 5 unread messages.\";\nString countStr = resultText.replaceAll(\"[^0-9]\", \"\");\nint count = Integer.parseInt(countStr);\nSystem.out.println(count > 0);", output: "true", explanation: "Extracting only digits from a string and converting to int.", selenium: "Asserting numeric values present within dynamic text blocks." }
  ],
  interview: [
    { q: "What is autoboxing and unboxing?", a: "Autoboxing is the automatic conversion the compiler makes from primitive to wrapper object. Unboxing is the reverse." },
    { q: "Why use wrapper classes?", a: "To use primitive data types in Java Collections (like ArrayList) and to use utility methods (like Integer.parseInt())." },
    { q: "A test asserts 'Assert.assertEquals(cartCount, 0)' where cartCount is an Integer field that was never explicitly initialized, and it throws NullPointerException instead of failing the assertion normally. Why?", a: "An uninitialized Integer field defaults to null (it's an object, not a primitive), and JUnit/TestNG's assertEquals tries to unbox it for comparison, which throws NullPointerException on unboxing null. This is exactly why the module's key point about 'unboxing null throws NPE' matters in real test code, not just theory." },
    { q: "You extract '1,234' unread messages from a page and Integer.parseInt() throws NumberFormatException. What's wrong and how do you fix it before parsing?", a: "parseInt() can't handle the comma thousands-separator — it expects a pure numeric string. Strip it first: Integer.parseInt(text.replace(\",\", \"\")), which is the same clean-then-parse pattern needed for currency symbols or any non-numeric formatting in scraped text." },
    { q: "Two Integer objects both hold the value 50 and '==' returns true, but two Integer objects both holding 500 return false with '=='. Is this inconsistent behavior a bug?", a: "Not a bug — it's Integer's internal caching of values from -128 to 127 (the IntegerCache), where cached values share the same object reference and == happens to work, but values outside that range create separate objects. This inconsistency is exactly why relying on == for Integer comparison is dangerous — always use .equals() so behavior doesn't silently change based on the value." },
    { q: "You have a method 'void logCount(int count)' and also overload it as 'void logCount(Integer count)'. If you call logCount(5), which one runs, and why does it matter?", a: "The primitive overload logCount(int) runs — Java prefers exact-match primitive widening over autoboxing when resolving overloads. This matters because if you intended the Integer overload (perhaps to handle a possible null), autoboxing won't kick in until no primitive-compatible overload exists, which can create subtle 'wrong method ran' bugs." },
    { q: "A List<Integer> is used to store row counts scraped from multiple pages, and one page's element wasn't found so a null got added, and later a sum-via-stream throws NullPointerException. Where does the fix belong?", a: "The fix belongs where the null enters the list — either skip adding null when scraping fails, or filter it out before summing: list.stream().filter(Objects::nonNull).mapToInt(Integer::intValue).sum(). Silently allowing null into a numeric collection just delays the crash to a less obvious location." },
    { q: "Why does Character.isDigit(), Character.isLetter(), and similar utility methods matter for validating scraped UI text, versus just using regex everywhere?", a: "For single-character checks, Character utility methods are clearer and faster than compiling a regex pattern — e.g., validating that a password field's first character isn't a digit is a simple Character.isDigit(str.charAt(0)) rather than a regex call. Regex is better suited to whole-string pattern validation, not single-character checks." },
    { q: "What happens if you try to put a raw 'int' into a 'List<Integer>', and what's actually happening behind the scenes when it appears to 'just work'?", a: "You can't declare List<int> at all (generics require reference types), but writing list.add(5) with a List<Integer> compiles because the compiler automatically autoboxes the int literal into an Integer before inserting it — this is invisible autoboxing, not the collection somehow accepting primitives directly." },
    { q: "In a data-driven test, a CSV column 'isActive' contains the text 'TRUE' (uppercase) and Boolean.parseBoolean(\"TRUE\") is used to convert it. Does this work, and would 'Boolean.parseBoolean(\"yes\")' also work?", a: "Boolean.parseBoolean(\"TRUE\") returns true — it's case-insensitive for the literal word 'true' in any casing. But parseBoolean(\"yes\") returns false, not an error — parseBoolean never throws, it just returns false for anything that isn't a case-insensitive match of 'true', which is a common silent-bug source if your test data uses yes/no instead of true/false." }
  ],
  handsOn: [
    "Write a program that takes a mixed alphanumeric string and extracts only the numbers, summing them up.",
    "Demonstrate the Integer cache by writing code that outputs true for one comparison and false for another using ==."
  ],
  memoryVis: "Primitive types live on the stack or inline in objects. Wrapper objects live on the heap. Autoboxing creates a new object on the heap (or references a cached one) to hold the primitive value.",
  challenges: [
    {
      title: "Convert scraped text to a number",
      prompt: "Fill in the wrapper class method that converts a numeric String into an int.",
      code: `String countText = "42";
int count = ___1___.parseInt(countText);`,
      blanks: [
        { label: "wrapper class for int", answer: "Integer" }
      ],
      explanation: "Integer.parseInt(String) is the standard way to convert a numeric string (like scraped UI text) into a primitive int for calculations or assertions."
    },
    {
      title: "Fix the collection type declaration",
      prompt: "This line won't compile because generics can't hold primitives. Fill in the correct type.",
      code: `List<___1___> counts = new ArrayList<>();
counts.add(10); // autoboxed`,
      blanks: [
        { label: "wrapper type usable in generics", answer: "Integer" }
      ],
      explanation: "Generics require reference types — List<int> doesn't compile. List<Integer> works because the compiler autoboxes the int literal into an Integer automatically when you call add(10)."
    },
    {
      title: "Fix the unreliable Integer comparison",
      prompt: "This comparison is unreliable outside the -128 to 127 cache range. Fill in the safe alternative.",
      code: `Integer a = 500;
Integer b = 500;
System.out.println(a.___1___(b));`,
      blanks: [
        { label: "safe content-comparison method", answer: [".equals", "equals"] }
      ],
      explanation: "Integer caches values from -128 to 127, so == is unreliable outside that range (500 vs 500 would be two different objects). .equals() always compares the actual numeric value correctly."
    }
  ]
};
