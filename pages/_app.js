import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';

import {
  apiProvider,
  configureChains,
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme,
  lightTheme,
  midnightTheme,
  wallet
} from '@rainbow-me/rainbowkit';
import { createClient, chain, WagmiProvider } from 'wagmi';

const customChains = {
  binance: {
    id: 56,
    name: 'Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: {
      default: `https://bsc-dataseed.binance.org`,
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
  }
}

const { provider, chains } = configureChains(
  [
    {
      ...customChains.binance,
      iconUrl: 'https://user-images.githubusercontent.com/12424618/54043975-b6cdb800-4182-11e9-83bd-0cd2eb757c6e.png',
      iconBackground: 'black',
    },
    chain.mainnet,
  ],
  [apiProvider.jsonRpc(chain => ({ rpcUrl: chain.rpcUrls.default }))]
);

const { wallets } = getDefaultWallets({
  appName: 'UNDER THE DEV',
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Others',
    wallets: [
      wallet.ledger({ chains })
    ],
  },
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return(
    <WagmiProvider client={wagmiClient}>
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
    </WagmiProvider>
  )
}

export default MyApp
