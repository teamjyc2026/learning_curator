import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "상담 신청 완료" };

export default function ConsultationCompletePage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <CheckCircle2 className="size-16 text-emerald-500" />
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight">
        상담 신청이 접수되었습니다
      </h1>
      <p className="mt-3 text-muted-foreground">
        입력해 주신 연락처로 빠르게 연락드리겠습니다. 감사합니다.
      </p>
      <Button className="mt-8" render={<Link href="/" />}>
        홈으로
      </Button>
    </div>
  );
}
