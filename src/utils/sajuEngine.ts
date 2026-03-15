import { getGapja, SIXTY_PILLARS } from '@fullstackfamily/manseryeok';
import type { RawSaju, RelationResult, FortuneFlow } from '../types/saju';import { CHAR_INFO, FIVE_ELEMENTS, RELATION_MAP, HANJA_TO_HANGUL } from '../constants/saju';

export const isPair = (arr: string[][], c1: string, c2: string) => arr.some(pair => (pair[0] === c1 && pair[1] === c2) || (pair[0] === c2 && pair[1] === c1));
export const isSamhap = (b1: string, b2: string) => isPair([['亥','卯'], ['卯','未'], ['亥','미'], ['寅','午'], ['午','戌'], ['寅','戌'], ['巳','酉'], ['酉','丑'], ['巳','丑'], ['申','子'], ['子','辰'], ['申','辰']], b1, b2);
export const isGwimun = (b1: string, b2: string) => isPair([['子','酉'], ['丑','午'], ['寅','未'], ['卯','申'], ['辰','亥'], ['巳','戌']], b1, b2);

export const getSengGeuk = (e1: string, e2: string) => {
  if (e1 === e2) return 'SAME';
  if ((e1==='목'&&e2==='화') || (e1==='화'&&e2==='토') || (e1==='토'&&e2==='금') || (e1==='금'&&e2==='수') || (e1==='수'&&e2==='목')) return 'SENG_1_TO_2'; 
  if ((e2==='목'&&e1==='화') || (e2==='화'&&e1==='토') || (e2==='토'&&e1==='금') || (e2==='금'&&e1==='수') || (e2==='수'&&e1==='목')) return 'SENG_2_TO_1'; 
  if ((e1==='목'&&e2==='토') || (e1==='토'&&e2==='수') || (e1==='수'&&e2==='화') || (e1==='화'&&e2==='금') || (e1==='금'&&e2==='목')) return 'GEUK_1_TO_2'; 
  return 'GEUK_2_TO_1'; 
};

export const getSipseong = (dayMaster: string | null | undefined, target: string | null | undefined) => {
  if (!dayMaster || !target) return '';
  const dmInfo = CHAR_INFO[dayMaster];
  const tgInfo = CHAR_INFO[target];
  if (!dmInfo || !tgInfo) return '';

  const diff = (FIVE_ELEMENTS.indexOf(tgInfo.e) - FIVE_ELEMENTS.indexOf(dmInfo.e) + 5) % 5;
  const sameP = dmInfo.p === tgInfo.p;
  if (diff === 0) return sameP ? '비견' : '겁재';
  if (diff === 1) return sameP ? '식신' : '상관';
  if (diff === 2) return sameP ? '편재' : '정재';
  if (diff === 3) return sameP ? '편관' : '정관';
  if (diff === 4) return sameP ? '편인' : '정인';
  return '';
};

