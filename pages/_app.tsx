import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app'

import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme,
  lightTheme
} from '@rainbow-me/rainbowkit';
import { 
  createConfig,
  configureChains, 
  WagmiConfig,
  Chain
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy'
import {
  ledgerWallet
} from '@rainbow-me/rainbowkit/wallets';

const walletConnectProjectId = "9945793581663233f7c9c4d6da12b24c"

const binance : Chain = {
  id: 56,
  name: 'Smart Chain',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: {
    public: {http: ['https://bsc-dataseed.binance.org']},
    default: {http: ['https://bsc-dataseed.binance.org']},
  },
  blockExplorers: {
    etherscan: {
      name: 'Etherscan',
      url: 'https://bscscan.com',
    },
    default: {
      name: 'Etherscan',
      url: 'https://bscscan.com',
    },
  },
  testnet: false,
  network: 'Smart Chain'
}
const customChains = {
  binance: binance
}

const { publicClient, chains } = configureChains(
  [
    {
      ...customChains.binance,
      iconUrl: 'https://user-images.githubusercontent.com/12424618/54043975-b6cdb800-4182-11e9-83bd-0cd2eb757c6e.png',
      iconBackground: 'black',
    },
  ],
  [publicProvider()]
);

const { wallets } = getDefaultWallets({
  appName: 'UNDER THE DEV',
  chains,
  projectId: walletConnectProjectId
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Others',
    wallets: [
      ledgerWallet({ chains, projectId: walletConnectProjectId })
    ],
  },
])

const wagmiClient = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <WagmiConfig config={wagmiClient}>
      <RainbowKitProvider chains={chains} showRecentTransactions={true} 
      theme={{
        lightMode: lightTheme(),
        darkMode: darkTheme({
        accentColor: 'black',
        accentColorForeground: 'white',
        borderRadius: 'medium',
      })}}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp