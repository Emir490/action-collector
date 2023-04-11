import Head from "next/head";
import Script from "next/script";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Action Collector</title>
        <Script src="" />
      </Head>
      <Script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript" />
      <div className="bg-slate-900 min-h-screen">
        <h1 className="font-mono text-5xl text-slate-100 font-black text-center pt-10">Señas</h1>
        {children}
      </div>
    </>
  )
}

export default Layout