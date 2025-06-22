import { builderContext } from "@/context/builderContext.module"
import { Sync } from "@/resources/definitions/sync"
import { useContext } from "react"
import { IoCheckmarkCircleOutline, IoSyncOutline } from "react-icons/io5"
import { MdOutlineSyncProblem } from "react-icons/md"

export function HeaderSyncStatus() {

    const { syncStatus } = useContext(builderContext)

    return (
        <div className="flex flex-nowrap items-center font-medium gap-2">
            {syncStatus === Sync.Ok && <IoCheckmarkCircleOutline className="w-8 h-8 text-green-500 opacity-75" />}
            {syncStatus === Sync.Syncing && <IoSyncOutline className="w-8 h-8 animate-spin duration-200 opacity-85" />}
            {syncStatus === Sync.Fail && <MdOutlineSyncProblem className="text-red-500 w-8 h-8 " />}
        </div>
    )
}