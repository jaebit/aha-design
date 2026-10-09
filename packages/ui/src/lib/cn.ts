import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// 커스텀 글자 크기(text-body 등)를 tailwind-merge가 색상 클래스로 오인하지 않도록 등록한다.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['caption', 'body-sm', 'body', 'heading', 'title', 'display'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
