import type { Meta, StoryObj } from '@storybook/react'

import Chat from './chat'
import { fn } from '@storybook/test'
import {
  Default as DefaultMessage,
  Loading,
  Assistant
} from './message.stories'

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
