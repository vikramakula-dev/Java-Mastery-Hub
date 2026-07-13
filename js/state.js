export const modulesList = [
  "Introduction", "OOPS", "Interfaces", "Packages", "Strings",
  "Wrapper Classes", "Java IO", "Exception Handling",
  "Multithreading", "Nested Classes", "Enum & Garbage Collection",
  "Collections Framework", "Generics", "Lambdas & Functional Interfaces", "Streams & Optional",
  "Modern Java Features", "JVM", "Java Networking",
  "Maven & Gradle", "JDBC", "Hibernate & JPA", "Spring Boot", "REST APIs", "Logging", "JUnit & Mockito",
  "AWT", "Swing", "Design Patterns", "Coding Problems", "TestNG", "Selenium WebDriver", "Capstone Projects"
];

export const moduleFileMap = {
  "Introduction": "introduction",
  "OOPS": "oops",
  "Interfaces": "interfaces",
  "Packages": "packages",
  "Strings": "strings",
  "Wrapper Classes": "wrapper_classes",
  "Java IO": "java_io",
  "Exception Handling": "exception_handling",
  "Multithreading": "multithreading",
  "Nested Classes": "nested_classes",
  "Enum & Garbage Collection": "enum_gc",
  "Collections Framework": "collections",
  "Generics": "generics",
  "Lambdas & Functional Interfaces": "lambdas_functional",
  "Streams & Optional": "streams_optional",
  "Modern Java Features": "modern_java_features",
  "JVM": "jvm",
  "Java Networking": "java_networking",
  "Maven & Gradle": "maven_gradle",
  "JDBC": "jdbc",
  "Hibernate & JPA": "hibernate_jpa",
  "Spring Boot": "spring_boot",
  "REST APIs": "rest_apis",
  "Logging": "logging",
  "JUnit & Mockito": "junit_mockito",
  "AWT": "awt",
  "Swing": "swing",
  "Design Patterns": "design_patterns",
  "Coding Problems": "coding_problems",
  "TestNG": "testng",
  "Selenium WebDriver": "selenium_webdriver",
  "Capstone Projects": "capstone_projects"
};

function readStored(key, fallback) {
  try { 
    const v = localStorage.getItem(key); 
    return v ? JSON.parse(v) : fallback; 
  } catch(e) { 
    return fallback; 
  }
}

const savedCompleted = readStored("jm2_completed", []);
const savedNotes = readStored("jm2_notes", []);
const savedPractice = readStored("jm2_practice", {});
const savedModule = readStored("jm2_module", "Introduction");
const savedTab = readStored("jm2_tab", "overview");

const VALID_TABS = ["overview", "programs", "memory", "interview", "flashcards", "notes", "quiz", "challenges", "capstone"];

export const state = {
  module: modulesList.includes(savedModule) ? savedModule : "Introduction",
  tab: VALID_TABS.includes(savedTab) ? savedTab : "overview",
  search: "",
  completed: new Set(Array.isArray(savedCompleted) ? savedCompleted.filter(m => modulesList.includes(m)) : []),
  notes: (Array.isArray(savedNotes) ? savedNotes : []).filter(n => n && typeof n.title === "string" && typeof n.body === "string"),
  flipped: false,
  flashIndex: 0,
  currentData: null,
  practice: savedPractice && typeof savedPractice === "object" ? savedPractice : {}
};

export function saveState() {
  try {
    localStorage.setItem("jm2_completed", JSON.stringify([...state.completed]));
    localStorage.setItem("jm2_notes", JSON.stringify(state.notes));
    localStorage.setItem("jm2_practice", JSON.stringify(state.practice));
    localStorage.setItem("jm2_module", JSON.stringify(state.module));
    localStorage.setItem("jm2_tab", JSON.stringify(state.tab));
  } catch (e) {
    console.warn("Could not persist state (storage full or blocked):", e);
  }
}

export function getCompletionPct() {
  return Math.round((state.completed.size / modulesList.length) * 100);
}
