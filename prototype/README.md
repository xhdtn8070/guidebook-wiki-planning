# Prototype Preview

단일 HTML 시안(`index.html`, `docs.html`, `login.html`)과 5개의 테마 JSON(`data/*.json`)을 바꿔 끼우는 구조입니다. 상단 셀렉트로 테마/모드를
전환하며, 선택값은 로컬 스토리지에 저장돼 URL 파라미터 없이도 이동/뒤로가기 시 그대로 유지됩니다. 홈/Docs/카카오 전용 로그인 흐름과 문서
드롭다운, 목데이터 기반 문서 스위처를 함께 프리뷰합니다.

## 파일
- `index.html`: 소개 전용 랜딩. 상단 Docs 드롭다운(다중 문서 세트)과 CTA 위주 섹션만 배치합니다.
- `docs.html`: 문서 상세 페이지 시안. 문서 드롭다운/SidebarNav를 목데이터로 렌더링하고, 준비 중인 문서는 토스트와 비활성 상태로 안내합니다.
- `login.html`: 카카오 전용 전체 페이지 로그인 시안. redirect 파라미터 칩 + 카카오 버튼만 포함합니다.
- `styles.css`: CSS 변수 기반 기본 스타일 및 카카오 로그인 버튼/배너/플러그인 카드 스타일.
- `theme-loader.js`: 테마 JSON을 로드해 CSS 변수와 컴포넌트 스타일에 반영. file:// 로 열릴 때 fetch가 막히면 인라인 프리셋으로 폴백합니다.
- `data/*.json`: 테마 데이터. `palette`, `font`, `layout`, `hero`, `components` 키를 공유합니다.
- `dev-server.js`: 외부 의존성 없는 정적 서버. `node`만 설치되어 있으면 실행 가능합니다.
- `docker-compose.yml`, `Dockerfile`: 프로토타입 단독 컨테이너 빌드/실행 설정.

## 사용법
1. **Docker Compose(권장)**: `cd prototype && docker compose up --build` 실행 후 `http://localhost:4173/` 접속.
   - 백그라운드 실행: `docker compose up -d`
   - 종료: `docker compose down`
2. **로컬 Node**: `cd prototype && npm run preview` 실행 후 브라우저에서 `http://localhost:4173/` 접속합니다.
3. 또는 `prototype/index.html`을 직접 열기(file://). 단, 브라우저 정책에 따라 fetch가 막히면 인라인 프리셋으로만 동작합니다.
4. API 연동 시 `THEME_FILES` 매핑을 실제 엔드포인트 fetch 로직으로 교체하면 됩니다. 인라인 프리셋은 file:// 폴백용이므로 운영 시 제거
   가능.
5. `npm test` 는 의존성 없이 정적 서버를 임시 포트로 띄운 뒤 홈(`index.html`)과 테마 JSON 응답을 확인하는 스모크 테스트입니다.
