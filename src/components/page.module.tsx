import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

export function PageContainer({ children }: ContainerProps) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {children}
    </div>
  )
}

export function MainContainer({ children }: ContainerProps) {
  return (<main className="flex flex-col gap-[32px] items-center max-w-[350px] w-full">{children}</main>)
}
