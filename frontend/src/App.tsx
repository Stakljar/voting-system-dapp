import './css/App.css'
import Voting from './components/Voting'
import Results from './components/Results'
import { createContext, useEffect, useRef, useState } from 'react'
import Notice from './components/Notice'
import { ethers } from 'ethers'
import { Spin } from 'antd'
import { contractAddress, contractAbi, contractChainId } from './data/contractData'
import { useSyncProviders } from './hooks/useSyncProviders'

type UserData = {
  isLoggedIn: boolean,
  address: string,
  balance: string,
  chainId: string | null,
}

export type ContractInteractionData = {
  browserProvider: ethers.BrowserProvider | null,
  signer: ethers.Signer | null,
  contract: ethers.Contract | null,
}

export type Candidate = {
  fullName: string,
  voteCount: bigint,
}

export type ContractData = {
  isEligible: boolean,
  isOwner: boolean,
  hasVoted: boolean,
  candidates: Candidate[] | null,
  endTime: bigint | null,
}

export const ContractInteractionDataContext = createContext<ContractInteractionData>({ browserProvider: null, signer: null, contract: null })

export default function App() {
  const providers = useSyncProviders()
  const [provider, setProvider] = useState<EIP6963ProviderDetail | null>(null)
  const [userData, setUserData] = useState<UserData>({ isLoggedIn: false, address: '', balance: '', chainId: null })
  const [contractData, setContractData] = useState<ContractData>({
    isEligible: false, isOwner: false, hasVoted: false,
    candidates: null, endTime: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const contractInteractionDataRef = useRef<ContractInteractionData>({ browserProvider: null, signer: null, contract: null })
  const loginTimeRef = useRef<number | null>(null)

  const handleAccountsChanged = async (accounts: string[]) => {
    if (contractInteractionDataRef.current.browserProvider === null) {
      return
    }
    try {
      const signer = await contractInteractionDataRef.current.browserProvider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractAbi, signer)
      const balance = await contractInteractionDataRef.current.browserProvider.getBalance(accounts[0])
      const votingStatus = await contract.getVotingStatus()
      const isOwner = await contract.getOwner() == ethers.getAddress(accounts[0])
      setContractData((prev) => { return { ...prev, isEligible: votingStatus !== 0n, isOwner: isOwner, hasVoted: votingStatus === 2n } })
      contractInteractionDataRef.current = { ...contractInteractionDataRef.current, signer: signer, contract: contract }
      setUserData((prev) => { return { ...prev, address: accounts[0], balance: ethers.formatEther(balance) } })
    }
    catch (error) {
      // @ts-ignore
      alert(error)
    }
  }

  const handleChainChanged = (newChainId: string | number) => {
    const decimalChainId: number | string = typeof newChainId === 'string' && newChainId.startsWith("0x") ?
      parseInt(newChainId, 16) : newChainId
    if (decimalChainId == contractChainId) {
      window.location.reload()
      return
    }
    setUserData((prev) => { return { ...prev, chainId: String(decimalChainId) } })
  }

  useEffect(() => {
    if (provider === null) {
      return
    }
    const connect = async () => {
      setIsLoading(true) 
      try {
        // @ts-ignore
        const chainId: string = await provider.provider.request({ method: 'net_version' })
        // @ts-ignore
        const accounts: string[] = await provider.provider.request({
          method: 'eth_requestAccounts'
        })
        if (chainId !== contractChainId) {
          setUserData((prev) => { return { ...prev, isLoggedIn: true, chainId: chainId } })
          setIsLoading(false)
          return
        }
        const browserProvider = new ethers.BrowserProvider(provider.provider)
        const signer = await browserProvider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractAbi, signer)
        const balance = await browserProvider.getBalance(accounts[0])
        const candidates = await contract.getCandidates()
        const endTime = await contract.getEndTime()
        const votingStatus = await contract.getVotingStatus()
        const isOwner = await contract.getOwner() === ethers.getAddress(accounts[0])
        contractInteractionDataRef.current = { browserProvider: browserProvider, signer: signer, contract: contract }
        loginTimeRef.current = Math.floor(Date.now() / 1000)
        setContractData(() => {
          return {
            isEligible: votingStatus !== 0n, isOwner: isOwner, hasVoted: votingStatus === 2n,
            candidates: candidates, endTime: endTime
          }
        })
        setUserData((prev) => { return { ...prev, isLoggedIn: true, address: accounts[0], balance: ethers.formatEther(balance), chainId: chainId } })
      }
      catch (error) {
        // @ts-ignore
        alert(error.message ? error.message : error.reason ? error.reason : error)
        setProvider(null)
      }
      setIsLoading(false)
    }
    connect()
  }, [provider])

  useEffect(() => {
    if (provider === null) {
      return
    }
    // @ts-ignore
    provider.provider.on('accountsChanged', handleAccountsChanged)
    // @ts-ignore
    provider.provider.on('chainChanged', handleChainChanged)
    return () => {
      // @ts-ignore
      provider.provider.removeListener('accountsChanged', handleAccountsChanged)
      // @ts-ignore
      provider.provider.removeListener('chainChanged', handleChainChanged)
    }
  }, [provider])

  return (
    <div className='App'>
      <h1 className='title'>Voting system decentralized application</h1>
      <ContractInteractionDataContext.Provider value={contractInteractionDataRef.current}>
        <div className='container'>
          {
            userData.isLoggedIn ?
              <>
                <span className='account-details'>Provider: <strong>{provider?.info.name}</strong></span>
                {
                  userData.chainId === contractChainId ?
                    <>
                      <span className='account-details'>Account address: <strong>{userData.address}</strong></span>
                      <span className='account-details'>Account balance on network: <strong>{Number(userData.balance).toFixed(3)} ETH</strong></span>
                      {
                        !contractData.isEligible ?
                          <Notice text='Your account is not eligible to vote.' /> :
                          Number(contractData.endTime) <= loginTimeRef.current! ?
                            <Results candidates={contractData.candidates!} isOwner={contractData.isOwner}
                              endTime={contractData.endTime!}
                            /> :
                            <Voting hasVoted={contractData.hasVoted} candidates={contractData.candidates!}
                              endTime={contractData.endTime!} setContractData={setContractData}
                            />
                      }
                    </> :
                    <Notice text={'You must switch to chain with chain id: ' + contractChainId +
                      ' to use this application properly. You are currently using chain with chain id: ' + userData.chainId + '.'}
                    />
                }
              </> :
              <>
                <h2>Select wallet</h2>
                <div className='login'>
                  {
                    providers.length > 0 ?
                      providers?.map((provider: EIP6963ProviderDetail) => (
                        <div key={provider.info.uuid} >
                          <button className='login-button' onClick={() => { setProvider(provider) }} >
                            <img src={provider.info.icon} alt={provider.info.name} />
                            <div>{provider.info.name}</div>
                          </button>
                        </div>
                      )) :
                      <Notice text='You need to install at least one wallet provider.' />
                  }
                </div>
                {isLoading && <div className='spinner'><Spin /></div>}
              </>
          }
        </div>
      </ContractInteractionDataContext.Provider>
    </div>
  )
}
