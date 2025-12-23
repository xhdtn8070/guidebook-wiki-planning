# Guidebook Wiki Planning Repository

이 저장소는 **Guidebook Wiki** 서비스(멀티 테넌트 API 기반 위키 플랫폼)와 첫 번째 대표 위키인 **API 실전 플레이북**의 기획·설계
문서를 모아두는 곳입니다. 영역별로 폴더를 분리해 한 저장소에서 프로토타입·백엔드·프론트엔드·데이터베이스 자료를 함께 관리합니다.

## 폴더 구조
- `docs/`: 비전, 문제 정의, 레이아웃/공통 컴포넌트 등 상위 기획 문서
- `frontend/`: 프론트엔드 설계와 구현 가이드
- `backend/`: API 규격 초안 및 공통 정책
- `database/`: PostgreSQL 스키마 초안
- `prototype/`: 정적 위키 UI 프로토타입, 프리뷰/테스트 스크립트 및 컨테이너 설정

## 추천 읽기 순서
1. **docs/guidebook-wiki-planning.md** – 비전, 문제 정의, 전체 아키텍처 개요를 먼저 파악합니다.
2. **docs/guidebook-wiki-layout-and-common-component.md** – 제품 경험을 좌우하는 UI/레이아웃 공통 요소를 확인합니다.
3. **frontend/guidebook-wiki-frontend-planning-nextjs.md** → **frontend/guidebook-wiki-frontend-planning-codex.md** – 프론트엔드 정보 구조와 구현
   가이드를 순서대로 읽습니다.
4. **backend/guidebook-wiki-backend-draft.md** – 인증/테넌트/위키/플러그인 API 초안을 검토합니다.
5. **database/guidebook-wiki-database-planning-postgresql.md** – 데이터 모델과 테이블 관계를 확인하며 백엔드 API 초안과 맞춰봅니다.

각 파일 상단에도 선행/후행 문서 안내를 추가했으니 필요한 부분만 찾아볼 때 참고하세요.

## 프로토타입 미리보기 (prototype/ 폴더 실행)
- **Docker Compose**: `cd prototype && docker compose up --build` 후 `http://localhost:4173/` 접속
  - 백그라운드 실행 시 `docker compose up -d`, 중단 시 `docker compose down`
- **로컬 Node**: `npm run preview --prefix prototype` 명령으로 정적 서버를 띄운 뒤 `http://localhost:4173/`로 접속합니다.
- **스모크 테스트**: `npm test --prefix prototype` 로 index와 테마 JSON 응답을 검증하는 테스트를 실행합니다.

## 사용 방법
- 새로운 내용이 생기면 기존 문서의 관련 섹션을 업데이트하거나, README에 새 파일을 추가로 연결해 주세요.
- 백엔드/프론트엔드/데이터베이스 문서를 변경할 때는 서로의 의존 관계(테넌트 코드, 권한/광고/플러그인 모델)를 함께 검증해 일관성을
  유지합니다.
- 문서만 수정한 경우 별도의 테스트/린터 실행은 생략해도 됩니다.
