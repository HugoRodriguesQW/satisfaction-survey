import { builderContext } from "@/context/builderContext.module"
import Head from "next/head";
import { useContext, useEffect, useState } from "react"

export function HeaderFile() {

    const { name, updateFilename } = useContext(builderContext)

    const [temp, setTemp] = useState(name);

    function handleSubmit() {
        updateFilename(temp)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            updateFilename(temp)
        }, 300)
        return () => {
            clearTimeout(timeout)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [temp])

    useEffect(() => {
        setTemp(name)
    }, [name])

    return (
        <div className="flex flex-nowrap items-center font-medium gap-2">
            <Head>
                <title>Privora | {name}</title>
            </Head>
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