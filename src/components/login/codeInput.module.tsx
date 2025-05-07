import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

type CodeInputProps = {
  length: number;
  onChange?: (code: string) => void;
  onSubmit?: (code: string) => void;
} & Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onSubmit" | "length">;

export function CodeInput({ onChange, onSubmit, length, className, ...rest }: CodeInputProps) {
  const [code, setCode] = useState<string>("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (code) {
      onChange?.(code);

      if (code && code.match(/\d/g)?.length == length) {
        onSubmit?.(code);
      }
    }
  }, [code, onChange, onSubmit, length]);

  function updateChar(index: number, chars: string) {
    const newCode = (code.substring(0, index) + chars + code.substring(index + chars.length))
      .substring(0, length)
      .trimEnd();
    setCode(newCode);
    if (chars === " ") inputRefs.current[index - 1]?.focus();
    if (chars !== " ") inputRefs.current[index + (chars.length - 1)]?.focus();
  }

  return (
    <div className={twMerge("flex flex-nowrap justify-between w-full", className)} {...rest}>
      {new Array(length).fill(null).map((_, i) => {
        return (
          <input
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            value={code[i] ?? ""}
            className="bg-foreground/5 py-5 text-foreground text-3xl text-center"
            type="number"
            placeholder="0"
            step="1"
            min="0"
            max="9"
            key={i + "code_input"}
            onKeyDown={(event) => {
              if (event.key === "Backspace") {
                updateChar(i, " ");
              }
            }}
            onChange={(event) => {
              if (event.target.value.length) {
                updateChar(i, event.target.value);
              }
              event.target.value = event.target.value.substring(-1);
            }}
          ></input>
        );
      })}
    </div>
  );
}
