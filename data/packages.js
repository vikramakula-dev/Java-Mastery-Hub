export const packagesData = {
  title: "Packages and Access Modifiers",
  concept: "Packages are used to group related classes. Access Modifiers (public, private, protected, default) define the visibility of classes, methods, and variables.",
  why: "To avoid name conflicts, provide access control, and organize large codebases (like testing frameworks).",
  realWorld: "Packages are like folders on your computer. Access modifiers are like permissions (public = everyone, private = only you).",
  seleniumMapping: "Frameworks are structured using packages (e.g., com.project.pages, com.project.tests).",
  commonMistakes: [
    "Leaving instance variables as 'default' (package-private) instead of 'private' in Page Classes.",
    "Importing the wrong class when multiple exist with the same name (e.g., java.util.List vs java.awt.List)."
  ],
  examples: [
    {
      level: "Beginner",
      title: "Creating a Package",
      code: `package com.automation.utils;
public class Helper {
    public static void print(String msg) {
        System.out.println(msg);
    }
    public static void main(String[] args) {
        print("Hello from utils package");
    }
}`,
      output: "Hello from utils package",
      explanation: "The 'package' keyword must be the first line of the file.",
      selenium: "Essential for structuring automation frameworks into pages, tests, and utils."
    },
    {
      level: "Beginner",
      title: "Importing a Class",
      code: `import java.util.Scanner;
public class InputTest {
    public static void main(String[] args) {
        // Scanner sc = new Scanner(System.in);
        System.out.println("Scanner imported successfully");
    }
}`,
      output: "Scanner imported successfully",
      explanation: "Used to access classes from other packages.",
      selenium: "import org.openqa.selenium.WebDriver; is needed in every test class."
    },
    {
      level: "Beginner",
      title: "Public Access Modifier",
      code: `public class PublicExample {
    public String message = "Accessible everywhere";
    public static void main(String[] args) {
        System.out.println(new PublicExample().message);
    }
}`,
      output: "Accessible everywhere",
      explanation: "The member is accessible from any other class.",
      selenium: "Test methods (@Test) and Page Object action methods must be public."
    },
    {
      level: "Intermediate",
      title: "Private Access Modifier",
      code: `class PrivateExample {
    private String secret = "Hidden";
    public String getSecret() { return secret; }
    public static void main(String[] args) {
        PrivateExample p = new PrivateExample();
        System.out.println(p.getSecret());
    }
}`,
      output: "Hidden",
      explanation: "Accessible only within the same class.",
      selenium: "WebElements/Locators in Page Object Model should be private."
    },
    {
      level: "Intermediate",
      title: "Protected Access Modifier",
      code: `class Parent {
    protected void setup() { System.out.println("Setup logic"); }
}
class Child extends Parent {
    public static void main(String[] args) {
        Child c = new Child();
        c.setup(); // Accessible in subclass
    }
}`,
      output: "Setup logic",
      explanation: "Accessible in the same package and subclasses in different packages.",
      selenium: "Useful in a BaseTest class for methods that only Test classes should access."
    },
    {
      level: "Intermediate",
      title: "Default (Package-Private)",
      code: `class DefaultExample {
    String name = "No modifier"; // Package-private
    public static void main(String[] args) {
        System.out.println(new DefaultExample().name);
    }
}`,
      output: "No modifier",
      explanation: "If no modifier is specified, accessible only within the same package.",
      selenium: "Rarely used intentionally in automation; usually a sign of forgotten 'private'."
    },
    {
      level: "Advanced",
      title: "Static Imports",
      code: `import static java.lang.Math.PI;
import static java.lang.Math.pow;
public class StaticImport {
    public static void main(String[] args) {
        double area = PI * pow(5, 2);
        System.out.println("Area: " + area);
    }
}`,
      output: "Area: 78.53981633974483",
      explanation: "Allows accessing static members without qualifying them with the class name.",
      selenium: "Often used with TestNG Assertions (e.g., import static org.testng.Assert.*;)."
    },
    {
      level: "Advanced",
      title: "Fully Qualified Class Names",
      code: `public class FQCN {
    public static void main(String[] args) {
        java.util.Date date = new java.util.Date();
        System.out.println("Date class instantiated");
    }
}`,
      output: "Date class instantiated",
      explanation: "Using the complete package path instead of an import statement.",
      selenium: "Used when resolving class name conflicts (e.g., java.util.List vs org.awt.List)."
    },
    {
      level: "Selenium-Oriented",
      title: "Framework Package Structure",
      code: `package com.framework.base;
public class BasePage {
    protected void log(String msg) {
        System.out.println("LOG: " + msg);
    }
    public static void main(String[] args) {
        new BasePage().log("Initialized");
    }
}`,
      output: "LOG: Initialized",
      explanation: "Organizing base utilities in their own package.",
      selenium: "Demonstrates standard automation framework hierarchy."
    },
    {
      level: "Selenium-Oriented",
      title: "Encapsulating Locators",
      code: `class LoginPage {
    // Private locators
    private String btnLogin = "loginBtn";
    // Public action method
    public void clickLogin() {
        System.out.println("Clicking element: " + btnLogin);
    }
    public static void main(String[] args) {
        new LoginPage().clickLogin();
    }
}`,
      output: "Clicking element: loginBtn",
      explanation: "Combining private access and public methods.",
      selenium: "The absolute standard for Page Object Model implementation."
    }
  ],
  interview: [
    { q: "What is the difference between protected and default access modifiers?", a: "Default is accessible only within the same package. Protected is accessible in the same package AND subclasses in other packages." },
    { q: "Why make locators private in POM?", a: "To enforce encapsulation. Test classes shouldn't manipulate locators directly; they should call business-logic methods on the Page Class." },
    { q: "You're designing a framework's folder structure: pages, tests, utils, config. What determines where a helper class like RetryUtil should live, and why does it matter for imports?", a: "It should live in the package that reflects its role (utils), because Java's package structure must match the folder structure exactly — 'package com.framework.utils;' at the top of the file must correspond to a utils/ folder. Getting this wrong causes 'package does not match expected directory' compile errors, and putting it in the wrong package forces awkward imports everywhere it's used." },
    { q: "A BasePage class in the 'pages' package has a protected WebDriver field. A test class in a completely different package, 'tests', tries to access it directly and fails to compile. Why, and is this a bug or intentional design?", a: "This is intentional — protected grants access to the same package AND subclasses, but the test class is neither in the pages package nor a subclass of BasePage, so access is correctly denied. This is exactly why Page Objects expose public action methods instead: the test package is meant to interact through the public API, not reach into internals." },
    { q: "Your framework has two classes both named 'Config' — one in com.framework.core, one in com.framework.reporting. How does Java tell them apart, and what happens if a file imports both without qualification?", a: "Packages create fully-qualified names (com.framework.core.Config vs com.framework.reporting.Config), so Java treats them as entirely distinct types despite the shared simple name. Importing both unqualified in the same file causes an ambiguity compile error — you'd need to fully qualify at least one usage or import only one and reference the other by its full path." },
    { q: "Why is 'import java.util.*;' generally discouraged in production framework code even though it saves typing?", a: "Wildcard imports pull in every class from that package's namespace, increasing the chance of a naming collision (e.g., java.util.List vs java.awt.List) and making it less obvious at a glance which specific classes a file actually depends on. Explicit imports are slightly more typing but make dependencies self-documenting and collisions impossible." },
    { q: "What access modifier would you choose for a Page Object's constructor, and why does that choice matter for how tests instantiate pages?", a: "Public — test classes in a different package need to call 'new LoginPage(driver)' directly, so the constructor must be accessible outside the pages package. If it were package-private (default) or private, only classes inside the pages package (or the class itself) could construct a LoginPage, which would break the framework's usage pattern." },
    { q: "Two teams merge their Selenium frameworks and both have a class named 'TestUtils' in the default (no-name) package. What problem does this cause, and how does adding proper packages fix it?", a: "Classes in the default package can't be imported by name from named packages, and having two same-named classes with no package creates an unresolvable naming collision the moment both are on the same classpath. Moving each into a distinct package (e.g., com.teamA.utils.TestUtils vs com.teamB.utils.TestUtils) makes both fully addressable and coexistable." },
    { q: "If a class member has no access modifier at all (just 'String locator;'), what is its actual visibility, and why might a framework deliberately choose this over private?", a: "That's default (package-private) visibility — accessible to any class in the same package, but not subclasses in other packages or unrelated classes. A framework might use this intentionally so helper classes within the same 'pages' package can share internals directly without full public exposure to test code outside the package." }
  ],
  handsOn: [
    "Create three packages: pages, tests, utils. Try accessing a default variable from 'pages' inside 'tests'."
  ],
  memoryVis: "Public = Public Park, Private = Your Bedroom, Protected = Family-only room, Default = Housemates only.",
  challenges: [
    {
      title: "Fix the encapsulation leak",
      prompt: "This locator field should not be touchable from other packages. Fill in the correct access modifier.",
      code: `package com.framework.pages;

public class LoginPage {
    ___1___ String usernameLocator = "id=user";
}`,
      blanks: [
        { label: "most restrictive access modifier", answer: "private" }
      ],
      explanation: "private restricts access to LoginPage itself — no other class, even in the same package, can touch the field directly. Test classes should go through public methods instead."
    },
    {
      title: "Complete the package declaration",
      prompt: "Fill in the keyword that must be the very first statement in a Java source file declaring its package.",
      code: `___1___ com.framework.tests;

public class LoginTest { }`,
      blanks: [
        { label: "keyword declaring which package this file belongs to", answer: "package" }
      ],
      explanation: "The 'package' statement must be the first non-comment line in the file, and it must match the folder structure exactly — com/framework/tests/LoginTest.java."
    },
    {
      title: "Pick the modifier for cross-package subclass access",
      prompt: "A BasePage field needs to be visible to Page Object subclasses in OTHER packages, but not to unrelated classes. Fill in the modifier.",
      code: `public abstract class BasePage {
    ___1___ WebDriver driver;
}`,
      blanks: [
        { label: "access modifier: same package + subclasses anywhere", answer: "protected" }
      ],
      explanation: "protected is the one modifier that extends visibility to subclasses even outside the package — exactly what's needed when Page Objects living in different packages extend a shared BasePage."
    }
  ]
};
