import { calculateSaju, calculateSajuSimple } from '@fullstackfamily/manseryeok'
import type { BirthTime, SajuPillar } from '@/types'

const ILGAN_MAP: Record<string, string> = {
  갑: '목(木) 기운 — 성장과 전진을 추구하며 직선적이고 이상이 높아요',
  을: '목(木) 기운 — 유연하고 섬세하며 감수성이 풍부해요',
  병: '화(火) 기운 — 열정적이고 표현력이 강하며 사교적이에요',
  정: '화(火) 기운 — 따뜻하고 감정이 깊으며 배려심이 많아요',
  무: '토(土) 기운 — 안정을 중시하고 현실적이며 묵직해요',
  기: '토(土) 기운 — 신중하고 실용적이며 내면이 단단해요',
  경: '금(金) 기운 — 원칙적이고 냉철하며 자존심이 강해요',
  신: '금(金) 기운 — 섬세하고 완벽주의적이며 감각이 예민해요',
  임: '수(水) 기운 — 지혜롭고 적응력이 강하며 감성이 풍부해요',
  계: '수(水) 기운 — 내성적이고 깊이 생각하며 감정 기복이 있어요',
}

const DHS_STRONG = ['자', '오', '묘', '유']
const DHS_WEAK = ['인', '사', '신', '해']

const HAP_PAIRS = [['자','축'],['인','해'],['묘','술'],['진','유'],['사','신'],['오','미']]
const CHUNG_PAIRS = [['자','오'],['축','미'],['인','신'],['묘','유'],['진','술'],['사','해']]

export function calcPersonality(pillar: SajuPillar): string {
  const ch = pillar.day.eumyang[0] ?? ''
  return ILGAN_MAP[ch] ?? ch + ' 일간'
}

export function calcDohasal(pillar: SajuPillar): string {
  const b = pillar.day.eumyang[1] ?? ''
  if (DHS_STRONG.includes(b)) return '강함'
  if (DHS_WEAK.includes(b)) return '약함'
  return '없음'
}

export function calcRelation(me: SajuPillar, partner: SajuPillar): string {
  const m = me.day.eumyang[1] ?? ''
  const p = partner.day.eumyang[1] ?? ''
  if (HAP_PAIRS.some(pair => pair.includes(m) && pair.includes(p) && m !== p))
    return '서로 끌어당기는 합(合)의 에너지'
  if (CHUNG_PAIRS.some(pair => pair.includes(m) && pair.includes(p) && m !== p))
    return '강한 마찰의 충(沖) 에너지'
  return '독립적으로 공존하는 에너지'
}

export function calcFreeResult(
  meSaju: SajuPillar,
  partnerSaju: SajuPillar,
): import('@/types').FreeResult {
  const relation = calcRelation(meSaju, partnerSaju)
  const dohasal = calcDohasal(partnerSaju)

  const isHap = relation.includes('합')
  const isChung = relation.includes('충')

  const hamScore = isHap ? 80 : isChung ? 20 : 50
  const chungScore = isChung ? 75 : isHap ? 15 : 40

  // 궁합 점수: 합/충/도화살 기반 계산
  let compatibility = isHap ? 78 : isChung ? 42 : 60
  if (dohasal === '강함') compatibility = Math.min(compatibility + 8, 99)
  if (dohasal === '약함') compatibility = Math.min(compatibility + 3, 99)

  const compatibilityLabel =
    compatibility >= 75 ? '좋은 궁합' :
    compatibility >= 55 ? '보통 궁합' : '어려운 궁합'

  const hamDesc = isHap
    ? '두 사람의 일주가 합(合)의 관계로, 서로 끌어당기는 강한 인연의 기운이 있어요.'
    : '두 사람 사이에 합(合)의 기운은 약한 편이에요.'

  const chungDesc = isChung
    ? '두 사람의 일주가 충(沖)의 관계로, 강한 마찰과 긴장감이 존재해요.'
    : '두 사람 사이에 충(沖)의 기운은 크지 않아요.'

  const ohScore = dohasal === '강함' ? 85 : dohasal === '약함' ? 50 : 10
  const ohLabel =
    dohasal === '강함' ? '도화살 강함 — 매력이 넘치는 상대예요' :
    dohasal === '약함' ? '도화살 약함 — 은은한 매력이 있어요' :
    '도화살 없음'

  const summary =
    `두 분의 사주를 바탕으로 기본 궁합을 분석했어요. ` +
    `${compatibilityLabel}이며, ${relation}가 나타나고 있어요. ` +
    `상대방의 도화살은 ${ohLabel}.`

  const upsellHook =
    '재회 가능성, 좋은 달, 상대방 속마음까지 — AI 정밀 분석으로 확인해보세요.'

  return {
    meSaju,
    partnerSaju,
    compatibility,
    compatibilityLabel,
    hamScore,
    chungScore,
    hamDesc,
    chungDesc,
    ohScore,
    ohLabel,
    summary,
    upsellHook,
  }
}

export function pillarToStr(p: SajuPillar): string {
  return [
    '년주(' + p.year.eumyang + ')',
    '월주(' + p.month.eumyang + ')',
    '일주(' + p.day.eumyang + ')',
    p.hour ? '시주(' + p.hour.eumyang + ')' : '',
  ].filter(Boolean).join(' ')
}

// 시시(時時) 한국어 → 시간 매핑
const BIRTH_TIME_TO_HOUR: Record<string, number> = {
  자시: 0,
  축시: 2,
  인시: 4,
  묘시: 6,
  진시: 8,
  사시: 10,
  오시: 12,
  미시: 14,
  신시: 16,
  유시: 18,
  술시: 20,
  해시: 22,
}

export function calcSajuPillar(birth: string, time: BirthTime): SajuPillar {
  const d = new Date(birth)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()

  const hour = time ? BIRTH_TIME_TO_HOUR[time] : undefined

  try {
    let result
    if (hour !== undefined) {
      // 서울 기준(경도 127) 진태양시 적용
      result = calculateSaju(year, month, day, hour, 0, {
        longitude: 127,
        applyTimeCorrection: true,
      })
    } else {
      result = calculateSajuSimple(year, month, day)
    }

    return {
      year: {
        hanja: result.yearPillarHanja,
        eumyang: result.yearPillar,
      },
      month: {
        hanja: result.monthPillarHanja,
        eumyang: result.monthPillar,
      },
      day: {
        hanja: result.dayPillarHanja,
        eumyang: result.dayPillar,
      },
      hour:
        hour !== undefined && result.hourPillar
          ? {
              hanja: result.hourPillarHanja ?? result.hourPillar,
              eumyang: result.hourPillar,
            }
          : null,
    }
  } catch {
    // 범위 밖 날짜 등 오류 시 fallback
    return {
      year: { hanja: '?', eumyang: '?' },
      month: { hanja: '?', eumyang: '?' },
      day: { hanja: '?', eumyang: '?' },
      hour: null,
    }
  }
}
