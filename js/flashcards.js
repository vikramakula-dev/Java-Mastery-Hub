export const createFlashcards = () => ({
  next(index, length) {
    return length ? (index + 1) % length : 0;
  },
});
