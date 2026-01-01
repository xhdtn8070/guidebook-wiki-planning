import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <h1 className="text-3xl font-bold">문서를 찾을 수 없습니다</h1>
      <p className="text-muted-foreground">요청하신 문서가 존재하지 않거나 준비 중입니다.</p>
      <Link href="/" className="text-primary font-semibold underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
