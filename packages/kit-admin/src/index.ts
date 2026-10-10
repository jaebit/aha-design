// 관리자 키트. 공통 부품(@aha/ui) 위에 관리 화면(목록 · 상세 · 편집 · 권한)의 부품을 둔다.

// 폼
export { FormActions, type FormActionsProps } from './components/form-actions/form-actions';
export { FormField, type FormFieldProps } from './components/form-field/form-field';
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
