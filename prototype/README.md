# Prototype Preview

단일 HTML 시안(`index.html`)과 5개의 테마 JSON(`data/*.json`)을 바꿔 끼우는 구조입니다. 쿼리스트링 `?theme=` 혹은 셀렉트 박스로 테마를 전환하며, 도큐사우루스 느낌의 위키 홈 + 문서/검색/플러그인 섹션을 하나의 페이지 안에서 프리뷰합니다.

## 파일
- `index.html`: 공통 마크업. 헤더/사이드바/히어로 + 로그인/배너 카드, 문서·검색·플러그인 섹션을 포함합니다.
- `styles.css`: CSS 변수 기반 기본 스타일 및 카카오 로그인 버튼/배너/플러그인 카드 스타일.
- `theme-loader.js`: 테마 JSON을 로드해 CSS 변수와 컴포넌트 스타일에 반영. file:// 로 열릴 때 fetch가 막히면 인라인 프리셋으로 폴백합니다.
- `data/*.json`: 테마 데이터. `palette`, `font`, `layout`, `hero`, `components` 키를 공유합니다.
- `dev-server.js`: 외부 의존성 없는 정적 서버. `node`만 설치되어 있으면 실행 가능합니다.

## 사용법
1. **추천**: 리포지토리 루트에서 `npm run preview` 실행 후 브라우저에서 `http://localhost:4173/` 접속.
2. 또는 `prototype/index.html`을 직접 열기(file://). 단, 브라우저 정책에 따라 fetch가 막히면 인라인 프리셋으로만 동작합니다.
3. 상단 셀렉트 박스로 테마 전환 또는 `?theme=gradient-pulse`처럼 URL 파라미터로 지정.
4. API 연동 시 `THEME_FILES` 매핑을 실제 엔드포인트 fetch 로직으로 교체하면 됩니다. 인라인 프리셋은 file:// 폴백용이므로 운영 시 제거 가능.
