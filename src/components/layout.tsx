import Head from "next/head";
import Link from "next/link";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Action Collector</title>
      </Head>
      <div className="bg-black min-h-screen">
        <header className="flex justify-evenly flex-col md:flex-row text-slate-100 font-black text-center py-5 bg-slate-900">
          <Link href='/' className="text-5xl font-mono">Hacer Señas</Link>
          <div className="flex justify-center items-center flex-col md:flex-row">
            <p className="text-white">¿Qué seña debo hacer?</p>
            <a className="text-white font-bold ml-3 uppercase underline" href="https://www.conapred.org.mx/documentos_cedoc/DiccioSenas_ManosVoz_ACCSS.pdf" target="_blank">Guía</a>
          </div>
        </header>
        <main className="container mx-auto mt-10 bg-slate-900 py-5 px-10 rounded-xl">
          {children}
        </main>
        <br />
      </div>
    </>
  )
}

export default Layout