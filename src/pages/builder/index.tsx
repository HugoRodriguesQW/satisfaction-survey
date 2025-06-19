import { BuilderEditor } from "@/components/builder/editor.module";
import { BuilderPanel } from "@/components/builder/panel.module";
import { BuilderSideBar } from "@/components/builder/sidebar.module";
import { createDraggable } from "@/components/draggable.module";
import { Header } from "@/components/header.module";
import { PageContainer } from "@/components/page.module";
import { BuilderContextProvider } from "@/context/builderContext.module";
import { firaCode } from "@/resources/client/fonts";
import { QuestionTypes } from "@/resources/definitions";
import { twMerge } from "tailwind-merge";

export const DragItems = createDraggable<QuestionTypes>()
export const DragTest = createDraggable()
export const MovableSection = createDraggable()

export default function Builder() {
    return (
        <BuilderContextProvider>
            <DragItems.Context>
                <DragTest.Context>
                    <MovableSection.Context>
                        <PageContainer noOverflow>
                            <Header fixed showFile />


                            <div className={twMerge("w-full h-full overflow-clip flex bg-background justify-between",
                                firaCode.variable
                            )}>
                                <BuilderSideBar />
                                <BuilderPanel />
                                <BuilderEditor />
                            </div>
                        </PageContainer>
                    </MovableSection.Context>
                </DragTest.Context>
            </DragItems.Context>
        </BuilderContextProvider>
    )
}