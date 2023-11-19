import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '@hyperlane-xyz/widgets/styles.css';

import Footer from '../components/Footer';
import Menubar from '../components/Menubar';
import { ErrorBoundary } from '../components/errors/ErrorBoundary';
import { CosmosWalletContext } from '../features/wallet/CosmosWalletContext';
import { EvmWalletContext } from '../features/wallet/EvmWalletContext';
import { SolanaWalletContext } from '../features/wallet/SolanaWalletContext';
import '../styles/fonts.css';
import '../styles/globals.css';
import { useIsSsr } from '../utils/ssr';

const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  // Disable app SSR for now as it's not needed and
  // complicates graphql integration
  const isSsr = useIsSsr();
  if (isSsr) {
    return <div></div>;
  }

  return (
    <ErrorBoundary>
      <EvmWalletContext>
        <SolanaWalletContext>
          <CosmosWalletContext>
            <QueryClientProvider client={reactQueryClient}>
              <Menubar>
                <Component {...pageProps} />
              </Menubar>
              {<Footer />}
            </QueryClientProvider>
            <ToastContainer transition={Zoom} position={toast.POSITION.BOTTOM_RIGHT} limit={2} />
          </CosmosWalletContext>
        </SolanaWalletContext>
      </EvmWalletContext>
    </ErrorBoundary>
  );
}