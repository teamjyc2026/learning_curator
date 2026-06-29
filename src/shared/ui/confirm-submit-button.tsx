"use client";

import { Button } from "@/shared/ui/button";

/** 확인창을 거쳐 폼(서버 액션)을 제출하는 삭제용 버튼. 취소 시 제출 차단. */
export function ConfirmSubmitButton({
  children,
  message = "삭제하시겠습니까? 되돌릴 수 없습니다.",
  variant = "ghost",
  size = "sm",
}: {
  children: React.ReactNode;
  message?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
}) {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </Button>
  );
}
