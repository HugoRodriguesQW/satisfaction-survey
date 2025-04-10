import { Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from "react";
import { CgSpinnerAlt } from "react-icons/cg";
import { HiArrowSmRight } from "react-icons/hi";
import { RiArrowRightSLine } from "react-icons/ri";
import { twMerge } from "tailwind-merge";

export function Login() {
  const STEP = {
    email: 0,
    login: 1,
    register: 2,
  };

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [name, setName] = useState<string>();

  const [step, setStep] = useState(STEP.email);
  const [fetching, setFetching] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function handleUpdate(
    value: string,
    setter: Dispatch<SetStateAction<string | undefined>>
  ) {
    setter(value);
  }

  function handleEmailSubmit() {
    setFetching(true);
    setTimeout(() => {
      setStep(STEP.login);
      setFetching(false);
    }, 2000);
  }

  function handleLoginSubmit() {
    setFetching(true);
    console.info({ email, password });
    setTimeout(() => {
      setFetching(false);
      setShowForgot(true);
    }, 2000);
  }

  function handleRegisterSubmit() {
    setFetching(true);
    console.info({ email, password, name });
    setTimeout(() => {
      setFetching(false);
    }, 2000);
  }

  function handleFormSubmit(e?: InputEvent | FormEvent) {
    e?.preventDefault();

    if (fetching) return;

    switch (step) {
      case STEP.email:
        handleEmailSubmit();
        break;
      case STEP.login:
        handleLoginSubmit();
        break;
      case STEP.register:
        handleRegisterSubmit();
    }
  }

  useEffect(() => {
    switch (step) {
      case STEP.email:
        emailRef.current?.focus();
        break;
      case STEP.login:
      case STEP.register:
        passwordRef.current?.focus();
    }
  }, [step]);

  return (
    <>
      <div className="text-2xl">Login</div>
      <form
        noValidate
        onSubmit={handleFormSubmit}
        className="flex gap-3 items-stretch w-full text-black/[.7] dark:text-white/[.7]"
        style={{
          flexDirection: step == STEP.email ? "row" : "column",
        }}
      >
        <input
          disabled={fetching}
          ref={emailRef}
          onChange={(e) => handleUpdate(e.target.value, setEmail)}
          placeholder="Email"
          type="email"
          className="bg-black/[.05] dark:bg-white/[.05] p-2 px-3 rounded-full outline-0 flex-1"
        />

        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "1fr auto",
            gridAutoFlow: "row",
          }}
        >
          {[STEP.login, STEP.register].includes(step) && (
            <input
              disabled={fetching}
              ref={passwordRef}
              onChange={(e) => handleUpdate(e.target.value, setPassword)}
              placeholder="Password"
              type="password"
              className={twMerge(
                "bg-black/[.05] dark:bg-white/[.05] p-2  px-3 rounded-full outline-0 flex-1",
                step === STEP.register && "col-span-2"
              )}
            />
          )}

          {step === STEP.register && (
            <>
              <input
                disabled={fetching}
                onChange={(e) => handleUpdate(e.target.value, setName)}
                placeholder="Name"
                type="text"
                className="bg-black/[.05] dark:bg-white/[.05] p-2  px-3 rounded-full outline-0 flex-1"
              />
            </>
          )}

          <button
            disabled={fetching}
            className="bg-sky-600 rounded-full p-1 px-4 cursor-pointer"
            onClick={handleFormSubmit}
          >
            {fetching ? (
              <CgSpinnerAlt className="h-7 w-7 animate-spin" />
            ) : (
              <HiArrowSmRight className="h-7 w-7" />
            )}
          </button>
        </div>

        {step === STEP.login && (
          <>
            <div
              className="text-sky-500 flex flex-row items-center pt-4 gap-1 my-0 mx-auto cursor-pointer"
              onClick={() => {
                setStep(STEP.register);
              }}
            >
              Create new Account <RiArrowRightSLine />
            </div>

            {showForgot && (
              <div
                className="text-sky-500 flex flex-row items-center gap-1 my-0 mx-auto cursor-pointer"
                onClick={() => {
                  alert("forgot password page");
                }}
              >
                Forgot the password?
              </div>
            )}
          </>
        )}

        {step === STEP.register && (
          <div
            className="text-sky-500 flex flex-row items-center gap-1 my-0 mx-auto cursor-pointer"
            onClick={() => {
              setStep(STEP.login);
            }}
          >
            Login instead?
          </div>
        )}
      </form>
    </>
  );
}
