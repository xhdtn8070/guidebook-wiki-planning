# Mock Theme Preview

단일 HTML 시안(`index.html`)과 5개의 테마 JSON(`data/*.json`)을 바꿔 끼우는 구조입니다. 쿼리스트링 `?theme=` 혹은 셀렉트 박스로 테마를 전환하며, 이후 API가 준비되면 `theme-loader.js`의 fetch 경로만 교체하면 됩니다.

## 파일
- `index.html`: 공통 마크업. 헤더/사이드바/히어로/카드/코드블록 데모 포함.
- `styles.css`: CSS 변수 기반 기본 스타일.
- `theme-loader.js`: 테마 JSON을 로드해 CSS 변수와 일부 컴포넌트 스타일에 반영.
- `data/*.json`: 테마 데이터. `palette`, `font`, `layout`, `hero`, `components` 키를 공유합니다.

## 사용법
1. 로컬에서 `mock-themes/index.html`을 브라우저로 열기.
2. 상단 셀렉트 박스로 테마 전환 또는 `?theme=gradient-pulse`처럼 URL 파라미터로 지정.
3. API 연동 시 `THEME_FILES` 매핑을 실제 엔드포인트 fetch 로직으로 교체하면 됩니다.
