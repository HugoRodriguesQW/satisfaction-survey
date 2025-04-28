import { apiGet, apiPost } from "@/resources/client/fetch";
import type { Transaction } from "@/resources/transactions";
import { Utf8ToHex } from "@/resources/utils";
import { createContext, ReactNode, useState } from "react";

type Params = {
  Login: { email: string };
  Register: { email: string; secret: string; name: string };
  Recovery: { email: string };
  EmailConfirmation: { code: string; transaction: Transaction };
  LoginValidation: { secret: string; email: string; transaction: Transaction };
  RecoveryRepassword: { email_token: string; secret: string; transaction: Transaction };
};

type SessionContextProps = {
  fetching: boolean;
  createLoginTransaction: (data: Params["Login"]) => Promise<Transaction>;
  createRegisterTransaction: (data: Params["Register"]) => Promise<Transaction>;
  createRecoveryTransaction: (data: Params["Recovery"]) => Promise<Transaction>;
  sendEmailConfirmation: (data: Params["EmailConfirmation"]) => Promise<void>;
  sendLoginValidation: (data: Params["LoginValidation"]) => Promise<void>;
  sendRecoveryPassword: (data: Params["RecoveryRepassword"]) => Promise<void>;
  forgotSession: () => Promise<void>;
};

type SessionProviderProps = {
  children: ReactNode;
};

export const sessionContext = createContext({} as SessionContextProps);

export function SessionContextProvider({ children }: SessionProviderProps) {
  const [fetching, setFetching] = useState(false);

  async function createLoginTransaction({ email }: Params["Login"]) {
    setFetching(true);
    console.info("Creating an login transaction");
    try {
      return await apiPost<Transaction>("/api/user/login/transaction/create", { email }, "json");
    } finally {
      setFetching(false);
    }
  }

  async function createRegisterTransaction({ email, secret, name }: Params["Register"]) {
    setFetching(true);
    console.info("Creating an register transaction");
    try {
      return await apiPost<Transaction>("/api/user/register/transaction/create", { email, secret, name }, "json");
    } finally {
      setFetching(false);
    }
  }

  async function createRecoveryTransaction({ email }: Params["Recovery"]) {
    setFetching(true);
    console.info("Creating an recovery transaction");
    try {
      return await apiPost<Transaction>("/api/user/recovery/transaction/create", { email }, "json");
    } finally {
      setFetching(false);
    }
  }

  async function sendEmailConfirmation({ code, transaction }: Params["EmailConfirmation"]) {
    setFetching(true);
    console.info("Sending the email_confirmation");
    try {
      return await apiGet<void>(`/api/user/register/t/email/${transaction.id}/${Utf8ToHex(code)}`, "none");
    } finally {
      setFetching(false);
    }
  }

  async function sendLoginValidation({ email, secret, transaction }: Params["LoginValidation"]) {
    setFetching(true);
    console.info("Sending an login_validation");
    try {
      return await apiPost<void>(
        `/api/user/login/t/${transaction.id}`,
        {
          email,
          secret,
        },
        "text"
      );
    } finally {
      setFetching(false);
    }
  }

  async function sendRecoveryPassword({ email_token, secret, transaction }: Params["RecoveryRepassword"]) {
    setFetching(true);
    console.info("Sending an recovery_repassword");
    try {
      return await apiPost<void>(
        `/api/user/recovery/t/repassword/${transaction.id}`,
        {
          email_token,
          secret,
        },
        "none"
      );
    } finally {
      setFetching(false);
    }
  }

  async function forgotSession() {
    setFetching(true);
    console.info("Cleaning the token cache");
    try {
      return await apiGet<void>(`/api/user/logout`, "none");
    } finally {
      setFetching(false);
    }
  }

  return (
    <sessionContext.Provider
      value={{
        fetching,
        createLoginTransaction,
        createRegisterTransaction,
        createRecoveryTransaction,
        sendEmailConfirmation,
        sendLoginValidation,
        sendRecoveryPassword,
        forgotSession,
      }}
    >
      {children}
    </sessionContext.Provider>
  );
}
