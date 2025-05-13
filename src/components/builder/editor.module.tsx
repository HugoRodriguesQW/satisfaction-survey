import { Resizable } from "../resizable.module";

export function BuilderEditor() {
    return (
        <Resizable axis={["x"]} border={{
            x: "left", y: "bottom"
        }} className="min-w-[360px] max-w-[500px]" handler>
            <div className="bg-green-500 w-full">EDITOR</div>
        </Resizable>
    )
}