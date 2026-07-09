export const mockInterviews = {
  tracks: [
    {
      id: "locators",
      title: "Locators & Waits",
      questions: [
        { 
          q: "What is the difference between Implicit and Explicit wait?", 
          a: "Implicit wait applies globally to the WebDriver instance for the lifetime of the session, polling the DOM for a specified amount of time when trying to find an element. Explicit wait is applied to specific elements with expected conditions (e.g., visibilityOfElementLocated) and stops waiting as soon as the condition is met or throws a TimeoutException after the maximum time elapses." 
        },
        { 
          q: "What is Fluent Wait and how does it differ from Explicit Wait?", 
          a: "Fluent Wait is a type of Explicit wait that allows you to configure the polling frequency (e.g., check every 500ms) and specify which exceptions to ignore (like NoSuchElementException) while waiting for the condition to be true. Standard Explicit Wait usually uses a default polling interval and doesn't ignore exceptions implicitly unless configured." 
        },
        { 
          q: "How do you handle dynamic IDs that change on every page load (e.g., id='submit_1234')?", 
          a: "You can handle them using XPath or CSS selectors that match partial attribute values. For example, XPath: `//*[starts-with(@id, 'submit_')]` or `//*[contains(@id, 'submit')]`. CSS Selector: `[id^='submit_']` or `[id*='submit']`." 
        },
        { 
          q: "Explain how to interact with an element inside a Shadow DOM.", 
          a: "Standard locators (XPath/CSS) cannot pierce the Shadow DOM boundary. In Selenium 4, you can get the shadow root of the host element using `element.getShadowRoot()`, and then use `shadowRoot.findElement()` with CSS Selectors to locate elements inside it. XPath is not supported inside Shadow DOM." 
        },
        { 
          q: "What are Relative Locators introduced in Selenium 4?", 
          a: "Relative locators (or Friendly Locators) allow finding elements based on their visual placement relative to other elements. The available methods are `above()`, `below()`, `toLeftOf()`, `toRightOf()`, and `near()`. Example: `driver.findElement(with(By.tagName(\"input\")).above(loginButton));`" 
        },
        { 
          q: "How do you wait for an element to be clickable vs visible?", 
          a: "Using Explicit Wait: `ExpectedConditions.visibilityOfElementLocated(locator)` checks if the element is present in the DOM and has a height and width greater than 0. `ExpectedConditions.elementToBeClickable(locator)` checks visibility AND ensures the element is enabled so it can receive clicks." 
        },
        { 
          q: "Why might XPath be slower than CSS Selectors in some older browsers?", 
          a: "XPath engines parse the DOM tree structure, which can be computationally heavier, especially if traversing backwards using axes like `ancestor` or `preceding`. CSS Selectors are optimized by modern browser layout engines natively, making them generally faster, although the performance gap is negligible in modern browsers." 
        },
        { 
          q: "How would you locate the 3rd row, 2nd column in a dynamic web table using XPath?", 
          a: "Assuming a standard `<table>` structure, you can use: `//table[@id='myTable']//tr[3]/td[2]`. If the rows are dynamic based on data, you would locate the specific row based on a cell's text and traverse to the required column using `//td[text()='TargetText']/following-sibling::td[1]`." 
        },
        { 
          q: "What is StaleElementReferenceException and how do you resolve it using waits?", 
          a: "It occurs when an element referenced in code is no longer attached to the current DOM (e.g., the page refreshed or DOM updated). You can resolve it by re-locating the element inside a `try-catch` block or using FluentWait to ignore `StaleElementReferenceException` and explicitly wait for the element to become present or visible again." 
        },
        { 
          q: "Explain the difference between `pageLoadTimeout` and `setScriptTimeout`.", 
          a: "`pageLoadTimeout` sets the time to wait for a page load to complete before throwing an exception. `setScriptTimeout` sets the time to wait for an asynchronous script to finish execution before throwing an error, useful when executing async Javascript via JavascriptExecutor." 
        },
        { 
          q: "How do you locate an element that doesn't have unique attributes, but its parent does?", 
          a: "Locate the parent first and then find the child. Example using XPath: `//div[@id='parent-unique-id']//span[@class='common-class']`. Using CSS: `div#parent-unique-id span.common-class`." 
        },
        { 
          q: "When would an element be present in the DOM but not visible, and how do you handle it?", 
          a: "Elements can be hidden using CSS (`display: none`, `visibility: hidden`, or opacity 0). Selenium cannot interact with non-visible elements. You handle it by either waiting for it to become visible using Explicit Wait, or if interaction is strictly necessary, using JavascriptExecutor to manipulate the element directly." 
        },
        { 
          q: "What is the difference between single slash (/) and double slash (//) in XPath?", 
          a: "Single slash `/` is an absolute path that looks for the immediate child node. Double slash `//` is a relative path that searches for the matching node anywhere in the document hierarchy from the current context." 
        },
        { 
          q: "How do you fetch all links on a page and identify the broken ones?", 
          a: "Find all links using `driver.findElements(By.tagName(\"a\"))`. Iterate through them, extract the 'href' attribute. Use a library like `HttpURLConnection` in Java to send a HEAD or GET request to each URL. If the HTTP response code is >= 400, the link is considered broken." 
        },
        { 
          q: "What are the limitations of mixing Implicit and Explicit waits?", 
          a: "Mixing them can cause unpredictable wait times. For example, if Implicit wait is 10s and Explicit wait is 15s, Selenium might wait 10 seconds for the element to appear before the explicit wait condition even begins polling properly, leading to timeouts much longer than expected. It is best practice to rely solely on Explicit waits in modern frameworks." 
        },
        { 
          q: "How do you use the `preceding-sibling` axis in XPath?", 
          a: "`preceding-sibling` selects all siblings before the current node in the document order. For example, `//td[text()='Price']/preceding-sibling::td` will select the table cell that comes immediately before the cell containing the text 'Price'." 
        }
      ]
    },
    {
      id: "frameworks",
      title: "TestNG & Frameworks",
      questions: [
        { 
          q: "What is ThreadLocal and why is it crucial for parallel execution in Selenium frameworks?", 
          a: "`ThreadLocal` is a Java class that provides thread-local variables. In a Selenium framework, wrapping the WebDriver instance in a `ThreadLocal` ensures that each thread running a test in parallel has its own isolated WebDriver instance, preventing race conditions and session conflicts." 
        },
        { 
          q: "Explain Page Object Model (POM) vs Page Factory.", 
          a: "POM is a design pattern where web pages are represented as classes, and elements/actions are properties/methods. Page Factory is an implementation of POM in Selenium that uses the `@FindBy` annotation to initialize elements. Page Factory caches elements but can lead to StaleElementReferenceException if the DOM updates dynamically, whereas lazy evaluation in pure POM handles dynamic DOMs better." 
        },
        { 
          q: "How do you implement a Data-Driven framework using TestNG?", 
          a: "By using the `@DataProvider` annotation. You create a method annotated with `@DataProvider` that returns a 2D array of objects (e.g., from an Excel file or database). Then, annotate your `@Test` method with `dataProvider = \"providerName\"`, allowing the test to execute multiple times with different datasets." 
        },
        { 
          q: "What is the difference between @BeforeTest and @BeforeMethod in TestNG?", 
          a: "`@BeforeTest` executes once before the execution of all the test methods inside a `<test>` tag in the testng.xml file. `@BeforeMethod` executes before EVERY `@Test` annotated method." 
        },
        { 
          q: "How do you automatically retry failed tests in TestNG?", 
          a: "Implement the `IRetryAnalyzer` interface and override the `retry()` method to define the retry logic (e.g., retry count). Then, attach this retry analyzer to your `@Test` annotation `(@Test(retryAnalyzer = MyRetry.class))` or globally using an `IAnnotationTransformer` listener." 
        },
        { 
          q: "Explain Dependency Injection in the context of a UI Test Framework.", 
          a: "Dependency injection (like using PicoContainer or Guice) is used to share state between different classes (e.g., step definitions in Cucumber or different Page Objects) without using static variables. It passes instantiated objects into classes that need them, ensuring better modularity and thread safety." 
        },
        { 
          q: "What is the difference between Hard Assert and Soft Assert in TestNG?", 
          a: "Hard Assert (`Assert.assertEquals`) immediately throws an `AssertionError` upon failure, stopping the execution of the current test method. Soft Assert (`SoftAssert` class) records failures but continues executing subsequent steps in the test. You must call `softAssert.assertAll()` at the end of the test to actually fail it if any soft assertions failed." 
        },
        { 
          q: "How do you manage configurations for multiple environments (QA, Staging, PROD)?", 
          a: "Use properties files or YAML/JSON configuration files for each environment (e.g., config-qa.properties). Pass an environment variable (like `-Denv=qa`) during Maven execution. A configuration manager class reads the variable and loads the corresponding properties file to set URLs, credentials, etc." 
        },
        { 
          q: "What are TestNG Listeners and give an example of how you use them?", 
          a: "Listeners in TestNG 'listen' to events during execution. Commonly used listeners include `ITestListener` (for actions on test start, pass, fail) and `ISuiteListener`. I use `ITestListener` to automatically take a screenshot on `onTestFailure` and attach it to Extent Reports." 
        },
        { 
          q: "How do you execute specific groups of tests in TestNG?", 
          a: "Define groups in the test method annotation: `@Test(groups = {\"smoke\", \"regression\"})`. In the testng.xml file, define `<groups>` inside the `<test>` tag, specifying `<run><include name=\"smoke\"/></run>` to execute only smoke tests." 
        },
        { 
          q: "Explain the Singleton design pattern and its use in Automation Frameworks.", 
          a: "The Singleton pattern ensures a class has only one instance and provides a global point of access to it. In older frameworks without parallel execution, it was used to maintain a single WebDriver instance across all test classes. It is also commonly used for Configuration Manager classes to parse properties files only once." 
        },
        { 
          q: "How do you integrate Selenium tests with CI/CD tools like Jenkins?", 
          a: "Push the code repository to Git. Create a Jenkins pipeline or freestyle job connected to the repo. Configure a build step to execute Maven commands (e.g., `mvn clean test`). Configure Post-build actions to publish TestNG/Extent reports and send email notifications based on build status." 
        },
        { 
          q: "What is the difference between BDD and TDD? When should you use Cucumber?", 
          a: "TDD (Test-Driven Development) writes tests before code, focusing on implementation. BDD (Behavior-Driven Development) focuses on system behavior from a user's perspective using plain text (Gherkin). Cucumber is ideal when business stakeholders (PMs, BAs) need to review or define test scenarios; it introduces overhead if the team is solely technical." 
        },
        { 
          q: "How do you handle test data securely, avoiding hardcoded passwords?", 
          a: "Avoid storing plain text passwords in properties files. Use environment variables injected at runtime by the CI pipeline, or integrate with secret management tools like AWS Secrets Manager or HashiCorp Vault. In local runs, use a local `.env` file that is ignored by Git." 
        },
        { 
          q: "What is the difference between parallel='methods' and parallel='classes' in testng.xml?", 
          a: "`parallel='methods'` runs each `@Test` method in a separate thread simultaneously, which can cause state issues if methods share class-level variables. `parallel='classes'` runs all methods within a single class in the same thread, but executes different classes in parallel, which is generally safer for state management." 
        },
        { 
          q: "How do you perform API testing within a UI automation framework?", 
          a: "Integrate a library like RestAssured. You can use API calls to quickly set up test data (e.g., creating a user via API before logging in via UI) or to assert backend changes after a UI action, significantly speeding up test execution compared to doing everything via the UI." 
        }
      ]
    },
    {
      id: "exceptions",
      title: "Handling Exceptions",
      questions: [
        { 
          q: "What causes an ElementClickInterceptedException and how do you resolve it?", 
          a: "It happens when the target element is obscured by another element (like a modal, spinner, or floating header) at the moment of the click. Resolve it by waiting for the obscuring element to disappear (invisibilityOf), scrolling to the element, or bypassing the UI layout and clicking via JavascriptExecutor." 
        },
        { 
          q: "What is the difference between NoSuchElementException and ElementNotVisibleException?", 
          a: "`NoSuchElementException` means the WebDriver cannot find the element in the DOM at all using the provided locator. `ElementNotVisibleException` (now generally part of ElementNotInteractableException in Selenium 4) means the element is in the DOM, but its CSS properties make it hidden or invisible." 
        },
        { 
          q: "How do you handle UnhandledAlertException?", 
          a: "This occurs when an unexpected JavaScript alert blocks the driver. Catch the exception, switch to the alert (`driver.switchTo().alert()`), accept or dismiss it, and then retry the original action. Alternatively, check for alerts before actions using `ExpectedConditions.alertIsPresent()`." 
        },
        { 
          q: "When does InvalidElementStateException occur?", 
          a: "It happens when an action is attempted on an element that is in a state preventing the action. For example, trying to `sendKeys()` to an input field that is disabled (`disabled` attribute) or read-only." 
        },
        { 
          q: "How do you deal with a random popup that appears unpredictably and breaks tests?", 
          a: "If it's truly random, handle it in a custom wrapper for `click()` or `findElement()`. If an exception like `ElementClickInterceptedException` is caught, check for the popup's presence, close it, and retry the action. Alternatively, block third-party popup domains via browser extensions or proxy." 
        },
        { 
          q: "What causes a TimeoutException and what is your debugging process?", 
          a: "It occurs when an Explicit Wait condition is not met within the specified time. I debug by checking: 1) Is the locator correct? 2) Is the page loading slowly (needs more time)? 3) Is there a JS error on the page? 4) Checking screenshots taken on failure to see the UI state." 
        },
        { 
          q: "How do you handle NoSuchWindowException when dealing with multiple tabs?", 
          a: "This happens when trying to switch to a window handle that no longer exists (e.g., the tab closed). Always maintain a list of window handles (`driver.getWindowHandles()`), ensure the target handle exists in the set, and switch to it using `driver.switchTo().window(handle)`. Don't hardcode index positions." 
        },
        { 
          q: "What is a SessionNotCreatedException and how do you fix it?", 
          a: "It occurs when the WebDriver cannot establish a connection with the browser. Common causes: incompatible browser and driver executable versions, missing browser installation, or driver binary not in PATH. Fix by aligning versions (using WebDriverManager or Selenium Manager in v4.6+) or updating paths." 
        },
        { 
          q: "How do you handle a NoSuchFrameException?", 
          a: "It occurs when the driver tries to switch to an invalid frame ID, name, or index. Ensure the frame has loaded by using `ExpectedConditions.frameToBeAvailableAndSwitchToIt()`. Verify that the frame isn't nested inside another frame; if so, you must switch to the parent frame first." 
        },
        { 
          q: "What triggers a JavascriptException?", 
          a: "It is thrown when executing custom JS code via `JavascriptExecutor` and the script contains syntax errors, references undefined variables, or fails to execute properly in the browser's JS engine. Check the script syntax and ensure elements passed as arguments are valid." 
        },
        { 
          q: "How do you handle MoveTargetOutOfBoundsException?", 
          a: "This happens when using the `Actions` class to move the mouse to an element that is rendered outside the visible viewport. Resolve it by first scrolling the element into view using JavascriptExecutor (`scrollIntoView(true)`) before attempting the mouse action." 
        },
        { 
          q: "What is WebDriverException and when is it typically thrown?", 
          a: "It is the base class for many Selenium exceptions. A generic `WebDriverException` is often thrown due to environmental issues, such as the browser crashing abruptly, network issues severing the driver connection, or the driver executable losing communication with the browser." 
        },
        { 
          q: "How do you capture a screenshot automatically upon encountering an exception?", 
          a: "Implement TestNG's `ITestListener` interface and override the `onTestFailure` method. Inside, cast the WebDriver to `TakesScreenshot`, call `getScreenshotAs(OutputType.FILE)`, and save it to a designated folder with a timestamp, then attach the path to your reporting tool." 
        },
        { 
          q: "What is InvalidSelectorException?", 
          a: "It is thrown when the locator strategy (usually XPath or CSS) is syntactically incorrect. For example, an unclosed bracket in XPath `//div[@id='foo'` or using an invalid CSS pseudo-class. Debug by validating the locator in the Chrome DevTools console." 
        },
        { 
          q: "How do you handle exceptions in a robust page object method?", 
          a: "Instead of raw driver calls, use custom wrappers. For example, a `click(By locator)` method that wraps `driver.findElement().click()` in a try-catch block. If an `ElementClickInterceptedException` is caught, it logs a warning, waits a second, and retries using JavascriptExecutor." 
        },
        { 
          q: "Why might a NoSuchElementException occur even if the element is visible on the screen?", 
          a: "The most common reason is that the element is inside an `<iframe>` or a Shadow DOM, and the WebDriver's current context is the main document. You must switch to the iframe (`driver.switchTo().frame()`) or access the Shadow Root before locating the element." 
        }
      ]
    }
  ]
};
