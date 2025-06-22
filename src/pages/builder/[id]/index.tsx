import { BuilderEditor } from "@/components/builder/editor.module";
import { BuilderPanel } from "@/components/builder/panel.module";
import { BuilderSideBar } from "@/components/builder/sidebar.module";
import { EditorSyncStatus } from "@/components/builder/sync.module";
import { createDraggable } from "@/components/draggable.module";
import { Header } from "@/components/header.module";
import { PageContainer } from "@/components/page.module";
import { BuilderContextProvider } from "@/context/builderContext.module";
import { firaCode } from "@/resources/client/fonts";
import { QuestionTypes } from "@/resources/definitions";
import { GetServerSideProps } from "next";
import { twMerge } from "tailwind-merge";

export const DragItems = createDraggable<QuestionTypes>()
export const DragTest = createDraggable()
export const MovableSection = createDraggable()

type BuilderProps = {
    id: string
}

export default function Builder(props: BuilderProps) {

    return (
        <BuilderContextProvider id={props.id}>
            <DragItems.Context>
                <DragTest.Context>
                    <MovableSection.Context>
                        <PageContainer noOverflow>
                            <Header fixed showFile showSync />
                            <div className="w-full h-full overflow-clip bg-background">
                                <EditorSyncStatus />

                                <div className={twMerge("w-full h-full overflow-clip flex justify-between",
                                    firaCode.variable
                                )}>
                                    <BuilderSideBar />
                                    <BuilderPanel />
                                    <BuilderEditor />
                                </div>
                            </div>
                        </PageContainer>
                    </MovableSection.Context>
                </DragTest.Context>
            </DragItems.Context>
        </BuilderContextProvider >
    )
}


export const getServerSideProps: GetServerSideProps<BuilderProps> = async (ctx) => {
    const { id } = ctx.query;

    return {
        props: {
            id: id as string
        }
    }
}