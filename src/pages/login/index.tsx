import { Footer } from "@/components/footer.module";
import { Login } from "@/components/auth.module";
import { MainContainer, PageContainer } from "@/components/page.module";
import { GetServerSideProps } from "next";
import { Header } from "@/components/header.module";

export default function LoginPage() {
  return (
    <PageContainer>
      <Header showAccount={false}/>
      <MainContainer>
        <Login />
      </MainContainer>

      <Footer />
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async function (ctx) {
  if (ctx.req.cookies["token"]) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
