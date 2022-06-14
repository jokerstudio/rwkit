import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';

import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme,
  lightTheme,
  wallet
} from '@rainbow-me/rainbowkit';
import { 
  createClient, 
  chain, 
  configureChains, 
  WagmiConfig
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

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
  [publicProvider()]
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
    <WagmiConfig client={wagmiClient}>
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
