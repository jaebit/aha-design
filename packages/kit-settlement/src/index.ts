// 정산 키트. 공통 부품(@actoz/ui) 위에 IP 라이선스 로열티 정산 화면의 부품을 둔다.

export { Amount, type AmountProps } from './components/amount/amount';
export { UnknownValue, type UnknownValueKind, type UnknownValueProps } from './components/unknown-value/unknown-value';
export { SourcedValue, type SourcedValueProps } from './components/sourced-value/sourced-value';
export {
  EXCEPTION_KIND_BY_CODE,
  EXCEPTION_KIND_LABELS,
  ExceptionBadge,
  exceptionKindOf,
  type ExceptionBadgeProps,
  type ExceptionKind,
} from './components/exception-badge/exception-badge';
export { JudgmentSummary, type JudgmentItem, type JudgmentSummaryProps } from './components/judgment-summary/judgment-summary';
export { FileSlots, type FileSlot, type FileSlotsProps } from './components/file-slots/file-slots';
export { Timeline, type TimelineProps, type TimelineStatus, type TimelineStep } from './components/timeline/timeline';
export {
  ExceptionPanel,
  type ExceptionPanelProps,
  type ExceptionReason,
} from './components/exception-panel/exception-panel';
export { SETTLEMENT_STATUSES, StatusPill, type SettlementStatus, type StatusPillProps } from './components/status-pill/status-pill';
