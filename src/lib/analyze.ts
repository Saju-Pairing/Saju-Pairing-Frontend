import type { PaidResult, SajuFormData, SajuPillar } from '@/types'
import { calcSajuPillar, calcPersonality, calcDohasal, calcRelation, calcFreeResult, pillarToStr } from './saju'
import { supabase } from './supabase'

// 무료 결과: 로컬 계산 (Gemini 호출 없음)
export function buildFreeResult(formData: SajuFormData) {
  const meSaju = calcSajuPillar(formData.me.birth, formData.me.time)
  const partnerSaju = calcSajuPillar(formData.partner.birth, formData.partner.time)
  return calcFreeResult(meSaju, partnerSaju)
}

// 유료 결과: Gemini 호출 (로그인 + 결제 후)
const SYSTEM_PROMPT = `당신은 사주명리학을 기반으로 연애 상담을 전문으로 하는 상담가입니다.
오행의 상생·상극, 각 기운의 성질을 활용하여 두 사람의 관계와 재회 가능성을 분석해줍니다.

[글쓰기 원칙]
1. 말투는 반드시 모든 문장을 '-요' 체로 작성할 것. Do not '-다.'
2. 사주 기반임을 자연스럽게 드러내되 용어를 구분해서 사용할 것.
   - 설명 없이 사용 가능: 도화살, 역마살, 궁합, 인연, 운명, 음양
   - 뜻을 한 번 설명 후 사용: 오행(목·화·토·금·수의 다섯 가지 기운), 합(두 기운이 서로 당기는 관계), 충(두 기운이 서로 부딪히는 관계), 상생(서로 돕고 보완하는 관계), 상극(서로 부딪히고 긴장하는 관계), 일주(태어난 날의 핵심 기운), 대운(수년간 흐르는 큰 운의 흐름), 세운(올해의 운의 흐름)
3. 절대 사용 금지: 천간, 지지, 십성, 육합, 육충, 납음, 원국, 편인, 식신, 겁재, 관성, 재성, 인성, 비겁, 묘고, 공망
4. 공감 문장, 감정적 서두 사용 금지. 핵심 분석부터 바로 시작.
5. 줄글 형식, 마크다운·번호·소제목 금지. 문단 3개.
6. 섹션당 최소 500자, 권장 600~700자.
7. 희망적이되 과장 금지. "반드시 재회된다" 절대 금지.
8. 결과는 반드시 JSON 형식으로만 출력. 코드블록 금지.`

function buildUserPrompt(
  mePillarStr: string,
  partnerPillarStr: string,
  meGender: string,
  partnerGender: string,
  relation: string,
  partnerPersonality: string,
  dohasal: string,
  breakupDuration: string,
  breakupReason: string,
): string {
  const dur = breakupDuration || '미입력'
  const reason = breakupReason || '미입력'
  return `아래 두 사람의 사주 데이터를 바탕으로 재회 상담 분석을 작성해주세요.

[두 사람 사주 원국]
나(사용자): ${mePillarStr} / 성별: ${meGender}
상대방: ${partnerPillarStr} / 성별: ${partnerGender}

[자동 계산 변수]
- 두 사람 일주 관계: ${relation}
- 상대방 성격 특성: ${partnerPersonality}
- 상대 도화살 강도: ${dohasal}
- 이별한 기간: ${dur}
- 이별 사유: ${reason}

[AI가 직접 판단할 변수]
- 나/상대방 대운 특성, 세운 특성, 나의 현재 행동 방향
- 재회 가능성 점수(0~100%), 좋은 달 3~4개, 가장 좋은 달 1개, 피해야 할 달 2~3개(2025~2026년 기준)

[섹션 작성 지침]
섹션01-상대방속마음: 상대 성격(${partnerPersonality})과 현재 운 흐름 기반으로 감정 처리 방식 설명.
섹션02-새인연: 도화살(${dohasal}) 기반 솔직 서술.
섹션03-재회가능성: 관계 에너지(${relation}) 기반으로 설명. 점수 숫자 언급 금지.
섹션04-타이밍: 가장 좋은 달 중심 설명.
섹션05-접근법: 상대 성격 기반 마음 여는 방식.
섹션06-지속가능성: 초반/중반/장기 3구간 예측.
섹션07-행동지침설명: 현재 행동 방향 한 문단.
섹션08-총평: 전체 흐름 엮기.

아래 JSON만 출력. 코드블록 금지:
{"reunionProbability":0,"reunionLabel":"","reunionDesc":"","goodMonths":[],"badMonths":[],"neutralMonths":[],"bestMonth":"","doList":[],"dontList":[],"dohasal":"${dohasal}","sections":{"속마음":"","재회가능성설명":"","이별이유":"","타이밍설명":"","접근법":"","새인연":"","지속가능성":"","행동지침설명":"","총평":""},"verdict":"","verdictScore":0}`
}

export function buildPaidPrompts(formData: SajuFormData, meSaju: SajuPillar, partnerSaju: SajuPillar) {
  const dohasal = calcDohasal(partnerSaju)
  const relation = calcRelation(meSaju, partnerSaju)
  const partnerPersonality = calcPersonality(partnerSaju)

  const userPrompt = buildUserPrompt(
    pillarToStr(meSaju),
    pillarToStr(partnerSaju),
    formData.me.gender,
    formData.partner.gender,
    relation,
    partnerPersonality,
    dohasal,
    formData.breakupDuration,
    formData.breakupReason,
  )

  return { systemPrompt: SYSTEM_PROMPT, userPrompt }
}

export async function analyzePaid(
  formData: SajuFormData,
  meSaju: SajuPillar,
  partnerSaju: SajuPillar,
  paymentId?: string,
  freeResult?: import('@/types').FreeResult,
): Promise<PaidResult> {
  const { systemPrompt, userPrompt } = buildPaidPrompts(formData, meSaju, partnerSaju)

  const { data, error } = await supabase.functions.invoke('analyze-saju', {
    body: { meSaju, partnerSaju, systemPrompt, userPrompt, paymentId, formData, freeResult },
  })
  if (error) throw error
  return data as PaidResult
}
