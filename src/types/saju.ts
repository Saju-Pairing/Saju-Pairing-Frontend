// 사용자 입력 정보
export interface PersonInput {
  name?: string;            // 이름 (선택)
  gender: 'F' | 'M';        // 성별 (여성 F, 남성 M)
  date: string;             // 생년월일 (YYYY-MM-DD)
  time: string;             // 출생 시간 (HH:mm)
  isUnknownTime: boolean;   // 출생 시간이 모르는 경우 여부
}

// 대운·세운·월운 흐름 정보
export interface FortuneFlow {
  daeUnPillar: string;      // 대운 기둥(천간·지지)
  daeUnAge: string;         // 대운 시작 나이
  seUnPillar: string;       // 세운(해운) 기둥
  seUnYear: string;         // 해당 세운의 연도
  wolUnPillar: string;      // 월운 기둥
  wolUnMonth: string;       // 해당 월운의 월(월 정보)
}

// 사주 팔자 분석 결과
export interface SajuResult {
  year: string;                         // 연주(년 기둥)
  month: string;                        // 월주(달 기둥)
  day: string;                          // 일주(날 기둥)
  hour: string;                         // 시주(시간 기둥)
  elements: Record<string, number>;     // 오행(목·화·토·금·수) 점수
  totalChars: number;                   // 총 글자 수 (4주=8자)
  fortune: FortuneFlow;                 // 대운·세운·월운 흐름 정보
}

// 원본 한자 기둥 정보 (API가 반환하는 원시 데이터)
export interface RawSaju {
  yearPillarHanja?: string | null;   // 연주(한자)
  monthPillarHanja?: string | null;  // 월주(한자)
  dayPillarHanja?: string | null;    // 일주(한자)
  hourPillarHanja?: string | null;   // 시주(한자)
}

// 두 사람의 궁합 결과
export interface RelationResult {
  hapTitle: string;       // 합(相合)의 대표 요약 제목
  hapDesc: string;        // 합 내용 상세 설명
  chungTitle: string;     // 충(相沖)의 대표 요약 제목
  chungDesc: string;     // 충 내용 상세 설명
  finalScore: number;     // 최종 궁합 점수
}

// 유료 결과 
export interface PaidResult {
  reunionProbability: number
  reunionLabel: string
  reunionDesc: string
  goodMonths: string[]
  badMonths: string[]
  neutralMonths: string[]
  bestMonth: string
  doList: string[]
  dontList: string[]
  dohasal: string
  sections: {
    속마음: string
    재회가능성설명: string
    이별이유: string
    타이밍설명: string
    접근법: string
    새인연: string
    지속가능성: string
    행동지침설명: string
    총평: string
  }
  verdict: string
  verdictScore: number
}

export interface SajuPillar {
  year: { hanja: string; eumyang: string } | null
  month: { hanja: string; eumyang: string } | null
  day: { hanja: string; eumyang: string } | null
  hour: { hanja: string; eumyang: string } | null
}

export interface SajuFormData {
  me: {
    name?: string
    birth: string
    gender: string
    time?: string
  }
  partner: {
    name?: string
    birth: string
    gender: string
    time?: string
  }
  breakupDuration: string
  breakupReason: string
}

export type BirthTime = string | undefined

export interface FreeResult {
  meSaju: object
  partnerSaju: object
  compatibility: number
  compatibilityLabel: string
  hamScore: number
  chungScore: number
  hamDesc: string
  chungDesc: string
  ohScore: number
  ohLabel: string
  summary: string
  upsellHook: string
}