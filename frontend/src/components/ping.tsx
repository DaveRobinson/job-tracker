
'use client'

import { useEffect, useState } from 'react'

export default function Ping() {
  const [apiStatus, setApiStatus] = useState<string>('checking...')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ping`)
      .then(res => res.json())
      .then(data => setApiStatus(`✅ API Connected: ${data.message}`))
      .catch(err => setApiStatus(`❌ API Error: ${err.message}`))
  }, [])

  return (
    <div>
      <h1>Job Tracker</h1>
      <p>API Status: {apiStatus}</p>
    </div>
  )
}