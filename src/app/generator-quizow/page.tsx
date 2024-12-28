'use client'

import TournamentGenerator from '@/app/components/tournament-generator'
import RoundEditor, { Round } from '@/app/components/round-editor'
import { useState } from 'react'

export default function Page() {
  const [rounds, setRounds] = useState<Round[]>([])

  return (
    <div className="space-y-8 py-8">
      <TournamentGenerator rounds={rounds} />
      <RoundEditor onRoundsChangeAction={setRounds} />
    </div>
  )
}

