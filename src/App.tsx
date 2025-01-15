import { useEffect, useState } from "react";
import "./App.css";

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
    };
  }
}

const App = () => {
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState<{ [date: string]: string[] }>({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await window.electron.ipcRenderer.invoke(
          "get-entries"
        );
        setEntries(response);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };
    fetchEntries();
  }, []);

  const handleSave = async () => {
    const newEntries = {
      ...entries,
      [selectedDate]: [...(entries[selectedDate] || []), entry],
    };
    setEntries(newEntries);
    try {
      await window.electron.ipcRenderer.invoke("save-entries", newEntries);
    } catch (error) {
      console.error("Error saving entries:", error);
    }
    setEntry("");
  };

  const handleClear = async () => {
    setEntries({});
    try {
      await window.electron.ipcRenderer.invoke("clear-entries");
    } catch (error) {
      console.error("Error clearing entries:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 min-h-screen text-white">
      <h1 className="mb-4 text-2xl">Diary</h1>
      <input
        type="date"
        className="mb-4 p-2 bg-gray-700 border border-gray-600 rounded"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <textarea
        className="mb-4 p-2 w-full max-w-md bg-gray-700 border border-gray-600 rounded"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />
      <button
        className="mb-4 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
        onClick={handleSave}
      >
        Save
      </button>
      <button
        className="mb-4 p-2 bg-red-500 hover:bg-red-700 text-white rounded"
        onClick={handleClear}
      >
        Clear
      </button>
      <ul className="w-full max-w-md">
        {Object.keys(entries)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
          .map((date) => (
            <li
              key={date}
              className="mb-2 p-2 bg-gray-700 border border-gray-600 rounded"
            >
              <strong>{date}</strong>
              <ul>
                {entries[date].map((entry, index) => (
                  <li
                    key={index}
                    className="mb-2 p-2 bg-gray-600 border border-gray-500 rounded"
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default App;
