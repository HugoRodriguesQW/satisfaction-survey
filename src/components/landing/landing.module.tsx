import { Header } from "../header.module";
import { MainContainer, PageContainer } from "../page.module";

export default function Landing() {
  return (
    <PageContainer>
      <Header fixed />
      <MainContainer>
        Se voce vê isso, é porque a landing page está funcionando
        </MainContainer>
    </PageContainer>
  );
}
