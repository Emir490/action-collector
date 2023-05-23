import Head from "next/head";
import { FC, ReactNode } from "react";
import Header from "./header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>SignAI</title>
      </Head>
      <div className="bg-orange-200 min-h-screen">
        <Header />
        <main className="container mx-auto mt-10 p-5 rounded-xl">
          {children}
        </main>
        <br />
      </div>
    </>
  );
};

export default Layout;