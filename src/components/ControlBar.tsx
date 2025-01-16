import {
  faArrowLeft,
  faArrowRight,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

interface ControlBarProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  handleDateChange: (days: number) => void;
}

const ControlBar = ({
  selectedDate,
  setSelectedDate,
  handleDateChange,
}: ControlBarProps) => (
  <div className="mb-4 space-x-6 items-center text-white">
    <Button
      icon={faArrowLeft}
      onClick={() => handleDateChange(-1)}
      tooltip="Go to previous day (Ctrl+[)"
    />
    <input
      type="date"
      className="text-xl p-5 bg-transparent border border-transparent hover:border-zinc-400 transition"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
    />
    <Button
      icon={faCalendarDay}
      onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
      tooltip="Today (Ctrl+T)"
    />
    <Button
      icon={faArrowRight}
      onClick={() => handleDateChange(1)}
      tooltip="Go to next day (Ctrl+])"
    />
  </div>
);

export default ControlBar;
