import { Logo } from "./icons/logo.module";
import { Account } from "./header/account.module";
import { twMerge } from "tailwind-merge";
import { HeaderFile } from "./header/file.module";
import { HeaderSyncStatus } from "./header/sync";

type HeaderProps = {
  showAccount?: boolean;
  showFile?: boolean;
  showSync?: boolean;
  fixed?: boolean;
};

export function Header({ showAccount = true, showFile = false, showSync = false, fixed }: HeaderProps) {
  function handlePushHome() {
    window.location.assign(window.location.origin);
  }

  return (
    <>
      {fixed && <div className="h-15" />}
      <header className={
        twMerge("w-full flex justify-between h-18 items-center border-b-foreground/5 border-b-1 px-8",
          fixed && "fixed top-0 left-0 bg-background",
          "z-[99]"
        )
      }>


        <div className={twMerge((!showAccount && !showFile) && "mx-auto sm:mx-0 my-0")}>
          <Logo className="h-8 sm:h-8 cursor-pointer" onClick={handlePushHome} />
        </div>

        {
          showFile && <HeaderFile />
        }


        <div className="flex gap-4">
          {
            showSync && <HeaderSyncStatus />
          }
          {showAccount && <Account />}
        </div>
      </header>
    </>
  );
}
