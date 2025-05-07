import { forwardRef, HTMLAttributes, InputHTMLAttributes, ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";
import { LoginError } from "./login/feedback.module";
import { PiEye, PiEyeClosed } from "react-icons/pi";

type InputProps = {
  children?: ReactNode;
  secret?: boolean;
  error?: string | string[];
  container?: HTMLAttributes<HTMLDivElement>;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, secret, className, container, type, ...rest }: InputProps,
  ref
) {
  const [showInput, setShowInput] = useState(false);

  function handleShowSwitch() {
    setShowInput(!showInput);
  }

  return (
    <div {...container} className={twMerge(container?.className, "relative")}>
      <input
        {...rest}
        ref={ref}
        className={twMerge(
          "tail-text-input w-full autofill:bg-amber-50",
          secret && "text-security-none",
          error && "border-red-500/50 border-1",
          className
        )}
        type={secret ? (showInput ? "text" : "password") : type}
      />

      {secret && (
        <div
          onClick={handleShowSwitch}
          className="absolute top-0 right-0 h-full max-h-10 max-w-[15%] w-13 flex items-center justify-center hover:bg-foreground/30 bg-foreground/5 rounded-full cursor-pointer"
        >
          {showInput ? <PiEye  /> : <PiEyeClosed />}
        </div>
      )}
      <LoginError error={error} className="text-left mt-2" limit={1} />
    </div>
  );
});
