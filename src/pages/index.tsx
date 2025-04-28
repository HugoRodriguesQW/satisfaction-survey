import type { GetServerSideProps } from "next";
import { sessionContext } from "@/context/sessionContext.module";
import { useRouter } from "next/router";
import { useContext } from "react";
import { MainContainer, PageContainer } from "@/components/page.module";
import { Footer } from "@/components/footer.module";

export default function Home() {
  const router = useRouter();
  const { forgotSession } = useContext(sessionContext);

  function handleLogout() {
    forgotSession()
      .then(() => {
        router.reload();
      })
      .catch(() => {});
  }

  return (
    <PageContainer>
      <header>
        <button onClick={handleLogout} className="cursor-pointer bg-red-500 text-background px-2 rounded-sm">
          logout
        </button>
      </header>

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
