
import { useRouter } from "next/router";
import { HTMLAttributes, ReactNode } from "react";
import { FaRegFolderOpen } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { LuPencilRuler } from "react-icons/lu";
import { MdOutlineInsights } from "react-icons/md";

import { twMerge } from "tailwind-merge";

export function Sidebar() {
  return (
    <div className={
        twMerge(
            "h-full flex lg:[&>*]:pl-8 [&>*]:px-4 lg:[*>*]:pr-0 border-r border-foreground/10 lg:max-w-[320px] lg:w-full",
            "flex-row sm:flex-col fixed bottom-0 left-0 h-auto w-full sm:static sm:h-full sm:w-auto",
            "overflow-y-auto",
            "before-dark sm:no-before-dark rounded-none"
        )
    }>
      <Section icon={<FaRegFolderOpen />} name="Workspace" active path="/" />
      <Section icon={<MdOutlineInsights />} name="Overview" path="/overview" />
      <Section icon={<IoPeopleSharp />} name="Users" path="/users" />
      <Section icon={<LuPencilRuler />} name="Builder" path="/builder" className="text-purple-700" />
    </div>
  );
}

type SectionProps = {
  icon?: ReactNode;
  name?: string;
  path?: string;
  active?: boolean;
} & HTMLAttributes<HTMLDivElement>;

function Section({ icon, className, name, active, path, ...rest }: SectionProps) {
  const router = useRouter();

  function handleClick() {
    return !active && path && router.push(path);
  }

  return (
    <div
      {...rest}
      className={twMerge(
        "w-full lg:grid lg:grid-cols-[1.78rem_1fr] gap-3 items-center py-3 bg-foreground/5 cursor-pointer",
        "bg-gradient-to-l from-foreground/[1%] via-foreground/[1%] to-foreground/[0%]",
        !active && "hover:from-foreground/5 hover:via-foreground/5",
        active && "from-foreground/10 via-foreground/10 hover:from-foreground/15",
        "grid-rows-[1.78rem_1fr] lg:grid-rows-1 justify-items-center lg:justify-items-start",
        className
      )}
      onClick={handleClick}
    >
      <div className="[&>*]:h-6 [&>*]:w-6 p-1 bg-foreground/15 flex items-center justify-center aspect-square rounded-md max-w-9">
        {icon}
      </div>
      <div >{name}</div>
    </div>
  );
}
