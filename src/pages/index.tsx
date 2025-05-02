import type { GetServerSideProps } from "next";
import { MainContainer, PageContainer } from "@/components/page.module";
import { Footer } from "@/components/footer.module";
import { Header } from "@/components/header.module";

export default function Home() {

  return (
    <PageContainer>
      <Header />

      <MainContainer>Logged</MainContainer>

      <Footer />
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async function (ctx) {
  if (!ctx.req.cookies["token"]) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
