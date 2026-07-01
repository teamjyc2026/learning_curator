"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useFusionQuizStore } from "@/features/game-self-check/quiz-store";
import { saveGameResultAction } from "@/features/game-self-check/actions";
import type { Json } from "@/shared/lib/supabase/database.types";
import {
  MAX_PER_SIGNAL,
  SIGNALS,
  TOTAL_MAX,
  TOTAL_QUESTIONS,
  sigFrac,
  sigLevel,
  totalLevel,
  type FusionResult,
  type Option,
} from "./data";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

type Q = { id: string; sig: string; p: string; o: Option[] };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 신호 순서를 숨기려 문항·보기를 로드할 때마다 섞는다. */
function buildQuestions(): Q[] {
  const qs: Q[] = [];
  SIGNALS.forEach((s) =>
    s.qs.forEach((q, qi) => {
      qs.push({ id: `${s.key}_${qi}`, sig: s.key, p: q.p, o: shuffle(q.o) });
    }),
  );
  return shuffle(qs);
}

/** 오각형 레이더(사고 나침반) */
function Radar({
  size,
  fracs,
  labels = false,
  className,
}: {
  size: number;
  fracs: number[];
  labels?: boolean;
  className?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size * (labels ? 0.34 : 0.4);
  const pt = (i: number, f: number): [number, number] => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    return [cx + R * f * Math.cos(a), cy + R * f * Math.sin(a)];
  };
  const grid = labels ? "rgba(255,255,255,0.22)" : "var(--border)";
  const rings = [0.25, 0.5, 0.75, 1].map((g, gi) => (
    <polygon
      key={gi}
      points={SIGNALS.map((_, i) => pt(i, g).join(",")).join(" ")}
      fill="none"
      stroke={grid}
      strokeWidth={1}
    />
  ));
  const spokes = SIGNALS.map((_, i) => {
    const [x, y] = pt(i, 1);
    return (
      <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={grid} strokeWidth={1} />
    );
  });
  const poly = SIGNALS.map((_, i) => pt(i, Math.max(0.001, fracs[i])).join(",")).join(
    " ",
  );
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="사고 나침반"
      className={className}
    >
      {rings}
      {spokes}
      <polygon
        points={poly}
        fill={labels ? "rgba(255,255,255,0.16)" : "rgba(59,91,219,0.16)"}
        stroke={labels ? "#fff" : "#3B5BDB"}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {SIGNALS.map((s, i) => {
        const [x, y] = pt(i, Math.max(0.001, fracs[i]));
        return <circle key={s.key} cx={x} cy={y} r={labels ? 4 : 2.4} fill={s.color} />;
      })}
      {labels
        ? SIGNALS.map((s, i) => {
            const [x, y] = pt(i, 1.16);
            return (
              <g key={s.key}>
                <circle cx={x} cy={y} r={11} fill={s.color} />
                <text
                  x={x}
                  y={y + 1}
                  fontSize={12}
                  fontWeight={800}
                  fill="#fff"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {s.num}
                </text>
              </g>
            );
          })
        : null}
    </svg>
  );
}

