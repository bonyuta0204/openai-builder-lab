import type { Meta, StoryObj } from '@storybook/react'

import Chat from './chat'
import { expect, fn, userEvent, within } from '@storybook/test'
import { Default as DefaultMessage, Assistant } from './message.stories'

const ActionsData = {
  onSendMessage: fn(),
  onStartVoiceChat: fn()
}

const meta = {
  title: 'Chat',
  tags: ['autodocs'],
  component: Chat,
  decorators: [
    story => (
      <div className="h-full p-4 w-full rounded-t-2xl shadow-lg bg-slate-50">
        {story()}
      </div>
    )
  ],
  args: {
    ...ActionsData
  }
} satisfies Meta<typeof Chat>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [DefaultMessage.args.message, Assistant.args.message],
    loading: false
  }
}

export const WithInteraction: Story = {
  args: {
    items: [DefaultMessage.args.message],
    loading: false
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    const sendButton = canvas.getByRole('button', { name: /send/i })

    // Type a message
    await userEvent.type(input, 'Hello, this is a test message')
    expect(input).toHaveValue('Hello, this is a test message')

    // Click send button
    await userEvent.click(sendButton)
    expect(args.onSendMessage).toHaveBeenCalledWith(
      'Hello, this is a test message'
    )
    expect(input).toHaveValue('')
  }
}
