# @aha/kit-admin

## 0.1.2

### Patch Changes

- f8939bd: 접근성: Avatar 대체 글자, Stepper 완료·고정됨 아이콘에 `role="img"`를 더해 이름이 읽히게 했다. RiskItem 심각도는 화면에 안 보이는 "심각도" 글자로 읽는다. ThinkingIndicator는 동작 줄이기 설정에서 깜빡이지 않는다. Composer·RecipientInput·ConversationHeader는 Safari의 한글 조합 Enter(keyCode 229)를 제출로 처리하지 않는다. MessageActions는 복사에 실패하면 "복사됨"을 띄우지 않는다. Heatmap 단계 경계를 범례 글자와 맞추고 빈 범례 목록을 없앴다. GuideChatScreen은 해시가 있는 주소로 처음 열 때 그 대화를 연다. CellText·DropdownMenuSeparator·DropdownMenuLabel에 data-slot을 달고, prop 설명을 보강했다. 키트 패키지가 tailwindcss를 peer로 두고, kit-dashboard는 배포 코드에서 쓰지 않는 lucide-react를 의존성에서 뺐다.

## 0.1.1

### Patch Changes

- 스크린리더용 숨김 텍스트(sr-only)가 스크롤 영역 밖으로 빠져 문서에 스크롤바가 하나 더 생기던 문제를 고쳤다. 숨김 텍스트를 가진 부품 루트(차트, DataTable, PermissionMatrix, ChoiceCardGroup 항목, 사이드바 항목, 내비 레일 로고)에 위치 기준(relative)을 둔다.
