import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

export function PageContainer({ children }: ContainerProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-clip grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      {children}
    </div>
  )
}

export function MainContainer({ children }: ContainerProps) {
  return (<main className="flex flex-col gap-[32px] items-center max-w-[350px] w-full">{children}</main>)
}
