import Image from "next/image";
import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  hidden,
  inputProps,
  placeholder,
  iconAlt,
  iconSrc,
}: InputFieldProps & {
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full"}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <div className="flex items-center rounded-md border border-dark-500 bg-dark-400">
        {iconSrc && (
          <Image
            src={iconSrc}
            height={24}
            width={24}
            alt={iconAlt || "icon"}
            className="ml-2"
          />
        )}
        <input
          type={type}
          {...register(name)}
          className="flex rounded-md  border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none  focus-visible:ring-ring  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-[#f4f4f4] placeholder:text-dark-600 border-dark-500 h-11 focus-visible:ring-0 ring-0 focus-visible:ring-offset-0 border-0 w-full"
          {...inputProps}
          defaultValue={defaultValue}
          placeholder={placeholder}
        />
      </div>
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
