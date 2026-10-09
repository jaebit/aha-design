export { cn } from './lib/cn';

// 범용
export { Avatar, type AvatarProps } from './components/avatar/avatar';
export { Badge, badgeVariants, type BadgeProps } from './components/badge/badge';
export { Button, buttonVariants, type ButtonProps } from './components/button/button';
export { Callout, type CalloutProps } from './components/callout/callout';
export { Chip, type ChipProps } from './components/chip/chip';
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  type DropdownMenuItemProps,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/dropdown-menu/dropdown-menu';
export { Input } from './components/input/input';
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTerm,
  type TooltipTermProps,
  TooltipTrigger,
} from './components/tooltip/tooltip';

// AI 대화
export { Citation, type CitationProps } from './components/citation/citation';
export { Composer, type ComposerProps } from './components/composer/composer';
export {
  ConversationEmptyState,
  type ConversationEmptyStateProps,
} from './components/conversation-empty-state/conversation-empty-state';
export { Message, MessageContent, type MessageProps } from './components/message/message';
export {
  type MessageFeedback,
  MessageActions,
  type MessageActionsProps,
} from './components/message-actions/message-actions';
export { Suggestions, type SuggestionsProps } from './components/suggestions/suggestions';
export { ThinkingIndicator, type ThinkingIndicatorProps } from './components/thinking-indicator/thinking-indicator';

// 앱 셸
export { AccountMenu, type AccountMenuProps } from './components/account-menu/account-menu';
export { AppShell, type AppShellProps } from './components/app-shell/app-shell';
export {
  ConversationHeader,
  type ConversationHeaderProps,
} from './components/conversation-header/conversation-header';
export { NavRail, type NavRailItem, type NavRailProps } from './components/nav-rail/nav-rail';
export { PageHeader, type PageHeaderProps } from './components/page-header/page-header';
export {
  HistoryItem,
  type HistoryItemProps,
  ServiceSidebar,
  type ServiceSidebarProps,
  SidebarNavItem,
  type SidebarNavItemProps,
  SidebarSection,
  type SidebarSectionProps,
} from './components/service-sidebar/service-sidebar';
export {
  GuideChatScreen,
  type GuideAnswer,
  type GuideChatScreenProps,
  type GuideConversation,
  type GuideTurn,
} from './templates/guide-chat-screen/guide-chat-screen';

// P1: AI 작업 흐름
export { AttachmentCard, type AttachmentCardProps } from './components/attachment-card/attachment-card';
export { Card, cardVariants, type CardProps } from './components/card/card';
export { ChoiceCardGroup, type ChoiceCardGroupProps, type ChoiceOption } from './components/choice-card/choice-card';
export { PreviewCard, type PreviewCardProps } from './components/preview-card/preview-card';
export { RecipientInput, type RecipientInputProps } from './components/recipient-input/recipient-input';
export { ResultCard, type ResultCardProps, ResultSection, type ResultSectionProps } from './components/result-card/result-card';
export { RiskItem, type RiskItemProps } from './components/risk-item/risk-item';
export { SidePanel, type SidePanelProps } from './components/side-panel/side-panel';
export { Stepper, type StepperProps } from './components/stepper/stepper';

// P1: 데이터 · 목록
export {
  CellText,
  type CellTextProps,
  DataTable,
  type DataTableColumn,
  type DataTableProps,
} from './components/data-table/data-table';
export { FilterBar, type FilterBarProps, FilterField, type FilterFieldProps } from './components/filter-bar/filter-bar';
export { List, ListRow, type ListRowProps } from './components/list-row/list-row';
export { NativeSelect } from './components/native-select/native-select';
export { Pagination, type PaginationProps } from './components/pagination/pagination';
export { SearchInput, type SearchInputProps } from './components/search-input/search-input';
export { ServiceCard, type ServiceCardProps } from './components/service-card/service-card';

// P2: 설정 · 대시보드
export { BarList, type BarListItem, type BarListProps } from './components/bar-list/bar-list';
export { InfoSummary, type InfoSummaryItem, type InfoSummaryProps } from './components/info-summary/info-summary';
export { MonthStepper, type MonthStepperProps, type YearMonth } from './components/month-stepper/month-stepper';
export {
  type ChartSeries,
  StackedColumnChart,
  type StackedColumnChartProps,
  type StackedColumnDatum,
} from './components/stacked-column-chart/stacked-column-chart';
export { StatCard, type StatCardProps, type StatDelta } from './components/stat-card/stat-card';
export { Switch, type SwitchProps } from './components/switch/switch';
