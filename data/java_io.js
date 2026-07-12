export const javaIoData = {
  title: "Java I/O",
  concept: "APIs used to read data from a source or write data to a destination (files, networks, etc.).",
  why: "Essential for data-driven testing, reading configurations, and logging output.",
  realWorld: "Reading a book (input) and writing in a notebook (output).",
  seleniumMapping: "Reading test data from Excel/CSV files, reading properties files for environment config, and capturing screenshots.",
  commonMistakes: [
    "Not closing streams, which leads to memory leaks and file locks.",
    "Ignoring IOExceptions instead of properly handling or throwing them."
  ],
  keyPoints: [
    "Two stream families: InputStream/OutputStream move raw BYTES (images, binaries); Reader/Writer move CHARACTERS (text). Mixing them up is the classic beginner error.",
    "try-with-resources — try (FileReader fr = ...) — auto-closes anything implementing AutoCloseable, even when an exception is thrown mid-read. It replaced the manual finally-close pattern; always prefer it.",
    "BufferedReader wraps a Reader and batches disk reads into memory — line-by-line readLine() on large files is dramatically faster than unbuffered character reads.",
    "new File(path) does NOT create a file on disk — it's just a path representation. exists(), createNewFile(), mkdir() do the actual filesystem work.",
    "Files.readAllLines() loads the ENTIRE file into memory — fine for small test-data files, dangerous for large logs. Stream line-by-line (BufferedReader or Files.lines()) for big files.",
    "FileWriter's second constructor argument (true) means APPEND; omitting it silently truncates and overwrites the file — a painful way to lose a log.",
    "Selenium's daily I/O: reading config.properties (Properties.load), reading CSV test data (BufferedReader + split), and saving failure screenshots (getScreenshotAs + copy)."
  ],
  examples: [
    { level: "Beginner", title: "Creating a File Object", code: "File file = new File(\"test.txt\");\nSystem.out.println(file.exists());", output: "false (or true if exists)", explanation: "Creates a File object representing the path. Doesn't actually create the file on disk until requested.", selenium: "" },
    { level: "Beginner", title: "Writing to a File", code: "try (FileWriter fw = new FileWriter(\"test.txt\")) {\n    fw.write(\"Hello I/O!\");\n} catch (IOException e) {\n    e.printStackTrace();\n}", output: "", explanation: "Writes a string to a file using FileWriter. The try-with-resources ensures it is closed automatically.", selenium: "" },
    { level: "Beginner", title: "Reading from a File", code: "try (FileReader fr = new FileReader(\"test.txt\");\n     BufferedReader br = new BufferedReader(fr)) {\n    String line = br.readLine();\n    System.out.println(line);\n} catch (IOException e) {\n    e.printStackTrace();\n}", output: "Hello I/O!", explanation: "Reads text from a file. BufferedReader makes it efficient and allows reading line by line.", selenium: "" },
    { level: "Intermediate", title: "Appending to a File", code: "try (FileWriter fw = new FileWriter(\"log.txt\", true)) {\n    fw.write(\"New log entry\\n\");\n} catch (IOException e) {\n    e.printStackTrace();\n}", output: "", explanation: "Passing true to the FileWriter constructor opens the file in append mode.", selenium: "Writing custom logs during test execution." },
    { level: "Intermediate", title: "Reading Properties File", code: "Properties prop = new Properties();\ntry (FileInputStream fis = new FileInputStream(\"config.properties\")) {\n    prop.load(fis);\n    System.out.println(prop.getProperty(\"url\"));\n} catch (IOException e) {\n    e.printStackTrace();\n}", output: "https://example.com (assuming file exists)", explanation: "Loads key-value pairs from a .properties file, widely used for configuration.", selenium: "Reading environment URLs or browser types for test setup." },
    { level: "Intermediate", title: "File class methods", code: "File f = new File(\"data\");\nif (!f.exists()) {\n    f.mkdir(); // creates directory\n    System.out.println(\"Directory created\");\n}", output: "Directory created", explanation: "File class can check for existence, create directories, and delete files.", selenium: "" },
    { level: "Advanced", title: "Copying a file using NIO", code: "Path source = Paths.get(\"source.txt\");\nPath dest = Paths.get(\"dest.txt\");\ntry {\n    Files.copy(source, dest, StandardCopyOption.REPLACE_EXISTING);\n} catch (IOException e) {\n    e.printStackTrace();\n}", output: "", explanation: "Java NIO (New I/O) provides more efficient ways to handle file operations.", selenium: "" },
    { level: "Advanced", title: "Reading All Lines using NIO", code: "Path path = Paths.get(\"test.txt\");\ntry {\n    List<String> lines = Files.readAllLines(path);\n    lines.forEach(System.out::println);\n} catch (IOException e) {\n    e.printStackTrace();\n}", output: "Hello I/O!", explanation: "Convenient way to read all lines of a small file into a List.", selenium: "" },
    { level: "Advanced", title: "Writing bytes (OutputStream)", code: "try (FileOutputStream fos = new FileOutputStream(\"data.bin\")) {\n    String data = \"Test data\";\n    fos.write(data.getBytes());\n} catch (IOException e) {\n    e.printStackTrace();\n}", output: "", explanation: "Using streams to write raw binary data, useful for non-text files.", selenium: "" },
    { level: "Selenium-Oriented", title: "Taking a Screenshot", code: "TakesScreenshot ts = (TakesScreenshot) driver;\nFile source = ts.getScreenshotAs(OutputType.FILE);\nFile target = new File(\"screenshot.png\");\nFileUtils.copyFile(source, target);", output: "", explanation: "Captures the current browser state as an image file and saves it using FileUtils.", selenium: "Crucial for capturing UI state when a test fails." },
    { level: "Selenium-Oriented", title: "Reading CSV Test Data", code: "try (BufferedReader br = new BufferedReader(new FileReader(\"data.csv\"))) {\n    String line;\n    while ((line = br.readLine()) != null) {\n        String[] values = line.split(\",\");\n        System.out.println(\"User: \" + values[0] + \", Pass: \" + values[1]);\n    }\n} catch (IOException e) {\n    e.printStackTrace();\n}", output: "User: admin, Pass: pass123", explanation: "Iterating over a CSV file to drive parameterized testing.", selenium: "Data-Driven Testing (DDT) using external files." }
  ],
  interview: [
    { q: "What is the difference between InputStream/OutputStream and Reader/Writer?", a: "InputStream/OutputStream deal with raw bytes (binary data), while Reader/Writer deal with character streams (text)." },
    { q: "What is the try-with-resources statement?", a: "A try statement that declares one or more resources. It ensures that each resource is closed at the end of the statement, preventing resource leaks." },
    { q: "A CI pipeline running 200 parallel Selenium tests starts throwing 'Too many open files' after a while, and the tests each read a small config file. What's the likely root cause?", a: "Streams (FileInputStream, FileReader, etc.) that aren't closed leak file handles at the OS level — with enough tests each leaking one handle, the process eventually exhausts its file descriptor limit. try-with-resources is the fix: it guarantees close() runs even if an exception occurs mid-read, which a bare try/catch without finally often misses." },
    { q: "Why would you use BufferedReader wrapping a FileReader instead of just FileReader directly when reading a large CSV test-data file line by line?", a: "FileReader reads character-by-character (or small chunks) directly from disk, which is slow for large files due to constant I/O calls; BufferedReader wraps it and reads larger chunks into an in-memory buffer, then serves individual readLine() calls from that buffer — dramatically fewer actual disk reads for the same data." },
    { q: "You need to read a config.properties file that might be inside a packaged JAR (not a loose file on disk) when tests run from a built artifact. Why does 'new FileInputStream(\"config.properties\")' fail in that scenario, and what's the fix?", a: "FileInputStream expects an actual filesystem path, but resources bundled inside a JAR aren't separate files on disk — they're entries inside the JAR archive. The fix is loading it as a classpath resource: getClass().getClassLoader().getResourceAsStream(\"config.properties\"), which works whether running from loose files or a packaged JAR." },
    { q: "A test that takes a screenshot on failure sometimes produces a 0-byte or corrupted PNG file. Besides a permissions issue, what I/O mistake commonly causes this?", a: "Not closing (or not fully flushing) the output stream before the test process exits or before another thread tries to read the file — writes can be buffered and not actually persisted to disk until close() is called. try-with-resources around the FileOutputStream (or using the well-tested FileUtils.copyFile helper, which handles this correctly) avoids the problem." },
    { q: "Why is Files.readAllLines() from java.nio convenient for small test-data files, but a poor choice for a 2GB log file you need to scan for an error string?", a: "readAllLines() loads the ENTIRE file into memory as a List<String> at once — fine for a small CSV, but a 2GB file could exhaust heap memory or at minimum be extremely wasteful. For large files, use a BufferedReader and process line-by-line in a loop (or Files.lines() which returns a lazy Stream<String>), so only one line is in memory at a time." },
    { q: "What's the risk of using a relative file path like new File(\"testdata/users.csv\") in a Selenium framework that runs both locally (from an IDE) and in CI (via Maven/Gradle)?", a: "Relative paths resolve against the current working directory, which differs between an IDE run (often the module root) and a CI run (often the build tool's execution directory) — the same relative path can resolve to a valid file locally and a FileNotFoundException in CI. Using classpath-relative resource loading or an absolute path built from a known base (like System.getProperty(\"user.dir\")) is more portable." },
    { q: "Explain why try-with-resources is strictly better than a manual try/finally with an explicit close() call, using a scenario where the manual version actually has a bug.", a: "In manual try/finally, if the resource's OWN close() call throws an exception (e.g., disk I/O error during close), it can mask an earlier exception thrown inside the try block — you lose the original error. try-with-resources handles this correctly via 'suppressed exceptions': the original exception is preserved as primary, and the close() failure is attached as suppressed, so nothing gets silently lost." }
  ],
  handsOn: [
    "Write a program to read a text file, count the number of words, and print the count.",
    "Create a program that writes the current date and time to a log file."
  ],
  memoryVis: "Streams establish a connection (pipeline) between your program memory and external storage/network. If left unclosed, the OS keeps this pipeline open, consuming resources.",
  challenges: [
    {
      title: "Guarantee the file gets closed",
      prompt: "Fill in the missing keyword so this FileReader is automatically closed even if an exception occurs.",
      code: `___1___ (FileReader fr = new FileReader("test.txt")) {
    System.out.println(fr.read());
} catch (IOException e) {
    e.printStackTrace();
}`,
      blanks: [
        { label: "keyword enabling auto-close of the resource", answer: "try" }
      ],
      explanation: "'try' with the resource declared in parentheses is try-with-resources — it guarantees close() runs when the block exits, success or failure, without a separate finally block."
    },
    {
      title: "Read all lines efficiently",
      prompt: "Fill in the NIO method that reads an entire small file into a List<String> in one call.",
      code: `Path path = Paths.get("test.txt");
List<String> lines = Files.___1___(path);`,
      blanks: [
        { label: "NIO method reading every line into a List", answer: "readAllLines" }
      ],
      explanation: "Files.readAllLines(path) reads the whole file into memory as a List<String> — convenient for small files, but the wrong choice for very large files where line-by-line streaming is safer."
    },
    {
      title: "Append instead of overwrite",
      prompt: "Fill in the missing constructor argument that makes this FileWriter append to the log instead of overwriting it.",
      code: `FileWriter fw = new FileWriter("log.txt", ___1___);
fw.write("New entry\\n");`,
      blanks: [
        { label: "boolean value enabling append mode", answer: "true" }
      ],
      explanation: "Passing true as FileWriter's second constructor argument opens the file in append mode; passing false (or omitting it) truncates and overwrites the file's existing content."
    }
  ]
};
