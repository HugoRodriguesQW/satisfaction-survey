import { PageContainer } from "@/components/page.module";
import { Header } from "@/components/header.module";
import { Sidebar } from "@/components/sidebar.module";
import { SearchBar } from "./search.module";
import { HTMLAttributes, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { Separator } from "../separator.module";
import { dataContext } from "@/context/dataContext.module";
import { Skeleton } from "../skeleton.module";

export default function Workspace() {
  const { data, fetching } = useContext(dataContext);

  return (
    <PageContainer noOverflow>
      <Header fixed />
      <Skeleton condition={!fetching && !!data}>
        <div className="w-full h-full overflow-clip flex">
          <Sidebar />

          <div className="flex-1 flex flex-col px-5 [&>*]:max-w-[1600px] items-center">
            <Section hcenter>
              <div className="text-2xl mb-2">
                Welcome back,
                <Skeleton.Content className="inline">{" " + data?.private.name}</Skeleton.Content>
              </div>
              <SearchBar
                onChange={(keywords) => {
                  console.info(keywords);
                }}
              />
            </Section>

            <Separator />

            <Section></Section>

            <Skeleton.Skel className="w-full min-h-[369px] rounded-md" />
          </div>
        </div>
      </Skeleton>
    </PageContainer>
  );
}

type SectionProps = {
  variant?: "default" | "secondary";
  center?: boolean;
  vcenter?: boolean;
  hcenter?: boolean;
  skeleton?: boolean;
} & HTMLAttributes<HTMLDivElement>;

function Section({
  variant = "default",
  className,
  children,
  center,
  hcenter,
  vcenter,
  skeleton,
  ...rest
}: SectionProps) {
  const Container = skeleton ? Skeleton.Content : "div";

  return (
    <Container
      {...rest}
      className={twMerge(
        "w-full flex-col py-6 px-4 flex rounded-md min-h-[189px] gap-4",
        (center || vcenter) && "justify-center",
        (center || hcenter) && "items-center",
        variant === "default" && "bg-background",
        variant === "secondary" && "bg-foreground/5",
        className
      )}
    >
      {children}
    </Container>
  );
}
