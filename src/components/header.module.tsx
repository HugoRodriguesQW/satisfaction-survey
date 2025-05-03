import { Logo } from "./icons/logo.module";
import { Account } from "./header/account.module";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/router";

type HeaderProps = {
  showAccount?: boolean;

};

export function Header({ showAccount = true }: HeaderProps) {

  const router = useRouter()

  function handlePushHome() {
    router.push("/")
  }

  return (
    <header className="w-full flex justify-between h-18 items-center border-b-foreground/5 border-b-1">
      <div className={
        twMerge(!showAccount && "mx-auto sm:mx-0 my-0")
      }>
        <Logo className="h-8 sm:h-10 cursor-pointer" onClick={handlePushHome} />
      </div>

      {showAccount && <Account />}
     
    </header>
  );
}
