/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react'

const VoicePage = async () => {
    const Voices = await fetch('/api/voices')
    const VoicesList: { id: string; name: string }[] = await Voices.json()
  return (<>
        <div>Voices Page</div> 
        <ul>
            {VoicesList.map((voice)=>(
                <li key={voice.id}>{voice.name}</li>))}
        </ul>
    </>
  )
}

export default VoicePage