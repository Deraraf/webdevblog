import { cn } from "@/lib/utils";
import {
  Path,
  UseFormRegister,
  FieldValues,
  FieldErrors,
} from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  id: string;
  label?: string;
  type?: string;
  register: UseFormRegister<T>;
  inputClassName?: string;
  disabled?: boolean;
  placeholder: string;
  errors: FieldErrors;
}

const FormField = <T extends FieldValues>({
  id,
  label,
  type,
  register,
  inputClassName,
  disabled,
  placeholder,
  errors,
}: FormFieldProps<T>) => {
  const message = errors[id] && (errors[id]?.message as string);
  return (
    <div className="dark:text-white">
      {label && <span className="block text-sm">{label}</span>}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        {...register(id as Path<T>)}
        className={cn(
          "w-full p-3 my-2 rounded-md border border-slate-300 dark:border-slate-700  disabled:opacity-70 disabled:cursor-not-allowed",
          errors[id] && "border-rose-400",
          inputClassName
        )}
      />
      {message && <p className="text-rose-400 text-sm mt-1">{message}</p>}
    </div>
  );
};

export default FormField;
