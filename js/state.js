export const modulesList = [
  "Introduction", "OOPS", "Interfaces", "Packages", "Strings",
  "Wrapper Classes", "Java IO", "Exception Handling",
  "Multithreading", "Nested Classes", "Enum & Garbage Collection",
  "Collections Framework", "Java Networking", "AWT", "Swing", "JVM",
  "Generics", "Lambdas & Functional Interfaces", "Streams & Optional",
  "Coding Problems", "TestNG", "Selenium WebDriver",
  "Design Patterns", "Capstone Projects"
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
  "Java Networking": "java_networking",
  "AWT": "awt",
  "Swing": "swing",
  "JVM": "jvm",
  "Generics": "generics",
  "Lambdas & Functional Interfaces": "lambdas_functional",
  "Streams & Optional": "streams_optional",
  "Coding Problems": "coding_problems",
  "TestNG": "testng",
  "Selenium WebDriver": "selenium_webdriver",
  "Design Patterns": "design_patterns",
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
