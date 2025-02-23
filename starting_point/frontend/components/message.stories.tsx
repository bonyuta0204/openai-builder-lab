import type { Meta, StoryObj } from '@storybook/react'

import Message from './message'

const meta = {
  title: 'Message',
  tags: ['autodocs'],
  decorators: [
    story => (
      <div className="p-4 rounded-t-2xl shadow-lg bg-slate-50">{story()}</div>
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
      content: `# Here's how to use Git effectively

## Basic Commands

First, let's go through some basic Git commands:

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

### Why use Git?

Git provides several advantages:
- **Version Control**: Track changes in your code
- **Collaboration**: Work with others seamlessly
- **Backup**: Keep your code safe in remote repositories

### Best Practices

1. Write clear commit messages
2. Use branches for new features
3. Review code before merging

> Remember: Always pull before you push to avoid conflicts!

You can learn more about Git by visiting [Git Documentation](https://git-scm.com/doc).

---

*This is just an example of markdown formatting capabilities.*`
    },
    loading: false
  }
}
