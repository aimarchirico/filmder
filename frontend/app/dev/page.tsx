'use client'

import { useState } from 'react'
import useFriends from '@/hooks/Friends'

export default function TestFriendsPage() {
  const { sendFriendRequest } = useFriends()
  const [userId, setUserId] = useState('')
  const [message, setMessage] = useState('')

  const handleSendRequest = async () => {
    try {
      const response = await sendFriendRequest(userId)
      if (response.error) {
        // Handle error object or string
        const errorMessage = typeof response.error === 'object' 
          ? response.error.message || JSON.stringify(response.error)
          : response.error;
        setMessage(`Error: ${errorMessage}`)
      } else {
        setMessage(`Friend request sent to user ${userId}`)
        setUserId('')
      }
    } catch (error) {
      setMessage(`System Error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return (
    <div>
      <h1>Test Friend Request</h1>
      <div>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID"
        />
        <button onClick={handleSendRequest}>Send Friend Request</button>
      </div>
      {message && (
        <p className={message.includes('Error') ? 'text-red-500' : 'text-green-500'}>
          {message}
        </p>
      )}
    </div>
  )
}