export const seleniumWebdriverData = {
  title: "Selenium WebDriver",
  concept: "WebDriver is the browser-automation API itself: locating elements, synchronizing with a page that loads on its own schedule, and driving interactions — clicks, typing, dropdowns, frames, windows, alerts — the way a user would.",
  why: "Everything else in this app is Java in service of THIS. Locators and waits are where automation succeeds or flakes: interviews spend more time on 'how do you find it and how do you wait for it' than on any other pair of topics.",
  realWorld: "Like giving directions to a courier in a building that's still under construction: you need an address that stays valid as walls move (locators), and the discipline to wait for a door to actually exist before walking through it (waits).",
  seleniumMapping: "This IS Selenium — every Page Object method body is made of these calls. The Mock Interview tracks quiz you on it; this module teaches it with runnable patterns.",
  commonMistakes: [
    "Mixing implicit and explicit waits — the interaction produces unpredictable timeout behavior; pick explicit waits and set implicit to zero.",
    "Absolute XPath (/html/body/div[2]/div[1]/button) — one layout change breaks it; always anchor on stable attributes.",
    "Thread.sleep() as a wait strategy — always too long (wastes minutes across a suite) or too short (flaky failures).",
    "Locating an element once and reusing the reference after the page re-renders — StaleElementReferenceException; re-find after any DOM refresh."
  ],
  keyPoints: [
    "The 8 locators: id, name, className, tagName, linkText, partialLinkText, cssSelector, xpath. Priority order: id (fastest, most stable) → name → css → xpath (most powerful, use when css can't — text matching, axes).",
    "CSS vs XPath — the eternal question: CSS is faster in old browsers and cleaner for attribute/hierarchy matching ([id^='submit'], div.card > button); XPath alone can match by TEXT (//button[text()='Login']) and traverse UPWARD (ancestor::, preceding-sibling::). Know one concrete example of each exclusive power.",
    "findElement throws NoSuchElementException when nothing matches; findElements returns an EMPTY LIST — which makes findElements(...).isEmpty() the clean existence check without try/catch.",
    "Implicit wait: one global setting, polls the DOM for element PRESENCE only — it can't wait for clickable/visible, and it silently adds delay to every findElement including ones you WANT to fail fast. Explicit wait (WebDriverWait + ExpectedConditions) targets a specific element and condition. Never mix them.",
    "The conditions that matter: presenceOfElementLocated (in DOM), visibilityOfElementLocated (in DOM + rendered), elementToBeClickable (visible + enabled). Choosing the RIGHT one is the difference between stable and flaky.",
    "Fluent wait = explicit wait with custom polling interval and ignored exceptions — WebDriverWait since Selenium 4 IS a FluentWait; mention .pollingEvery() and .ignoring(NoSuchElementException.class).",
    "get(url) waits for page load; navigate().to() adds back/forward/refresh history control. driver.close() closes the current window; driver.quit() ends the whole session and browser process — quit is what belongs in teardown.",
    "Windows: getWindowHandles() returns Set<String>; loop and switchTo().window(handle) to reach the new tab. Frames: switchTo().frame(...) before touching anything inside, switchTo().defaultContent() to come back — 'element not found' inside an iframe is a missing frame switch until proven otherwise.",
    "Alerts (JS popups): switchTo().alert() then accept()/dismiss()/getText()/sendKeys() — you cannot inspect them with devtools, and unhandled alerts throw UnhandledAlertException on the next command.",
    "Select class for real <select> dropdowns: selectByVisibleText/Value/Index. If the 'dropdown' is a styled div (most modern UIs), Select won't work — click and pick like a user.",
    "JavascriptExecutor is the escape hatch: scroll into view, click elements that refuse clicks, read values the DOM hides. Powerful, but every js click bypasses what a USER could do — use it deliberately, not as a first resort."
  ],
  examples: [
    {
      level: "Beginner",
      title: "The 8 Locators + findElement vs findElements",
      code: `/*
driver.findElement(By.id("username"));            // fastest, most stable
driver.findElement(By.name("email"));
driver.findElement(By.className("btn-primary"));  // single class name only
driver.findElement(By.tagName("h1"));
driver.findElement(By.linkText("Forgot password?"));
driver.findElement(By.partialLinkText("Forgot"));
driver.findElement(By.cssSelector("form#login input[type='submit']"));
driver.findElement(By.xpath("//button[text()='Sign in']"));

// Existence check WITHOUT exceptions:
List<WebElement> banners = driver.findElements(By.cssSelector(".error-banner"));
if (banners.isEmpty()) {
    System.out.println("no errors shown");
}
*/
System.out.println("no errors shown");`,
      output: "no errors shown",
      explanation: "All eight strategies, ordered roughly by preference — and the findElements empty-list idiom that answers 'is it there?' without try/catch.",
      selenium: "Interviewers ask you to rank locators and justify it: id wins on speed and stability; xpath is last resort but uniquely can match text and walk up the tree.",
      walkthrough: [
        { code: "By.id(\"username\")", note: "Browsers index by id natively — fastest lookup, and ids change least often. If the app has stable ids (or better, data-testid via css), everything else is fallback." },
        { code: "By.cssSelector(\"form#login input[type='submit']\")", note: "CSS handles hierarchy (parent > child), attributes ([type='submit']), and prefix/suffix matching ([id^='btn_']) — covering 90% of real needs with better readability than xpath equivalents." },
        { code: "By.xpath(\"//button[text()='Sign in']\")", note: "The two things ONLY xpath does: match by visible text, and traverse upward (//input[@id='email']/ancestor::form). Quote those two powers when asked 'when do you actually need xpath?'" },
        { code: "driver.findElements(...).isEmpty()", note: "findElement throws NoSuchElementException on zero matches; findElements returns an empty list. That asymmetry is deliberate API design — existence checks belong to findElements, so absence isn't exception-driven control flow." }
      ]
    },
    {
      level: "Intermediate",
      title: "Explicit Wait Done Right",
      code: `/*
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

// Wait for the RIGHT condition, not just presence:
WebElement submit = wait.until(
    ExpectedConditions.elementToBeClickable(By.id("submit")));
submit.click();

// Fluent tuning — polling interval + ignored exceptions:
Wait<WebDriver> fluent = new FluentWait<>(driver)
    .withTimeout(Duration.ofSeconds(15))
    .pollingEvery(Duration.ofMillis(300))
    .ignoring(NoSuchElementException.class);
WebElement banner = fluent.until(
    d -> d.findElement(By.cssSelector(".toast-success")));
*/
System.out.println("clicked when actually clickable");`,
      output: "clicked when actually clickable",
      explanation: "WebDriverWait polls the condition every 500ms until true or timeout; FluentWait exposes the polling knobs. The skill is choosing the condition that matches the interaction.",
      selenium: "The #1 flakiness question: 'element is present but click fails' usually means you waited for presence when you needed clickable — the element existed behind a spinner overlay.",
      walkthrough: [
        { code: "ExpectedConditions.elementToBeClickable(...)", note: "The three-condition ladder: presenceOfElementLocated = in the DOM (maybe invisible); visibilityOfElementLocated = rendered with size; elementToBeClickable = visible AND enabled. Waiting one rung too low is the root of most 'intermittent' click failures." },
        { code: "new WebDriverWait(driver, Duration.ofSeconds(10))", note: "Scoped to THIS wait, unlike the global implicit wait. The mixing trap: implicit 10s + explicit 10s can compound into ~20s timeouts on absent elements, because every internal findElement poll ALSO waits implicitly. Set implicit to zero and standardize on explicit — say exactly that in interviews." },
        { code: ".pollingEvery(Duration.ofMillis(300)).ignoring(NoSuchElementException.class)", note: "FluentWait's two extras: check more (or less) often than the default 500ms, and treat chosen exceptions as 'not yet' rather than failure while polling. Since Selenium 4, WebDriverWait extends FluentWait — so 'fluent wait' is a configuration style, not a separate tool. That one-liner defuses the classic 'explain all three wait types' question." }
      ]
    },
    {
      level: "Intermediate",
      title: "Actions Class — Hover, Drag, Right-Click",
      code: `/*
Actions actions = new Actions(driver);

// Hover to reveal a hidden submenu, then click the item:
WebElement menu = driver.findElement(By.id("products"));
WebElement item = driver.findElement(By.linkText("Laptops"));
actions.moveToElement(menu).pause(Duration.ofMillis(200))
       .moveToElement(item).click().build().perform();

// Drag and drop:
actions.dragAndDrop(cardElement, targetColumn).perform();

// Right-click and keyboard chord:
actions.contextClick(fileRow).perform();
actions.keyDown(Keys.CONTROL).click(row1).click(row2)
       .keyUp(Keys.CONTROL).perform();
*/
System.out.println("submenu item clicked");`,
      output: "submenu item clicked",
      explanation: "Actions builds composite user gestures — sequences of mouse/keyboard primitives executed as one chain by perform().",
      selenium: "click() can't hover, and hover-revealed menus are everywhere — Actions.moveToElement is the answer to 'the element only appears on mouse-over'.",
      walkthrough: [
        { code: "actions.moveToElement(menu)...build().perform()", note: "Each call queues a primitive; perform() executes the whole chain (build() is optional sugar — perform() calls it). Without perform(), NOTHING happens — the silently-does-nothing bug interviewers love asking about." },
        { code: ".pause(Duration.ofMillis(200))", note: "Real menus animate open — a brief pause between hover and click prevents targeting a submenu that's still sliding into place. Small, honest concession to real UIs." },
        { code: "keyDown(Keys.CONTROL).click(row1).click(row2).keyUp(...)", note: "Modifier-key chords for multi-select — press is held across the clicks then released. Forgetting keyUp leaves CTRL 'held down' for subsequent actions: a wonderfully confusing bug to debug." }
      ]
    },
    {
      level: "Intermediate",
      title: "Windows, Frames, Alerts — the Three switchTo()s",
      code: `/*
// WINDOWS: clicking a link opened a new tab
String original = driver.getWindowHandle();
driver.findElement(By.linkText("Terms")).click();
for (String handle : driver.getWindowHandles()) {   // Set<String>
    if (!handle.equals(original)) {
        driver.switchTo().window(handle);
    }
}
System.out.println(driver.getTitle());  // new tab's title
driver.close();                          // close the tab
driver.switchTo().window(original);      // ALWAYS switch back

// FRAMES: element lives inside an iframe
driver.switchTo().frame("payment-frame");         // by name/id, index, or element
driver.findElement(By.id("cardNumber")).sendKeys("4111...");
driver.switchTo().defaultContent();                // back to the main page

// ALERTS: JS popup
Alert alert = driver.switchTo().alert();
System.out.println(alert.getText());
alert.accept();   // or dismiss()
*/
System.out.println("switched, filled, accepted");`,
      output: "switched, filled, accepted",
      explanation: "Three contexts WebDriver can't see across: other windows, iframes, and JS alerts — each has its own switchTo() door in and back out.",
      selenium: "'My locator is right but findElement fails' inside a payment widget or embedded editor = missing frame switch, ~90% of the time. Ask yourself 'is it in an iframe?' before rewriting the locator.",
      walkthrough: [
        { code: "driver.getWindowHandles()", note: "Returns a Set<String> — the Collections module's uniqueness guarantee in action. Loop to find the handle that ISN'T the original; Selenium 4 alternative: driver.switchTo().newWindow(WindowType.TAB) when YOU open the tab." },
        { code: "driver.close(); driver.switchTo().window(original);", note: "close() kills the CURRENT window only (quit() kills everything) — and after closing, the driver still points at the dead window: every command throws until you switch back. The forgotten switch-back is a classic post-popup failure cascade." },
        { code: "driver.switchTo().frame(...); ... defaultContent();", note: "Inside a frame, ONLY that frame's DOM is visible — parent-page locators fail, which is why the symptom masquerades as a locator bug. defaultContent() returns to the top; parentFrame() steps up one level in nested frames." },
        { code: "driver.switchTo().alert().accept()", note: "JS alerts are browser chrome, not DOM — no locators can touch them. Unhandled, they make the NEXT command throw UnhandledAlertException. getText() first when you need to assert the message." }
      ]
    },
    {
      level: "Selenium-Oriented",
      title: "Select, JavascriptExecutor, Screenshot",
      code: `/*
// SELECT — real <select> tags only:
Select country = new Select(driver.findElement(By.id("country")));
country.selectByVisibleText("India");
country.selectByValue("IN");
country.selectByIndex(3);

// JAVASCRIPT EXECUTOR — the escape hatch:
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript("arguments[0].scrollIntoView({block:'center'});", element);
js.executeScript("arguments[0].click();", stubbornElement);
String readyState = (String) js.executeScript("return document.readyState;");

// SCREENSHOT — failure evidence:
File shot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
FileUtils.copyFile(shot, new File("shots/checkout_failure.png"));
*/
System.out.println("selected, scrolled, captured");`,
      output: "selected, scrolled, captured",
      explanation: "The three utility APIs every framework leans on: typed dropdown control, raw JS execution for what WebDriver can't reach, and screenshot capture.",
      selenium: "Each maps to a stock interview question: 'how do you handle dropdowns?', 'when do you use JavascriptExecutor?', and 'how does screenshot-on-failure work?' (this + the TestNG listener).",
      walkthrough: [
        { code: "new Select(driver.findElement(By.id(\"country\")))", note: "Select wraps a real <select> element and throws UnexpectedTagNameException on anything else. Modern custom dropdowns (styled divs) need the user path instead: click the trigger, wait for the list, click the option — recognizing WHICH kind you're facing is the actual skill." },
        { code: "js.executeScript(\"arguments[0].scrollIntoView(...)\", element)", note: "arguments[0] is the WebElement passed after the script string — the bridge between Java objects and the page's JS context. Scrolling into view fixes 'element not interactable' when the target sits below the fold." },
        { code: "js.executeScript(\"arguments[0].click();\", stubbornElement)", note: "The JS click bypasses visibility/overlay checks a real user is subject to — it 'works' on elements a user literally cannot click. Use it when an overlay is a known rendering quirk, never to paper over a real product bug; volunteering that judgment is what separates senior answers." },
        { code: "((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE)", note: "The cast works because every driver implements TakesScreenshot. Returns a temp file — copy it somewhere permanent (Java IO module) named after the failing test. In frameworks, this lives in the TestNG listener's onTestFailure, not inside tests." }
      ]
    }
  ],
  interview: [
    { q: "Rank the locator strategies and defend your order. When is XPath the RIGHT choice?", a: "id first — natively indexed, fastest, least churn. name next for forms. Then cssSelector as the general workhorse: attributes, hierarchy, prefix/suffix matching, more readable than equivalent xpath. XPath last but irreplaceable for its two exclusive powers: matching by visible text (//button[text()='Login']) and traversing UP the tree (ancestor::, preceding-sibling::) — e.g., finding the row that CONTAINS a known cell text, then clicking that row's delete button. Absolute xpath is never acceptable; anchored relative xpath is a legitimate tool." },
    { q: "A click fails intermittently with ElementClickInterceptedException even though the element is present. Diagnose like you're on the job.", a: "Present isn't clickable — something overlays it at click time: a spinner, toast, sticky header, or the element is mid-animation. Diagnosis: screenshot at failure (listener) shows the overlay. Fixes in order of correctness: wait for the overlay to disappear (invisibilityOfElementLocated on the spinner), then elementToBeClickable on the target; scrollIntoView if it's a fold problem; JS click only as a documented last resort since it bypasses what users can actually do. The layered answer — diagnose, right wait, honest escape hatch — is what's being graded." },
    { q: "Explain implicit vs explicit vs fluent wait — and why mixing implicit and explicit is dangerous.", a: "Implicit: one global setting; every findElement polls up to that long for PRESENCE only — it can't express visible or clickable. Explicit: WebDriverWait targeting one locator + one ExpectedCondition — precise, per-interaction. Fluent: the same machinery with custom polling frequency and ignored exceptions (and since Selenium 4, WebDriverWait literally extends FluentWait). Mixing: explicit waits internally call findElement repeatedly, and each internal call ALSO waits the implicit timeout — timeouts compound unpredictably (10s + 10s behaving like ~20s), and fast-fail negative checks become slow. Standard practice: implicit zero, explicit everywhere." },
    { q: "findElement vs findElements — and how do you check an element does NOT exist without burning 10 seconds?", a: "findElement returns the first match or throws NoSuchElementException; findElements returns all matches or an EMPTY list — never throws for zero. Existence check: driver.findElements(locator).isEmpty() — no exception handling as control flow. The 10-second trap: with an implicit wait set, even findElements blocks the full timeout before returning empty — a third reason to keep implicit at zero; with it zeroed, the negative check returns immediately." },
    { q: "Your test fills a payment form and findElement keeps failing on a locator you've verified in devtools. What's the first thing you check?", a: "Whether the field is inside an IFRAME — payment widgets (Stripe, PayPal) almost always are. Devtools finds it because the console searches the frame you have selected; WebDriver searches only the current frame context. Fix: driver.switchTo().frame(...) before interacting, defaultContent() after. The generalized lesson: 'right locator, element not found' means wrong CONTEXT (frame, window, or a shadow root) before it means wrong locator." },
    { q: "Walk through handling a link that opens a new tab: verify its title, close it, and continue in the original tab.", a: "Save driver.getWindowHandle() (current), click the link, then loop driver.getWindowHandles() — a Set<String> — and switchTo().window(handle) for the one that isn't the original. Assert getTitle(), then driver.close() (kills ONLY that tab, not the session), and critically switchTo().window(original) — after close() the driver still points at the dead window and every next command throws. In Selenium 4, if the test itself needs a fresh tab: switchTo().newWindow(WindowType.TAB)." },
    { q: "When is JavascriptExecutor legitimate, and when is it hiding a bug?", a: "Legitimate: scrollIntoView for below-the-fold targets, reading state the DOM doesn't expose (document.readyState), fixing known rendering quirks documented as such. Hiding a bug: js click on an element a real user can't click — if the overlay always blocks it, USERS are blocked too, and your test just certified a broken flow as passing. The rule I state in interviews: JS execution changes the question from 'can a user do this' to 'can the browser do this' — only accept that downgrade knowingly and note it in the test." },
    { q: "driver.close() vs driver.quit() — and which belongs in teardown?", a: "close() closes the current window only; the session (and browser process, if other windows exist) lives on. quit() ends the WebDriver session and kills every window and the driver process. Teardown always uses quit(): with close(), suites leak zombie browser processes that eventually exhaust CI agent memory — and under ThreadLocal driver management, quit() pairs with remove() to prevent the stale-reference leak across pooled threads." }
  ],
  handsOn: [
    "On any public demo site (the-internet.herokuapp.com is built for this): practice one exercise per switchTo() — nested frames, multiple windows, JS alerts.",
    "Write the same element's locator three ways — id/css/xpath — then break the page's layout in devtools and see which locators survive.",
    "Reproduce the implicit+explicit mixing problem: set implicit to 10s, explicitly wait for a non-existent element with 5s timeout, and time how long it ACTUALLY takes.",
    "Build a hover-menu navigation with Actions on a site with dropdown menus, first WITHOUT pause() to see the flake, then with it."
  ],
  memoryVis: "WebDriver sees one room at a time: frames, windows, and alerts are other rooms, and switchTo() is the only door — 'element not found' often means 'right furniture, wrong room'. Waits are the discipline of knocking and listening (polling) instead of either barging in (no wait) or standing outside a fixed 10 minutes regardless (Thread.sleep). JavascriptExecutor is the master key that opens any door — carry it, but remember that users don't have one.",
  challenges: [
    {
      title: "Wait for the RIGHT condition",
      prompt: "The element renders behind a spinner overlay briefly. Fill in the condition that guarantees a click will land.",
      code: `WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement btn = wait.until(
    ExpectedConditions.___1___(By.id("submit")));
btn.click();`,
      blanks: [
        { label: "condition: visible AND enabled, ready for clicks", answer: ["elementToBeClickable"] }
      ],
      explanation: "elementToBeClickable = visible + enabled. presenceOfElementLocated passes while the element is still behind the spinner; visibility passes while it's disabled — one rung too low on the ladder and the click intermittently fails."
    },
    {
      title: "Check absence without exceptions",
      prompt: "Fill in the method that returns an empty list (instead of throwing) when nothing matches.",
      code: `boolean errorShown = !driver.___1___(By.cssSelector(".error-banner")).isEmpty();`,
      blanks: [
        { label: "the plural finder returning a List", answer: "findElements" }
      ],
      explanation: "findElements returns an empty List for zero matches — the clean existence check. findElement would throw NoSuchElementException, forcing try/catch as control flow."
    },
    {
      title: "Enter the iframe",
      prompt: "The card-number field lives inside an embedded payment iframe. Fill in the context switch.",
      code: `driver.switchTo().___1___("payment-frame");
driver.findElement(By.id("cardNumber")).sendKeys("4111111111111111");
driver.switchTo().defaultContent();`,
      blanks: [
        { label: "switch into the embedded browsing context", answer: "frame" }
      ],
      explanation: "Inside an iframe, only that frame's DOM is searchable — without switchTo().frame(...), a perfectly correct locator throws NoSuchElementException. defaultContent() returns to the top-level page afterward."
    }
  ]
};
