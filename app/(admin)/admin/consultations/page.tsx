import type { Metadata } from "next";
import {
  channelLabel,
  consultationStatusLabel,
  getAllConsultations,
} from "@/entities/consultation";
import { updateConsultationAction } from "./actions";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

export const metadata: Metadata = { title: "상담 예약 관리" };

const statusVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  requested: "default",
  confirmed: "secondary",
  completed: "outline",
  cancelled: "destructive",
  no_show: "destructive",
};

function fmt(v: string | null) {
  return v ? new Date(v).toLocaleString("ko-KR") : "-";
}

export default async function AdminConsultationsPage() {
  const list = await getAllConsultations();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">상담 예약</h1>
      <p className="mt-1 text-muted-foreground">
        접수된 상담을 확인하고 상태를 관리하세요. (총 {list.length}건)
      </p>

      <div className="mt-6 space-y-4">
        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-muted/20 p-12 text-center text-muted-foreground">
            접수된 상담이 없습니다.
          </div>
        ) : (
          list.map((c) => (
            <div key={c.id} className="rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={statusVariant[c.status]}>
                  {consultationStatusLabel[c.status]}
                </Badge>
                <span className="font-bold">{c.student_name}</span>
                {c.grade ? (
                  <span className="text-sm text-muted-foreground">
                    {c.grade}
                  </span>
                ) : null}
                <span className="ml-auto text-xs text-muted-foreground">
                  {fmt(c.created_at)}
                </span>
              </div>

              <div className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                <div>학부모: {c.parent_name ?? "-"}</div>
                <div>연락처: {c.phone}</div>
                <div>이메일: {c.email ?? "-"}</div>
                <div>관심 영역: {c.preferred_subject ?? "-"}</div>
                <div>
                  방식: {c.channel ? channelLabel[c.channel] ?? c.channel : "-"}
                </div>
                <div>희망1: {fmt(c.preferred_at_1)}</div>
                <div>희망2: {fmt(c.preferred_at_2)}</div>
              </div>

              {c.message ? (
                <p className="mt-3 whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-sm">
                  {c.message}
                </p>
              ) : null}

              <form
                action={updateConsultationAction}
                className="mt-4 flex flex-wrap items-end gap-2 border-t pt-4"
              >
                <input type="hidden" name="id" value={c.id} />
                <div className="space-y-1">
                  <label className="text-xs font-medium">상태</label>
                  <select
                    name="status"
                    defaultValue={c.status}
                    className="block h-9 rounded-md border bg-background px-2 text-sm"
                  >
                    {Object.entries(consultationStatusLabel).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-medium">관리자 메모</label>
                  <input
                    name="admin_note"
                    defaultValue={c.admin_note ?? ""}
                    placeholder="메모"
                    className="block h-9 w-full rounded-md border bg-background px-2 text-sm"
                  />
                </div>
                <Button type="submit" size="sm">
                  저장
                </Button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
