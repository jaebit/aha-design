// 관리자 키트. 공통 부품(@aha/ui) 위에 관리 화면(목록 · 상세 · 편집 · 권한)의 부품을 둔다.

// 폼
export { FormActions, type FormActionsProps } from './components/form-actions/form-actions';
/** @deprecated FormField는 공통 부품으로 옮겼다. `@aha/ui`에서 import한다. 다음 minor에서 뺀다. */
export { FormField, type FormFieldProps } from '@aha/ui';
export { FormSection, type FormSectionProps } from './components/form-section/form-section';

// 상세 · 목록
export { BulkActionBar, type BulkActionBarProps } from './components/bulk-action-bar/bulk-action-bar';
export { type DescriptionItem, DescriptionList, type DescriptionListProps } from './components/description-list/description-list';

// 확인 · 권한
export { ConfirmDialog, type ConfirmDialogProps } from './components/confirm-dialog/confirm-dialog';
export {
  type PermissionAction,
  PermissionMatrix,
  type PermissionMatrixProps,
  type PermissionResource,
} from './components/permission-matrix/permission-matrix';

// 세션 · 비밀값
export { type SessionItem, SessionList, type SessionListProps } from './components/session-list/session-list';
export { SecretField, type SecretFieldProps } from './components/secret-field/secret-field';
