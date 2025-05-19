import { builderContext } from "@/context/builderContext.module"
import { useContext } from "react"

export function HeaderFile() {

    const { filename, updateFilename } = useContext(builderContext)

    return (
        <div className="flex flex-nowrap items-center font-medium gap-2">
            <input
                value={filename}
                onChange={(e) => {
                    const filename = e.target.value;
                    updateFilename(filename)
                }}

                className="whitespace-nowrap max-w-[120px] overflow-clip border-b border-foreground/10 outline-0"></input>
            /
            <div className="bg-foreground/10 px-[0.4rem] py-[0.1rem] rounded-md">Draft</div>
        </div>
    )
}