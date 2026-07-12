export const awtData = {
  title: "Abstract Window Toolkit (AWT)",
  concept: "Original platform-dependent UI toolkit; provides OS-level controls.",
  why: "Enables interactions outside the browser window (OS popups).",
  realWorld: "Handling native OS file upload windows.",
  seleniumMapping: "Robot class for OS native events.",
  commonMistakes: "Using Robot without delays, leading to missed keystrokes.",
  keyPoints: [
    "WebDriver automates the browser DOM only — native OS dialogs (file pickers, auth popups, print dialogs) are separate OS processes it literally cannot see. That gap is why AWT's Robot class matters to testers.",
    "For file uploads, ALWAYS try sendKeys(filePath) on the <input type='file'> element first — it bypasses the native dialog entirely and works headless. Robot is the fallback, not the default.",
    "Robot simulates raw OS input: keyPress + keyRelease must BOTH be sent (some dialogs act on release), and coordinates-based mouse actions break with resolution/layout changes.",
    "Robot needs a real (or virtual) display — it fails on headless CI agents unless a virtual framebuffer (Xvfb) is present. A Robot-dependent suite that passes locally and dies in Jenkins is the classic symptom.",
    "Robot has no concept of elements or waits — it can't know when a dialog appeared or closed, forcing fragile sleeps. Use it sparingly and only where WebDriver genuinely can't reach.",
    "AWT components wrap native OS resources ('heavyweight'); Swing draws its own ('lightweight') — that's the AWT vs Swing distinction interviewers occasionally probe."
  ],
  examples: [
    { 
      level: "Beginner", 
      title: "Basic Frame", 
      code: `import java.awt.*;
Frame f = new Frame("Title");
f.setSize(200, 200);
f.setVisible(true);`, 
      output: "Window appears", 
      explanation: "Creating a native window.", 
      selenium: "Custom test tools." 
    },
    { 
      level: "Beginner", 
      title: "AWT Button", 
      code: `/* Button b = new Button("Click");
f.add(b); */`, 
      output: "Button visible", 
      explanation: "Adding UI components.", 
      selenium: "UI interactions." 
    },
    { 
      level: "Intermediate", 
      title: "Toolkit Beep", 
      code: `import java.awt.Toolkit;
Toolkit.getDefaultToolkit().beep();`, 
      output: "System beep", 
      explanation: "Triggering OS alert sound.", 
      selenium: "Audible test failure alert." 
    },
    { 
      level: "Intermediate", 
      title: "Screen Size", 
      code: `Dimension size = Toolkit.getDefaultToolkit().getScreenSize();
System.out.println(size.width + "x" + size.height);`, 
      output: "1920x1080", 
      explanation: "Getting monitor resolution.", 
      selenium: "Validating max screen bounds." 
    },
    { 
      level: "Advanced", 
      title: "Clipboard Copy", 
      code: `import java.awt.datatransfer.*;
StringSelection sel = new StringSelection("Text");
Toolkit.getDefaultToolkit().getSystemClipboard().setContents(sel, null);`, 
      output: "Text in clipboard", 
      explanation: "Copying text to OS clipboard.", 
      selenium: "Preparing file paths for upload." 
    },
    { 
      level: "Advanced", 
      title: "Robot Mouse Move", 
      code: `import java.awt.Robot;
Robot r = new Robot();
r.mouseMove(500, 500);`, 
      output: "Cursor moves", 
      explanation: "Moving OS cursor.", 
      selenium: "Bypassing anti-bot checks (rare)." 
    },
    { 
      level: "Advanced", 
      title: "Robot Mouse Click", 
      code: `/* r.mousePress(InputEvent.BUTTON1_DOWN_MASK);
r.mouseRelease(InputEvent.BUTTON1_DOWN_MASK); */`, 
      output: "Left click", 
      explanation: "Clicking OS cursor.", 
      selenium: "Clicking outside browser viewport." 
    },
    { 
      level: "Advanced", 
      title: "Robot Screen Capture", 
      code: `/* BufferedImage img = r.createScreenCapture(new Rectangle(Toolkit.getDefaultToolkit().getScreenSize())); */`, 
      output: "Screenshot taken", 
      explanation: "Capturing entire desktop.", 
      selenium: "Full OS-level test evidence." 
    },
    { 
      level: "Selenium-Oriented", 
      title: "Robot Keyboard Press", 
      code: `/* r.keyPress(KeyEvent.VK_ENTER);
r.keyRelease(KeyEvent.VK_ENTER); */`, 
      output: "Enter pressed", 
      explanation: "Native keystroke.", 
      selenium: "Dismissing OS alerts." 
    },
    { 
      level: "Selenium-Oriented", 
      title: "Robot File Upload", 
      code: `/* // Assuming path is in clipboard
r.keyPress(KeyEvent.VK_CONTROL);
r.keyPress(KeyEvent.VK_V);
r.keyRelease(KeyEvent.VK_V);
r.keyRelease(KeyEvent.VK_CONTROL);
r.keyPress(KeyEvent.VK_ENTER); */`, 
      output: "File path pasted and uploaded", 
      explanation: "Automating native file dialogs.", 
      selenium: "Standard file upload workaround." 
    }
  ],
  interview: [
    { q: "Why use Robot class in Selenium?", a: "To interact with OS-level dialogs that WebDriver cannot access." },
    { q: "A test needs to upload a file, and the click on 'Choose File' opens a native OS file picker dialog that WebDriver simply cannot see or interact with. Walk through why this happens and the two standard ways to solve it.", a: "WebDriver only automates the browser's DOM/rendering process — a native OS dialog is a completely separate process outside the browser's control, invisible to WebDriver entirely. The preferred fix is to skip the dialog altogether by calling sendKeys(filePath) directly on the <input type='file'> element (works for most modern browsers); the fallback when that's not possible is Robot class, which simulates real OS-level keyboard/mouse events to interact with the dialog." },
    { q: "Why is using Robot class considered a 'last resort' rather than a first choice for handling file uploads or OS popups?", a: "Robot operates at the OS input level (fake keypresses/clicks based on screen coordinates or focus), which is inherently fragile — it depends on window focus, screen resolution, OS dialog layout, and timing, none of which WebDriver can verify or wait on reliably. It also doesn't work at all in headless CI environments without a virtual display, making it a poor fit for most automated pipelines." },
    { q: "A Robot-based Robot.keyPress(KeyEvent.VK_ENTER) to dismiss a Windows security dialog works locally but fails in Jenkins running headless on a Linux CI agent. Why?", a: "Robot needs an actual (or virtual) display/windowing system to send input events to — a headless Linux CI agent without Xvfb (a virtual framebuffer) has no display for Robot to target, so the OS-level events have nowhere to go. This is a common gotcha when moving Robot-dependent tests from a developer's desktop into CI." },
    { q: "Why can't you use Robot.mouseMove() reliably to click a specific button inside a dynamically-positioned OS dialog, compared to how WebDriver locates elements?", a: "Robot has no concept of 'elements' at all — it only knows raw screen pixel coordinates, so if the dialog's position or size varies (different screen resolution, different OS theme, dialog remembers last position), your hardcoded coordinates miss the target. WebDriver's locator strategies (By.id, By.xpath) are resilient to layout shifts in a way that raw coordinate-based automation fundamentally is not." },
    { q: "What AWT concept explains why closing a Robot-driven native dialog doesn't automatically return control to your Selenium script the way closing a browser tab does?", a: "Native OS dialogs run in their own OS-level windows/processes, entirely outside the browser's window and JVM's rendering pipeline that Selenium was designed to observe — there's no WebDriver wait condition that can detect 'has this native dialog closed,' so scripts typically fall back to a fixed sleep or a loop polling Robot/AWT's own window state, which is inherently less reliable than a proper WebDriverWait." },
    { q: "If AWT components 'consume native OS resources and must be disposed' (per this module's common mistake), how does that risk manifest in a long-running test suite that repeatedly triggers Robot-based interactions?", a: "Each native resource handle (window references, input event queues) that isn't properly released can accumulate over hundreds of test executions, similar to file-handle or memory leaks elsewhere in the JVM — in a long CI run, this can degrade performance or eventually cause OS-level resource exhaustion, which is why Robot-based workarounds should be used sparingly and only when sendKeys()-based upload isn't viable." }
  ],
  handsOn: ["Use Robot to paste a file path into an OS file upload dialog."],
  memoryVis: "AWT components consume native OS resources and must be disposed.",
  challenges: [
    {
      title: "Prefer sendKeys over Robot when possible",
      prompt: "Fill in the WebElement method that uploads a file WITHOUT needing Robot or a native dialog at all.",
      code: `WebElement fileInput = driver.findElement(By.cssSelector("input[type='file']"));
fileInput.___1___("C:\\\\test\\\\sample.pdf");`,
      blanks: [
        { label: "method that types a value directly into an input", answer: "sendKeys" }
      ],
      explanation: "sendKeys(filePath) on a file input element bypasses the native OS dialog entirely for most browsers — always prefer this over Robot, which should be a last resort for cases sendKeys can't handle."
    },
    {
      title: "Simulate a key press with Robot",
      prompt: "Fill in the Robot method used to simulate pressing a key, such as dismissing a native OS dialog.",
      code: `Robot robot = new Robot();
robot.___1___(KeyEvent.VK_ENTER);
robot.keyRelease(KeyEvent.VK_ENTER);`,
      blanks: [
        { label: "Robot method simulating a key going down", answer: "keyPress" }
      ],
      explanation: "keyPress() simulates the key going down; keyRelease() simulates releasing it — both are needed to fully simulate a real keystroke since some dialogs listen for the release event."
    }
  ]
};
