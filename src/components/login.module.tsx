/* eslint-disable react-hooks/exhaustive-deps */
import { sessionContext } from "@/context/sessionContext.module";
import { nextTask } from "@/resources/transactions";
import type { Transaction } from "@/resources/transactions";
import { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { CgSpinnerAlt } from "react-icons/cg";
import { HiArrowSmRight } from "react-icons/hi";
import { RiArrowRightSLine } from "react-icons/ri";
import { twMerge } from "tailwind-merge";
import { CodeInput } from "./codeInput.module";
import { hideEmail } from "@/resources/client/utils";
import { useRouter } from "next/router";
import { LoginFeedback } from "./login/feedback.module";

type LoginProps = {
  initialStep?: keyof typeof STEP;
  initialTransaction?: Transaction;
  data?: {
    email_token?: string;
  };
};

export const STEP = {
  initial: 0,
  login_validation: 1,
  register: 2,
  register_email_check: 3,
  recovery: 4,
  recovery_email_check: 5,
  recovery_instruction: 6,
  recovery_feedback: 7,
};

export type STEP = keyof typeof STEP;

export function Login(props: LoginProps) {
  const [email, setEmail] = useState<string>();
  const [secret, setSecret] = useState<string>();
  const [confirmSecret, setConfirmSecret] = useState<string>();
  const [name, setName] = useState<string>();
  const [code, setCode] = useState<string>();

  const [step, setStep] = useState(STEP[props.initialStep ?? "initial"]);

  const [lastEmail, setLastEmail] = useState(email);
  const [transaction, setTransaction] = useState<Transaction | undefined>(props.initialTransaction);
  const [autoSendedCode, setAutoSendedCode] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const secretRef = useRef<HTMLInputElement>(null);

  const session = useContext(sessionContext);

  const router = useRouter();

  async function changeStep(name?: keyof typeof STEP) {
    switch (name) {
      case "initial":
        setStep(STEP.initial);
        break;
      case "login_validation":
        setStep(STEP.login_validation);
        break;
      case "register":
        setStep(STEP.register);
        break;
      case "register_email_check":
        setStep(STEP.register_email_check);
        break;
      case "recovery":
        setStep(STEP.recovery);
        break;
      case "recovery_email_check":
        setStep(STEP.recovery_email_check);
        break;
      case "recovery_instruction":
        setStep(STEP.recovery_instruction);
        break;
      case "recovery_feedback":
        setStep(STEP.recovery_feedback);
    }
  }

  async function handleEmailSubmit() {
    if (email?.length) {
      session
        .createLoginTransaction({
          email,
        })
        .then((transaction) => {
          setLastEmail(email);
          changeStep(nextTask(transaction.tasks)?.name as STEP);
          setTransaction(transaction);
        })
        .catch(() => {});
    }
  }

  async function handleLoginSubmit(opt?: { renew: boolean }) {
    if (email?.length && secret?.length) {
      const local_transaction = Promise.resolve(
        !opt?.renew && email === lastEmail && transaction
          ? transaction
          : session.createLoginTransaction({
              email,
            })
      );

      local_transaction
        .then((transaction) => {
          setLastEmail(email);
          session
            .sendLoginValidation({ email, secret, transaction })
            .then(() => {
              router.reload();
            })
            .catch(() => {});
        })
        .catch(() => {});
    }
  }

  function handleRegisterSubmit() {
    if (email?.length && secret?.length && name?.length) {
      session.createRegisterTransaction({ email, secret, name }).then((transaction) => {
        setLastEmail(email);
        setTransaction(transaction);

        if ((nextTask(transaction.tasks)?.name as STEP) === "login_validation") {
          return handleLoginSubmit();
        }

        changeStep(nextTask(transaction.tasks)?.name as STEP);
      });
    }
  }

  function handleEmailCodeSubmit(code: string) {
    if (code?.length && transaction) {
      session
        .sendEmailConfirmation({ code, transaction })
        .then(() => {
          handleLoginSubmit({ renew: true }).catch(() => {
            setStep(STEP.login_validation);
          });
        })
        .catch(() => {});
    }
  }

  function handleRecoverySubmit() {
    if (email?.length) {
      session
        .createRecoveryTransaction({ email })
        .then(() => {
          changeStep("recovery_instruction");
        })
        .catch(() => {});
    }
  }

  function handleNewPasswordSubmit() {
    if (secret?.length && secret === confirmSecret && props.data?.email_token && transaction) {
      session
        .sendRecoveryPassword({ secret, email_token: props.data?.email_token, transaction })
        .then(() => {
          changeStep("recovery_feedback");
        })
        .catch(() => {});
    }
  }

  function handleFormSubmit(e?: InputEvent | FormEvent) {
    e?.preventDefault();

    if (session.fetching) return;

    switch (step) {
      case STEP.initial:
        handleEmailSubmit();
        break;
      case STEP.login_validation:
        handleLoginSubmit();
        break;
      case STEP.register:
        handleRegisterSubmit();
        break;
      case STEP.recovery:
        handleRecoverySubmit();
        break;
      case STEP.recovery_email_check:
        handleNewPasswordSubmit();
        break;
    }
  }

  function handleUpdate(value: string, setter: Dispatch<SetStateAction<string | undefined>>) {
    setter(value);
  }

  useEffect(() => {
    switch (step) {
      case STEP.initial:
        emailRef.current?.focus();
        break;
      case STEP.login_validation:
        secretRef.current?.focus();
        break;
      case STEP.register:
        if (email?.length) {
          secretRef.current?.focus();
        } else {
          emailRef.current?.focus();
        }
    }
  }, [step]);

  return (
    <>
      <div className="text-2xl">
        {[STEP.initial, STEP.login_validation].includes(step) && "Login"}
        {[STEP.register, STEP.register_email_check].includes(step) && "Create Account"}
        {[STEP.recovery, STEP.recovery_email_check, STEP.recovery_instruction, STEP.recovery_feedback].includes(step) &&
          "Recovery Account"}
      </div>

      <LoginFeedback
        visible={[STEP.recovery_instruction].includes(step)}
        back={() => {
          changeStep("login_validation");
        }}
      >
        If there is a registered user with the email {hideEmail(email)}, we have sent a password recovery link to
        him/her. Please check your inbox and spam folder.
      </LoginFeedback>

      <LoginFeedback
        visible={[STEP.recovery_feedback].includes(step)}
        back={() => {
          router.replace("/login");
        }}
      >
        Your password has been reset successfully. Please log in to enter your account with your new password.
      </LoginFeedback>

      <form
        noValidate
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-3 items-stretch w-full text-black/[.7] dark:text-white/[.7]"
      >
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "1fr auto",
            gridAutoFlow: "row",
          }}
        >
          {[STEP.initial, STEP.register, STEP.login_validation, STEP.recovery].includes(step) && (
            <input
              disabled={session.fetching}
              ref={emailRef}
              onChange={(e) => handleUpdate(e.target.value, setEmail)}
              autoComplete="username"
              placeholder="Email"
              type="email"
              className={twMerge(
                "tail-text-input flex-1",
                ![STEP.initial, STEP.recovery].includes(step) && "col-span-2"
              )}
            />
          )}

          {[STEP.login_validation, STEP.register, STEP.recovery_email_check].includes(step) && (
            <input
              disabled={session.fetching}
              ref={secretRef}
              onChange={(e) => handleUpdate(e.target.value, setSecret)}
              autoComplete={step === STEP.login_validation ? "current-password" : "new-password"}
              placeholder="Password"
              type="password"
              className={twMerge(
                "tail-text-input flex-1",
                [STEP.register, STEP.recovery_email_check].includes(step) && "col-span-2"
              )}
            />
          )}

          {[STEP.recovery_email_check].includes(step) && (
            <input
              disabled={session.fetching}
              onChange={(e) => handleUpdate(e.target.value, setConfirmSecret)}
              autoComplete="new-password"
              placeholder="Confirm password"
              type="password"
              className="tail-text-input flex-1"
            />
          )}

          {step === STEP.register && (
            <>
              <input
                disabled={session.fetching}
                onChange={(e) => handleUpdate(e.target.value, setName)}
                placeholder="Name"
                autoComplete="name"
                type="text"
                className="tail-text-input flex-1  transition-all duration-500 ease-in-out"
              />
            </>
          )}

          {[STEP.register_email_check].includes(step) && (
            <div className="col-span-2 flex flex-col items-center">
              <div className="text-center *:mt-3">
                <div className="text-xl">
                  We’ve sent a <strong>verification code to your email address</strong>:
                </div>
                <div className="opacity-70 p-1"> {hideEmail(email)}</div>
                <div>
                  Please check your inbox and enter the code to continue. If you don’t see the email, be sure to check
                  your spam or junk folder.
                </div>
              </div>

              <CodeInput
                length={4}
                onSubmit={(code) => {
                  if (autoSendedCode) return;
                  setAutoSendedCode(true);
                  handleEmailCodeSubmit(code);
                }}
                onChange={setCode}
                className="pt-4"
              />

              <button
                disabled={session.fetching || code?.match(/\d/g)?.length !== 4}
                className="bg-sky-600 p-2 cursor-pointer mt-10 px-12 py-3 rounded-md "
                onClick={() => {
                  if (code) handleEmailCodeSubmit(code);
                }}
              >
                {session.fetching ? <CgSpinnerAlt className="h-7 w-7 animate-spin" /> : "Enviar"}
              </button>
            </div>
          )}

          {[STEP.initial, STEP.login_validation, STEP.register, STEP.recovery_email_check, STEP.recovery].includes(
            step
          ) && (
            <button
              disabled={session.fetching}
              className="bg-sky-600 rounded-full p-1 px-4 cursor-pointer"
              onClick={handleFormSubmit}
            >
              {session.fetching ? (
                <CgSpinnerAlt className="h-7 w-7 animate-spin" />
              ) : (
                <HiArrowSmRight className="h-7 w-7" />
              )}
            </button>
          )}
        </div>

        <div className="flex gap-8 items-center justify-center pt-4">
          {[STEP.initial, STEP.login_validation, STEP.recovery].includes(step) && (
            <>
              <div
                className="tail-link"
                onClick={() => {
                  changeStep("register");
                }}
              >
                Create new Account {[STEP.initial].includes(step) && <RiArrowRightSLine />}
              </div>

              {![STEP.recovery, STEP.initial].includes(step) && (
                <div
                  className="tail-link"
                  onClick={() => {
                    changeStep("recovery");
                  }}
                >
                  Forgot the password?
                </div>
              )}
            </>
          )}

          {[STEP.register, STEP.recovery, STEP.recovery].includes(step) && (
            <div
              className="tail-link"
              onClick={() => {
                changeStep("login_validation");
              }}
            >
              Login instead?
            </div>
          )}
        </div>
      </form>
    </>
  );
}
