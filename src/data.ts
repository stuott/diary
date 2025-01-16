import { openDB } from "idb";

const initDB = async () => {
  return openDB("diaryDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("entries")) {
        db.createObjectStore("entries", { keyPath: "date" });
      }
    },
  });
};

const saveEntryToDB = async (db: any, date: string, content: string) => {
  const tx = db.transaction("entries", "readwrite");
  const store = tx.objectStore("entries");
  await store.put({ date, content });
  await tx.done;
};

const deleteEntryFromDB = async (db: any, date: string) => {
  const tx = db.transaction("entries", "readwrite");
  const store = tx.objectStore("entries");
  await store.delete(date);
  await tx.done;
};

export { deleteEntryFromDB, initDB, saveEntryToDB };
