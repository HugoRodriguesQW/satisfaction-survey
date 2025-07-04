import { Footer } from "@/components/footer.module";
import { Login } from "@/components/auth.module";
import { MainContainer, PageContainer } from "@/components/page.module";
import { Transaction } from "@/resources/transactions";
import { it } from "@/resources/utils";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

type LoginRecoveryProps = {
  invalid: boolean;
  email_token?: string;
  transaction?: Transaction;
};

export default function LoginRecovery(props: LoginRecoveryProps) {
  const router = useRouter();

  function getOutHere() {
    router.replace("/");
  }

  return (
    <PageContainer>
      <header></header>
      <MainContainer>
        {props.invalid && (
          <div className="flex flex-col gap-10 items-start">
            <div>
              <div className="text-2xl">OOOPS!</div>
              <div>This recovery link cannot be used. Below are some reasons that may lead to this:</div>
            </div>

            <ul className="list-inside list-decimal">
              <li>The link has already been used;</li>
              <li>The link was not validated by the server;</li>
              <li>The link has already expired;</li>
              <li>A temporary error in processing;</li>
            </ul>

            <button className="tail-button rounded-md text-background p-2 px-6" onClick={getOutHere}>
              Get out here
            </button>
          </div>
        )}

        {!props.invalid && (
          <Login
            initialStep="recovery_email_check"
            initialTransaction={props.transaction}
            data={{
              email_token: props.email_token,
            }}
          />
        )}
      </MainContainer>
      <Footer />
    </PageContainer>
  );
}


import { searchTransactionBy } from "@/resources/server/transactions";
import { newClient } from "@/resources/server/database";
import { Compound, Task } from "@/resources/server/tasks";

export const getServerSideProps: GetServerSideProps<LoginRecoveryProps> = async (ctx) => {
  try {
    const { id, email_token } = ctx.query;
    if (!validateInput(id, email_token)) throw this;
    const client = await newClient();
    const transaction = await searchTransactionBy(client, id as string);

  
    if (!transaction) throw this;

    const tasks = Compound.TaskStack(transaction.tasks.map(Task.from)).attachRaw(transaction.meta)


    return {
      props: {
        invalid: false,
        transaction: {
          id: id as string,
          tasks: tasks.map(Task.safeSave)
        },
        email_token: email_token as string,
      },
    };

  } catch  {
    return {
      props: {
        invalid: true,
      },
    };
  }
};

function validateInput(id: unknown, email_token: unknown): boolean {
  return it(id, email_token).is(String());
}
