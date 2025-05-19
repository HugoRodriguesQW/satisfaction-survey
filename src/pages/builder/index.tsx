import { BuilderEditor } from "@/components/builder/editor.module";
import { BuilderPanel } from "@/components/builder/panel.module";
import { BuilderSideBar } from "@/components/builder/sidebar.module";
import { createDraggable } from "@/components/draggable.module";
import { Header } from "@/components/header.module";
import { PageContainer } from "@/components/page.module";
import { BuilderContextProvider } from "@/context/builderContext.module";
import { QuestionTypes } from "@/resources/definitions";

export const DragItems = createDraggable<QuestionTypes>()
export const DragTest = createDraggable()

export default function Builder() {
    return (
        <BuilderContextProvider>
           
            <DragItems.Context>
                <DragTest.Context>
                    <PageContainer noOverflow>
                        <Header fixed showFile />


                        <div className="w-full h-full overflow-clip flex bg-background justify-between">
                            <BuilderSideBar />
                            <BuilderPanel />
                            <BuilderEditor />
                        </div>
                    </PageContainer>
                </DragTest.Context>
            </DragItems.Context>
        </BuilderContextProvider>
    )
}