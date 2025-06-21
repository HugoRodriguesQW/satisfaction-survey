import { builderContext } from "@/context/builderContext.module"
import { useContext, useEffect, useState } from "react"

export function HeaderFile() {

    const { name, updateFilename } = useContext(builderContext)

    const [temp, setTemp] = useState(name);

    function handleSubmit() {
        updateFilename(temp)
    }

    useEffect(() => {
        setTemp(name)
    }, [name])

    return (
        <div className="flex flex-nowrap items-center font-medium gap-2">
            <input
                value={temp}
                placeholder="Untitled Survey"
                onChange={(e) => {
                    setTemp(e.target.value)
                }}
                onSubmit={handleSubmit}
                onBlur={handleSubmit}
                className="whitespace-nowrap flex-0 max-w-[120px] overflow-clip border-b border-foreground/10 outline-0"></input>
            /
            <div className="bg-foreground/10 px-[0.4rem] py-[0.1rem] rounded-md">Draft</div>
        </div>
    )
}