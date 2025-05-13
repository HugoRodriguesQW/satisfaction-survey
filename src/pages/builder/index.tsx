import { BuilderEditor } from "@/components/builder/editor.module";
import { BuilderPanel } from "@/components/builder/panel.module";
import { BuilderSideBar } from "@/components/builder/sidebar.module";
import { Header } from "@/components/header.module";
import { PageContainer } from "@/components/page.module";

export default function Builder() {
    return (
        <PageContainer noOverflow>
            <Header fixed />


            <div className="w-full h-full overflow-clip flex bg-background justify-between">
                <BuilderSideBar />
                <BuilderPanel />
                <BuilderEditor />
            </div>
        </PageContainer>
    )
}