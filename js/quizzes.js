export const createQuizzes = () => ({
  score(answers) {
    return answers.filter(Boolean).length;
  },
});
