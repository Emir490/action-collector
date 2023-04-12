import { ActionsProvider } from '@/context/ActionsProvider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ActionsProvider>
      <Component {...pageProps} />
    </ActionsProvider>
  )
}
