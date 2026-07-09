export const networkingData = {
  title: "Java Networking",
  concept: "Communicating across a network using APIs like Sockets and HTTP.",
  why: "Needed for API testing, interacting with Grid, checking broken links.",
  realWorld: "Fetching REST APIs, downloading server files.",
  seleniumMapping: "Checking broken links (HttpURLConnection), communicating with Grid.",
  commonMistakes: "Forgetting to close connections, ignoring timeouts.",
  examples: [
    { 
      level: "Beginner", 
      title: "URL Parsing", 
      code: `import java.net.URL;
URL url = new URL("https://example.com:80/docs");
System.out.println(url.getHost());`, 
      output: "example.com", 
      explanation: "Parsing URL components.", 
      selenium: "Validating current URL components." 
    },
    { 
      level: "Beginner", 
      title: "InetAddress", 
      code: `import java.net.InetAddress;
InetAddress ip = InetAddress.getByName("localhost");
System.out.println(ip.getHostAddress());`, 
      output: "127.0.0.1", 
      explanation: "Resolving IP addresses.", 
      selenium: "Checking local network setup for Grid." 
    },
    { 
      level: "Intermediate", 
      title: "HttpURLConnection GET", 
      code: `import java.net.HttpURLConnection;
import java.net.URL;
URL u = new URL("http://example.com");
HttpURLConnection con = (HttpURLConnection) u.openConnection();
con.setRequestMethod("GET");
System.out.println(con.getResponseCode());`, 
      output: "200", 
      explanation: "Basic HTTP GET request.", 
      selenium: "Checking link status." 
    },
    { 
      level: "Intermediate", 
      title: "Reading Response", 
      code: `/* Scanner sc = new Scanner(con.getInputStream());
while(sc.hasNext()) System.out.println(sc.nextLine()); */`, 
      output: "HTML Content", 
      explanation: "Reading data from input stream.", 
      selenium: "Fetching raw DOM for assertions." 
    },
    { 
      level: "Intermediate", 
      title: "HttpURLConnection POST", 
      code: `/* con.setRequestMethod("POST");
con.setDoOutput(true);
con.getOutputStream().write("data".getBytes()); */`, 
      output: "201 Created", 
      explanation: "Sending POST data.", 
      selenium: "API test data creation." 
    },
    { 
      level: "Advanced", 
      title: "ServerSocket", 
      code: `/* ServerSocket server = new ServerSocket(8080);
Socket client = server.accept(); */`, 
      output: "Server listening", 
      explanation: "Listening for TCP connections.", 
      selenium: "Mocking backend services." 
    },
    { 
      level: "Advanced", 
      title: "Socket Client", 
      code: `/* Socket socket = new Socket("localhost", 8080);
socket.getOutputStream().write("Hello".getBytes()); */`, 
      output: "Data sent", 
      explanation: "Sending TCP data.", 
      selenium: "Direct service communication." 
    },
    { 
      level: "Advanced", 
      title: "HttpClient (Java 11+)", 
      code: `import java.net.http.*;
import java.net.URI;
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder().uri(URI.create("http://example.com")).build();
// client.send(request, HttpResponse.BodyHandlers.ofString());`, 
      output: "200 OK", 
      explanation: "Modern HTTP client API.", 
      selenium: "Modern API testing alongside UI." 
    },
    { 
      level: "Advanced", 
      title: "HttpClient POST", 
      code: `/* HttpRequest req = HttpRequest.newBuilder().uri(URI.create(url)).POST(BodyPublishers.ofString("test")).build(); */`, 
      output: "201 Created", 
      explanation: "Modern POST request.", 
      selenium: "REST API interactions." 
    },
    { 
      level: "Selenium-Oriented", 
      title: "Broken Link Checker", 
      code: `/* URL u = new URL(element.getAttribute("href"));
HttpURLConnection c = (HttpURLConnection) u.openConnection();
c.setRequestMethod("HEAD");
c.connect();
int code = c.getResponseCode(); */`, 
      output: "200 or 404", 
      explanation: "Validating anchor tags.", 
      selenium: "Classic broken link script." 
    }
  ],
  interview: [
    { q: "Difference between URI and URL?", a: "URI identifies, URL both identifies and locates via protocol." },
    { q: "A test needs to verify that clicking a 'Download PDF' link actually serves a valid file, without letting Selenium click it and trigger an OS-level download dialog. How would you check this using Java networking APIs instead?", a: "Extract the href attribute from the link element, then open an HttpURLConnection (or use HttpClient) directly to that URL, call setRequestMethod(\"HEAD\") to avoid downloading the full body, and check getResponseCode() is 200 and the Content-Type header matches 'application/pdf'. This validates the link without ever touching the browser's download mechanism." },
    { q: "You want to assert that every link on a page returns a non-error HTTP status (no broken links), across 50 links. Would you do this through WebDriver, or through direct HTTP calls — and why?", a: "Direct HTTP calls (HttpURLConnection or HttpClient) — using WebDriver to navigate to each of 50 URLs would load full pages (slow, resource-heavy) just to check a status code. A lightweight HEAD or GET request per URL, done outside the browser, checks response codes far faster and doesn't pollute browser/test state." },
    { q: "A test fails with 'java.net.SocketTimeoutException' when checking an API endpoint's health before starting UI tests. What does this specific exception tell you versus a generic ConnectException?", a: "SocketTimeoutException means the connection was established (or attempted) but no response came back within the configured timeout — the server may be slow or hung. ConnectException means the connection couldn't even be established (wrong host/port, service down, firewall blocking) — they point to different root causes and different debugging steps." },
    { q: "Why would setting explicit connect and read timeouts on an HttpURLConnection matter for a CI pipeline, even if your local runs never seem to hang?", a: "Without explicit timeouts, a hung or unresponsive server can block the connection indefinitely (default is often no timeout / very long), which in CI means a single flaky network call can hang an entire pipeline job until an external CI-level timeout eventually kills it — costing much more time than a fast, deliberate failure would. Explicit short timeouts (e.g., 5-10 seconds) fail fast and keep pipelines responsive." },
    { q: "Your framework needs to make a REST API call to seed test data before a UI test runs (API-driven setup, UI-driven verification). What Java networking building blocks would this typically use?", a: "HttpClient (Java 11+) or HttpURLConnection to send a POST request with a JSON body to the API, parsing the JSON response (often with a library like Jackson/Gson) to extract an ID needed later, then proceeding to drive the browser with WebDriver for the actual UI test. This hybrid API+UI pattern is common for fast, reliable test setup that doesn't depend on slow UI flows just to get to a starting state." },
    { q: "What's the difference between InetAddress and a Socket in Java networking terms, and would either be directly relevant to typical Selenium test code?", a: "InetAddress represents an IP address (resolving a hostname to an IP, e.g., for DNS-related checks), while a Socket represents an actual open connection endpoint for sending/receiving data over TCP. Neither shows up directly in typical Selenium test code (which uses higher-level HTTP client APIs), but they're the lower-level building blocks those HTTP libraries are built on — worth knowing conceptually even if you rarely touch them directly." },
    { q: "A flaky test occasionally fails to reach a test environment URL, and you suspect DNS resolution timing rather than the server itself. How would you isolate that using pure Java, without involving the browser?", a: "Call InetAddress.getByName(hostname) directly and time how long it takes / whether it throws UnknownHostException — if this step alone is slow or fails intermittently, that isolates the problem to DNS resolution rather than the actual HTTP server or the browser's network stack, letting you rule out (or confirm) that specific layer." },
    { q: "Why might closing network streams properly (try-with-resources on an HttpURLConnection's InputStream) matter more in a long-running CI test suite than in a single quick script?", a: "Each unclosed stream/connection can leave a socket or file handle open; a single quick script exits and the OS reclaims everything, but a long-running CI suite making hundreds of HTTP calls across many tests will accumulate leaked handles until it hits an OS-level limit (similar to the file-handle exhaustion issue with unclosed file I/O) — proper resource cleanup compounds in importance with scale and runtime." }
  ],
  handsOn: ["Write a script to extract all links and print their HTTP status codes."],
  memoryVis: "Network Streams must be closed to avoid memory and resource leaks.",
  challenges: [
    {
      title: "Open a connection without downloading the body",
      prompt: "Fill in the HTTP method that checks a link's status without downloading its full content.",
      code: `HttpURLConnection conn = (HttpURLConnection) url.openConnection();
conn.setRequestMethod("___1___");
int status = conn.getResponseCode();`,
      blanks: [
        { label: "lightweight HTTP method that skips the response body", answer: "HEAD" }
      ],
      explanation: "HEAD requests the same headers and status code as GET but without the body — perfect for a fast broken-link check across dozens of URLs without downloading full pages."
    },
    {
      title: "Set a timeout to fail fast",
      prompt: "Fill in the method that caps how long the connection attempt will wait before giving up.",
      code: `HttpURLConnection conn = (HttpURLConnection) url.openConnection();
conn.___1___(5000); // milliseconds`,
      blanks: [
        { label: "method setting the connection timeout", answer: "setConnectTimeout" }
      ],
      explanation: "Without an explicit timeout, a hung server can block a connection indefinitely — setConnectTimeout(5000) makes the call fail fast after 5 seconds instead of hanging a whole CI pipeline."
    },
    {
      title: "Resolve a hostname to check DNS",
      prompt: "Fill in the class used to resolve a hostname to an IP address, useful for isolating DNS-related flakiness.",
      code: `___1___ address = ___1___.getByName("qa.example.com");
System.out.println(address.getHostAddress());`,
      blanks: [
        { label: "class representing a resolved IP address", answer: "InetAddress" }
      ],
      explanation: "InetAddress.getByName(hostname) performs DNS resolution directly — timing or catching failures here isolates whether a flaky connection issue is DNS-related versus a problem with the actual HTTP server."
    }
  ]
};
