import { Chip } from '@aha/ui';

import type { Density } from '../catalog-types';

/** 미리보기 밀도 전환. 기본 / 촘촘하게(data-density="compact"). */
export function DensityToggle({ value, onChange, recommended }: { value: Density; onChange: (value: Density) => void; recommended?: Density }) {
  const options: { value: Density; label: string }[] = [
    { value: 'default', label: '기본 밀도' },
    { value: 'compact', label: '촘촘하게' },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="미리보기 밀도">
      {options.map((option) => (
        <Chip key={option.value} selected={value === option.value} onClick={() => onChange(option.value)}>
          {option.label}
          {recommended === option.value ? <span className="text-caption"> · 권장</span> : null}
        </Chip>
      ))}
    </div>
  );
}
