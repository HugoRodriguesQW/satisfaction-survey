import { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type LoginFeedbackProps = {
  visible: boolean;
  children: ReactNode;
  back: () => void;
  backDisable?: boolean;
  backText?: string;
};

export function LoginFeedback({ visible, children, back, backDisable = false, backText = "Back" }: LoginFeedbackProps) {
  return (
    <>
      {visible && (
        <div className="flex flex-col items-center text-center gap-2">
          <div>{children}</div>

          {!backDisable && (
            <button className="text-background bg-sky-500 p-2 px-6 rounded-md mt-4" onClick={back}>
              {backText}
            </button>
          )}
        </div>
      )}
    </>
  );
}

type LoginErrorProps = {
  error?: string | string[];
  limit?: number;
} & HTMLAttributes<HTMLDivElement>;

export function LoginError({ error, limit, className }: LoginErrorProps) {
  const limitedError = error?.slice(0, limit);

  return (
    <>
      {limitedError &&
        [...limitedError].map((error, i) => {
          return (
            <div className={twMerge("text-red-500 opacity-80 text-center", className)} key={"login-error-" + i}>
              {error}
            </div>
          );
        })}
    </>
  );
}
