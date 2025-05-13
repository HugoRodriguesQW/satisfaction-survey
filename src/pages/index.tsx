import { dataContext } from "@/context/dataContext.module";
import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { useContext } from "react";

type HomeProps = {
  access: boolean;
};

const Workspace = dynamic(() => import("@/components/workspace/workspace.module"), { ssr: true });
const LandingPage = dynamic(() => import("@/components/landing/landing.module"), { ssr: true });

export default function Home(props: HomeProps) {

  const { data, fetching } = useContext(dataContext)
  if (data || (fetching && props.access)) {
    return <Workspace />;
  }
  return <LandingPage />;
}

export const getServerSideProps: GetServerSideProps = async function (ctx) {
  return {
    props: {
      access: !!ctx.req.cookies["token"],
    } as HomeProps,
  };
};

