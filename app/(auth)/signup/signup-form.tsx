"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signupAction, type AuthState } from "@/features/auth/actions";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signupAction,
    null,
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [role, setRole] = useState<"parent" | "student">("student");

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label>회원 유형</Label>
        <div className="grid grid-cols-2 gap-2">
          {(["student", "parent"] as const).map((r) => (
            <label
              key={r}
              className={`cursor-pointer rounded-md border p-2.5 text-center text-sm font-medium transition-colors ${
                role === r
                  ? "border-primary bg-primary/5 text-primary"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
                className="sr-only"
              />
              {r === "student" ? "학생" : "학부모"}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="size-14">
          <AvatarImage src={preview ?? undefined} alt="" />
          <AvatarFallback>{role === "student" ? "학생" : "학부모"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="avatar">프로필 사진 (선택)</Label>
          <Input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="nickname">닉네임</Label>
        <Input id="nickname" name="nickname" required maxLength={20} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">이메일</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
        <p className="text-xs text-muted-foreground">8자 이상 입력해 주세요.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">연락처 (선택)</Label>
        <Input id="phone" name="phone" type="tel" inputMode="tel" />
      </div>

      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "가입 중…" : "회원가입"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
