import { Question, QuestionProperties } from "@/resources/definitions";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { dataContext } from "@/context/dataContext.module";
import type { Survey } from "@/resources/server/surveys";
import { apiPost } from "@/resources/client/fetch";
import { createUpdateStack } from "@/resources/client/updateStack";

type BuilderData = {
    id?: string,
    name: string,
    questions: Array<Question>
}

type BuilderContextProps = BuilderData & {
    current: number,
    updateCurrent: (index?: number) => void;
    addQuestion: <Q extends Question>(question: Q, position?: "after" | "before" | number) => void
    removeQuestion: (index: number) => void
    updateQuestion: <T extends Question>(index: number, updater: <S extends QuestionProperties>(question: S) => T) => void
    updateFilename: (name: string) => void
}

export const builderContext = createContext({} as BuilderContextProps)

const updateStack = createUpdateStack("questions", "name").setup({ timeout: 400 });

type BuilderProviderProps = {
    children: ReactNode,
    id?: string,
}

export function BuilderContextProvider({ children, id }: BuilderProviderProps) {

    const [surveyFetched, setSurvetFetched] = useState(false);

    const [name, setFilename] = useState<BuilderContextProps["name"]>("Untitled Survey")
    const [questions, setQuestions] = useState<BuilderContextProps["questions"]>([])
    const [current, setCurrent] = useState<BuilderContextProps["current"]>(-1)
    const { data, fetching } = useContext(dataContext)

    const updateCurrent: BuilderContextProps["updateCurrent"] = (index) => {
        setCurrent(index ?? -1)
    }

    const addQuestion: BuilderContextProps["addQuestion"] = (question, position = "after") => {
        if (position === "after") {
            updateCurrent(questions.length)
            return setQuestions([...questions, question])
        }
        if (position === "before") {
            updateCurrent(0)
            return setQuestions([question, ...questions])
        }
        updateCurrent(position)
        setQuestions([...questions.slice(0, position), question, ...questions.slice(position + 1)])
    }

    const removeQuestion: BuilderContextProps["removeQuestion"] = (index) => {
        updateCurrent(undefined)
        setQuestions([...questions.filter((_, i) => index !== i)])
    }

    const updateQuestion: BuilderContextProps["updateQuestion"] = (index, updater) => {
        if (questions[index]) {
            questions[index] = { ...updater(questions[index] as QuestionProperties) }
            setQuestions([...questions])
            updateCurrent(index)
        }
    }

    const updateFilename: BuilderContextProps["updateFilename"] = (name) => {
        const newFilename = name.length ? name : "Untitled Survey"
        setFilename(newFilename)
    }

    const importBuilderData = async (id: string, surveyKey: string) => {
        const survey = await apiPost<Survey>(`/api/survey/${id}/read`, { surveyKey }, "json");

        if (survey) {
            updateFilename(survey.name ?? "");
            setQuestions(survey.questions);
            setSurvetFetched(true);
        }
    }

    async function handleUpdateStack(update: unknown, stackId: string) {
        console.info("Updating the Stack with:", { update, stackId })
        const result = await apiPost<Survey>(`/api/survey/${id}/update`, { property: stackId, value: update }, "json")
        if (!result) throw new Error("Couldn't update the stack")
    }

    function handleUpdateError(update: unknown, stackId: string) {
        console.warn({ updateError: { update, stackId } })
    }

    useEffect(() => {
        if (surveyFetched) {
            updateStack.push("questions", questions);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questions])

    useEffect(() => {
        if (surveyFetched) {
            updateStack.push("name", name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name])

    useEffect(() => {
        updateStack.on("name", handleUpdateStack)
        updateStack.on("questions", handleUpdateStack)
        updateStack.on("fail", handleUpdateError)

        return () => {
            updateStack.off("name", handleUpdateStack)
            updateStack.off("questions", handleUpdateStack)
            updateStack.off("fail", handleUpdateError)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (data?.private && !fetching && id) {
            importBuilderData(id, data.private.keys[id].survey)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, fetching, id])

    return (
        <builderContext.Provider value={{
            id,
            name,
            questions,
            current,
            updateCurrent,
            addQuestion,
            removeQuestion,
            updateQuestion,
            updateFilename
        }}>

            {children}
        </builderContext.Provider>
    )
}