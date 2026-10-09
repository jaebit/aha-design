import type { Meta, StoryObj } from '@storybook/react-vite';

import { InfoSummary } from './info-summary';

const meta = {
  title: 'Components/InfoSummary',
  component: InfoSummary,
  tags: ['autodocs'],
  args: {
    items: [
      { label: '수신 이메일', value: 'hama@actoz.com' },
      { label: '발송 주기', value: '하루 한 번' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InfoSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 뉴스레터 수신 정보 (14쪽). */
export const Newsletter: Story = {};
