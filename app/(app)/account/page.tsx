import type { Metadata } from "next";
import { getSessionContext } from "@/lib/auth/roles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AccountForm } from "./account-form";

export const metadata: Metadata = { title: "내 계정" };

export default async function AccountPage() {
  const { user, profile } = await getSessionContext();

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>내 계정</CardTitle>
          <CardDescription>
            닉네임·연락처·프로필 사진을 수정할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountForm
            email={user?.email ?? ""}
            nickname={profile?.nickname ?? ""}
            phone={profile?.phone ?? ""}
            avatarUrl={profile?.avatar_url ?? null}
          />
        </CardContent>
      </Card>
    </div>
  );
}
