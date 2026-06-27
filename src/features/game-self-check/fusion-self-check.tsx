"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useFusionQuizStore } from "@/features/game-self-check/quiz-store";
import { saveGameResultAction } from "@/features/game-self-check/actions";
import type { Json } from "@/shared/lib/supabase/database.types";
import {
  band,
  MAX_PER_SIGNAL,
  OPTS,
  overallMessage,
  SIGNALS,
  TOTAL_QUESTIONS,
  type FusionResult,
} from "./data";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function FusionSelfCheck({
  gameId,
  canSave,
}: {
  gameId: string | null;
  canSave: boolean;
}) {
  const { answers, setAnswer, reset } = useFusionQuizStore();
  const [showResult, setShowResult] = useState(false);
  const [saved, setSaved] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const done = answeredCount >= TOTAL_QUESTIONS;

  const scores = useMemo(
    () =>
      SIGNALS.map((s) =>
        s.qs.reduce((acc, _q, qi) => acc + (answers[`${s.key}_${qi}`] ?? 0), 0),
      ),
    [answers],
  );
  const total = scores.reduce((a, b) => a + b, 0);
  const topI = scores.indexOf(Math.max(...scores));
  const lowI = scores.indexOf(Math.min(...scores));

  async function handleSeeResult() {
    setShowResult(true);
    if (canSave && !saved) {
      const result: FusionResult = {
        scores,
        total,
        topKo: SIGNALS[topI].ko,
        lowKo: SIGNALS[lowI].ko,
        bands: SIGNALS.map((s, i) => ({ ko: s.ko, label: band(scores[i]).label })),
      };
      const res = await saveGameResultAction({
        gameId,
        internalKey: "fusion-self-check",
        result: result as unknown as Json,
      });
      if (res.saved) {
        setSaved(true);
        toast.success("진단 결과가 내 기록에 저장되었습니다.");
      }
    }
    requestAnimationFrame(() => {
      document
        .getElementById("fusion-result")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleReset() {
    reset();
    setShowResult(false);
    setSaved(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-6">
      {!canSave ? (
        <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
          로그인하면 진단 결과를 내 기록에 저장할 수 있어요. 결과는 기기에 저장되지
          않습니다.
        </p>
      ) : null}

      {SIGNALS.map((s, si) => (
        <section
          key={s.key}
          className="rounded-2xl border bg-card p-5"
          style={{ borderLeft: `6px solid ${s.color}` }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex size-9 items-center justify-center rounded-lg text-base font-extrabold text-white"
              style={{ background: s.color }}
            >
              {si + 1}
            </span>
            <div>
              <div className="text-lg font-extrabold">
                {s.ko}{" "}
                <span className="text-xs font-semibold text-muted-foreground">
                  {s.en}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>

          <div className="mt-3 divide-y">
            {s.qs.map((q, qi) => {
              const id = `${s.key}_${qi}`;
              return (
                <div
                  key={id}
                  className="flex flex-wrap items-center gap-3 py-3"
                >
                  <p className="min-w-[200px] flex-1 text-sm">{q}</p>
                  <div className="flex gap-1.5">
                    {OPTS.map(([label, value]) => {
                      const active = answers[id] === value;
                      return (
                        <button
                          key={label}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setAnswer(id, value)}
                          className={cn(
                            "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                            active
                              ? "text-white"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          style={
                            active
                              ? { background: s.color, borderColor: s.color }
                              : undefined
                          }
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* progress + cta */}
      <div className="sticky bottom-4 z-10 flex items-center gap-3 rounded-xl border bg-background/95 p-3 shadow-sm backdrop-blur">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(answeredCount / TOTAL_QUESTIONS) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {answeredCount} / {TOTAL_QUESTIONS}
        </span>
        <Button type="button" disabled={!done} onClick={handleSeeResult}>
          결과 보기
        </Button>
      </div>

      {showResult ? (
        <div id="fusion-result" className="space-y-4 pt-2">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-extrabold">나의 융합 사고 지도</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {overallMessage(total)}
            </p>
            <div className="mt-4 space-y-2.5">
              {SIGNALS.map((s, i) => {
                const b = band(scores[i]);
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    <div className="flex w-32 items-center gap-2 text-sm font-bold">
                      <span
                        className="size-3 rounded-sm"
                        style={{ background: s.color }}
                      />
                      {s.ko}
                    </div>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(scores[i] / MAX_PER_SIGNAL) * 100}%`,
                          background: s.color,
                        }}
                      />
                    </div>
                    <span
                      className="w-16 text-right text-xs font-bold"
                      style={{ color: b.color }}
                    >
                      {b.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: SIGNALS[topI].color }}
              >
                <div className="text-xs font-bold text-muted-foreground">
                  가장 강한 신호
                </div>
                <div
                  className="text-lg font-extrabold"
                  style={{ color: SIGNALS[topI].color }}
                >
                  {SIGNALS[topI].ko}
                </div>
              </div>
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: SIGNALS[lowI].color }}
              >
                <div className="text-xs font-bold text-muted-foreground">
                  지금 키우면 좋은 신호
                </div>
                <div
                  className="text-lg font-extrabold"
                  style={{ color: SIGNALS[lowI].color }}
                >
                  {SIGNALS[lowI].ko}
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="text-xs font-extrabold text-amber-700">
                오늘의 한 걸음 — {SIGNALS[lowI].ko}
              </div>
              <div className="mt-1.5 text-sm font-medium text-amber-900">
                {SIGNALS[lowI].step}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={handleReset}>
                다시 진단하기
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.print()}
              >
                결과 인쇄 / PDF 저장
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
