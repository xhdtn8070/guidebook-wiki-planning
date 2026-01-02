# Guidebook Wiki Planning Repository

이 저장소는 **Guidebook Wiki** 서비스(멀티 테넌트 API 기반 위키 플랫폼)와 첫 번째 대표 위키인 **API 실전 플레이북**의 기획·설계
문서를 모아두는 곳입니다. 영역별로 폴더를 분리해 한 저장소에서 프로토타입·백엔드·프론트엔드·데이터베이스 자료를 함께 관리합니다.

## 폴더 구조
- `docs/`: 비전, 문제 정의, 레이아웃/공통 컴포넌트 등 상위 기획 문서
- `frontend/`: 프론트엔드 설계와 구현 가이드
- `backend/`: API 규격 초안 및 공통 정책
- `database/`: PostgreSQL 스키마 초안
- `nextjs/`: 실동작하는 Next.js 기반 위키 UI 코드베이스 (기획서에서 정의한 구조를 구현)

## 추천 읽기 순서
1. **docs/guidebook-wiki-planning.md** – 비전, 문제 정의, 전체 아키텍처 개요를 먼저 파악합니다.
2. **docs/guidebook-wiki-layout-and-common-component.md** – 제품 경험을 좌우하는 UI/레이아웃 공통 요소를 확인합니다.
3. **frontend/guidebook-wiki-frontend-planning-nextjs.md** → **frontend/guidebook-wiki-frontend-planning-codex.md** – 프론트엔드 정보 구조와 구현
   가이드를 순서대로 읽습니다.
4. **backend/guidebook-wiki-backend-draft.md** – 인증/테넌트/위키/플러그인 API 초안을 검토합니다.
5. **database/guidebook-wiki-database-planning-postgresql.md** – 데이터 모델과 테이블 관계를 확인하며 백엔드 API 초안과 맞춰봅니다.

각 파일 상단에도 선행/후행 문서 안내를 추가했으니 필요한 부분만 찾아볼 때 참고하세요.

## Next.js 실행/검증
- **개발 서버**: `cd nextjs && npm run dev`
- **테스트**: `cd nextjs && npm test`
- **린트**: `cd nextjs && npm run lint`

## 사용 방법
- 새로운 내용이 생기면 기존 문서의 관련 섹션을 업데이트하거나, README에 새 파일을 추가로 연결해 주세요.
- 백엔드/프론트엔드/데이터베이스 문서를 변경할 때는 서로의 의존 관계(테넌트 코드, 권한/광고/플러그인 모델)를 함께 검증해 일관성을
  유지합니다.
- 문서만 수정한 경우 별도의 테스트/린터 실행은 생략해도 됩니다.
