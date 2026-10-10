// "에이전트에게 붙여넣기" 프롬프트. MCP가 연결되어 있으면 도구로 확인하게 하고, 없어도 바로 쓸 수 있게 예제를 함께 싣는다.
import { type CatalogComponent, type CatalogStory, type CatalogTemplate, kitOf } from '../catalog-types';
import { site } from '../../site.config';
import { catalog } from './catalog';

const hasKits = catalog.kits.some((k) => k.id !== 'core');

const rules = `규칙:
- ${site.name} 컴포넌트(${catalog.packages.ui.name}${hasKits ? `, 키트 패키지 ${site.scope}/kit-*` : ''})를 그대로 쓰고, 같은 역할의 컴포넌트를 새로 만들지 않는다.
- 색·글자 크기·모서리는 시맨틱 토큰 클래스만 쓴다 (bg-primary, text-muted-foreground, text-body, rounded-lg 등). hex나 임의값은 쓰지 않는다.
- import에 나온 ${site.scope} 패키지가 프로젝트에 없으면 ${site.mcpName} MCP의 get_setup_guide를 보고 먼저 설치한다.`;

export function componentPrompt(component: CatalogComponent, story?: CatalogStory) {
  const example = story ?? component.stories[0];
  return `${site.name} 디자인 시스템의 ${component.name} 컴포넌트로 아래 화면을 만들어 줘.

[만들고 싶은 화면을 여기에 적어 주세요]

참고:
- ${site.mcpName} MCP가 연결되어 있으면 get_component("${component.name}")로 props와 예제를 먼저 확인해.
- import: ${component.import}${
    example?.snippet
      ? `
- 예제 (${example.name}):
\`\`\`tsx
${example.snippet}
\`\`\``
      : ''
  }

${rules}`;
}

function templatePackages(template: CatalogTemplate) {
  const kit = kitOf(catalog, template);
  if (!kit || kit.id === 'core') return `- 필요한 패키지: ${catalog.packages.ui.name}`;
  const density = kit.density === 'compact' ? ' 이 키트 화면은 <html data-density="compact">(촘촘한 밀도)로 쓴다.' : '';
  return `- 필요한 패키지: ${catalog.packages.ui.name} + ${kit.package.name} (${kit.label} 키트).${density}`;
}

export function templatePrompt(template: CatalogTemplate) {
  return `${site.name} 디자인 시스템의 "${template.label}" 템플릿(${template.name})을 바탕으로 화면을 만들어 줘.

[바꾸고 싶은 내용: 서비스 이름, 메뉴, 표의 열, 데이터 등]

참고:
- ${site.mcpName} MCP의 get_template("${template.name}")으로 전체 소스와 예시 데이터를 가져와서 시작해.
- Storybook 전용 코드(Meta, StoryObj, withLinkActions)는 빼고 페이지 컴포넌트만 옮겨.
${templatePackages(template)}
- 화면에 쓰인 컴포넌트: ${template.import.replace(/\s+/g, ' ')}

${rules}`;
}
