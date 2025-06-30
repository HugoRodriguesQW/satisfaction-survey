import {
  useClick,
  useFloating,
  useInteractions,
  useDismiss,
  useRole,
  autoUpdate,
  flip,
  shift,
  size,
  useHover,
  safePolygon,
} from "@floating-ui/react";
import { dataContext } from "@/context/dataContext.module";
import { HTMLAttributes, useContext, useState } from "react";
import { Skeleton } from "../skeleton.module";
import Avatar from "boring-avatars";
import { Separator } from "../separator.module";
import { twMerge } from "tailwind-merge";
import { PiGearFine } from "react-icons/pi";
import { CgLogOff, CgSpinnerAlt } from "react-icons/cg";
import { sessionContext } from "@/context/sessionContext.module";
import { useRouter } from "next/router";
import { HeaderLogin } from "./login.module";

export function Account() {
  const router = useRouter();
  const { fetching, data } = useContext(dataContext);
  const { fetching: sessionFetching, forgotSession } = useContext(sessionContext);

  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,

    whileElementsMounted: autoUpdate,
    middleware: [
      flip(),
      shift(),
      size({
        apply({ rects, elements }) {
          elements.floating.style.minWidth = `${rects.reference.width}px`;
        },
      }),
    ],
    placement: "bottom-end",
  });

  const click = useClick(context);
  const role = useRole(context, { role: "menu" });

  const hover = useHover(context, {
    mouseOnly: true,
    delay: open ? 0 : 1000,
    handleClose: safePolygon(),
    restMs: 0
  });

  const dismiss = useDismiss(context, {
    escapeKey: false,

    outsidePress: (event) => {
      event.preventDefault();
      event.stopPropagation();
      return true;
    },
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([click, hover, dismiss, role]);

  function handleLogoff() {
    forgotSession()
      .then(() => {
        router.reload();
      })
      .catch(() => { });
  }

  if (!fetching && !data) {
    return <HeaderLogin />;
  }

  return (
    <Skeleton condition={!fetching && !!data}>
      <div className="flex items-center gap-3">
        <Separator orientation="vertical" className="h-10" />
        <div
          className={twMerge(
            "flex items-center gap-2 p-2 rounded-md cursor-pointer",
            " from-foreground/10 to-foreground/20 via-foreground/10",
            "transition-colors duration-150",
            open && "rounded-b-none bg-gradient-to-tr",
            !open && "hover:bg-foreground/5"
          )}
          ref={refs.setReference}
          {...getReferenceProps()}
        >
          <Skeleton.Skel className="w-12 h-12" />
          <Skeleton.Content>
            <Avatar
              name={data?.private.name}
              colors={["#796c86", "#74aa9b", "#91c68d", "#ece488", "#f6f5cd"]}
              variant="beam"
              className="w-12"
            />
          </Skeleton.Content>
          <div className="hidden sm:flex flex-col">
            <Skeleton.Skel className="min-w-20 w-20 h-5" />
            <Skeleton.Content className="whitespace-nowrap italic font-semibold">Personal</Skeleton.Content>

            <Skeleton.Skel className="w-30 h-5" />
            <Skeleton.Content className="whitespace-nowrap text-foreground text-sm">{data?.private.name}</Skeleton.Content>
          </div>
        </div>
      </div>

      {open && (
        <div
          style={floatingStyles}
          ref={refs.setFloating}
          {...getFloatingProps()}
          className="min-h-[50px] p-3 before-dark border-none rounded-b-md z-50"
        >

          <div className="flex sm:hidden flex-col"> 
            <Skeleton.Skel className="min-w-20 w-20 h-5" />
            <Skeleton.Content className="whitespace-nowrap italic font-semibold">Personal</Skeleton.Content>

            <Skeleton.Skel className="w-30 h-5" />
            <Skeleton.Content className="whitespace-nowrap text-sm">{data?.private.name}</Skeleton.Content>
          </div>

          <Separator className="block: sm:hidden my-2" />

          <MenuItem className="opacity-10" disabled>
            <PiGearFine className="w-5" /> Ajustes
          </MenuItem>

          <MenuItem className="text-red-600" onClick={handleLogoff} disabled={sessionFetching}>
            {sessionFetching ? <CgSpinnerAlt className="h-5 w-5 animate-spin" /> : <CgLogOff className="w-5" />}
            Sair
          </MenuItem>
        </div>
      )}
    </Skeleton>
  );
}

function MenuItem({ children, className, disabled, ...rest }: HTMLAttributes<HTMLDivElement> & { disabled?: boolean }) {
  return (
    <div
      {...rest}
      className={twMerge(
        "flex items-center gap-1 select-none hover:font-semibold transition-colors cursor-pointer mt-1",
        className,
        disabled && "hover:font-normal cursor-default"
      )}
    >
      {children}
    </div>
  );
}
