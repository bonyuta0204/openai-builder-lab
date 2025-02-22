import type { Meta, StoryObj } from '@storybook/react'

import ToolCall from './tool-call'

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof ToolCall> = {
  title: 'ToolCall',
  tags: ['autodocs'],
  component: ToolCall
}

export default meta
type Story = StoryObj<typeof ToolCall>

const sampleOutput = JSON.stringify({
  items: [
    {
      id: '1',
      name: 'Item 1',
      price: 10.99
    }
  ]
})

const sampleArguments = {
  name: 'Item 1'
}

export const Default: Story = {
  args: {
    functionCall: {
      type: 'function_call',
      status: 'in_progress',
      id: '1',
      name: 'Search stock',
      arguments: JSON.stringify(sampleArguments),
      parsedArguments: sampleArguments,
      output: sampleOutput
    },
    previousItem: {
      type: 'message',
      role: 'user',
      content: 'What stock do you want to search?'
    }
  }
}

export const ConsecutiveCalls: Story = {
  args: {
    functionCall: {
      type: 'function_call',
      status: 'in_progress',
      id: '1',
      name: 'Search stock',
      arguments: JSON.stringify(sampleArguments),
      parsedArguments: sampleArguments,
      output: sampleOutput
    },
    previousItem: {
      type: 'function_call',
      status: 'in_progress',
      id: '1',
      name: 'function_name',
      arguments: 'arguments',
      parsedArguments: {},
      output: sampleOutput
    }
  }
}
