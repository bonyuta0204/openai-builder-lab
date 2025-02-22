import type { Meta, StoryObj } from '@storybook/react'

import Assistant from './assistant'

const meta = {
  title: 'Assistant',
  tags: ['autodocs'],
  component: Assistant
} satisfies Meta<typeof Assistant>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {}
}
