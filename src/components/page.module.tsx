import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ContainerProps = {
  noOverflow?: boolean;
  children: ReactNode;
};

export function PageContainer({ children, noOverflow }: ContainerProps) {
  return (
    <div className={
      twMerge(
        "fixed top-0 left-0 w-full h-full overflow-auto grid grid-rows-[20px_1fr] items-center justify-items-center pb-0 gap-16 pt-8 font-[family-name:var(--font-geist-sans)]",
        noOverflow && "overflow-clip"
      )
    }>
      {children}
    </div>
  )
}

export function MainContainer({ children }: ContainerProps) {
  return (<main className="flex flex-col gap-[32px] items-center max-w-[350px] w-full">{children}</main>)
}
