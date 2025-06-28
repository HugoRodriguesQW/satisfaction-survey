import { Resizable } from "../resizable.module";
import { ReactNode, useContext } from "react";
import { builderContext } from "@/context/builderContext.module";
import { LongTextField, TextField } from "./editor/text.module";
import { DropdownField } from "./editor/dropdown.module";
import { FontFamily, FontWeight } from "@/resources/definitions/typography";
import { NumberField } from "./editor/number.module";
import { DynamicBox } from "../DynamicBox";
import { twMerge } from "tailwind-merge";
import { AutoProperties, Question, QuestionProperties, SelectionQuestion, SliderQuestion, TextInputQuestion } from "@/resources/definitions";
import { it } from "@/resources/utils";
import { TagsField } from "./editor/tags.module";
import { OptionsField } from "./editor/options.module";
import { BiPlusCircle } from "react-icons/bi";
import { SwitchField } from "./editor/switch.module";
import { Operations } from "@/resources/definitions/operations";
import { IoTrash } from "react-icons/io5";
import { EditorMenuBar } from "./menubar.module";

type _internEditorProps<T> = {
    current: number,
    currentQuestion: T
}

export function BuilderEditor() {
    const { questions, current } = useContext(builderContext)
    const currentQuestion = questions[current] as QuestionProperties | undefined

    return (
        <Resizable axis={["x"]} border={{
            x: "left", y: "bottom"
        }} className="min-w-[420px] max-w-[520px]" handler>
            <EditorMenuBar />
            <DynamicBox onChange={(rect, w) => {
                return {
                    maxHeight: `${w.height - rect.top}px`,
                }
            }} className="overflow-auto show-scrollbar">
                {currentQuestion?.section && <SectionEditor current={current} currentQuestion={currentQuestion} />}
                {currentQuestion?.typography && <TypographyEditor current={current} currentQuestion={currentQuestion} />}
                {currentQuestion?.input &&
                    <InputEditor current={current} currentQuestion={currentQuestion as TextInputQuestion | SliderQuestion} />}
                {currentQuestion?.selection && <SelectionEditor current={current} currentQuestion={currentQuestion as SelectionQuestion} />}
            </DynamicBox>
        </Resizable>
    )
}



function EditorContainer(props: { children?: ReactNode, name?: ReactNode, suffix?: ReactNode }) {
    return (
        <div className="w-full border-t border-foreground/10 pt-3 mb-4 px-5">
            {props.name && <div className={
                twMerge("text-sm capitalize font-semibold",
                    props.suffix && "flex items-center justify-between"
                )}>
                {props.name} {props.suffix}
            </div>}


            <div className={
                twMerge(props.name && "mt-2")
            }>
                {props.children}
            </div>
        </div>
    )
}

function EditorSubContainer(props: { children?: ReactNode, name?: ReactNode, suffix?: ReactNode }) {
    return (
        <div className={
            twMerge(
                "w-full pb-2 bg-foreground/5 p-2 not-last:border-b border-foreground/10 rounded-md not-last:rounded-b-none not-first:rounded-t-none",
                props.name && "first:mt-3"
            )
        }>
            {props.name && <div className={twMerge(
                "text-sm capitalize font-semibold text-foreground/70",
                props.suffix && "flex items-center justify-between"
            )}>
                {props.name} {props.suffix}
            </div>}

            <div className={"grid grid-cols-2 gap-2 pb-3"}>
                {props.children}
            </div>
        </div>
    )
}

function SectionEditor({ }: _internEditorProps<Question>) {
    const { current, removeQuestion, questions, updateQuestion } = useContext(builderContext)

    const currentQuestion = questions[current]


    return (
        <EditorContainer name="basic properties" suffix={
            <div className="flex gap-2 text-foreground/80">
                <button
                    onClick={() => {
                        removeQuestion(current)
                    }}
                    className="bg-red-500/60 text-foreground p-1 px-2 rounded-xs flex items-center flex-nowrap font-normal gap-1">
                    <IoTrash /> Remove
                </button>


            </div>
        }>
            <TextField label="Title" value={currentQuestion.section.title} onChange={(value) => {
                updateQuestion(current, (question) => {
                    question.section.title = value;
                    return question;
                })
            }} />
            <LongTextField label="Description" value={currentQuestion.section.description} onChange={(value) => {
                updateQuestion(current, (question) => {
                    question.section.description = value;
                    return question;
                })
            }} />


            {currentQuestion.type !== "text-message" && (
                <TagsField label="Tags" list={currentQuestion.section.tags} onChange={(list) => {
                    updateQuestion(current, (question) => {
                        question.section.tags = list;
                        return question;
                    })
                }} />
            )}
        </EditorContainer>
    )
}

