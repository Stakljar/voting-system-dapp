import { Button, Table, Spin } from 'antd'
import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import { ContractInteractionDataContext, type Candidate } from '../App'
import { AlignType } from 'rc-table/lib/interface'
import Countdown from 'react-countdown'
import Notice from './Notice'

type VotingProps = {
  hasVoted: boolean,
  candidates: Candidate[],
  endTime: bigint,
}

export default function Voting({ hasVoted, candidates, endTime }: VotingProps) {
  const columns = [
    {
      title: 'Index',
      dataIndex: 'key',
      key: 'index',
      align: 'center' as AlignType,
    },
    {
      title: 'Full name',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'left' as AlignType,
    },
    {
      title: 'Select',
      key: 'select',
      render: (record: any) => (
        <Button disabled={hasVoted} onClick={() => setCandidateIndex(record.key - 1)} type='primary'>Vote</Button>
      ),
      align: 'center' as AlignType,
    },
  ]

  const contractInteractionData = useContext(ContractInteractionDataContext)
  const [candidateIndex, setCandidateIndex] = useState<number | null>(null)
  const [hasEnded, setHasEnded] = useState(false)

  useEffect(() => {
    if (candidateIndex === null) {
      return
    }
    const vote = async () => {
      try {
        const tx = await contractInteractionData.contract!.vote(candidateIndex)
        await tx.wait()
      }
      catch (error) {
        // @ts-ignore
        alert(error.reason ? error.reason : error.error?.message ? error.error?.message : error)
      }
      setCandidateIndex(null)
    }
    vote()
  }, [candidateIndex])

  return (
    <>
      <div className='timer'>
        <h2>Voting ends in:</h2>
        <span>≈</span>
        <Countdown date={Number(endTime) * 1000} onComplete={() => setHasEnded(true)}/>
      </div>
      {
        hasEnded ?
          <>
            <Notice text='Voting has ended, refresh and relogin to see the results.' />
            <Button type='primary' onClick={() => window.location.reload()}>Refresh</Button>
          </> :
          <>
            {hasVoted && <h3 className='vote-placed'>You have placed your vote.</h3>}
            <h3>Candidates</h3>
            <Table className='candidates-table'
              dataSource={candidates.map((candidate, index) => {
                return {
                  key: index + 1,
                  fullName: ethers.decodeBytes32String(candidate.fullName),
                }
              })}
              columns={columns}
            />
            {candidateIndex !== null && <div className='spinner'><Spin /></div>}
          </>
      }
    </>
  )
}
