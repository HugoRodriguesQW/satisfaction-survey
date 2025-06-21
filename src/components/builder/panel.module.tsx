import { DragItems } from "@/pages/builder/[id]";
import { CiCirclePlus } from "react-icons/ci";
import { DynamicBox } from "../DynamicBox";
import { useContext } from "react";
import { AutoProperties, Question, QuestionProperties, QuestionTypes, SelectionQuestion, SliderQuestion, TextInputQuestion, TextMessageQuestion } from "@/resources/definitions";
import { twMerge } from "tailwind-merge";
import { Input } from "../input.module";
import { builderContext } from "@/context/builderContext.module";

import { LuPointer, LuTextCursor } from "react-icons/lu";
import { RxSlider } from "react-icons/rx";
import { clone, merge, uuid } from "@/resources/utils";

export function createQuestion(type: QuestionTypes): Question {
    switch (type) {
        case "text-input":
            return merge(clone(TextInputQuestion), { type, id: uuid() });
        case "selection":
            return merge(clone(SelectionQuestion), { type, id: uuid() });
        case "text-message":
            return merge(clone(TextMessageQuestion), { type, id: uuid() });
        case "slider":
            return merge(clone(SliderQuestion), { type, id: uuid() });
    }
}


export function BuilderPanel() {

    const { current, addQuestion, questions, updateCurrent } = useContext(builderContext);

    return (
        <DynamicBox onChange={(rect, w) => {
            return {
                maxHeight: `${w.height - rect.top}px`,
            }
        }} className="overflow-auto flex-1 px-5 py-5 pb-[128px]">



            <div className="flex flex-col w-full gap-3">


                <DragItems.Drop handleDrop={(type) => {
                    addQuestion(createQuestion(type), "before")
                }} className={
                    twMerge("h-[67px] bg-gradient-to-b from-foreground/0 to-foreground/5 rounded-xl flex items-center justify-center",
                        !Boolean(questions[0]) && "h-[128px]"
                    )
                }>
                    <CiCirclePlus className="w-[34px] h-[34px] fill-foreground/30" />
                </DragItems.Drop>


                {
                    questions.map((question, i) => {
                        return (
                            <>
                                <div key={"builder-panel-" + i} onClick={() => {
                                    updateCurrent(i)
                                }} className={
                                    twMerge(
                                        "min-h-[256px] bg-foreground/5 rounded-xl p-4 flex flex-col items-center justify-center relative",
                                        current === i && "ring-4 ring-foreground/20"
                                    )
                                }>

                                    <div className="absolute bottom-2 left-3">
                                        {question.type !== "text-message" &&
                                            <div className=" text-sm text-violet-500">
                                                {question.section.tags.map((tag) => `#${tag}`).join(" ")}
                                            </div>}
                                    </div>

                                    <div className="absolute bottom-2 right-3">

                                        {question.type === "selection" && (
                                            <>
                                                <div className={
                                                    twMerge(
                                                        "rounded-md flex  items-center justify-center h-5 min-w-5 px-1 font-semibold text-sm text-foreground/80 bg-foreground/5 gap-1"
                                                    )
                                                }>

                                                    <LuPointer />
                                                    {question.selection.multiple ? (
                                                        "up to " + (question.selection.multipleLimit ?? QuestionProperties.selection.multipleLimit)
                                                    ) : "1"}
                                                </div>
                                            </>
                                        )}


                                        {(question.type === "slider" || question.type == "text-input") && (
                                            <>
                                                <div className={
                                                    twMerge(
                                                        "rounded-md flex items-center justify-center h-5 min-w-5 px-1 font-semibold text-sm text-foreground/80 bg-foreground/5 gap-1"
                                                    )
                                                }>

                                                    {question.type === "slider" ? <RxSlider /> : <LuTextCursor />}
                                                    {`${question.input.min ?? AutoProperties.input.min[question.type]}${question.type === "slider" ? "-" : "/"
                                                        }${question.input.max ?? AutoProperties.input.max[question.type]}`}
                                                </div>
                                            </>
                                        )}

                                    </div>

                                    <div className={
                                        twMerge(
                                            "text-xl border border-foreground/10 px-2 py-1 focus:outline-0",
                                            `font-${question.typography.title.weight}`,
                                            `font-${question.typography.title.fontFamily}`,

                                        )
                                    } >
                                        {question.section.title}
                                    </div>

                                    <div className={twMerge("text-lg text-gray-500  border border-foreground/10 px-2 py-1 focus:outline-0 mb-5",
                                        `font-${question.typography.description.weight}`,
                                        `font-${question.typography.description.fontFamily}`,
                                    )} >
                                        {question.section.description}
                                    </div>

                                    {
                                        question.type === "selection" && (
                                            <div className="flex max-w-[600px] flex-wrap gap-3 items-center"> {
                                                question.selection.options.map((option, j) => {
                                                    let selected = false;
                                                    return <button
                                                        key={"builder-" + i + "panel-" + question.type + j}
                                                        itemProp={String(selected)}
                                                        onClick={() => selected = !selected}
                                                        className={
                                                            twMerge(
                                                                "bg-gradient-to-br to-violet-500/80 from-neon-mid/70 p-2 px-6 rounded-md min-h- flex-[1_auto]",
                                                                `font-${question.typography.buttons.fontFamily}`,
                                                                `font-${question.typography.buttons.weight}`
                                                            )
                                                        } >
                                                        {option.text}
                                                    </button>
                                                })

                                            }
                                            </div>
                                        )
                                    }


                                    {
                                        question.type === "text-input" && (
                                            <div className="w-full max-w-[600px]">
                                                <Input placeholder={question.input.placeholder} maxLength={question.input.max ?? 512} minLength={question.input.min ?? 0} />
                                            </div>
                                        )
                                    }


                                    {
                                        question.type === "slider" && (
                                            <div className="w-full max-w-[600px] flex gap-2 items-center">
                                                {question.input.minText}
                                                <div className="relative bg-foreground/10 w-full rounded-full h-3 flex items-center">
                                                    <div className="absolute h-6 w-6 rounded-full bg-neon left-[50%] -ml-3 pointer" />
                                                </div>
                                                {question.input.maxText}
                                            </div>
                                        )
                                    }
                                </div>


                            </>)


                    })

                }

                {
                    Boolean(questions[0]) && <DragItems.Drop handleDrop={(type) => {
                        addQuestion(createQuestion(type), "after")
                    }} className="bg-gradient-to-t from-foreground/0 to-foreground/5 rounded-xl flex items-center justify-center h-[67px]"
                    >
                        <CiCirclePlus className="w-[34px] h-[34px] fill-foreground/30" />
                    </DragItems.Drop>
                }
            </div>
        </DynamicBox>
    )
}
