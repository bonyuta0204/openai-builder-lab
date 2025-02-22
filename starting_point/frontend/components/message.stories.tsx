import type { Meta, StoryObj } from '@storybook/react'

import Message from './message'

const meta = {
  title: 'Message',
  tags: ['autodocs'],
  decorators: [
    story => (
      <div className="p-4 w-1/2 rounded-t-2xl shadow-lg bg-gray-100">
        {story()}
      </div>
    )
  ],
  component: Message
} satisfies Meta<typeof Message>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: {
      type: 'message',
      role: 'user',
      content: 'Hello!'
    },
    loading: false
  }
}

export const Loading: Story = {
  args: {
    message: {
      type: 'message',
      role: 'assistant',
      content: 'Hello!'
    },
    loading: true
  }
}

export const Assistant: Story = {
  args: {
    message: {
      type: 'message',
      role: 'assistant',
      content: 'Hello!'
    },
    loading: false
  }
}
