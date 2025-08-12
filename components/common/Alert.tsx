import { cn } from "@/lib/utils";
import React from "react";
import { BiError } from "react-icons/bi";
import {
  IoIosCheckmarkCircleOutline,
  IoIosInformationCircleOutline,
} from "react-icons/io";

const Alert = ({
  error,
  success,
  message,
  className,
}: {
  error?: boolean;
  success?: boolean;
  message?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center my-2 gap-2 rounded-md border p-3",
        error && "border-rose-400 bg-rose-50 text-rose-400",
        success && "border-green-400 bg-green-50 text-green-500",
        !error && !success && "border-blue-400 bg-blue-50 text-blue-500",
        className
      )}
    >
      <span>
        {error && <BiError size={20} />}
        {success && <IoIosCheckmarkCircleOutline size={20} />}
        {!error && !success && <IoIosInformationCircleOutline size={20} />}
      </span>
      {message}
    </div>
  );
};

export default Alert;
