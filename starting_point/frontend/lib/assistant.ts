import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { SYSTEM_PROMPT } from './constants'
import useConversationStore from '@/stores/useConversationStore'
import { handleTool } from './tools'
import useRealTimeStore from '@/stores/useRealTimeStore'
import { SessionCreateResponse } from 'openai/resources/beta/realtime/sessions'

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

    if ('tool_calls' in data && data.tool_calls) {
      // Update conversation items
      conversationItems.push(data)
      setConversationItems([...conversationItems])

      await Promise.all(
        data.tool_calls.map(async toolCall => {
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

          const result = await handleTool(
            toolCall.function.name,
            JSON.parse(toolCall.function.arguments)
          )

          // update conversation items
          conversationItems.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: result ? JSON.stringify(result) : ''
          })

          setConversationItems([...conversationItems])
        })
      )

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

export const startVoiceChat = async () => {
  const { setToken } = useRealTimeStore.getState()
  const response = await fetch('/api/realtime/sessions', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const data: SessionCreateResponse = await response.json()
  const token = data.client_secret.value

  setToken(token)
  // Create a peer connection
  const pc = new RTCPeerConnection()

  // Set up to play remote audio from the model
  const audioEl = document.createElement('audio')
  audioEl.autoplay = true
  pc.ontrack = e => (audioEl.srcObject = e.streams[0])

  // Add local audio track for microphone input in the browser
  const ms = await navigator.mediaDevices.getUserMedia({
    audio: true
  })
  pc.addTrack(ms.getTracks()[0])

  // Set up data channel for sending and receiving events
  const dc = pc.createDataChannel('oai-events')
  dc.addEventListener('message', e => {
    // Realtime server events appear here!
    console.log(e)
  })

  // Start the session using the Session Description Protocol (SDP)
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  const baseUrl = 'https://api.openai.com/v1/realtime'
  const model = 'gpt-4o-realtime-preview-2024-12-17'
  const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
    method: 'POST',
    body: offer.sdp,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/sdp'
    }
  })

  const answer = {
    type: 'answer',
    sdp: await sdpResponse.text()
  } as const
  await pc.setRemoteDescription(answer)
}
