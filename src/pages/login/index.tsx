import { Footer } from "@/components/footer.module";
import { Login } from "@/components/login.module";
import { MainContainer, PageContainer } from "@/components/page.module";
import { GetServerSideProps } from "next";

export default function LoginPage() {
  return (
    <PageContainer>
      <header></header>
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
