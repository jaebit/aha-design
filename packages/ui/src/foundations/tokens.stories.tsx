import manifest from '@aha/tokens/manifest.json';
import type { Meta, StoryObj } from '@storybook/react-vite';

interface TokenEntry {
  name: string;
  cssVar: string;
  type: string;
  reference?: string;
  description?: string;
  layer: 'primitive' | 'semantic';
}

const tokens = manifest.tokens as TokenEntry[];

function TokenTable({ type, layer }: { type: string; layer: TokenEntry['layer'] }) {
  const rows = tokens.filter((token) => token.type === type && token.layer === layer);
  return (
    <table className="w-full border-collapse text-body-sm">
      <thead>
        <tr className="border-b border-border text-left text-muted-foreground">
          <th className="py-2 pr-4 font-medium">미리보기</th>
          <th className="py-2 pr-4 font-medium">토큰</th>
          <th className="py-2 pr-4 font-medium">참조</th>
          <th className="py-2 font-medium">용도</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((token) => (
          <tr key={token.name} className="border-b border-border">
            <td className="py-2 pr-4">
              {type === 'color' ? (
                <span
                  className="block size-8 rounded-md border border-border"
                  style={{ background: `var(${token.cssVar})` }}
                />
              ) : type === 'dimension' && token.name.startsWith('radius') ? (
                <span
                  className="block size-8 border border-border-strong"
                  style={{ borderRadius: `var(${token.cssVar})` }}
                />
              ) : type === 'dimension' ? (
                <span style={{ fontSize: `var(${token.cssVar})` }}>가나다 Aa</span>
              ) : null}
            </td>
            <td className="py-2 pr-4 font-mono text-caption">{token.cssVar}</td>
            <td className="py-2 pr-4 font-mono text-caption text-muted-foreground">{token.reference ?? ''}</td>
            <td className="py-2">{token.description ?? ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const meta = {
  title: 'Foundations/Tokens',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** 컴포넌트는 시맨틱 색상만 쓴다. Tailwind 클래스 이름은 토큰 이름과 같다 (예: `bg-primary`, `text-muted-foreground`). */
export const SemanticColors: Story = {
  render: () => <TokenTable type="color" layer="semantic" />,
};

/** 원시 팔레트. 컴포넌트에서 직접 참조하지 않는다. */
export const PrimitiveColors: Story = {
  render: () => <TokenTable type="color" layer="primitive" />,
};

/** 글자 크기와 모서리. Tailwind 클래스: `text-body`, `text-title`, `rounded-xl` 등. */
export const TypographyAndRadius: Story = {
  render: () => <TokenTable type="dimension" layer="primitive" />,
};
