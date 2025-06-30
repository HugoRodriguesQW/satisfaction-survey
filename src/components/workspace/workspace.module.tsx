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
import Head from "next/head";
import { workspaceContext, WorkspaceContextProvider } from "@/context/workspaceContext.module";
import { getSurveyStatus } from "@/resources/survey";

export default function Workspace() {
  const { data, fetching } = useContext(dataContext);

  return (
    <WorkspaceContextProvider>
      <PageContainer noOverflow>

        <Head>
          <title>Privora | Build Fast and Private Surveys</title>
        </Head>

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

              <DynamicBox className="overflow-auto h-full" onChange={(rect, w) => {
                return {
                  maxHeight: `${w.height - rect.top}px`,
                }
              }} >
                <SurveyCards />
              </DynamicBox>
            </div>
          </div>
        </Skeleton>
      </PageContainer >
    </WorkspaceContextProvider>
  );
}

function SurveyCards() {

  const { currentBucket, fetching, nextExists, readSurveyBucket, surveys, openSurveyEditor } = useContext(workspaceContext)


  const conditions = {
    displaySurveys: !!surveys[0],
    displayShowMore: nextExists,
    showFirstSurveyCall: !fetching && !surveys[0],
    showLoading: fetching && !surveys[0]
  }


  function handleGetStarted() {
    window.open(new URL("/builder", window.location.href), "_blank")
  }

  function handleShowMore() {
    readSurveyBucket(currentBucket + 1)
  }

  function handleClick(id: string) {
    openSurveyEditor(id)
  }

  return (
    <>

      <Section className="w-full overflow-auto" display="grid">

        {conditions.displaySurveys && (surveys.map((survey) =>
          <SurveyCard key={survey.id + "-survey-card-workspace"}
            onClick={() => handleClick(survey.id)}
            data={{
              answers: 0,
              questions: survey.questionsCount,
              status: getSurveyStatus(survey.schedule),
              takers: 100,
              feedbacks: 0,
              title: survey.name ?? "Untitled Survey",
              description: ""
            }} />
        ))}

        {(conditions.showFirstSurveyCall || conditions.showLoading) && (
          new Array(8).fill(0).map((_, i) => (
            <Skeleton condition={!conditions.showLoading} key={"fake-workspace-skel-" + i} >
              <Skeleton.Skel className="w-full h-full rounded-md bg-foreground/5 min-h-[200px]" />
              <Skeleton.Content className="w-full h-full rounded-md bg-foreground/10 min-h-[200px]" />
            </Skeleton>
          ))
        )}

        {fetching && (
          <>
            <Skeleton condition={false}>
              <Skeleton.Skel className="w-full h-full rounded-md" />
            </Skeleton>
            <Skeleton condition={false}>
              <Skeleton.Skel className="w-full h-full rounded-md" />
            </Skeleton>
          </>
        )
        }
      </Section>


      {conditions.displayShowMore && (
        <div className="w-full flex py-3 justify-center">
          <button className="border border-foreground/25 px-4 py-1 rounded-md hover:bg-foreground/5" onClick={handleShowMore} disabled={fetching}>
            {fetching ? "searching..." : "show more"}
          </button>
        </div>
      )}

      {conditions.displaySurveys && <div className="h-20" />}

      {
        (conditions.showFirstSurveyCall || conditions.showLoading) && (
          <div className="min-h-[300px] h-full py-5 flex items-center justify-center flex-col gap-5 relative">
            {
              conditions.showFirstSurveyCall && (
                <>
                  <div className="flex flex-col gap-2 items-center z-1">
                    <div className="text-3xl font-bold text-center">Let’s start by creating your first <span className="font-bold text-neon-violet-sub">private</span> survey.</div>
                    <div className="text-lg max-w-[80%] text-center  text-foreground/90">No surveys yet. Create your first survey to start collecting valuable insights</div>
                  </div>
                  <button
                    className="tail-button px-8 py-2 z-1 rounded-md font-bold text-white cursor-pointer hover:to-neon-violet  transition duration-200"
                    onClick={handleGetStarted}
                  >Get Started</button>
                </>
              )
            }
          </div>
        )
      }
    </>
  )
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
        display === "grid" && "workspace-grid",
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
