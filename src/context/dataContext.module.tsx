import { apiGet } from "@/resources/client/fetch";
import type { SafeData } from "@/resources/server/user";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { sessionContext } from "./sessionContext.module";

type dataContextProps = {
  data?: SafeData;
  fetching: boolean;
};

export const dataContext = createContext({} as dataContextProps);

type ProviderProps = {
  children?: ReactNode;
};

export function DataContextProvider({ children }: ProviderProps) {
  const [data, setData] = useState<SafeData>();
  const [fetching, setFetching] = useState(true);

  const { forgotSession } = useContext(sessionContext);

  async function getData() {
    setFetching(true);
    try {
      return await apiGet<SafeData>("/api/data", "json");
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    getData()
      .then(setData)
      .catch((error: Response) => {
        if (error.status == 403) {
          forgotSession();
        }
      });
  }, []);

  return (
    <dataContext.Provider
      value={{
        data,
        fetching,
      }}
    >
      {children}
    </dataContext.Provider>
  );
}
