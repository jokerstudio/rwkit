import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSignMessage, useContract, useProvider } from 'wagmi'
import legacyERC721ABI from '../legacyERC721ABI.json'
import { useEffect, useState } from 'react'
import axios from 'axios'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  const [image, setImage] = useState<null | string>('')
  const [tokenId, setTokenId] = useState('')
  const [signing, setSigning] = useState(false)
  const provider = useProvider()
  const { address} = useAccount()
  const {
    chain
  } = useNetwork()
  const contract = useContract({
    address: '0xA5FDb0822bf82De3315f1766574547115E99016f',
    abi: legacyERC721ABI,
    signerOrProvider: provider
  })

  const [message, setMessage] = useState('under the dev')
  const { data: res, signMessage } = useSignMessage({
    message,
    onSuccess(data) {
      (async() => {
        const res = await axios.post(
          "/api/coupon",
          {
            address: address,
            tokenId: tokenId,
            sig: data,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
        setSigning(false)
        console.log(res.data)
      })()
    },
    onError(error){
      setSigning(false)
    },
  })

  useEffect(() =>   {
    (async() => {
      if(address == null) {
        setImage(null)
        return
      }
      if(chain?.id != 56) 
      {
        setImage(null)
        return
      }

      const tokenCount = await contract?.balanceOf(address)
      if(Number(tokenCount) < 1) {
        setImage(null)
        return
      }
      const tokenId = await contract?.tokenOfOwnerByIndex(address, 0)
      if(tokenId == null) return
      const meta = await contract?.tokenURI(Number(tokenId))
      const response = await fetch(meta);
      const data = await response.json();
      setImage(data.image)
    })()
  }, [contract, address])
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h2 className={styles.title}>
          UNDER THE DEV X Meta Warden
        </h2>
        <br/>
        <ConnectButton accountStatus="address" />
        <br/>
        <div>
          { !image ? null :
            <Image className="rounded-full" alt="MetaWarden" src={image} width={200} height={200} />
          }
        </div>
        <br/>
        { !image ? null :
          <button onClick={() => {setSigning(true);signMessage()}} type="button" className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
            { signing ? 
            (
              <>
              <svg role="status" className="inline w-5 h-5 mr-2 text-gray-600 animate-spin dark:text-gray-200 fill-gray-200 dark:fill-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              Waiting...
              </>
            ) :
              <>Claim Coupon</>
            }
          </button>
        }
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home