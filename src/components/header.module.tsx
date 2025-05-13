import { Logo } from "./icons/logo.module";
import { Account } from "./header/account.module";
import { twMerge } from "tailwind-merge";

type HeaderProps = {
  showAccount?: boolean;
  fixed?: boolean;
};

export function Header({ showAccount = true, fixed }: HeaderProps) {
  function handlePushHome() {
    window.location.assign(window.location.origin);
  }

  return (
    <>
    {fixed && <div className="h-15"/>}
    <header className={
      twMerge("w-full flex justify-between h-18 items-center border-b-foreground/5 border-b-1 px-8",
        fixed && "fixed top-0 left-0 bg-background",
        "z-[99]"
      )
    }>
      <div className={twMerge(!showAccount && "mx-auto sm:mx-0 my-0")}>
        <Logo className="h-8 sm:h-10 cursor-pointer" onClick={handlePushHome} />
      </div>

      {showAccount && <Account />}
    </header>
    </>
  );
}
