import { Logo } from "./icons/logo.module";
import { Account } from "./header/account.module";
import { twMerge } from "tailwind-merge";
import { HeaderFile } from "./header/file.module";
import { ApplySurveyHeader } from "./header/apply.module";


type HeaderProps = {
  showAccount?: boolean;
  showFile?: boolean;
  fixed?: boolean;
  surveyName?: string,
  showSurveyName?: boolean
};

export function Header({ showAccount = true, showFile = false, showSurveyName = false, surveyName, fixed }: HeaderProps) {
  function handlePushHome() {
    window.location.assign(window.location.origin);
  }

  return (
    <>
      {fixed && <div className="h-15" />}
      <header className={
        twMerge("w-full flex justify-between h-18 items-center border-b-foreground/5 border-b-1 px-8  backdrop-blur-md",
          fixed && "fixed top-0 left-0 bg-background",
          "z-[99]"
        )
      }>


        <div className={twMerge((!showAccount && !showFile && !showSurveyName) && "mx-auto sm:mx-0 my-0", (showSurveyName && "max-[500px]:mx-auto"))}>
          <Logo className="h-8 sm:h-8 cursor-pointer" onClick={handlePushHome} />
        </div>

        {
          showFile && <HeaderFile />
        }

        {showSurveyName && (
          <>
            <ApplySurveyHeader name={surveyName} />
            {!showAccount && <div className="flex-1 max-sm:hidden" />}
          </>
        )}


        {showAccount && <Account />}

      </header>
    </>
  );
}
