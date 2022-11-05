import '../styles/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { AppProps } from 'next/app'
import Layout from '../components/layouts/layout';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
useEffect(() => {
  

})


  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>)
}
