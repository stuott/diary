import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Button from "./components/Button";
import ControlBar from "./components/ControlBar";
import Message from "./components/Message";
import { deleteEntryFromDB, initDB, saveEntryToDB } from "./data";

const App = () => {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState<{ [date: string]: string }>({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const db = await initDB();
        const entry = await db.get("entries", selectedDate);
        if (entry) {
          setEntry(entry.content);
        } else {
          setEntry("");
        }
        clearBanner();
      } catch (error) {
        console.error("Error fetching entry:", error);
        setErrorMessage("Error fetching entry");
      }
    };
    fetchEntry();
  }, [selectedDate]);

  const setInfoMessage = (message: string) => {
    setError(false);
    setMessage(message);
  };

  const setErrorMessage = (message: string) => {
    setError(true);
    setMessage(message);
  };

  const clearBanner = () => {
    setError(false);
    setMessage("");
  };

  const handleSave = async () => {
    const newEntries = {
      ...entries,
      [selectedDate]: entry,
    };
    setEntries(newEntries);
    try {
      const db = await initDB();
      await saveEntryToDB(db, selectedDate, entry);
      setInfoMessage("Entry saved");
    } catch (error) {
      console.error("Error saving entries:", error);
      setErrorMessage("Error saving entry");
    }
  };

  const handleClear = async () => {
    const newEntries = { ...entries };
    delete newEntries[selectedDate];
    setEntries(newEntries);
    try {
      const db = await initDB();
      await deleteEntryFromDB(db, selectedDate);
      setInfoMessage("Entry cleared");
    } catch (error) {
      console.error("Error clearing entry:", error);
      setErrorMessage("Error clearing entry");
    }
    setEntry("");
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    const newDateString = newDate.toISOString().split("T")[0];
    setSelectedDate(newDateString);
    setEntry(entries[newDateString] || "");
  };

  addHotkeys(handleSave, handleClear, handleDateChange, setSelectedDate);

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-zinc-800 min-h-screen text-white">
      <ControlBar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        handleDateChange={handleDateChange}
      />
      <textarea
        className="p-2 w-full max-w-xl bg-zinc-700 border-0 h-96"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />
      <div className="space-x-6">
        <Button
          icon={faSave}
          onClick={handleSave}
          tooltip="Save entry (Ctrl+S)"
        />
        <Button
          icon={faTrash}
          onClick={handleClear}
          tooltip="Clear entry for day (Ctrl+D)"
        />
      </div>
      <Message message={message} error={error} />
    </div>
  );
};

const addHotkeys = (
  saveCallback: () => void,
  clearCallback: () => void,
  handleDateChange: (days: number) => void,
  setSelectedDate: (date: string) => void
) => {
  document.addEventListener("keydown", (event) => {
    if (!event.ctrlKey) return;

    if (event.key === "s") {
      event.preventDefault();
      saveCallback();
      return;
    }

    if (event.key === "[") {
      event.preventDefault();
      handleDateChange(-1);
      return;
    }

    if (event.key === "]") {
      event.preventDefault();
      handleDateChange(1);
      return;
    }

    if (event.key === "t") {
      event.preventDefault();
      setSelectedDate(new Date().toISOString().split("T")[0]);
      return;
    }

    if (event.key === "d") {
      event.preventDefault();
      clearCallback();
      return;
    }
  });
};

export default App;
