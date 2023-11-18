import "@/styles/globals.css";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '../components/errors/ErrorBoundary';
import { CosmosWalletContext } from '../features/wallet/CosmosWalletContext';
import { EvmWalletContext } from '../features/wallet/EvmWalletContext';
import { SolanaWalletContext } from '../features/wallet/SolanaWalletContext';
import Menubar from "@/components/Menubar";
import Footer from "@/components/Footer";
import { WagmiConfig } from "wagmi";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import {
	arbitrum,
	avalanche,
	bsc,
	fantom,
	gnosis,
	mainnet,
	optimism,
	polygon,
  goerli
} from "wagmi/chains";

const chains = [
	mainnet,
	polygon,
	avalanche,
	arbitrum,
	bsc,
	optimism,
	gnosis,
	fantom,
  goerli
];

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

const reactQueryClient = new QueryClient({
	defaultOptions: {
	  queries: {
		refetchOnWindowFocus: false,
	  },
	},
  });

const wagmiConfig = defaultWagmiConfig({ chains, projectId });

createWeb3Modal({ wagmiConfig, projectId, chains, themeMode: 'dark'  });

export default function App({ Component, pageProps }: AppProps) {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setReady(true);
	}, []);
	return (
		<>
	{ready ? (
	<WagmiConfig config={wagmiConfig}>
		<ErrorBoundary>
      		<EvmWalletContext>
						<QueryClientProvider client={reactQueryClient}>
		  					<Menubar>
		  						<Component {...pageProps} />
          					</Menubar>
						{<Footer />}
					</QueryClientProvider>
		</EvmWalletContext>
	</ErrorBoundary>
</WagmiConfig>
			) : null}
		</>
	);
}