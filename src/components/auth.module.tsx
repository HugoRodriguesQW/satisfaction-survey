/* eslint-disable react-hooks/exhaustive-deps */
import { sessionContext } from "@/context/sessionContext.module";
import { nextTask } from "@/resources/transactions";
import type { Transaction } from "@/resources/transactions";
import { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { CgSpinnerAlt } from "react-icons/cg";
import { HiArrowSmRight } from "react-icons/hi";
import { RiArrowRightSLine } from "react-icons/ri";
import { twMerge } from "tailwind-merge";
import { CodeInput } from "./login/codeInput.module";
import { hideEmail } from "@/resources/client/utils";
import { useRouter } from "next/router";
import { LoginError, LoginFeedback } from "./login/feedback.module";
import { it } from "@/resources/utils";
import {
  emailCodeSchema,
  loginSchema,
  recoverySchema,
  registerSchema,
  repasswordSchema,
  schemaErrors,
  stringSchema,
} from "@/resources/types";
import { Input } from "./input.module";

type LoginProps = {
  initialStep?: keyof typeof STEP;
  initialTransaction?: Transaction;
  data?: {
    email_token?: string;
  };
};

const STEP = {
  blank: -1,
  initial: 0,
  login_validation: 1,
  register: 2,
  register_email_check: 3,
  recovery: 4,
  recovery_email_check: 5,
  recovery_instruction: 6,
  recovery_feedback: 7,
};

type STEP = keyof typeof STEP;

export function Login(props: LoginProps) {
  const [email, setEmail] = useState<string>();
  const [secret, setSecret] = useState<string>();
  const [secret2, setSecret2] = useState<string>();
  const [name, setName] = useState<string>();
  const [code, setCode] = useState<string>();

  const [step, setStep] = useState(STEP[props.initialStep ?? "initial"]);

  const [lastEmail, setLastEmail] = useState(email);
  const [transaction, setTransaction] = useState<Transaction | undefined>(props.initialTransaction);
  const [autoSendedCode, setAutoSendedCode] = useState(false);
  const [error, setError] = useState<schemaErrors>();

  const emailRef = useRef<HTMLInputElement>(null);
  const secretRef = useRef<HTMLInputElement>(null);

  const session = useContext(sessionContext);

  const router = useRouter();

  async function changeStep(name?: keyof typeof STEP) {
    setError({});
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
        break;
      case "blank":
        setStep(STEP.blank);
    }
  }

  async function handleEmailSubmit() {
    const submit = stringSchema.safeParse(email);

    if (!submit.success) {
      return setError({
        form: submit.error.format()._errors,
      });
    }

    session
      .createLoginTransaction({
        email: submit.data,
      })
      .then((transaction) => {
        setTransaction(transaction)
        setLastEmail(email);
        changeStep(nextTask(transaction.tasks)?.name as STEP);
        setTransaction(transaction);
      })
      .catch(() => {
        setError({
          form: ["We hit a snag while starting your login. Please try again shortly."],
        });
      });
  }

  async function handleLoginSubmit(opt?: { renew: boolean }) {
    const submit = loginSchema.safeParse({ email, secret });

    if (!submit.success) {
      return setError(submit.error.flatten().fieldErrors);
    }

    const local_transaction = Promise.resolve(
      !opt?.renew && email === lastEmail && transaction
        ? transaction
        : session.createLoginTransaction({
          email: submit.data.email,
        })
    );

    local_transaction
      .then((transaction) => {
        setTransaction(transaction)
        setLastEmail(email);
        session
          .sendLoginValidation({ ...submit.data, transaction })
          .then(() => {
            router.reload();
          })
          .catch((error: Response) => {
            switch (error.status) {
              case 400:
                setError({
                  form: ["Make sure your email or username is correct and try again."],
                });
                break;
              default:
                throw error;
            }
          });
      })
      .catch(() => {
        setError({
          form: ["We hit a snag while starting your login. Please try again shortly."],
        });
      });
  }

  function handleRegisterSubmit() {
    const submit = registerSchema.safeParse({ email, secret, name });

    if (!submit.success) {
      return setError(submit.error.flatten().fieldErrors);
    }

    session
      .createRegisterTransaction(submit.data)
      .then((transaction) => {
        setLastEmail(email);
        setTransaction(transaction);

        if ((nextTask(transaction.tasks)?.name as STEP) === "login_validation") {
          return handleLoginSubmit();
        }

        changeStep(nextTask(transaction.tasks)?.name as STEP);
      })
      .catch(() => {
        setError({
          form: ["Something went wrong while creating your account. Please try again."],
        });
      });
  }

  function handleEmailCodeSubmit(code: string) {
    const submit = emailCodeSchema.safeParse({ code });

    if (!submit.success) {
      return setError(submit.error.flatten().fieldErrors);
    }

    if (!transaction) {
      setError({
        form: [
          "There was an issue sending the code. We’re sorry about that. You can use the link in the email we sent to complete the process.",
        ],
      });

      return changeStep("blank");
    }

    session
      .sendEmailConfirmation({ ...submit.data, transaction })
      .then(() => {
        handleLoginSubmit({ renew: true }).catch(() => {
          changeStep("login_validation");
        });
      })
      .catch((error: Response) => {
        switch (error.status) {
          case 400:
            setError({
              code: ["It seems the code doesn’t match. Try entering it again."],
            });
            break;
          default:
            setError({
              code: ["We couldn't create your account. Try again later or sign in if you already have one."],
            });
        }
      });
  }

  function handleRecoverySubmit() {
    const submit = recoverySchema.safeParse({ email });

    if (!submit.success) {
      return setError(submit.error.flatten().fieldErrors);
    }

    session
      .createRecoveryTransaction(submit.data)
      .then((transaction) => {
        setTransaction(transaction)
        changeStep("recovery_instruction");
      })
      .catch(() => {
        setError({
          form: ["We couldn’t begin the account recovery process. Please try again."],
        });
      });
  }

  function handleNewPasswordSubmit() {
    const submit = repasswordSchema.safeParse({ secret, secret2 });

    if (!submit.success) {
      return setError(submit.error.flatten().fieldErrors);
    }

    if (!props.data?.email_token || !transaction) {
      return router.replace("/login/recovery/deep/sea");
    }

    session
      .sendRecoveryPassword({ secret: submit.data.secret, email_token: props.data.email_token, transaction })
      .then(() => {
        changeStep("recovery_feedback");
      })
      .catch(() => {
        setError({
          form: ["Something went wrong while updating your password. Please try again."],
        });
      });
  }

  function handleFormSubmit(e?: InputEvent | FormEvent) {
    e?.preventDefault();
    setError({});
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
        {it(step).eq(STEP.initial, STEP.login_validation) && "Sign In"}
        {it(step).eq(STEP.register, STEP.register_email_check) && "Create Account"}
        {it(step).eq(STEP.recovery, STEP.recovery_email_check, STEP.recovery_instruction, STEP.recovery_feedback) &&
          "Account Recovery"}
      </div>

      <LoginError error={error?.form} />

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
            <Input
              disabled={session.fetching}
              ref={emailRef}
              error={error?.email}
              onChange={(e) => handleUpdate(e.target.value, setEmail)}
              autoComplete="username"
              placeholder="Email"
              type="email"
              container={{
                className: twMerge("flex-1", ![STEP.initial, STEP.recovery].includes(step) && "col-span-2"),
              }}
            />
          )}

          {[STEP.login_validation, STEP.register, STEP.recovery_email_check].includes(step) && (
            <Input
              secret
              disabled={session.fetching}
              ref={secretRef}
              error={error?.secret}
              onChange={(e) => handleUpdate(e.target.value, setSecret)}
              autoComplete={step === STEP.login_validation ? "current-password" : "new-password"}
              placeholder="Password"
              type="password"
              container={{
                className: twMerge([STEP.register, STEP.recovery_email_check].includes(step) && "col-span-2"),
              }}
            />
          )}

          {[STEP.recovery_email_check].includes(step) && (
            <Input
              secret
              error={error?.secret2}
              disabled={session.fetching}
              onChange={(e) => handleUpdate(e.target.value, setSecret2)}
              autoComplete="new-password"
              placeholder="Confirm password"
              type="password"
            />
          )}

          {step === STEP.register && (
            <Input
              disabled={session.fetching}
              onChange={(e) => handleUpdate(e.target.value, setName)}
              placeholder="Name"
              autoComplete="name"
              type="text"
              error={error?.name}
            />
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

              <LoginError error={error?.code} limit={1} className="mt-3" />

              <button
                disabled={session.fetching || code?.match(/\d/g)?.length !== 4}
                className="tail-button p-2 cursor-pointer mt-10 px-12 py-3 rounded-md font-semibold text-white"
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
                className="tail-button rounded-full p-1 px-4 cursor-pointer max-h-10 text-white"
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

        <div className="flex flex-col sm:flex-row  gap-3 sm:gap-8 items-center justify-center pt-4">
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
              Sign In instead?
            </div>
          )}
        </div>
      </form>
    </>
  );
}
