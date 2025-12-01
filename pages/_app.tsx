import type { AppProps } from 'next/app'
import Head from 'next/head'
import { CartProvider } from '../src/context/CartContext'
import { ToastProvider } from '../src/context/ToastContext'
import Header from '../src/components/Header'
import '../src/styles/global.css'
import Toasts from '../src/components/Toast'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <CartProvider>
        <Head>
          <title>RLEcommernce</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Header />
        <main className="container">
          <Component {...pageProps} />
        </main>
        <Toasts />
      </CartProvider>
    </ToastProvider>
  )
}
