export const createSearchIndex = (modules = []) => {
  const index = [];
  modules.forEach((m) => {
    const haystack = [
      m.title,
      m.concept || "",
      m.selenium || "",
      ...(m.examples || []).map((x) => `${x.input} ${x.execution} ${x.output}`),
      ...(m.interview?.beginner || []),
      ...(m.interview?.intermediate || []),
      ...(m.interview?.advanced || []),
    ].join(" ").toLowerCase();
    index.push({ id: m.title, haystack });
  });
  return {
    search(query) {
      const q = query.trim().toLowerCase();
      if (!q) return modules;
      return modules.filter((m, i) => index[i].haystack.includes(q));
    },
  };
};
