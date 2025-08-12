"use client";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons/lib";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  outlined?: boolean;
  small?: boolean;
  icon?: IconType;
  className?: string;
  type?: "submit" | "button" | "reset" | undefined;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button = ({
  label,
  disabled,
  outlined,
  small,
  icon: Icon,
  className,
  type,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "disabled:opacity-50 disabled:cursor-not-allowed gap-2 rounded-md border-slate-300 dark:border-slate-700 bg-slate-700  transition w-auto flex items-center justify-center text-white border-2 my-2 px-5 py-3 hover:opacity-80",
        outlined &&
          "bg-transparent text-slate-700 dark:text-slate-300 dark:bg-transparent",
        small && "text-sm py-1 px-2 border-[1px]",
        className && className
      )}
      onClick={onClick}
    >
      {Icon && <Icon />}
      {label}
    </button>
  );
};

export default Button;
