"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  subscribeNewsletterAction,
  type NewsletterState,
} from "@/lib/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(
    subscribeNewsletterAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success("뉴스레터 구독이 완료되었습니다.");
      formRef.current?.reset();
    }
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex gap-2">
      <Input
        type="email"
        name="email"
        inputMode="email"
        placeholder="이메일 주소"
        aria-label="이메일 주소"
        required
      />
      <Button type="submit" disabled={pending}>
        구독
      </Button>
    </form>
  );
}
