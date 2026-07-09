export const createNotes = (storage) => ({
  load() { return storage.getNotes(); },
  save(notes) { storage.setNotes(notes); },
});
