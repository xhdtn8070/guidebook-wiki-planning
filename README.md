# Guidebook Wiki Planning Repository

이 저장소는 **Guidebook Wiki** 서비스(멀티 테넌트 API 기반 위키 플랫폼)와 첫 번째 대표 위키인 **API 실전 플레이북**의 기획·설계 문서를 모아두는 곳입니다. 백엔드/프론트엔드/데이터베이스/레이아웃 설계가 각각 별도 파일로 분리되어 있으므로, 아래 "추천 읽기 순서"에 따라 문서를 탐색하면 전체 맥락을 빠르게 파악할 수 있습니다.

## 추천 읽기 순서
1. **guidebook-wiki-planning.md** – 비전, 문제 정의, 전체 아키텍처 개요를 먼저 파악합니다.
2. **guidebook-wiki-layout-and-common-component.md** – 제품 경험을 좌우하는 UI/레이아웃 공통 요소를 확인합니다.
3. **guidebook-wiki-frontend-planning-nextjs.md** → **guidebook-wiki-frontend-planning-codex.md** – 프론트엔드 정보 구조와 구현 가이드를 순서대로 읽습니다.
4. **guidebook-wiki-backend-draft.md** – 인증/테넌트/위키/플러그인 API 초안을 검토합니다.
5. **guidebook-wiki-database-planning-postgresql.md** – 데이터 모델과 테이블 관계를 확인하며 백엔드 API 초안과 맞춰봅니다.

각 파일 상단에도 선행/후행 문서 안내를 추가했으니 필요한 부분만 찾아볼 때 참고하세요.

## 문서 개요
- **guidebook-wiki-planning.md**: 서비스 비전, 문제 정의, 도메인/레포 구조, 전체 아키텍처 개요.
- **guidebook-wiki-layout-and-common-component.md**: 공통 레이아웃, 내비게이션, 광고/위젯/권한 UI 패턴.
- **guidebook-wiki-frontend-planning-nextjs.md**: IA, 주요 화면 플로우, 테넌트 인지 및 BFF 역할.
- **guidebook-wiki-frontend-planning-codex.md**: Next.js + TypeScript 구현 가이드, 폴더 구조, 인증/페치 규칙.
- **guidebook-wiki-backend-draft.md**: API 규격 초안(인증, 위키, 플러그인, 검색, 알림 등)과 공통 정책.
- **guidebook-wiki-database-planning-postgresql.md**: PostgreSQL 스키마 초안, 테넌트·문서·버전·광고 테이블 설계.

## 사용 방법
- 새로운 내용이 생기면 기존 문서의 관련 섹션을 업데이트하거나, README에 새 파일을 추가로 연결해 주세요.
- 백엔드/프론트엔드/데이터베이스 문서를 변경할 때는 서로의 의존 관계(테넌트 코드, 권한/광고/플러그인 모델)를 함께 검증해 일관성을 유지합니다.
- 문서만 수정한 경우 별도의 테스트/린터 실행은 생략해도 됩니다.
