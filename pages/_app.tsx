import type {AppProps} from "next/app";
import {useRouter} from "next/router";
import {QueryClient, QueryClientProvider} from "react-query";
import {RecoilRoot} from "recoil";
import "../styles/globals.css";
import "../styles/reset.css";
import RootProvider from "./components/RootProvider";
import Header from "./components/_header/Header";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter();

  return (
    <QueryClientProvider client={client}>
      <RecoilRoot>
        <RootProvider>
          {router.pathname !== "/" && <Header />}
          <Component {...pageProps} />
        </RootProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export default MyApp;
