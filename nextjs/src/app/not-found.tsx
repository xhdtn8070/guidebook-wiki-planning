import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">404</p>
      <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground">문서를 찾을 수 없습니다</h1>
      <p className="max-w-md text-sm leading-7 text-muted-foreground">요청한 페이지가 없거나, 현재 tenant 컨텍스트에서는 열 수 없습니다.</p>
      <Link href="/" className="rounded-full border border-border px-4 py-2 text-sm font-medium">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
