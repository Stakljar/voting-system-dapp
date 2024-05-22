import { Button } from 'antd'
import { useContext, useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import SelectDateDialog from './SelectDateDialog'
import { ethers } from 'ethers'
import dayjs from 'dayjs'
import { ContractInteractionDataContext, type Candidate } from '../App'

type ResultsProps = {
  isOwner: boolean,
  candidates: Candidate[],
  endTime: bigint,
}

export default function Results({ isOwner, candidates, endTime }: ResultsProps) {
  const state = {
    series: [{
      name: 'Votes',
      data: candidates.map((value) => Number(value.voteCount)),
    }],
    options: {
      yaxis: {
        labels: {
          style: {
            fontSize: '14px',
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 15,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        tickPlacement: 'none',
        stepSize: 1,
        labels: {
          style: {
            fontSize: '14px',
          },
          formatter: function (val: string) {
            return Number(val).toFixed(0)
          },
        },
        categories: candidates.map((value) => ethers.decodeBytes32String(value.fullName)),
      },
      tooltip: {
        style: {
          fontSize: '14px',
        },
      },
    },
  }

  const contractInteractionData = useContext(ContractInteractionDataContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newVotingTime, setNewVotingTime] = useState<number | null>(null)
  const highestVoteCandidates: Candidate[] = candidates.filter((candidate) =>
    Number(candidate.voteCount) === Math.max(...candidates.map((candidate) => Number(candidate.voteCount))))

  useEffect(() => {
    if (newVotingTime === null) {
      return
    }
    const restartVoting = async () => {
      try {
        const tx = await contractInteractionData.contract!.restartVoting(newVotingTime!)
        await tx.wait()
        window.location.reload()
      }
      catch (error) {
        // @ts-ignore
        alert(error.reason ? error.reason : error.error?.message ? error.error?.message : error)
        setNewVotingTime(null)
      }
    }
    restartVoting()
  }, [newVotingTime])

  return (
    <>
      <h2 className='timer'>Voting ended on approx. {dayjs.unix(Number(endTime)).format('DD.MM.YYYY. HH:mm:ss')}</h2>
      <h3>
        {
        highestVoteCandidates.length > 1 ? 'Undecided' : highestVoteCandidates.length === 0 ?
          'No candidates' : 'Winner is ' + ethers.decodeBytes32String(highestVoteCandidates[0].fullName)
        }
      </h3>
      <Chart
        options={state.options}
        series={state.series}
        type='bar'
        width='80%'
        height={(state.series[0].data.length * 65)}
      />
      {
        isOwner && highestVoteCandidates.length > 1 && <Button type='primary' onClick={() => setIsModalOpen(true)}>Restart voting</Button>
      }
      <SelectDateDialog isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} newVotingTime={newVotingTime} setNewVotingTime={setNewVotingTime} />
    </>
  )
}
