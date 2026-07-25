import type { PaidResult, SajuFormData, SajuPillar } from '../types/saju'
import { calcSajuPillar, calcPersonality, calcDohasal, calcRelation, calcFreeResult, pillarToStr } from './saju'
import { supabase } from './supabase'

// 무료 결과: 로컬 계산 (Gemini 호출 없음)
export function buildFreeResult(formData: SajuFormData) {
  const meSaju = calcSajuPillar(formData.me.birth, formData.me.time, !formData.me.time)
  const partnerSaju = calcSajuPillar(formData.partner.birth, formData.partner.time, !formData.partner.time)
  return calcFreeResult(meSaju, partnerSaju)
}

// 기준 날짜 다음 달부터 12개월치 "YYYY년 M월" 목록 생성
function getAllowedMonths(): string[] {
  const now = new Date()
  const months: string[] = []
  for (let i = 1; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    months.push(`${d.getFullYear()}년 ${d.getMonth() + 1}월`)
  }
  return months
}

// 기준 날짜(Today)를 'YYYY년 M월 D일' 한국어 형식으로 생성
function getTodayKoreanStr(): string {
  const now = new Date()
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`
}

// 유료 결과: Gemini 호출 (로그인 + 결제 후)
const SYSTEM_PROMPT = `당신은 사주명리학을 기반으로 연애 상담을 전문으로 하는 상담가입니다.
오행의 상생·상극, 각 기운의 성질을 활용하여 두 사람의 관계와 재회 가능성을 분석해줍니다.

[글쓰기 원칙]
1. 모든 문장은 '-요' 체로 작성 ('-다' 체 금지).
2. 용어 규칙:
   - 설명 없이 사용: 도화살, 역마살, 궁합, 인연, 운명, 음양
   - 최초 1회 뜻 풀이 후 사용: 오행(목·화·토·금·수 다섯 기운), 합(서로 당기는 관계), 충(서로 부딪히는 관계), 상생(돕고 보완하는 관계), 상극(부딪히고 긴장하는 관계), 일주(태어난 날의 핵심 기운), 대운(수년간 흐르는 운의 흐름), 세운(올해의 운의 흐름)
   - 금지: 천간, 지지, 십성, 육합, 육충, 납음, 원국, 편인, 식신, 겁재, 관성, 재성, 인성, 비겁, 묘고, 공망
3. 공감 표현·감정적 서두 없이 핵심 분석부터 바로 시작.
4. 줄글 형식(마크다운·번호·소제목 금지), 문단 3개 구성.
5. [분량 원칙] 각 섹션은 유저 프롬프트에 지정된 필수 내용 요소를 빠짐없이 서술하되, 최소 7문장 이상·500자 이상을 반드시 지킬 것. 500자에 못 미치거나 7문장 미만이면 요소 중 일부가 빠졌다는 뜻이니 반드시 보완할 것.
6. 희망적이되 과장 금지. "반드시 재회된다" 표현 절대 금지.
7. goodMonths/badMonths/neutralMonths/bestMonth와 섹션04(타이밍)에서 언급하는 모든 달은 유저 프롬프트의 [기준 날짜] 다음 날부터 12개월 이내여야 하며, 기준 날짜 이전이거나 기준 날짜가 속한 달은 절대 언급하지 말 것.
8. 출력은 JSON만. 코드블록 금지.`

function buildUserPrompt(
  today: string,
  allowedMonths: string[],
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

[기준 날짜] ${today}
[선택 가능한 달 목록 - goodMonths/badMonths/neutralMonths/bestMonth 및 섹션04는 반드시 이 목록 안에서만 선택할 것]
${allowedMonths.join(', ')}

[두 사람 사주 원국]
나(사용자): ${mePillarStr} / 성별: ${meGender}
상대방: ${partnerPillarStr} / 성별: ${partnerGender}

[자동 계산 변수]
- 일주 관계: ${relation}
- 상대방 성격: ${partnerPersonality}
- 상대 도화살 강도: ${dohasal}
- 이별 기간: ${dur}
- 이별 사유: ${reason}

[AI 판단 변수]
- 나/상대방 대운·세운 특성, 나의 현재 행동 방향
- 재회 가능성 점수(0~100%)
- 좋은 달 3~4개, 가장 좋은 달 1개, 피해야 할 달 2~3개 → [기준 날짜] 이후 12개월 범위 내에서만 선정 (예: "2026년 9월" 형식으로 표기)

[섹션별 지침] (각 섹션 최소 7문장·500자, 이 조건 어기면 안 됨)
섹션01-상대방속마음: 상대 성격(${partnerPersonality})과 현재 운 흐름 기반 감정 처리 방식.
섹션02-새인연: 도화살(${dohasal}) 기반 솔직 서술.
섹션03-재회가능성: 관계 에너지(${relation}) 기반 설명(점수 숫자 언급 금지).
섹션04-타이밍: 가장 좋은 달 중심 설명. 언급하는 모든 달은 [기준 날짜] 이후 12개월 이내여야 함(과거 달 언급 금지).
섹션05-접근법: 상대 성격 기반 마음 여는 방식.
섹션06-지속가능성: 초반/중반/장기 3구간 예측.
섹션07-행동지침설명: 현재 행동 방향 한 문단(500자 이상 유지).
섹션08-총평: 전체 흐름 종합.

아래 JSON만 출력(코드블록 금지):
{"reunionProbability":0,"reunionLabel":"","reunionDesc":"","goodMonths":[],"badMonths":[],"neutralMonths":[],"bestMonth":"","doList":[],"dontList":[],"dohasal":"${dohasal}","sections":{"속마음":"","재회가능성설명":"","이별이유":"","타이밍설명":"","접근법":"","새인연":"","지속가능성":"","행동지침설명":"","총평":""},"verdict":"","verdictScore":0}`
}

export function buildPaidPrompts(formData: SajuFormData, meSaju: SajuPillar, partnerSaju: SajuPillar) {
  const dohasal = calcDohasal(partnerSaju)
  const relation = calcRelation(meSaju, partnerSaju)
  const partnerPersonality = calcPersonality(partnerSaju)
  const today = getTodayKoreanStr()
  const allowedMonths = getAllowedMonths()

  const userPrompt = buildUserPrompt(
    today,
    allowedMonths,
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
  freeResult?: object,
): Promise<PaidResult> {
  const { systemPrompt, userPrompt } = buildPaidPrompts(formData, meSaju, partnerSaju)

  const { data, error } = await supabase.functions.invoke('analyze-saju', {
    body: { meSaju, partnerSaju, systemPrompt, userPrompt, paymentId, formData, freeResult },
  })
  if (error) throw error
  return data as PaidResult
}