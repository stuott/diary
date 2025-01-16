import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

interface ButtonProps {
  text?: string;
  icon?: IconDefinition;
  tooltip?: string;
  onClick: () => void;
}

const Button = ({ text, icon, tooltip, onClick }: ButtonProps) => {
  const buttonClasses = classNames(
    "p-2 h-16 w-16 text-2xl text-zinc-500",
    "border border-transparent",
    "transition hover:text-white hover:border-zinc-400"
  );
  return (
    <button className={buttonClasses} onClick={onClick} title={tooltip}>
      {text}
      {icon && <FontAwesomeIcon icon={icon} />}
    </button>
  );
};

export default Button;
