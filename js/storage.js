const prefix = "j4s_";

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(prefix + key);
    return value == null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(prefix + key, JSON.stringify(value));

export const storage = {
  getNotes: () => read("notes", []),
  setNotes: (notes) => write("notes", notes),
  getCompleted: () => read("completed", []),
  setCompleted: (items) => write("completed", items),
  getPractice: () => read("practice", {}),
  setPractice: (data) => write("practice", data),
  getPreferences: () => read("preferences", {}),
  setPreferences: (data) => write("preferences", data),
  getQuizScores: () => read("quizScores", {}),
  setQuizScores: (data) => write("quizScores", data),
};
