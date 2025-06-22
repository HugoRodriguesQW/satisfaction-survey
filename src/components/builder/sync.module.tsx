import { builderContext } from "@/context/builderContext.module";
import { Sync } from "@/resources/definitions/sync";
import { useContext, useEffect, useState } from "react";
import { BiSolidErrorCircle } from "react-icons/bi";

export function EditorSyncStatus() {

    const { syncStatus, forceSync } = useContext(builderContext)
    const [isInError, setIsInError] = useState(false);

    function handleTryAgain() {
        forceSync()
    }

    useEffect(() => {
        if (syncStatus === Sync.Fail) {
            setIsInError(true)
        }

        if (syncStatus === Sync.Ok) {
            setIsInError(false)
        }
    }, [syncStatus])

    return (
        <>
            {isInError && (
                <div className="w-full bg-red-300/20 h-12 flex justify-between py-2 px-6 items-center text-red-600">
                    <div className="flex gap-2">
                        <BiSolidErrorCircle className="w-4 h-4" /> OPS! We could not save your survey. Your file is not saved, but you can try again anytime.
                    </div>

                    <button className="font-bold  px-3 py-1 rounded-md hover:opacity-85" onClick={handleTryAgain} disabled={syncStatus != Sync.Fail}>
                        {syncStatus === Sync.Syncing ? "Syncing" : "Try Again"}
                    </button>
                </div>
            )}
        </>
    )
}