function TypographyEditor({ current, currentQuestion }: _internEditorProps<Question>) {
    const { updateQuestion } = useContext(builderContext)


    return (
        <EditorContainer name="Typography">
            <EditorSubContainer name="Title">
                <DropdownField
                    label="Font Weight"
                    options={FontWeight}
                    value={currentQuestion?.typography.title.weight}
                    onChange={(value) => {
                        updateQuestion(current, (question) => {
                            question.typography.title.weight = value;
                            return question;
                        })
                    }}
                    optionStyle={(value) => `font-${value}`}
                />
                <DropdownField
                    label="Font Family"
                    options={FontFamily}
                    value={currentQuestion?.typography.title.fontFamily} onChange={(value) => {
                        updateQuestion(current, (question) => {
                            question.typography.title.fontFamily = value;
                            return question;
                        })
                    }}
                    optionStyle={(value) => `font-${value}`}
                />
            </EditorSubContainer>


            <EditorSubContainer name="Description">
                <DropdownField
                    label="Font Weight"
                    options={FontWeight}
                    value={currentQuestion?.typography.description.weight}
                    onChange={(value) => {
                        updateQuestion(current, (question) => {
                            question.typography.description.weight = value;
                            return question;
                        })
                    }}
                    optionStyle={(value) => `font-${value}`}
                />
                <DropdownField
                    label="Font Family"
                    options={FontFamily}
                    value={currentQuestion?.typography.description.fontFamily} onChange={(value) => {
                        updateQuestion(current, (question) => {
                            question.typography.description.fontFamily = value;
                            return question;
                        })
                    }}
                    optionStyle={(value) => `font-${value}`}
                />
            </EditorSubContainer>


            {
                currentQuestion.type === "selection" && (
                    <EditorSubContainer name="Buttons">
                        <DropdownField
                            label="Font Weight"
                            options={FontWeight}
                            value={currentQuestion.typography.buttons?.weight}
                            onChange={(value) => {
                                updateQuestion(current, (question) => {
                                    question.typography.buttons.weight = value;
                                    return question;
                                })
                            }}
                            optionStyle={(value) => `font-${value}`}
                        />
                        <DropdownField
                            label="Font Family"
                            options={FontFamily}
                            value={currentQuestion.typography.buttons.fontFamily}
                            onChange={(value) => {
                                updateQuestion(current, (question) => {
                                    question.typography.buttons.fontFamily = value;
                                    return question;
                                })
                            }}
                            optionStyle={(value) => `font-${value}`}
                        />
                    </EditorSubContainer>
                )
            }
        </EditorContainer>
    )
}


export function InputEditor({ currentQuestion, current }: _internEditorProps<SliderQuestion | TextInputQuestion>) {

    const { updateQuestion } = useContext(builderContext)

    const auto = {
        input: {
            min: AutoProperties.input.min[currentQuestion.type],
            max: AutoProperties.input.max[currentQuestion.type]
        }
    }

    return (
        <EditorContainer name="Input Properties">
            <EditorSubContainer>
                <NumberField
                    label={currentQuestion.type === "slider" ? "Min" : "Min length"}
                    hidden={it(currentQuestion?.input.min).eq(undefined)}
                    value={currentQuestion?.input.min}
                    placeholder={it(auto.input.min).exists() ? `Auto=${auto.input.min}` : "None"}
                    onChange={(value) => {
                        updateQuestion(current, (question) => {
                            question.input.min = value;
                            return question;
                        })
                    }} />

                {currentQuestion.type == "slider" && (
                    <TextField
                        label="Min Text"
                        value={currentQuestion?.input.minText}
                        placeholder={QuestionProperties.input.minText}
                        onChange={(value) => {
                            updateQuestion(current, (question) => {
                                question.input.minText = value;
                                return question;
                            })
                        }} />
                )}

                <NumberField
                    label={currentQuestion.type === "slider" ? "Max" : "Max length"}
                    value={currentQuestion?.input.max}
                    placeholder={it(auto.input.max).exists() ? `Auto=${auto.input.max}` : "None"}
                    onChange={(value) => {
                        updateQuestion(current, (question) => {
                            question.input.max = value;
                            return question;
                        })
                    }} />

                {
                    currentQuestion.type === "slider" && (
                        <TextField
                            label="Max Text"
                            value={currentQuestion.input.maxText}
                            placeholder={QuestionProperties.input.maxText}
                            onChange={(value) => {
                                updateQuestion(current, (question) => {
                                    question.input.maxText = value;
                                    return question;
                                })
                            }} />
                    )
                }


                {
                    currentQuestion.type === "text-input" && (
                        <TextField
                            className="col-span-2"
                            label="Placeholder"
                            value={currentQuestion.input.placeholder}
                            placeholder={QuestionProperties.input.placeholder}
                            onChange={(value) => {
                                updateQuestion(current, (question) => {
                                    question.input.placeholder = value;
                                    return question;
                                })
                            }} />
                    )
                }

                {
                    currentQuestion.type === "slider" && (
                        <NumberField
                            className="col-span-2 ring-violet-500/60 ring text-violet-500 font-semibold"
                            label={<div className="text-violet-600 ">Bias</div>}
                            value={currentQuestion.input.bias}
                            placeholder={"auto=" + QuestionProperties.selection.options[0].bias}
                            onChange={(value) => {
                                updateQuestion(current, (question) => {
                                    question.input.bias = value;
                                    return question;
                                })
                            }} />
                    )
                }
            </EditorSubContainer>
        </EditorContainer>
    )
}



