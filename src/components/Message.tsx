import classNames from "classnames";

interface MessageProps {
  message: string;
  error?: boolean;
}

const Message = ({ message, error }: MessageProps) => {
  const messageClasses = classNames(
    "p-4 w-full max-w-md text-center border-4",
    {
      "bg-rose-700 border-sky-900": error,
      "bg-sky-700 border-sky-900": !error,
    }
  );

  return <>{message && <div className={messageClasses}>{message}</div>}</>;
};

export default Message;
