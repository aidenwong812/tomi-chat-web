// import React from "react";
import { classNames } from "../../../helpers";

interface ToggleButtonProps {
  /**
   * Is the toggle on?
   */
  isOn: boolean;
  /**
   * Function to call when the toggle is clicked
   */
  onToggle: () => void;
  /**
   * Optional size prop
   */
  size?: "small" | "medium" | "large";
  /**
   * Optional test id for the button
   */
  testId?: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  isOn,
  onToggle,
  size = "small",
  testId,
}) => {
  const sizeClasses = {
    small: "w-8 h-4",
    medium: "w-11 h-6",
    large: "w-14 h-7",
  };

  const toggleClasses = {
    small: "h-3 w-3",
    medium: "h-5 w-5",
    large: "h-6 w-6",
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      className={classNames(
        "relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#bdbdbd] transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        sizeClasses[size],
      )}
      data-testid={testId}>
      <span className="sr-only">Use setting</span>
      <span
        className={classNames(
          "pointer-events-none inline-block transform rounded-full shadow ring-0 transition duration-200 ease-in-out focus:outline-none",
          isOn
            ? "translate-x-[130%] bg-[#FF0083] rounded-full"
            : "translate-x-0 bg-white rounded-full",
          toggleClasses[size],
        )}
      />
    </button>
  );
};
