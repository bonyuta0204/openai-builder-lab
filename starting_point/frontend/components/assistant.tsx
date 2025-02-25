'use client'
import React, { useState } from 'react'
import Chat from './chat'
import useConversationStore from '@/stores/useConversationStore'
import { handleTurn, Item, startVoiceChat } from '@/lib/assistant'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

const Assistant: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { chatMessages, addConversationItem, addChatMessage } =
    useConversationStore()

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userItem: Item = {
      type: 'message',
      role: 'user',
      content: message.trim()
    }
    const userMessage: ChatCompletionMessageParam = {
      role: 'user',
      content: message.trim()
    }

    try {
      setLoading(true)
      addConversationItem(userMessage)
      addChatMessage(userItem)

      await handleTurn()
    } catch (error) {
      console.error('Error processing message:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartVoiceChat = () => {
    startVoiceChat()
  }

  return (
    <div className="h-full p-4 w-full rounded-t-2xl shadow-lg bg-slate-50">
      <Chat
        items={chatMessages}
        onSendMessage={handleSendMessage}
        onStartVoiceChat={handleStartVoiceChat}
        loading={loading}
      />
    </div>
  )
}

export default Assistant
