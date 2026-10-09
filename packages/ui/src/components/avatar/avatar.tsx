import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/cn';

const avatarVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-strong bg-background font-semibold text-foreground',
  {
    variants: {
      size: {
        sm: 'size-8 text-caption',
        md: 'size-10 text-caption',
        lg: 'size-12 text-body-sm',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  /** 이미지가 없거나 불러오지 못했을 때 보이는 짧은 이름. 와이어프레임은 이름 두 글자를 쓴다 (예: "하마"). */
  initials: string;
  /** 프로필 이미지 주소. */
  src?: string;
  /** 스크린리더용 이름. 생략하면 `initials`를 읽는다. */
  alt?: string;
  className?: string;
}

/** 사용자 아바타. 내비 레일 하단의 계정 버튼 (1, 19쪽). */
export function Avatar({ initials, src, alt, size, className }: AvatarProps) {
  return (
    <AvatarPrimitive.Root data-slot="avatar" className={cn(avatarVariants({ size }), className)}>
      {src ? <AvatarPrimitive.Image src={src} alt={alt ?? initials} className="size-full object-cover" /> : null}
      <AvatarPrimitive.Fallback aria-label={alt ?? initials}>{initials}</AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
