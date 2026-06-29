import type { Metadata } from "next";
import { PageHeader } from "@/shared/ui/page-header";
import { ConsultationForm } from "./consultation-form";

export const metadata: Metadata = { title: "상담예약" };

export default function ConsultationPage() {
  return (
    <>
      <PageHeader
        eyebrow="CONSULTATION"
        title="학습코칭 상담예약"
        description="우리 아이에게 맞는 학습 코칭, 온라인으로 간편하게 신청하세요."
      />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border bg-card p-6 sm:p-8">
          <ConsultationForm />
        </div>
      </div>
    </>
  );
}