export function FusionSelfCheck({
  gameId,
  canSave,
}: {
  gameId: string | null;
  canSave: boolean;
}) {
  const { answers, setAnswer, reset } = useFusionQuizStore();
  const [questions, setQuestions] = useState<Q[]>(buildQuestions);
  const [showResult, setShowResult] = useState(false);
  const [saved, setSaved] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const done = answeredCount >= TOTAL_QUESTIONS;

  const raws = useMemo(
    () =>
      SIGNALS.map(
        (s) => (answers[`${s.key}_0`] ?? 0) + (answers[`${s.key}_1`] ?? 0),
      ),
    [answers],
  );
  const total = raws.reduce((a, b) => a + b, 0);
  const fracs = raws.map(sigFrac);
  const topI = raws.indexOf(Math.max(...raws));
  const lowI = raws.indexOf(Math.min(...raws));
  const flat = Math.max(...raws) === Math.min(...raws);
  const tl = totalLevel(total);

  async function handleSeeResult() {
    setShowResult(true);
    if (canSave && !saved) {
      const result: FusionResult = {
        scores: raws,
        total,
        topKo: SIGNALS[topI].ko,
        lowKo: SIGNALS[lowI].ko,
        bands: SIGNALS.map((s, i) => ({ ko: s.ko, label: sigLevel(raws[i]).label })),
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
    setQuestions(buildQuestions());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-l-[3px] border-l-primary bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        멋진 답이 아니라 <b className="text-foreground">평소 내 모습</b>을 골라주세요.
        각 상황이 무엇을 보는지는 일부러 숨겨 두었어요 —{" "}
        <b className="text-foreground">다 풀고 나면 결과에서</b> 알려드려요.
      </div>

      {!canSave ? (
        <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
          로그인하면 진단 결과를 내 기록에 저장할 수 있어요.
        </p>
      ) : null}

      {questions.map((q, idx) => (
        <section key={q.id} className="rounded-2xl border bg-card p-5">
          <div className="flex items-start gap-3">
            <span className="flex size-9 flex-none items-center justify-center rounded-xl bg-foreground text-base font-extrabold text-background">
              {idx + 1}
            </span>
            <p className="flex-1 break-keep pt-1.5 font-semibold leading-relaxed">
              {q.p}
            </p>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {q.o.map((opt, oi) => {
              const active = answers[q.id] === opt.s;
              return (
                <button
                  key={oi}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setAnswer(q.id, opt.s)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border px-3.5 py-3 text-left text-sm leading-relaxed break-keep transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 flex-none items-center justify-center rounded-full border-2",
                      active ? "border-primary-foreground" : "border-border",
                    )}
                  >
                    {active ? (
                      <span className="size-2 rounded-full bg-primary-foreground" />
                    ) : null}
                  </span>
                  <span>{opt.t}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {/* progress + cta */}
      <div className="sticky bottom-4 z-10 flex items-center gap-3 rounded-xl border bg-background/95 p-3 shadow-sm backdrop-blur">
        <Radar size={44} fracs={fracs} />
        <div className="min-w-0 flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(answeredCount / TOTAL_QUESTIONS) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {done
              ? "완료! 결과 보기를 눌러 나의 나침반을 확인하세요"
              : `${answeredCount} / ${TOTAL_QUESTIONS} 상황`}
          </p>
        </div>
        <Button type="button" disabled={!done} onClick={handleSeeResult}>
          결과 보기
        </Button>
      </div>

      {showResult ? (
        <div id="fusion-result" className="space-y-4 pt-2">
          <div className="overflow-hidden rounded-2xl border bg-foreground p-6 text-background">
            <div className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-background/60">
              나의 사고 나침반
            </div>
            <h2 className="mt-1.5 break-keep text-2xl font-extrabold leading-tight">
              {tl.k}
            </h2>
            <p className="mt-1 text-sm text-background/70">
              합계 <b className="text-background">{total}</b> / {TOTAL_MAX}점
            </p>
            <p className="mt-3 break-keep text-xs text-background/60">
              방금 답한 {TOTAL_QUESTIONS}개 상황은 아래 다섯 가지 융합 사고 신호를
              비춰본 것입니다.
            </p>

            <div className="my-5 grid place-items-center">
              <Radar
                size={340}
                fracs={fracs}
                labels
                className="h-auto w-full max-w-[380px]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-3">
                <span
                  className="mt-0.5 flex-none rounded-md px-2 py-1 text-[0.65rem] font-extrabold text-white"
                  style={{ background: SIGNALS[topI].color }}
                >
                  가장 강한 신호
                </span>
                <span className="break-keep text-sm text-background/90">
                  <b className="text-background">
                    {SIGNALS[topI].num}. {SIGNALS[topI].ko}
                  </b>{" "}
                  — 이미 당신의 사고 무기입니다. 더 어려운 문제에서 의도적으로 꺼내
                  쓰세요.
                </span>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-3">
                <span className="mt-0.5 flex-none rounded-md bg-white/20 px-2 py-1 text-[0.65rem] font-extrabold text-white">
                  {flat ? "다음 한 걸음" : "키울 한 가지"}
                </span>
                <span className="break-keep text-sm text-background/90">
                  {flat ? (
                    "다섯 신호가 균형을 이뤘습니다. 가장 끌리는 신호 하나를 골라 더 깊이 밀어붙여보세요."
                  ) : (
                    <>
                      <b className="text-background">
                        {SIGNALS[lowI].num}. {SIGNALS[lowI].ko}
                      </b>{" "}
                      — {SIGNALS[lowI].grow}
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h3 className="font-extrabold">다섯 가지 신호 · 신호별 상세</h3>
            <p className="mt-1 break-keep text-xs text-muted-foreground">
              ① 강제 연결 · ② 지식의 전이 · ③ 다관점 종합 · ④ 비유적 추상화 · ⑤
              자기주도적 탐구
            </p>
            <div className="mt-4 space-y-1">
              {SIGNALS.map((s, i) => {
                const lv = sigLevel(raws[i]);
                return (
                  <div
                    key={s.key}
                    className="flex items-center gap-3 border-t py-2.5 first:border-t-0"
                  >
                    <span
                      className="flex size-6 flex-none items-center justify-center rounded-md text-xs font-extrabold text-white"
                      style={{ background: s.color }}
                    >
                      {s.num}
                    </span>
                    <span className="w-24 flex-none break-keep text-sm font-bold sm:w-28">
                      {s.ko}
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(raws[i] / MAX_PER_SIGNAL) * 100}%`,
                          background: s.color,
                        }}
                      />
                    </div>
                    <span className="w-8 flex-none text-right text-sm font-bold tabular-nums">
                      {raws[i]}
                    </span>
                    <span
                      className="flex-none rounded-full px-2 py-0.5 text-[0.65rem] font-extrabold text-white"
                      style={{ background: lv.color }}
                    >
                      {lv.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 break-keep rounded-xl border border-dashed bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
              {tl.d}
              <br />
              <br />이 진단은 표준화된 ‘검사’가 아니라, 검증된 연구(OECD·PISA·Lattuca
              등)가 가리키는 역량을 생활 장면으로 비춰보는{" "}
              <b className="text-foreground">관찰 도구</b>입니다. 점수보다 “어느
              신호를 어떻게 키울지”의 단서로 활용하세요.
            </p>

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
