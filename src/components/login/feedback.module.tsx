import { ReactNode } from "react";

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
