import { apiGet } from "@/resources/client/fetch";
import type { SafeData } from "@/resources/server/user";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { sessionContext } from "./sessionContext.module";

type dataContextProps = {
  data?: SafeData;
  fetching: boolean;
  revokeSurveyKey: (surveyId: string) => Promise<void>
};

export const dataContext = createContext({} as dataContextProps);

type ProviderProps = {
  children?: ReactNode;
};

export function DataContextProvider({ children }: ProviderProps) {

  const { forgotSession } = useContext(sessionContext);


  const [data, setData] = useState<SafeData>();
  const [fetching, setFetching] = useState(true);

  async function getData() {
    setFetching(true);
    try {
      return await apiGet<SafeData>("/api/data", "json");
    } finally {
      setFetching(false);
    }
  }

  async function revokeSurveyKey(surveyId: string) {
    if (!data) throw new Error("Data must be fetched before");
    const newSurveyKey = await apiGet<string>(`/api/survey/${surveyId}/revoke`, "text")
    if (!newSurveyKey) throw new Error("Couldn't update the stack")
    data.private.keys[surveyId].survey = newSurveyKey;
    setData({ ...data })
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
        revokeSurveyKey
      }}
    >
      {children}
    </dataContext.Provider>
  );
}
