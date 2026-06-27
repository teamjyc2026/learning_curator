// 융합형 사고 자가진단 — 원본 HTML(reference/융합형사고_자가진단_체크리스트.html)에서 이식.
export interface Signal {
  key: string;
  color: string;
  ko: string;
  en: string;
  desc: string;
  qs: string[];
  step: string;
}

export const SIGNALS: Signal[] = [
  {
    key: "s1",
    color: "#2E7CF6",
    ko: "강제 연결",
    en: "forced connection",
    desc: "상관없어 보이는 것들을 억지로라도 이어보는 힘",
    qs: [
      "서로 상관없어 보이는 두 가지를 보면 “이 둘을 연결하면?” 하고 떠올린 적이 있다.",
      "한 과목에서 배운 걸 다른 과목에서 “어, 이거 비슷하네” 하고 알아챈 적이 있다.",
      "평소에 “이것과 저것의 공통점은 뭘까?”를 종종 생각한다.",
    ],
    step:
      "하루에 한 번, 눈앞의 전혀 다른 두 가지를 골라 억지로 연결해 한 문장 만들기 (예: “구름과 시험의 공통점은?”).",
  },
  {
    key: "s2",
    color: "#16A37B",
    ko: "지식의 전이",
    en: "transfer",
    desc: "배운 것을 시험 밖 실제 문제에 끌어다 쓰는 힘",
    qs: [
      "시험을 위해서가 아니라, 배운 것을 실제 상황에 써본 적이 있다.",
      "새로운 문제를 만나면 “전에 비슷한 걸 어디서 봤더라?”를 먼저 떠올린다.",
      "수업에서 배운 개념으로 일상의 현상을 설명해본 적이 있다.",
    ],
    step:
      "오늘 배운 것 하나를 골라 “이걸 실생활 어디에 쓸 수 있을까?”를 한 문장으로 적어보기.",
  },
  {
    key: "s3",
    color: "#A855F7",
    ko: "다관점 종합",
    en: "synthesis",
    desc: "상충하는 관점을 함께 쥐고 내 자리를 잡는 힘",
    qs: [
      "의견이 갈리는 문제에서 양쪽 입장을 모두 이해해보려 한다.",
      "“둘 다 맞을 수도 있다”는 생각을 해본 적이 있다.",
      "내 생각과 다른 의견을 들으면 화내기보다 그 이유가 궁금해진다.",
    ],
    step:
      "뉴스나 토론 주제 하나를 골라, 내 생각과 ‘반대편 주장’을 각각 한 줄씩 정리해보기.",
  },
  {
    key: "s4",
    color: "#F59E0B",
    ko: "비유적 추상화",
    en: "analogy",
    desc: "핵심 구조를 뽑아 다른 것에 빗대 설명하는 힘",
    qs: [
      "어려운 내용을 친구에게 “이건 마치 ~같은 거야”라고 비유로 설명한 적이 있다.",
      "복잡한 것을 보면 핵심만 뽑아 단순하게 정리하려 한다.",
      "새 개념을 익힐 때 이미 아는 것에 빗대어 이해한다.",
    ],
    step:
      "최근 배운 개념 하나를 “한 문장 비유”로 바꿔 친구나 가족에게 설명해보기.",
  },
  {
    key: "s5",
    color: "#EF4444",
    ko: "자기주도적 탐구",
    en: "self-directed inquiry",
    desc: "정답이 없을 때 멈추지 않고 스스로 길을 내는 힘",
    qs: [
      "정답이 없는 질문을 받아도 일단 내 나름의 가설을 세워본다.",
      "틀리는 것을 크게 두려워하지 않고 일단 시도해본다.",
      "궁금한 게 생기면 누가 시키지 않아도 스스로 찾아본다.",
    ],
    step: "문제를 풀거나 검색하기 전에 “내 예상은 ~이다”를 먼저 적고 시작하기.",
  },
];

export const OPTS: [string, number][] = [
  ["그렇다", 2],
  ["가끔", 1],
  ["아니다", 0],
];

export const TOTAL_QUESTIONS = SIGNALS.length * 3;
export const MAX_PER_SIGNAL = 6;

export function band(score: number): { label: string; color: string } {
  if (score >= 5) return { label: "강함", color: "#16A37B" };
  if (score >= 3) return { label: "보통", color: "#F59E0B" };
  return { label: "키우는 중", color: "#9AA3AE" };
}

export function overallMessage(total: number): string {
  if (total >= 24)
    return "연결하는 습관이 이미 몸에 배어 있어요. 이제는 깊이까지 더해 보세요 — 한 분야를 끝까지 파고든 위에 다른 분야를 잇는 거예요.";
  if (total >= 15)
    return "융합의 씨앗이 곳곳에 보여요. 강한 신호는 살리고, 약한 신호 하나만 의식적으로 키워도 사고가 훨씬 단단해집니다.";
  return "아직은 지식이 칸칸이 나뉘어 있을 수 있어요. 괜찮아요 — 융합은 타고나는 게 아니라 ‘연결해보는 습관’으로 자랍니다. 아래 한 걸음부터 시작해 보세요.";
}

export interface FusionResult {
  scores: number[];
  total: number;
  topKo: string;
  lowKo: string;
  bands: { ko: string; label: string }[];
}
