import { DynamicBox } from "../DynamicBox";
import { Resizable } from "../resizable.module";
import { BsCursorText } from "react-icons/bs";
import { GiClick } from "react-icons/gi";
import { RxSlider } from "react-icons/rx";
import { IoText } from "react-icons/io5";


export function BuilderSideBar() {
    return (
        <Resizable axis={["x"]} className="min-w-[360px] max-w-[500px] px-3" handler>
            <DynamicBox onChange={(rect, w) => {
                return {
                    maxHeight: `${w.height - rect.top}px`,
                }
            }} className="overflow-auto">
                <div className="builder-sidebar-grid  w-full overflow-auto grid">
                    <SidebarItem Icon={BsCursorText} name="Text Input" value="text-input" />
                    <SidebarItem Icon={GiClick} name="Selection" value="selection" />
                    <SidebarItem Icon={RxSlider} name="Slider" value="slider" />
                    <SidebarItem Icon={IoText} name="Text Message" value="text-message" />
                </div>
            </DynamicBox>
        </Resizable>
    )

}


import { DragItems } from "@/pages/builder";
import { IconType } from "react-icons";
import { QuestionTypes } from "@/resources/definitions";

type SidebarItemProps = {
    Icon: IconType,
    name: string,
    value: QuestionTypes
}
function SidebarItem({ Icon, name, value }: SidebarItemProps) {
    return (
        <DragItems.Item data={value} onClick={(()=> {
            
        })} className="border border-foreground/15 from-foreground/10  to-foreground/5 bg-gradient-to-br rounded-md flex flex-col items-center py-6 justify-center whitespace-nowrap hover:to-foreground/20 hover:from-foreground/20  text-foreground/90 cursor-pointer [&>*]:select-none">
            <Icon className="w-7 h-7 opacity-55" />
            {name}
        </DragItems.Item>
    )
}
