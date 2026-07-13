export const codingProblemsData = {
  title: "Coding Problems",
  concept: "The classic live-coding problems asked in SDET interviews — string manipulation, arrays, and collections logic — each solved the way an interviewer wants to see it: a working solution first, then the optimization conversation.",
  why: "Nearly every Selenium/SDET interview has a live-coding round, and it filters out more candidates than any framework question. Knowing Java isn't enough — you need these specific patterns rehearsed until writing them under pressure is automatic.",
  realWorld: "Like a driving test: you've driven for years, but the examiner wants parallel parking, hill start, and three-point turn — specific maneuvers, performed on demand, while being watched.",
  seleniumMapping: "These aren't academic: reversing/parsing strings is scraped-text handling, HashMap counting is duplicate-detection in table data, and array logic is what you do with getText() results from findElements().",
  commonMistakes: [
    "Jumping straight to code without restating the problem and confirming edge cases (empty string, single element, nulls) — interviewers grade the approach, not just the result.",
    "Using the built-in when the interviewer said not to — 'reverse a string' means WITHOUT StringBuilder.reverse(); mention the built-in exists, then write the manual loop.",
    "Ignoring complexity: always be ready to state the time/space cost of your solution and whether a HashMap trades memory for speed."
  ],
  keyPoints: [
    "The interview protocol: restate the problem → ask about edge cases → talk through the approach BEFORE coding → code while narrating → test out loud with a sample input. Silence is the enemy.",
    "The three workhorse patterns behind 80% of these problems: two-pointer sweeps (reverse, palindrome), HashMap counting (duplicates, anagrams, frequency), and single-pass tracking variables (max/second-max, sums).",
    "String problems: remember charAt(i), toCharArray(), and that Strings are immutable — build results with StringBuilder, never += in a loop.",
    "HashMap counting idiom to memorize: map.put(ch, map.getOrDefault(ch, 0) + 1) — it appears in duplicates, anagrams, and frequency problems verbatim.",
    "LinkedHashSet = uniqueness + insertion order in one line — the elegant answer to 'remove duplicates preserving order'.",
    "Know both solutions when they exist: brute force O(n²) then optimized O(n) — interviewers often WANT the naive one first to see you can reason about improving it.",
    "Always state complexity unprompted: 'this is O(n) time, O(1) space' scores points even when the code is simple.",
    "When told 'no built-ins', name the built-in anyway ('normally I'd use Collections.sort here') — it shows you know the ecosystem AND can work without it."
  ],
  examples: [
    {
      level: "Beginner",
      title: "Reverse a String (no built-ins)",
      code: `public class ReverseString {
    public static String reverse(String input) {
        char[] chars = input.toCharArray();
        int left = 0, right = chars.length - 1;
        while (left < right) {
            char temp = chars[left];
            chars[left] = chars[right];
            chars[right] = temp;
            left++;
            right--;
        }
        return new String(chars);
    }

    public static void main(String[] args) {
        System.out.println(reverse("Selenium"));
    }
}`,
      output: "muineleS",
      explanation: "The two-pointer swap: walk inward from both ends, swapping as you go — O(n) time, O(n) space for the char array, no StringBuilder.reverse() needed.",
      selenium: "The #1 most-asked SDET warm-up question. Mention that new StringBuilder(input).reverse().toString() exists — then write this.",
      walkthrough: [
        { code: "char[] chars = input.toCharArray();", note: "Strings are immutable — you cannot swap characters inside one. Converting to a char array gives a mutable copy to work on. This one line answers the interviewer's follow-up 'why not swap in the String directly?'" },
        { code: "int left = 0, right = chars.length - 1;", note: "The two-pointer setup: one index at each end, walking toward each other. This pattern also solves palindrome checks and array reversal — learn it once, use it three times." },
        { code: "while (left < right) {", note: "Strictly less-than: when the pointers meet (odd length) the middle character needs no swap; when they cross (even length) everything is already swapped. Off-by-one safe by construction." },
        { code: "char temp = chars[left]; ...", note: "The classic three-step swap with a temp variable. Narrate it out loud in the interview — silent typing loses points even when correct." }
      ]
    },
    {
      level: "Beginner",
      title: "Palindrome Check",
      code: `public class Palindrome {
    public static boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("madam"));
        System.out.println(isPalindrome("selenium"));
    }
}`,
      output: "true\nfalse",
      explanation: "Same two-pointer pattern as reversal, but comparing instead of swapping — and returning early on the first mismatch.",
      selenium: "The standard follow-up to string reversal. The early return shows the interviewer you think about efficiency: why keep checking after a mismatch?",
      walkthrough: [
        { code: "if (s.charAt(left) != s.charAt(right)) return false;", note: "Early exit on FIRST mismatch — no reason to scan the rest. charAt(i) reads a character without any array copy, so this version is O(1) space, better than the toCharArray approach for read-only problems." },
        { code: "return true;", note: "Only reachable when every pair matched. Edge cases to mention unprompted: empty string and single character are both palindromes (the loop body never runs) — naming those before the interviewer asks is exactly what 'thinks about edge cases' looks like." }
      ]
    },
    {
      level: "Beginner",
      title: "Count Character Occurrences",
      code: `import java.util.*;

public class CharCount {
    public static void main(String[] args) {
        String input = "selenium";
        Map<Character, Integer> counts = new LinkedHashMap<>();

        for (char ch : input.toCharArray()) {
            counts.put(ch, counts.getOrDefault(ch, 0) + 1);
        }
        System.out.println(counts);
    }
}`,
      output: "{s=1, e=3, l=1, n=1, i=1, u=1, m=1}",
      explanation: "The HashMap counting idiom — one pass, getOrDefault handles both 'first time seen' and 'seen before' without an if/else.",
      selenium: "The same idiom counts duplicate row values scraped from a table, or how many times each error message appears in a result list.",
      walkthrough: [
        { code: "Map<Character, Integer> counts = new LinkedHashMap<>();", note: "LinkedHashMap keeps first-seen order, so the printed result follows the input string — nicer to demo. Plain HashMap works but prints in arbitrary order; saying WHY you chose Linked shows intent." },
        { code: "counts.put(ch, counts.getOrDefault(ch, 0) + 1);", note: "THE line to memorize: if ch is absent, getOrDefault supplies 0, so first-sight stores 1; if present, it increments. Replaces four lines of if-containsKey-else. This exact idiom reappears in the anagram and duplicate problems." },
        { code: "for (char ch : input.toCharArray())", note: "Single pass = O(n) time. If asked for only the FIRST non-repeating character afterward: do this counting pass, then a second scan returning the first char whose count is 1 — a very common extension question." }
      ]
    },
    {
      level: "Intermediate",
      title: "Find Duplicates in an Array",
      code: `import java.util.*;

public class FindDuplicates {
    public static void main(String[] args) {
        String[] users = {"admin", "guest", "admin", "qa", "guest"};

        Set<String> seen = new HashSet<>();
        Set<String> duplicates = new LinkedHashSet<>();

        for (String u : users) {
            if (!seen.add(u)) {
                duplicates.add(u);
            }
        }
        System.out.println(duplicates);
    }
}`,
      output: "[admin, guest]",
      explanation: "Exploits Set.add()'s return value: false means 'already there' — detection and tracking in a single O(n) pass.",
      selenium: "Directly applicable: collect getText() from every table row into this loop to verify a grid has no duplicate entries.",
      walkthrough: [
        { code: "if (!seen.add(u)) {", note: "The trick the interviewer is fishing for: add() returns FALSE when the element already exists. One call both inserts and answers 'have I seen this?' — no separate contains() check, no second lookup." },
        { code: "Set<String> duplicates = new LinkedHashSet<>();", note: "A Set for results too — 'admin' appearing 3 times should list once. LinkedHashSet preserves the order duplicates were discovered. Mention the brute-force alternative (nested loops, O(n²)) and why this O(n) version beats it." }
      ]
    },
    {
      level: "Intermediate",
      title: "Anagram Check",
      code: `import java.util.*;

public class Anagram {
    public static boolean isAnagram(String a, String b) {
        if (a.length() != b.length()) return false;
        char[] ca = a.toCharArray();
        char[] cb = b.toCharArray();
        Arrays.sort(ca);
        Arrays.sort(cb);
        return Arrays.equals(ca, cb);
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent"));
        System.out.println(isAnagram("hello", "world"));
    }
}`,
      output: "true\nfalse",
      explanation: "Sort both, compare: anagrams become identical when sorted. O(n log n) — the HashMap counting version is the O(n) follow-up.",
      selenium: "A favorite second-round question. Give this version first for clarity, then offer the counting version when asked to optimize.",
      walkthrough: [
        { code: "if (a.length() != b.length()) return false;", note: "The free early exit — different lengths can never be anagrams. Skipping this cheap guard is a silent point deduction in most rubrics." },
        { code: "Arrays.sort(ca); Arrays.sort(cb); return Arrays.equals(ca, cb);", note: "Sorted anagrams are equal, character for character. When the interviewer says 'can you do better than O(n log n)?' — count characters of A up in a HashMap, count B down, verify all zeros: O(n) time. Having both answers ready IS the test." }
      ]
    },
    {
      level: "Intermediate",
      title: "Second Largest Element",
      code: `public class SecondLargest {
    public static void main(String[] args) {
        int[] prices = {45, 12, 89, 67, 89, 34};

        int largest = Integer.MIN_VALUE;
        int second = Integer.MIN_VALUE;

        for (int p : prices) {
            if (p > largest) {
                second = largest;
                largest = p;
            } else if (p > second && p < largest) {
                second = p;
            }
        }
        System.out.println("Largest: " + largest + ", Second: " + second);
    }
}`,
      output: "Largest: 89, Second: 67",
      explanation: "Single pass with two tracking variables — no sorting. Note the p < largest guard: duplicate 89s must not make second-largest also 89.",
      selenium: "The array-logic staple. Real-world twin: verifying the second-highest price in a sorted product grid actually belongs there.",
      walkthrough: [
        { code: "int largest = Integer.MIN_VALUE; int second = Integer.MIN_VALUE;", note: "Seeding with MIN_VALUE (not 0, not arr[0]) handles negative numbers and keeps initialization honest. If asked 'what if the array has fewer than 2 elements?' — check length up front and say what you'd return; asking that question yourself is even better." },
        { code: "if (p > largest) { second = largest; largest = p; }", note: "New champion found: the OLD champion becomes second. Assign second BEFORE overwriting largest — reversing those two lines is the classic bug interviewers watch for." },
        { code: "else if (p > second && p < largest)", note: "The && p < largest guard makes duplicates of the maximum not count as second-largest ({89, 89} → second stays 67). Whether duplicates should count IS the edge case to raise — clarifying it out loud is worth more than either answer." }
      ]
    },
    {
      level: "Intermediate",
      title: "Remove Duplicates, Preserve Order",
      code: `import java.util.*;

public class RemoveDuplicates {
    public static void main(String[] args) {
        List<String> tabs = Arrays.asList("Home", "Cart", "Home", "Login", "Cart");

        List<String> unique = new ArrayList<>(new LinkedHashSet<>(tabs));

        System.out.println(unique);
    }
}`,
      output: "[Home, Cart, Login]",
      explanation: "LinkedHashSet deduplicates while remembering insertion order — wrap and unwrap in one line.",
      selenium: "Deduplicating window handles, link texts, or dropdown options scraped in DOM order — where order carries meaning.",
      walkthrough: [
        { code: "new LinkedHashSet<>(tabs)", note: "The constructor copies the list, silently dropping repeats. LinkedHashSet (not HashSet) is the point: HashSet would scramble order, and 'preserve order' is usually stated in the problem precisely to catch that." },
        { code: "new ArrayList<>(...)", note: "Wrap back to a List because the caller usually needs indexing. Follow-up to expect: 'do it without any Set' — then it's a result list plus contains() check per element, O(n²), and you should SAY it's O(n²) versus this O(n)." }
      ]
    },
    {
      level: "Advanced",
      title: "Fibonacci (iterative, not recursive)",
      code: `public class Fibonacci {
    public static void main(String[] args) {
        int n = 8;
        long a = 0, b = 1;
        StringBuilder series = new StringBuilder("0 1");

        for (int i = 2; i < n; i++) {
            long next = a + b;
            series.append(" ").append(next);
            a = b;
            b = next;
        }
        System.out.println(series);
    }
}`,
      output: "0 1 1 2 3 5 8 13",
      explanation: "Two rolling variables, one pass — O(n) time, O(1) space. The recursive version is the follow-up trap: elegant but exponential without memoization.",
      selenium: "Asked to test loop fluency. The killer answer contrasts this with naive recursion: fib(50) recursively makes ~2^50 calls; this loop makes 50.",
      walkthrough: [
        { code: "long a = 0, b = 1;", note: "The rolling window: only the last two values matter, so store only those — that's the O(1) space claim. long, not int: fib(47) already overflows int, and mentioning overflow unprompted is a strong signal." },
        { code: "long next = a + b; a = b; b = next;", note: "Slide the window forward. Assignment ORDER matters — a must take b's old value before b moves on. If asked for recursion: write it, then immediately note it recomputes subtrees exponentially and offer memoization. That dialogue is the actual test." },
        { code: "StringBuilder series = ...", note: "String += in a loop creates a new String every iteration — StringBuilder is the loop-safe accumulator, echoing the Strings module. Small detail, consistently noticed." }
      ]
    },
    {
      level: "Advanced",
      title: "Count Words + Reverse Word Order",
      code: `public class Words {
    public static void main(String[] args) {
        String sentence = "  Selenium  automates   browsers  ";

        String[] words = sentence.trim().split("\\\\s+");
        System.out.println("Word count: " + words.length);

        StringBuilder reversed = new StringBuilder();
        for (int i = words.length - 1; i >= 0; i--) {
            reversed.append(words[i]);
            if (i > 0) reversed.append(" ");
        }
        System.out.println(reversed);
    }
}`,
      output: "Word count: 3\nbrowsers automates Selenium",
      explanation: "trim + split on the whitespace regex handles messy spacing, then a backwards loop rebuilds the sentence word-reversed.",
      selenium: "Two questions in one: word count, and 'reverse the words but not the letters' — both live on split() + loop control.",
      walkthrough: [
        { code: "sentence.trim().split(\"\\\\s+\")", note: "The regex \\\\s+ means 'one or MORE whitespace chars', so triple spaces don't create empty strings in the array — split(\" \") would, giving word count 6 instead of 3. trim() first kills leading/trailing space. This line is where most candidates' versions silently break." },
        { code: "for (int i = words.length - 1; i >= 0; i--)", note: "Iterate the array backwards to reverse WORD order while each word stays intact — distinguishing this from character reversal is exactly what the question probes." },
        { code: "if (i > 0) reversed.append(\" \");", note: "Separator between words, not after the last one — the trailing-space bug is tiny but interviewers testing attention to detail do notice." }
      ]
    },
    {
      level: "Selenium-Oriented",
      title: "Find Broken Ordering in Scraped Prices",
      code: `import java.util.*;

public class SortedCheck {
    public static void main(String[] args) {
        // Simulating prices scraped from a "Low to High" sorted grid:
        List<Double> prices = Arrays.asList(9.99, 12.50, 11.00, 24.99);

        int brokenAt = -1;
        for (int i = 1; i < prices.size(); i++) {
            if (prices.get(i) < prices.get(i - 1)) {
                brokenAt = i;
                break;
            }
        }

        if (brokenAt == -1) System.out.println("Sorted correctly");
        else System.out.println("Sort breaks at index " + brokenAt + ": "
                + prices.get(brokenAt) + " after " + prices.get(brokenAt - 1));
    }
}`,
      output: "Sort breaks at index 2: 11.0 after 12.5",
      explanation: "Adjacent-pair comparison in one pass — and it reports WHERE the ordering fails, not just that it fails.",
      selenium: "The real assertion behind 'verify Sort by Price works': scrape prices with findElements + getText, parse to doubles, run exactly this loop. Reporting the failing index makes the test failure actually debuggable.",
      walkthrough: [
        { code: "for (int i = 1; i < prices.size(); i++)", note: "Start at 1 and compare each element to its LEFT neighbor — n-1 comparisons prove the whole list's order. The alternative (sort a copy, compare lists) also works but costs O(n log n) and loses the failure location." },
        { code: "if (prices.get(i) < prices.get(i - 1)) { brokenAt = i; break; }", note: "Strictly less-than allows equal adjacent prices (two items at $12.50 is still valid ascending order) — whether ties are allowed is the edge case to confirm with the interviewer before coding." },
        { code: "prices.get(brokenAt) + \" after \" + prices.get(brokenAt - 1)", note: "A failure message with the offending values — the difference between assertTrue(sorted) exploding with 'expected true' and a report a human can act on. Test-code craftsmanship interviewers explicitly look for." }
      ]
    }
  ],
  interview: [
    { q: "The interviewer says 'reverse this string' and you write new StringBuilder(s).reverse(). They frown. What did they actually want, and what's the right move?", a: "They wanted the manual algorithm — the two-pointer swap over a char array — because the question tests whether you can manipulate indices, not whether you know the API. The right move is to do both: name the built-in first ('in production I'd use StringBuilder.reverse()'), then write the manual version. That shows you know the ecosystem AND can work without it." },
    { q: "You're asked to find duplicates in a list of 10,000 scraped row values. Compare the nested-loop approach with the HashSet approach — when does the difference actually matter?", a: "Nested loops compare every pair: O(n²) — 100 million comparisons for 10,000 rows, seconds of pure CPU. A HashSet pass is O(n): 10,000 add() calls where a false return flags a duplicate. For 20 items nobody notices; at scraped-table scale the difference is a test that finishes instantly versus one that visibly hangs. Stating the crossover — 'brute force is fine for tiny inputs, but here's why I'd default to the set' — is exactly the reasoning interviews reward." },
    { q: "Halfway through a problem you realize your approach won't work. What do you do — and what's the worst thing you can do?", a: "Say it out loud immediately: 'this approach breaks on X, let me adjust' — then either fix incrementally or restart cleanly with a sentence about the new plan. Interviewers actively reward visible course-correction; it's evidence of how you debug. The worst move is silent thrashing: mutating code randomly while saying nothing, which reads as panic even when your instincts are right." },
    { q: "Why does 'count character occurrences' come up so often in SDET interviews specifically, and what's the one-line idiom that solves it?", a: "Because it's the miniature version of real test-automation work: aggregating scraped data (row values, error messages, log lines) and asserting on frequencies. The idiom: map.put(ch, map.getOrDefault(ch, 0) + 1) in a single loop — getOrDefault collapses the 'first time vs seen before' branch into one call. The same shape answers duplicates, anagram counting, and first-non-repeated-character." },
    { q: "You solved the problem in 5 minutes and the interviewer asks 'can you improve it?' — but your solution is already O(n). What are they fishing for?", a: "Usually one of: space (can O(n) extra memory become O(1)?), early termination (can you exit before scanning everything?), robustness (nulls, empties, overflow — fib(47) overflows int), or readability (naming, extracting a method). If it's genuinely optimal, say so with the reason: 'any solution must read every element at least once, so O(n) time is the floor — but I can cut space by X.' Defending an optimal answer confidently is itself part of the assessment." },
    { q: "How do you handle the classic 'swap two numbers without a temp variable' question, and is the trick ever a good idea in real code?", a: "Arithmetic: a = a + b; b = a - b; a = a - b; (or XOR: a ^= b; b ^= a; a ^= b). State both, then say plainly: never in production — it's less readable, the arithmetic version can overflow, and the temp variable costs nothing. Interviewers ask it as trivia; the strongest answer demonstrates the trick AND the judgment that a temp variable is better engineering." },
    { q: "What's your first 60 seconds when given ANY coding problem in an interview?", a: "Restate the problem in my own words; confirm input/output types with a concrete example; ask about edge cases (empty input, single element, duplicates, negatives, nulls); state my planned approach and its complexity in one sentence; get a nod, THEN start typing. That minute prevents solving the wrong problem — the most common way strong coders fail interviews — and every part of it scores points before a line of code exists." }
  ],
  handsOn: [
    "Time yourself: reverse a string, check a palindrome, and count characters — all three in under 10 minutes, in a plain editor, no IDE autocomplete.",
    "Write findDuplicates() for a List<String>, then extend it to return counts of each duplicate (the HashMap upgrade path an interviewer would ask for).",
    "Take the sorted-prices checker and adapt it to verify DESCENDING order for a 'High to Low' filter — one comparison flips.",
    "Practice narrating: solve any problem above while explaining every line out loud to an empty room. The talking is the skill."
  ],
  memoryVis: "Three tools solve almost everything here: two pointers walking toward each other (reverse, palindrome, sorted-check), a HashMap tally counter clicking as elements pass (counting, duplicates, anagrams), and one or two champion variables updated in a single pass (largest, second-largest, Fibonacci). Before coding, ask: which of the three shapes is this?",
  challenges: [
    {
      title: "Complete the two-pointer swap",
      prompt: "Fill in the loop condition that stops the reversal at the middle of the string.",
      code: `char[] chars = input.toCharArray();
int left = 0, right = chars.length - 1;
while (left ___1___ right) {
    char temp = chars[left];
    chars[left] = chars[right];
    chars[right] = temp;
    left++; right--;
}`,
      blanks: [
        { label: "comparison that stops when pointers meet", answer: "<" }
      ],
      explanation: "left < right stops when the pointers meet (odd length — middle char needs no swap) or cross (even length — all pairs done). <= would harmlessly re-swap the middle with itself, but < is the precise answer interviewers expect."
    },
    {
      title: "Complete the counting idiom",
      prompt: "Fill in the method that supplies 0 for a character seen for the first time.",
      code: `Map<Character, Integer> counts = new HashMap<>();
for (char ch : input.toCharArray()) {
    counts.put(ch, counts.___1___(ch, 0) + 1);
}`,
      blanks: [
        { label: "method returning the value or a default", answer: "getOrDefault" }
      ],
      explanation: "getOrDefault(ch, 0) returns the current count, or 0 if the key is absent — collapsing the 'first sighting vs repeat' branch into one call. This exact idiom solves counting, duplicates, and anagram problems."
    },
    {
      title: "Detect the duplicate in one call",
      prompt: "Fill in the Set method whose return value reveals whether the element was already present.",
      code: `Set<String> seen = new HashSet<>();
for (String u : users) {
    if (!seen.___1___(u)) {
        System.out.println("Duplicate: " + u);
    }
}`,
      blanks: [
        { label: "method that inserts AND reports if it was new", answer: "add" }
      ],
      explanation: "Set.add() returns false when the element already exists — insertion and duplicate-detection in a single call, no separate contains() lookup. Exploiting that return value is the trick this classic problem tests."
    }
  ]
};
