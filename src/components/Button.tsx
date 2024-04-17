"use client";

type ButtonProps = {
  id: string;
  label: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick: () => void;
  className?: string;
};

export default function Button({
  id,
  label,
  type = "submit",
  disabled,
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${
        className || ""
      } rounded-md bg-orange-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300`}
    >
      {label}
    </button>
  );
}