export const getRelation = (meStr: string, ptStr: string): RelationResult => {
  const meStem = meStr.charAt(0); const meBranch = meStr.charAt(1);
  const ptStem = ptStr.charAt(0); const ptBranch = ptStr.charAt(1);

  const isStemHap = isPair(RELATION_MAP.STEM_HAP, meStem, ptStem);
  const isBranchHap = isPair(RELATION_MAP.BRANCH_HAP, meBranch, ptBranch);
  const isStemChung = isPair(RELATION_MAP.STEM_CHUNG, meStem, ptStem);
  const isBranchChung = isPair(RELATION_MAP.BRANCH_CHUNG, meBranch, ptBranch);
  const isBranchWonjin = isPair(RELATION_MAP.BRANCH_WONJIN, meBranch, ptBranch);
  
  const samhap = isSamhap(meBranch, ptBranch);
  const gwimun = isGwimun(meBranch, ptBranch);
  const sengGeuk = getSengGeuk(CHAR_INFO[meStem]?.e || '', CHAR_INFO[ptStem]?.e || '');

  let plusScore = 0;
  if (isStemHap && isBranchHap) plusScore = 40;
  else if (samhap) plusScore = 30;
  else if (isBranchHap) plusScore = 20;
  else if (isStemHap) plusScore = 15;
  else if (sengGeuk === 'SENG_1_TO_2' || sengGeuk === 'SENG_2_TO_1') plusScore = 10;
  else if (sengGeuk === 'SAME') plusScore = 5;

  let minusScore = 0;
  if (isStemChung && isBranchChung) minusScore = -40;
  else if (isBranchWonjin && gwimun) minusScore = -30;
  else if (isBranchWonjin) minusScore = -20;
  else if (gwimun || isBranchChung) minusScore = -15;
  else if (isStemChung) minusScore = -10;
  else if (sengGeuk === 'GEUK_1_TO_2' || sengGeuk === 'GEUK_2_TO_1') minusScore = -5;

  let finalScore = 60 + plusScore + minusScore;
  finalScore = Math.max(20, Math.min(100, finalScore));

  let hapTitle = '서로 알아가는 단계'; let hapDesc = '서서히 맞춰가며 정이 드는 평온한 관계';
  if (isStemHap && isBranchHap) { hapTitle = '천지합 (천생연분)'; hapDesc = '정신과 육체가 완벽히 끌리는 운명적 합'; } 
  else if (isBranchHap) { hapTitle = '지지육합 (본능적 끌림)'; hapDesc = '이성적인 판단보다 본능적으로 끌리는 속궁합'; }
  else if (samhap) { hapTitle = '삼합/반합 (강력한 시너지)'; hapDesc = '함께 있을 때 능력과 매력이 폭발하는 소울메이트'; }
  else if (isStemHap) { hapTitle = '천간합 (정신적 교감)'; hapDesc = '대화가 잘 통하고 가치관이 찰떡같이 맞는 관계'; } 
  else if (sengGeuk === 'SENG_1_TO_2') { hapTitle = '수호천사 (내가 퍼주는 사랑)'; hapDesc = '내가 무의식적으로 상대방을 챙기고 양보하게 됨'; }
  else if (sengGeuk === 'SENG_2_TO_1') { hapTitle = '안식처 (내가 받는 사랑)'; hapDesc = '상대방이 나를 귀여워하고 다정하게 품어주는 관계'; }
  else if (sengGeuk === 'SAME') { hapTitle = '비견겁재 (친구 같은 연인)'; hapDesc = '서로 코드가 잘 맞고 편안한 동지애가 넘침'; }

  let chungTitle = '큰 마찰 없음'; let chungDesc = '성향 차이만 잘 극복하면 안정적인 관계 유지 가능';
  if (isStemChung && isBranchChung) { chungTitle = '천지충 (강한 마찰)'; chungDesc = '가치관과 현실 모두 부딪히기 쉬워 깊은 배려 필요'; } 
  else if (isBranchWonjin && gwimun) { chungTitle = '원진·귀문 (애증의 굴레)'; chungDesc = '미치도록 끌리지만 사소한 일로 극도로 예민해지는 인연'; }
  else if (isBranchWonjin) { chungTitle = '원진살 (애증과 미련)'; chungDesc = '미워하면서도 왠지 모르게 쉽게 끊어내지 못하는 알쏭달쏭한 인연'; }
  else if (gwimun) { chungTitle = '귀문관살 (집착과 예민함)'; chungDesc = '묘하게 빠져들지만 한 번 싸우면 걷잡을 수 없는 감정선'; }
  else if (isBranchChung) { chungTitle = '지지충 (현실적 갈등)'; chungDesc = '환경이나 현실적인 문제로 인한 잦은 스트레스 주의'; } 
  else if (isStemChung) { chungTitle = '천간충 (의견 대립)'; chungDesc = '자존심 싸움이나 생각의 차이로 잦은 말다툼 주의'; } 
  else if (sengGeuk === 'GEUK_1_TO_2') { chungTitle = '주도권 쟁탈 (내가 리드)'; chungDesc = '무의식적으로 내가 상대를 통제하거나 이기려 할 수 있음'; }
  else if (sengGeuk === 'GEUK_2_TO_1') { chungTitle = '주도권 쟁탈 (상대가 리드)'; chungDesc = '상대방의 강한 페이스에 내가 휘말리거나 져주게 되는 관계'; }

  return { hapTitle, hapDesc, chungTitle, chungDesc, finalScore };
};

