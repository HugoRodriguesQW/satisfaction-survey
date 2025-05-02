import { Logo } from "./icons/logo.module";
import { Account } from "./header/account.module";

export function Header() {

  return (
    <header className="w-full flex justify-between h-18 items-center border-b-foreground/5 border-b-1">
      <div>
        <Logo className="h-10" />
      </div>

      <Account />
    </header>
  );
}
