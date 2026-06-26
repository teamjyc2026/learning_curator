"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { updateProfileAction, type ProfileState } from "../actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AccountForm({
  email,
  nickname,
  phone,
  avatarUrl,
}: {
  email: string;
  nickname: string;
  phone: string;
  avatarUrl: string | null;
}) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(
    updateProfileAction,
    null,
  );
  const [preview, setPreview] = useState<string | null>(avatarUrl);

  useEffect(() => {
    if (state?.success) toast.success("프로필이 저장되었습니다.");
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar className="size-16">
          <AvatarImage src={preview ?? undefined} alt="" />
          <AvatarFallback>{(nickname || "회").slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="avatar">프로필 사진</Label>
          <Input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : avatarUrl);
            }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">이메일</Label>
        <Input id="email" value={email} disabled readOnly />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="nickname">닉네임</Label>
        <Input
          id="nickname"
          name="nickname"
          defaultValue={nickname}
          required
          maxLength={20}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">연락처</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          defaultValue={phone}
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "저장 중…" : "변경사항 저장"}
      </Button>
    </form>
  );
}
