import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '../badge/badge';
import { cn } from '../../lib/cn';

export interface ServiceCardProps {
  /** lucide-react 아이콘 요소. NavRail과 같은 아이콘을 쓴다. */
  icon: ReactNode;
  /** 서비스 이름. 예: "사내 가이드 챗". */
  title: string;
  /** 무엇을 해 주는지 한두 문장. 예: "등록된 사내 가이드에서 답을 찾아드려요." */
  description: string;
  /** 입력 종류 태그. 예: "질문 입력", "녹음 파일", "문서 파일". */
  tag?: string;
  /** 서비스 화면 주소. 카드 전체가 이 링크다. */
  href: string;
  className?: string;
}

/** 홈 화면의 서비스 바로가기 카드 (1쪽). 카드 전체가 링크다. */
export function ServiceCard({ icon, title, description, tag, href, className }: ServiceCardProps) {
  return (
    <a
      data-slot="service-card"
      href={href}
      className={cn(
        'group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 text-card-foreground transition-colors hover:border-border-strong',
        className,
      )}
    >
      <span aria-hidden className="flex size-12 items-center justify-center rounded-lg bg-muted [&_svg]:size-6">
        {icon}
      </span>
      <span className="text-heading font-semibold">{title}</span>
      <span className="text-body-sm text-muted-foreground">{description}</span>
      <span className="mt-auto flex items-center justify-between pt-2">
        {tag ? (
          <Badge variant="soft" size="md">
            {tag}
          </Badge>
        ) : (
          <span />
        )}
        <ArrowRight aria-hidden className="size-5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}