export const getScoreComment = (score: number, relation: RelationResult, meElements: Record<string, number>, ptElements: Record<string, number>): { title: string, desc: string } => {
  const getStrongest = (elements: Record<string, number>) => Object.entries(elements).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const meStrong = getStrongest(meElements);
  const ptStrong = getStrongest(ptElements);

  if (score >= 90) return { title: "하늘이 점지한 완벽한 조화", desc: `서로의 부족한 ${meStrong === ptStrong ? '기운을 극대화하는' : '기운을 채워주는'} 완벽한 합입니다. 운명적인 끌림이 매우 강합니다.` };
  if (score >= 70) {
    if (meStrong === '수' && ptStrong === '화') return { title: "수화기제(水火旣濟)의 인연", desc: "서로 다른 극과 극의 기운이 만나 절묘한 균형을 이룹니다. 갈등이 성장의 발판이 되는 관계입니다." };
    if (meStrong === '목' && ptStrong === '화') return { title: "목화통명(木火通明)의 인연", desc: "나의 에너지가 상대를 빛나게 해줍니다. 함께할수록 서로의 재능과 앞길이 밝아지는 궁합입니다." };
    if (meStrong === '금' && ptStrong === '수') return { title: "금생수(金生水)의 깊은 신뢰", desc: "말하지 않아도 통하는 깊은 신뢰가 있습니다. 정서적 지지력이 매우 강한 결합입니다." };
    return { title: "인연의 끈이 살아있는 관계", desc: `${relation.hapTitle}의 기운이 강하며, 서로의 오행이 조화롭게 섞여 현실적인 안정을 가져다줍니다.` };
  }
  if (score >= 50) return { title: "서서히 스며드는 일상의 인연", desc: "불꽃 같은 열정보다는 은은한 온기 같은 관계입니다. 시간이 지날수록 서로의 소중함을 깨닫게 됩니다." };
  if (score >= 30) {
    if (meStrong === ptStrong) return { title: "비슷해서 더 부딪히는 관계", desc: `둘 다 ${meStrong}의 기운이 강해 고집을 부리면 평행선을 달릴 수 있습니다. 양보가 필수적입니다.` };
    return { title: "조심스러운 이해가 필요한 인연", desc: `${relation.chungTitle}의 영향으로 소통 방식의 차이가 있습니다. '다름'을 '틀림'으로 보지 않는 연습이 필요합니다.` };
  }
  return { title: "난이도 높은 애증의 관계", desc: "기운의 충돌이 강해 서로에게 상처를 주기 쉽습니다. 인연을 이어가기 위해서는 뼈를 깎는 이해와 인내가 요구됩니다." };
};

export const getElements = (saju: RawSaju, isUnknown: boolean) => {
  const stats = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const chars = [
    saju.yearPillarHanja?.charAt(0), saju.yearPillarHanja?.charAt(1), 
    saju.monthPillarHanja?.charAt(0), saju.monthPillarHanja?.charAt(1), 
    saju.dayPillarHanja?.charAt(0), saju.dayPillarHanja?.charAt(1), 
    ...(isUnknown ? [] : [saju.hourPillarHanja?.charAt(0), saju.hourPillarHanja?.charAt(1)])
  ].filter(Boolean) as string[];
  chars.forEach(c => { if (CHAR_INFO[c]) stats[CHAR_INFO[c].e as keyof typeof stats]++; });
  return { stats, total: chars.length };
};