export function SelectionEditor({ currentQuestion, current }: _internEditorProps<SelectionQuestion>) {
    const { updateQuestion } = useContext(builderContext)

    return (
        <EditorContainer name="Selection Properties">

            <EditorSubContainer name="Multiple Selection" suffix={
                <SwitchField
                    className="mt-0 mb-0"
                    label={currentQuestion.selection.multiple ? "Enabled" : "Disabled"}
                    value={currentQuestion.selection.multiple}
                    onChange={(value) => {
                        updateQuestion(current, (question) => {
                            question.selection.multiple = value;
                            return question;
                        })
                    }} />
            }>

                {
                    currentQuestion.selection.multiple && (
                        <>
                            <NumberField label="Max selections"
                                min={1}
                                max={currentQuestion.selection.options.length}
                                placeholder={"Auto=" + QuestionProperties.selection.multipleLimit}
                                onChange={(value) => {
                                    updateQuestion(current, (question) => {
                                        question.selection.multipleLimit = value != null ?
                                            Math.max(1, Math.min(value, currentQuestion.selection.options.length))
                                            : null
                                        return question
                                    })
                                }} value={
                                    currentQuestion.selection.multipleLimit
                                } />


                            <DropdownField
                                label="Bias Method"
                                options={Object.keys(Operations) as Operations[]}
                                value={currentQuestion.selection.multipleMethod}
                                onChange={(value) => {
                                    updateQuestion(current, (question) => {
                                        question.selection.multipleMethod = value;
                                        return question
                                    })
                                }} />
                        </>
                    )
                }
            </EditorSubContainer>

            <EditorSubContainer name="Options">
                {currentQuestion.selection.options.map((option, i, all) => (
                    <OptionsField
                        key={"editor-selection-option" + i}
                        className="col-span-2"
                        option={option}
                        onChange={(option) => {
                            updateQuestion(current, (question) => {
                                question.selection.options[i] = option
                                return question;
                            })
                        }}
                        disableRemove={!all[1]}
                        onRemove={() => {
                            updateQuestion(current, (question) => {
                                if (!all[1]) return question
                                question.selection.options.splice(i, 1)
                                return question
                            })
                        }}
                    />
                ))}

                <button className={
                    twMerge(
                        "flex items-center gap-2 bg-gradient-to-b from-foreground/10 to-foreground/0 rounded-md p-1 px-2 col-span-2 justify-center",
                        "hover:from-foreground/25 hover:ring hover:ring-foreground/5"
                    )
                }
                    onClick={() => {
                        updateQuestion(current, (question) => {

                            const count = currentQuestion.selection.options.length

                            question.selection.options = [
                                ...question.selection.options,
                                {
                                    text: "Option " + (count + 1),
                                    bias: null
                                }
                            ]

                            return question
                        })
                    }}
                >
                    Add More <BiPlusCircle />
                </button>
            </EditorSubContainer>




        </EditorContainer>

    )
}