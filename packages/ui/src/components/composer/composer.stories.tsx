import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';

import { Composer } from './composer';

const meta = {
  title: 'AI/Composer',
  component: Composer,
  tags: ['autodocs'],
  args: {
    onSubmit: fn(),
    onValueChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Composer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 사내 가이드 챗 빈 상태 (3쪽). `+` 첨부 버튼과 안내 문구가 있는 큰 입력창. */
export const Hero: Story = {
  args: {
    variant: 'hero',
    placeholder: '사내 가이드에 대해 물어보세요',
    onAttach: fn(),
    helper: '등록된 사내 가이드 안에서만 답해요. 최종 확인은 담당 부서에 해 주세요.',
  },
};

/** 회의록 생성 빈 상태 (10쪽). 라벨이 있는 첨부 버튼. */
export const HeroWithLabeledAttach: Story = {
  args: {
    variant: 'hero',
    placeholder: '녹음 파일을 첨부하세요',
    onAttach: fn(),
    attachLabel: '녹음 파일 첨부',
  },
};

/** 대화 화면 하단에 고정된 입력창 (5쪽). */
export const Docked: Story = {
  args: {
    variant: 'docked',
    placeholder: '사내 가이드에 대해 물어보세요',
    onAttach: fn(),
    helper: '등록된 사내 가이드 안에서만 답해요. 최종 확인은 담당 부서에 해 주세요.',
  },
};

/** 우측 대화 패널용 (16쪽). 첨부 버튼 없음. */
export const Compact: Story = {
  args: {
    variant: 'compact',
    placeholder: '메시지를 입력하세요',
    helper: '대화는 전체 기록에 저장돼요',
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};

/** AI가 응답을 만드는 중. 입력은 가능하지만 전송은 막힌다. */
export const Busy: Story = {
  args: {
    variant: 'docked',
    defaultValue: '영수증을 잃어버리면 어떻게 해?',
    onAttach: fn(),
    busy: true,
  },
};

export const Disabled: Story = {
  args: { variant: 'docked', onAttach: fn(), disabled: true },
};

/** 보낸 메시지가 위에 쌓이는 동작 확인용. Enter로 보내고 Shift+Enter로 줄을 바꾼다. */
export const Playground: Story = {
  args: { variant: 'docked', placeholder: '사내 가이드에 대해 물어보세요', onAttach: fn() },
  render: function Render(args) {
    const [sent, setSent] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-4">
        <ul className="flex flex-col items-end gap-2">
          {sent.map((text, index) => (
            <li key={index} className="whitespace-pre-wrap rounded-xl bg-muted px-4 py-2 text-body">
              {text}
            </li>
          ))}
        </ul>
        <Composer
          {...args}
          onSubmit={(text) => {
            args.onSubmit?.(text);
            setSent((prev) => [...prev, text]);
          }}
        />
      </div>
    );
  },
};
