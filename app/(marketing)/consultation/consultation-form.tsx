"use client";

import { useActionState } from "react";
import {
  createConsultationAction,
  type ConsultationState,
} from "./actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export function ConsultationForm() {
  const [state, action, pending] = useActionState<ConsultationState, FormData>(
    createConsultationAction,
    null,
  );

  return (
    <form action={action} className="space-y-5">
      {/* 허니팟 */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="student_name">학생 이름 *</Label>
          <Input id="student_name" name="student_name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="parent_name">학부모 이름</Label>
          <Input id="parent_name" name="parent_name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">연락처 *</Label>
          <Input id="phone" name="phone" type="tel" inputMode="tel" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" name="email" type="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="grade">학년</Label>
          <Input id="grade" name="grade" placeholder="예: 중2" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="preferred_subject">관심 영역</Label>
          <Input
            id="preferred_subject"
            name="preferred_subject"
            placeholder="예: 수학 사고력"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="preferred_at_1">희망 일시 1</Label>
          <Input id="preferred_at_1" name="preferred_at_1" type="datetime-local" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="preferred_at_2">희망 일시 2</Label>
          <Input id="preferred_at_2" name="preferred_at_2" type="datetime-local" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="channel">상담 방식</Label>
        <Select
          name="channel"
          defaultValue="visit"
          items={{
            visit: "방문 상담",
            phone: "전화 상담",
            online: "온라인 상담",
          }}
        >
          <SelectTrigger id="channel">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visit">방문 상담</SelectItem>
            <SelectItem value="phone">전화 상담</SelectItem>
            <SelectItem value="online">온라인 상담</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">문의 내용</Label>
        <Textarea id="message" name="message" rows={4} />
      </div>

      <label className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3 text-sm">
        <input
          type="checkbox"
          name="privacy_consent"
          className="mt-0.5 size-4 accent-primary"
        />
        <span>
          개인정보(이름·연락처 등)를 상담 목적으로 수집·이용하는 데
          동의합니다. <span className="text-destructive">*</span>
        </span>
      </label>

      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "신청 중…" : "상담 신청하기"}
      </Button>
    </form>
  );
}
