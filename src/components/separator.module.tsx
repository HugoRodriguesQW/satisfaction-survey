import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type SeparatorProps = {
  orientation?: "vertical" | "horizontal";
} & HTMLAttributes<HTMLDivElement>;

export function Separator({ orientation = "horizontal", className, ...rest }: SeparatorProps) {
  return (
    <div
      {...rest}
      className={twMerge(
        orientation === "vertical" ? "border-l w-1 h-full" : "border-t h-1 w-full",
        "border-foreground/15",
        className
      )}
    />
  );
}
