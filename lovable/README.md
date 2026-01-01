# Lovable 전달용 패키지

`Lovable`(lovable.dev)에서 Guidebook Wiki UI를 재디자인/재구현할 때 바로 참조할 수 있도록 코드 스냅샷, 핵심 기획, 프롬프트 초안을 모았습니다. 폴더 전체를 압축해 Lovable에 업로드하거나, 필요한 파일만 선택해서 붙여넣어도 됩니다.

## 폴더 구성
- `prototype/`: 현재 정적 HTML/CSS/JS 프로토타입 스냅샷 (홈/문서/로그인). 테마 JSON, 스타일, 실행용 스크립트 포함.
- `design-brief.md`: 브랜드/레이아웃/UX 요구사항을 정리한 짧은 브리프.
- `prompt.md`: Lovable에 바로 붙여넣을 수 있는 요청 프롬프트.

## Lovable로 보낼 때 참고 사항
- Lovable 기본 산출물은 **Next.js(React) 기반 UI**입니다. 정적 HTML/CSS로만 유지하고 싶다면 프롬프트에서 “정적 자산 구조와 호환되도록 출력”을 명시하세요.
- 우리 프로토타입은 **순수 HTML/CSS/JS**이지만, Lovable에선 Next.js App Router + TypeScript로 변환을 요청해도 무방합니다. 페이지/컴포넌트 구조는 `design-brief.md`와 `prompt.md`를 그대로 따르도록 요구하세요.
- 테마(색·폰트·레이아웃 토큰)는 `prototype/data/*.json`과 `theme-loader.js`에 정리되어 있습니다. Lovable가 새 UI를 만들 때 이 토큰 구조를 유지하거나 mapping 코드를 제공하도록 요청할 수 있습니다.

## 추천 전달 방식
1. `lovable` 폴더를 그대로 압축(zip)하거나, `prototype`과 `design-brief.md`, `prompt.md`만 묶어 업로드합니다.
2. Lovable에 `prompt.md` 내용을 붙여넣되, 필요 시 색상/레이아웃 선호나 금지할 라이브러리(Tailwind 등)를 추가로 기입합니다.
3. 생성된 프로젝트가 Next.js일 경우, `prototype` 스냅샷을 참고해 테마/상호작용을 비교 테스트합니다.

## 빠른 확인
로컬에서 기존 시안을 확인하려면 `prototype/README.md`의 안내대로 Node 미리보기(`npm run preview --prefix prototype`)를 실행하세요.
