import type { Metadata } from "next";
import { PageHeader, ComingSoon } from "@/shared/ui/page-header";

export const metadata: Metadata = { title: "자료" };

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="RESOURCES"
        title="자료"
        description="학습 자료집과 전자책을 준비하고 있습니다."
      />
      <ComingSoon note="자료집·전자책을 곧 공개합니다." />
    </>
  );
}
