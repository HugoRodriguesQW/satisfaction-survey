import { DataContextProvider } from "@/context/dataContext.module";
import { SessionContextProvider } from "@/context/sessionContext.module";
import "@/styles/globals.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider>
      <DataContextProvider>
        <Component {...pageProps} />
      </DataContextProvider>
    </SessionContextProvider>
  );
}