export const getFortuneFlow = (birthYear: number, birthDay: number, gender: 'F'|'M', yearHanja: string, monthHanja: string): FortuneFlow => {
  const today = new Date(); const currentYear = today.getFullYear(); const currentMonth = today.getMonth() + 1;
  const currentGapja = getGapja(currentYear, currentMonth, today.getDate());
  const isYangYear = ['甲', '丙', '戊', '庚', '壬'].includes(yearHanja.charAt(0));
  const isForward = (gender === 'M' && isYangYear) || (gender === 'F' && !isYangYear);
  const monthIdx = SIXTY_PILLARS.findIndex(p => p.combined.hanja === monthHanja);
  const daeunNum = (birthDay % 9) + 1; 
  const step = Math.floor((currentYear - birthYear + 1 < daeunNum ? 0 : (currentYear - birthYear + 1 - daeunNum) / 10) + 1);
  let currentDaeunIdx = (monthIdx + ((isForward ? 1 : -1) * step)) % 60;
  if (currentDaeunIdx < 0) currentDaeunIdx += 60;
  const startAge = daeunNum + (step - 1) * 10;
  return { 
    daeUnPillar: SIXTY_PILLARS[currentDaeunIdx]?.combined.hanja || '??', 
    daeUnAge: `${startAge}~${startAge + 9}세`, 
    seUnPillar: currentGapja.yearPillarHanja || '??', 
    seUnYear: `${currentYear}년`, 
    wolUnPillar: currentGapja.monthPillarHanja || '??', 
    wolUnMonth: `${currentMonth}월` 
  };
};

export const formatPillar = (pillar: string) => {
  if (!pillar || pillar === '??') return '??';
  const hangul = (HANJA_TO_HANGUL[pillar.charAt(0)] || '') + (HANJA_TO_HANGUL[pillar.charAt(1)] || '');
  return `${hangul}(${pillar})`;
};

// 🌟 서버 전송용 JSON 빌더 함수
export const buildServerPayload = (
  rawSaju: RawSaju, 
  elements: { stats: Record<string, number>; total: number }, 
  fortune: FortuneFlow, 
  isUnknown: boolean
) => {
  const dm = rawSaju.dayPillarHanja?.charAt(0) || '甲';
  const split = (str: string | null | undefined) => (!str || str === '??') ? { 천간: "?", 지지: "?" } : { 천간: str.charAt(0), 지지: str.charAt(1) };
  
  return {
    원국: { 
      년주: split(rawSaju.yearPillarHanja), 
      월주: split(rawSaju.monthPillarHanja), 
      일주: split(rawSaju.dayPillarHanja), 
      시주: isUnknown ? { 천간: "?", 지지: "?" } : split(rawSaju.hourPillarHanja) 
    },
    오행통계: elements.stats,
    현재대운: { 
      천간: fortune.daeUnPillar.charAt(0), 
      지지: fortune.daeUnPillar.charAt(1), 
      시작나이: Number(fortune.daeUnAge.match(/(\d+)~/)?.[1] || 0), 
      끝나이: Number(fortune.daeUnAge.match(/~(\d+)세/)?.[1] || 0) 
    },
    현재세운: { 
      천간: fortune.seUnPillar.charAt(0), 
      지지: fortune.seUnPillar.charAt(1), 
      년도: Number(fortune.seUnYear.replace(/[^0-9]/g, '')) 
    },
    현재월운: { 
      천간: fortune.wolUnPillar.charAt(0), 
      지지: fortune.wolUnPillar.charAt(1), 
      월: Number(fortune.wolUnMonth.replace(/[^0-9]/g, '')) 
    },
    십성: { 
      대운십성: getSipseong(dm, fortune.daeUnPillar.charAt(0)), 
      세운십성: getSipseong(dm, fortune.seUnPillar.charAt(0)) 
    }
  };
};