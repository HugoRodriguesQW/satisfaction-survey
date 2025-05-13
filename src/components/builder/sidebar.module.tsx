import { Resizable } from "../resizable.module";


export function BuilderSideBar() {
    return (
        <Resizable axis={["x"]} className="min-w-[360px] max-w-[500px]" handler>
            <div className="bg-red-500 w-full">SIDEBAR</div>
        </Resizable>
    )

}