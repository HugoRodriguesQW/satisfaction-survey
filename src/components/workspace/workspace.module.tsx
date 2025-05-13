import { PageContainer } from "@/components/page.module";
import { Header } from "@/components/header.module";
import { Sidebar } from "@/components/sidebar.module";
import { SearchBar } from "./search.module";
import { HTMLAttributes, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { Separator } from "../separator.module";
import { dataContext } from "@/context/dataContext.module";
import { Skeleton } from "../skeleton.module";
import { SurveyCard } from "./card.module";
import { DynamicBox } from "../DynamicBox";
import { STATUS, STATUSValue } from "@/resources/definitions";

export default function Workspace() {
  const { data, fetching } = useContext(dataContext);

  return (
    <PageContainer noOverflow>
      <Header fixed />
      <Skeleton condition={!fetching && !!data}>
        <div className="w-full h-full overflow-clip flex bg-background">
          <Sidebar />

          <div className="flex-1 px-5 max-w-[1600px] mx-auto my-0 items-center">
            <Section hcenter className="min-h-[4rem] sm:min-h-[186px] py-0 sm:py-6">
              <div className="text-2xl mb-2 hidden sm:block">
                <div className="whitespace-nowrap">Welcome back,</div>
                <Skeleton.Content className="inline whitespace-nowrap">{" " + data?.private.name}</Skeleton.Content>
              </div>
              <SearchBar
                onChange={(keywords) => {
                  console.info(keywords);
                }}
              />
            </Section>

            <Separator />

            <DynamicBox className="overflow-auto" onChange={(rect, w) => {
              return {
                maxHeight: `${w.height - rect.top}px`,
              }
            }} >
              <Section className="grid-flow-dense w-full   overflow-auto" display="grid">
                <SurveyCard data={{
                  answers: 0,
                  questions: 6,
                  status: STATUS.scheduled,
                  takers: 142,
                  feedbacks: 23,
                  title: "Pulsa Supply - BM",
                  description: "ambev engagement survey"
                }} />

                <SurveyCard data={{
                  answers: 13,
                  questions: 6,
                  status: STATUS.active,
                  title: "Pulsa Supply - BM",
                  takers: 142,
                  feedbacks: 12,
                  description: "Ambev engagement survey"
                }} />


                <SurveyCard data={{
                  answers: 27,
                  questions: 8,
                  status: STATUS.ended,
                  title: "Pulsa Supply - BM",
                  takers: 142,
                  feedbacks: 2,
                  description: "Ambev engagement survey"
                }} />


                <SurveyCard data={{
                  answers: 3,
                  questions: 5,
                  status: STATUS.disabled,
                  title: "Pulsa Supply - BM",
                  takers: 136,
                  feedbacks: 5,
                  description: "Ambev engagement survey"
                }} />


                <SurveyCard data={{
                  answers: 1,
                  questions: 5,
                  status: STATUS.ended,
                  title: "Pulsa Supply - BM",
                  takers: 136,
                  feedbacks: 12,
                  description: "Ambev engagement survey"
                }} />



                <SurveyCard data={{
                  answers: 45,
                  questions: 12,
                  status: 8 as STATUSValue,
                  title: "Pulsa Supply - BM",
                  takers: 137,
                  feedbacks: 5,
                  description: "Ambev engagement survey"
                }} />
              </Section>



              <Skeleton.Skel className="w-full min-h-[369px] rounded-md" />

              <div className="h-20" />
            </DynamicBox>
          </div>
        </div>
      </Skeleton>
    </PageContainer >
  );
}

type SectionProps = {
  variant?: "default" | "secondary";
  center?: boolean;
  vcenter?: boolean;
  hcenter?: boolean;
  skeleton?: boolean;
  display?: "grid" | "flex"
} & HTMLAttributes<HTMLDivElement>;

function Section({
  variant = "default",
  display = "flex",
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
        display === "flex" && "flex flex-col",
        display === "grid" && "grid-flow-dense",
        "w-full py-6 px-2 sm:px-4 rounded-md   min-h-[189px] gap-4",
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
