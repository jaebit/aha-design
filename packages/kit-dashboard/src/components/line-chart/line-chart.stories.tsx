import type { Meta, StoryObj } from '@storybook/react-vite';

import { LineChart } from './line-chart';

const meta = {
  title: 'Dashboard/LineChart',
  component: LineChart,
  tags: ['autodocs', 'kit:dashboard'],
  args: {
    title: '일별 활성 사용자',
    series: [{ key: 'users', label: '활성 사용자' }],
    data: [
      { label: '10/01', values: { users: 182 } },
      { label: '10/02', values: { users: 205 } },
      { label: '10/03', values: { users: 231 } },
      { label: '10/04', values: { users: 98 } },
      { label: '10/05', values: { users: 87 } },
      { label: '10/06', values: { users: 244 } },
      { label: '10/07', values: { users: 262 } },
      { label: '10/08', values: { users: 251 } },
      { label: '10/09', values: { users: 270 } },
      { label: '10/10', values: { users: 283 } },
    ],
    formatValue: (value: number) => `${value.toLocaleString('ko-KR')}명`,
    area: true,
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 시리즈 하나: 아래를 옅게 칠해 추세를 강조한다. 주말(10/4, 10/5)에 줄어든다. */
export const SingleSeries: Story = {};

/** 여러 시리즈 비교. 마우스를 올리면 그 날의 모든 값이 툴팁으로 나온다. */
export const MultipleSeries: Story = {
  args: {
    title: '서비스별 일별 요청',
    area: false,
    formatValue: (value: number) => `${value.toLocaleString('ko-KR')}건`,
    series: [
      { key: 'guide', label: '사내 가이드 챗' },
      { key: 'minutes', label: '회의록 생성' },
      { key: 'review', label: '문서 검토' },
    ],
    data: [
      { label: '10/01', values: { guide: 320, minutes: 84, review: 41 } },
      { label: '10/02', values: { guide: 351, minutes: 92, review: 38 } },
      { label: '10/03', values: { guide: 402, minutes: 101, review: 55 } },
      { label: '10/04', values: { guide: 120, minutes: 12, review: 9 } },
      { label: '10/05', values: { guide: 98, minutes: 8, review: 6 } },
      { label: '10/06', values: { guide: 388, minutes: 110, review: 62 } },
      { label: '10/07', values: { guide: 410, minutes: 97, review: 58 } },
    ],
  },
};

/** 값이 없는 날은 선이 끊긴다 (수집 장애 등). 표에서는 "—"로 보인다. */
export const WithGap: Story = {
  args: {
    data: [
      { label: '10/01', values: { users: 182 } },
      { label: '10/02', values: { users: 205 } },
      { label: '10/03', values: {} },
      { label: '10/04', values: { users: 98 } },
      { label: '10/05', values: { users: 87 } },
    ],
    area: false,
  },
};
