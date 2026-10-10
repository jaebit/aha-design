// AI 서비스 키트. 공통 부품(@aha/ui) 위에 AI 대화 화면의 부품과 화면 템플릿을 둔다.

// 대화
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

// 작업 흐름
export { AttachmentCard, type AttachmentCardProps } from './components/attachment-card/attachment-card';
export { ChoiceCardGroup, type ChoiceCardGroupProps, type ChoiceOption } from './components/choice-card/choice-card';
export { PreviewCard, type PreviewCardProps } from './components/preview-card/preview-card';
export { RecipientInput, type RecipientInputProps } from './components/recipient-input/recipient-input';
export { ResultCard, type ResultCardProps, ResultSection, type ResultSectionProps } from './components/result-card/result-card';
export { RiskItem, type RiskItemProps } from './components/risk-item/risk-item';

// 화면
export {
  GuideChatScreen,
  type GuideAnswer,
  type GuideChatScreenProps,
  type GuideConversation,
  type GuideTurn,
} from './templates/guide-chat-screen/guide-chat-screen';
