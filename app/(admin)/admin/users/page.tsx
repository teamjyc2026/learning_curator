import type { Metadata } from "next";
import { getUsersWithRoles } from "@/lib/queries/admin-users";
import { setUserRoleAction } from "./actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { AppRole } from "@/lib/supabase/database.types";

export const metadata: Metadata = { title: "회원 관리" };

const ROLES: { value: AppRole; label: string }[] = [
  { value: "admin", label: "관리자" },
  { value: "parent", label: "학부모" },
  { value: "student", label: "학생" },
];

export default async function AdminUsersPage() {
  const users = await getUsersWithRoles();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight">회원 / 역할</h1>
      <p className="mt-1 text-muted-foreground">
        회원에게 역할을 부여하거나 해제합니다. (총 {users.length}명)
      </p>

      <div className="mt-6 divide-y rounded-xl border bg-card">
        {users.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            회원이 없습니다.
          </p>
        ) : (
          users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center gap-3 p-4">
              <Avatar className="size-9">
                <AvatarImage src={u.avatar_url ?? undefined} alt="" />
                <AvatarFallback>
                  {(u.nickname ?? "회").slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{u.nickname ?? "(닉네임 없음)"}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {u.email}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map((r) => {
                  const has = u.roles.includes(r.value);
                  return (
                    <form key={r.value} action={setUserRoleAction}>
                      <input type="hidden" name="userId" value={u.id} />
                      <input type="hidden" name="role" value={r.value} />
                      <input
                        type="hidden"
                        name="op"
                        value={has ? "remove" : "add"}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        variant={has ? "default" : "outline"}
                      >
                        {r.label}
                        {has ? " ✓" : ""}
                      </Button>
                    </form>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
