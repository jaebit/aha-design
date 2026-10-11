import { Chip, cn } from '@actoz/ui';

export interface SuggestionsProps {
  /** 추천 질문 문장. 2~3개를 권장한다. */
  items: string[];
  /** 질문을 누르면 호출된다. 보통 그 문장을 그대로 보낸다. */
  onSelect: (item: string) => void;
  /** 정렬. 빈 상태에서는 `center` (3쪽), 답변 뒤 후속 질문은 `start` (5쪽). */
  align?: 'start' | 'center';
  className?: string;
}

/** 추천 질문 칩 목록. 빈 상태의 예시 질문과 답변 뒤 후속 질문에 쓴다. */
export function Suggestions({ items, onSelect, align = 'start', className }: SuggestionsProps) {
  return (
    <div
      data-slot="suggestions"
      role="group"
      aria-label="추천 질문"
      className={cn('flex flex-wrap gap-2', align === 'center' && 'justify-center', className)}
    >
      {items.map((item) => (
        <Chip key={item} onClick={() => onSelect(item)}>
          {item}
        </Chip>
      ))}
    </div>
  );
}
