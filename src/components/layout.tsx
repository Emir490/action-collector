import Head from "next/head";
import Link from "next/link";
import { FC, ReactNode } from "react";
import Header from "./header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Action Collector</title>
      </Head>
      <div className="bg-black min-h-screen">
        <Header />
        <main className="container mx-auto mt-10 bg-slate-900 p-5 rounded-xl">
          {children}
        </main>
        <br />
      </div>
    </>
  );
};

export default Layout;
