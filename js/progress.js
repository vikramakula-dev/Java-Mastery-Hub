export const createProgress = (storage) => ({
  load() {
    return new Set(storage.getCompleted());
  },
  save(set) {
    storage.setCompleted([...set]);
  },
});
