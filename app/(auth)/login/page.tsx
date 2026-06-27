import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; registered?: string }>;
}) {
  const sp = await searchParams;
  return (
    <Card>
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>러닝 큐레이터 계정으로 로그인하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm redirectTo={sp.redirect} registered={sp.registered === "1"} />
      </CardContent>
    </Card>
  );
}
