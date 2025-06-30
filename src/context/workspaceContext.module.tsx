import { apiGet } from "@/resources/client/fetch";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import type { MinimalSurvey } from "@/resources/server/surveys";
import type { SearchBucket } from "@/pages/api/survey/bucket/[bucket]/search";
import { dataContext } from "./dataContext.module";

type workspaceContextProps = {
    fetching: boolean;
    surveys: MinimalSurvey[];
    currentBucket: number;
    nextExists: boolean;
    openSurveyEditor: (id: string) => void;
    readSurveyBucket: (bucket: number) => Promise<true> | Promise<void>;
};


let lockFrontend = false;

export const workspaceContext = createContext({} as workspaceContextProps);

type ProviderProps = {
    children?: ReactNode;
};

export function WorkspaceContextProvider({ children }: ProviderProps) {

    const [fetching, setFetching] = useState(true);

    const [surveys, setSurveys] = useState<MinimalSurvey[]>([]);
    const [currentBucket, setCurrentBucket] = useState(0);
    const [nextExists, setNextExists] = useState(false);

    const { data } = useContext(dataContext)

    const readSurveyBucket: workspaceContextProps["readSurveyBucket"] = async (bucket) => {
        setFetching(true);
        try {
            setCurrentBucket(bucket);
            const { nextExists, surveys: surveyBucket } = await apiGet<SearchBucket>(`/api/survey/bucket/${bucket}/search`, "json")
            setNextExists(nextExists)


            surveyBucket.map((s) => {
                if (!s.schedule) s.schedule = { active: false }
                if (s.schedule?.start) s.schedule.start = new Date(s.schedule.start)
                if (s.schedule?.end) s.schedule.end = new Date(s.schedule.end)
                if (s.created_at) s.created_at = new Date(s.created_at)
            })

            setSurveys([...surveys, ...surveyBucket].filter((s, index, list) => {
                return list.findIndex((li) => li.id === s.id) === index;
            }))

            return true;
        } finally {
            setFetching(false);
        }
    }

    const openSurveyEditor: workspaceContextProps["openSurveyEditor"] = (id) => {
        window.open(new URL("/builder/" + id, window.location.href), "_blank")
    }

    useEffect(() => {
        if (!data?.private) {
            return;
        }
        if (lockFrontend) return;
        lockFrontend = true;

        function call() {
            readSurveyBucket(0).then((ok) => {
                if (!ok) {
                    setTimeout(call, 1000)
                }
            })

        }

        call()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <workspaceContext.Provider
            value={{
                fetching,
                currentBucket,
                surveys,
                nextExists,
                readSurveyBucket,
                openSurveyEditor
            }}
        >
            {children}
        </workspaceContext.Provider>
    );
}
