import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { SYSTEM_PROMPT } from './constants'
import useConversationStore from '@/stores/useConversationStore'
import { handleTool } from './tools'

export interface MessageItem {
  type: 'message'
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface FunctionCallItem {
  type: 'function_call'
  status: 'in_progress' | 'completed' | 'failed'
  id: string
  name: string
  arguments: string
  parsedArguments: any
  output: string | null
}

export type Item = MessageItem | FunctionCallItem

export const handleTurn = async () => {
  const {
    chatMessages,
    conversationItems,
    setChatMessages,
    setConversationItems
  } = useConversationStore.getState()

  const allConversationItems: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT
    },
    ...conversationItems
  ]

  try {
    // To use the python backend, replace by
    //const response = await fetch('http://localhost:8000/get_response', {
    const response = await fetch('/api/get_response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: allConversationItems })
    })

    if (!response.ok) {
      console.error(`Error: ${response.statusText}`)
      return
    }

    const data: ChatCompletionMessageParam = await response.json()
    console.log('Response', data)

    if ('tool_calls' in data && data.tool_calls) {
      const toolCall = data.tool_calls[0]
      chatMessages.push({
        type: 'function_call',
        status: 'in_progress',
        id: toolCall.id,
        name: toolCall.function.name,
        arguments: toolCall.function.arguments,
        parsedArguments: JSON.parse(toolCall.function.arguments),
        output: null
      })
      setChatMessages([...chatMessages])
      // Update conversation items
      conversationItems.push(data)
      setConversationItems([...conversationItems])

      const result = await handleTool(
        toolCall.function.name,
        toolCall.function.arguments
      )

      // update conversation items
      conversationItems.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: String(result ?? '')
      })

      setConversationItems([...conversationItems])

      console.log('Calling handleTurn')
      await handleTurn()
    } else {
      // Update chat messages
      chatMessages.push({
        type: 'message',
        role: data.role as MessageItem['role'],
        content: data.content as string
      })
      setChatMessages([...chatMessages])

      // Update conversation items
      conversationItems.push(data)
      setConversationItems([...conversationItems])
    }
  } catch (error) {
    console.error('Error processing messages:', error)
  }
}
