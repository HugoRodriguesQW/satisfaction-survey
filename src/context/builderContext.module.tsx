import { Question, QuestionProperties } from "@/resources/definitions";
import Head from "next/head";
import { createContext, ReactNode, useEffect, useState } from "react";



type BuilderData = {
    id?: string,
    filename: string,
    questions: Array<Question>
}

type BuilderContextProps = BuilderData & {
    current: number,
    updateCurrent: (index?: number) => void;
    addQuestion: <Q extends Question>(question: Q, position?: "after" | "before" | number) => void
    removeQuestion: (index: number) => void
    updateQuestion: <T extends Question>(index: number, updater: <S extends QuestionProperties>(question: S) => T) => void
    updateFilename: (filename: string) => void
}

export const builderContext = createContext({
} as BuilderContextProps)


type BuilderProviderProps = {
    children: ReactNode,
    id?: string,
}

export function BuilderContextProvider({ children, ...rest }: BuilderProviderProps) {

    const [id] = useState<BuilderContextProps["id"]>(rest.id)
    const [filename, setFilename] = useState<BuilderContextProps["filename"]>("Untitled Survey")
    const [questions, setQuestions] = useState<BuilderContextProps["questions"]>([])
    const [current, setCurrent] = useState<BuilderContextProps["current"]>(-1)

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

    const updateFilename: BuilderContextProps["updateFilename"] = (filename) => {
        setFilename(filename.length ? filename : "Untitled Survey")
    }

    // const importBuilderData = async (id: string) => {

    //     const data = await apiGet<BuilderData>("/api/get/survey/" + id, "json");

    //     if (data) {
    //         setFilename(data.filename)
    //         setId(data.id)
    //         setQuestions(data.questions)
    //     }

    // }

    useEffect(() => {
        if (id) {
            // importBuilderData(id)
        }
    }, [id])

    return (
        <builderContext.Provider value={{
            id,
            filename,
            questions,
            current,
            updateCurrent,
            addQuestion,
            removeQuestion,
            updateQuestion,
            updateFilename
        }}>
            <Head>
                <title>Privora | {filename}</title>
            </Head>

            {children}
        </builderContext.Provider>
    )
}