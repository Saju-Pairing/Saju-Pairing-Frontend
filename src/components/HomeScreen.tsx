import React from 'react';
import taijiIcon from '../assets/icon-taiji.svg';

interface Props {
  onStart: () => void;
}

// 💡 첫 문단(선명)과 나머지 문단(블러)을 나눠서 받을 수 있도록 Props 수정
interface LandingCardProps {
  num: string;
  category: string;
  icon: string;
  title: string;
  visibleContent?: React.ReactNode;
  blurredContent?: React.ReactNode;
}

const LandingCard = ({ num, category, icon, title, visibleContent, blurredContent }: LandingCardProps) => (
  <div className="w-full bg-[#141120] rounded-[1.5rem] border border-[rgba(180,140,255,0.11)] overflow-hidden relative mb-6 shadow-lg text-left">
    {/* 카드 상단 타이틀 영역 */}
    <div className="p-5 border-b border-[rgba(180,140,255,0.05)] flex items-center gap-4">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#0f0d18] border border-[rgba(180,140,255,0.11)] text-[#f0eaf8] flex-shrink-0 shadow-inner">
        {icon}
      </div>
      <div>
        <div className="text-[#4A4068] font-['Noto_Sans_KR'] text-[9px] font-light tracking-[2px] mb-1">
          {num} · {category}
        </div>
        <div className="text-[#F0EAF8] font-['Noto_Serif_KR'] text-[14px] font-semibold leading-[18.9px]">
          {title}
        </div>
      </div>
    </div>
    
    {/* 카드 내용 영역 */}
    <div className="p-6">
      {/* 선명하게 보여줄 첫 번째 문단 */}
      {visibleContent && (
        <div className="text-[#C0BAD0] font-['Noto_Sans_KR'] text-[13.5px] font-light leading-[27.68px] break-keep mb-6">
          {visibleContent}
        </div>
      )}
      
      {/* 💡 자물쇠 없이 텍스트 자체만 블러 처리 적용 */}
      {blurredContent && (
        <div className="text-[#C0BAD0] font-['Noto_Sans_KR'] text-[13.5px] font-light leading-[27.68px] break-keep space-y-4 blur-[6px] opacity-40 select-none pointer-events-none">
          {blurredContent}
        </div>
      )}
    </div>
  </div>
);

export default function HomeScreen({ onStart }: Props) {
  return (
    <div className="min-h-[100dvh] bg-[#07060c] font-sans text-[#f0eaf8] relative overflow-x-hidden pt-[70px] pb-[84px]">
      
      {/* --- 배경 애니메이션 요소 --- */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] max-w-[400px] h-[60vw] max-h-[400px] bg-[#c084fc] rounded-full blur-[120px] opacity-15 pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-[50vw] max-w-[300px] h-[50vw] max-h-[300px] bg-[#f472b6] rounded-full blur-[130px] opacity-10 pointer-events-none"></div>
      <div className="fixed inset-0 pointer-events-none opacity-60">
        <div className="absolute top-[12%] left-[22%] w-[2px] h-[2px] bg-white rounded-full opacity-30"></div>
        <div className="absolute top-[25%] left-[15%] w-[1px] h-[1px] bg-white rounded-full opacity-50"></div>
        <div className="absolute top-[18%] right-[25%] w-[3px] h-[3px] bg-white rounded-full opacity-20"></div>
        <div className="absolute top-[35%] right-[10%] w-[2px] h-[2px] bg-white rounded-full opacity-40"></div>
        <div className="absolute top-[48%] left-[8%] w-[2px] h-[2px] bg-white rounded-full opacity-20"></div>
        <div className="absolute top-[65%] right-[18%] w-[1px] h-[1px] bg-white rounded-full opacity-60"></div>
        <div className="absolute top-[80%] left-[25%] w-[3px] h-[3px] bg-white rounded-full opacity-20"></div>
        <div className="absolute bottom-[15%] right-[32%] w-[2px] h-[2px] bg-white rounded-full opacity-40"></div>
      </div>

      {/* --- 메인 콘텐츠 영역 --- */}
      <div className="w-full max-w-md mx-auto flex flex-col relative z-10 animate-fade-in-up px-5">

        {/* --- 히어로 섹션 --- */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-154px)] pb-10 pt-4">
          <div className="relative w-[100px] h-[100px] flex items-center justify-center mb-[28px]">
            <div className="absolute w-[100px] h-[100px] rounded-full border border-[rgba(180,140,255,0.15)] animate-[spin_12s_linear_infinite]">
              <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-[#c084fc] shadow-[0_0_10px_#c084fc]"></div>
            </div>
            <div className="absolute w-[72px] h-[72px] rounded-full border border-[rgba(180,140,255,0.25)]"></div>
            <div className="absolute w-[62px] h-[62px] rounded-full bg-gradient-to-b from-[#1d162d] to-[#0a0812] shadow-[0_0_50px_rgba(192,132,252,0.2)] flex items-center justify-center">
              <img src={taijiIcon} alt="" width={38} height={38} className="drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-[26px] font-['Noto_Serif_KR'] font-bold leading-snug tracking-tight mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#f472b6]">다시 시작하고 싶은</span><br />
              <span className="text-[#f0eaf8]">당신을 위해</span>
            </h1>
            <p className="text-[#9d8fba] text-[12px] font-light leading-[1.8] break-keep">
              두 사람의 재회 가능성,<br />
              최적의 타이밍, 접근법을 분석해드려요.
            </p>
          </div>

          <div className="w-full mt-[36px]">
            <button 
              onClick={onStart}
              className="w-full h-[54px] flex items-center justify-center gap-2 bg-[linear-gradient(135deg,#C084FC,#F472B6)] text-white font-bold rounded-[1.2rem] transition-transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(192,132,252,0.3)]"
            >
              <span className="text-[14px]">✦</span>
              <span className="text-[16px] font-black tracking-wide">재회사주 보러 가기</span>
            </button>
          </div>
        </div>

        {/* --- 랜딩 상세 소개 섹션 --- */}
        <div className="flex flex-col items-center mt-4">
          
          {/* Part 1 */}
          <div className="flex flex-col items-center mb-16 w-full">
            <div className="px-5 py-1.5 rounded-full border border-[rgba(180,140,255,0.2)] text-[#c084fc] text-[10px] font-bold tracking-[2px] mb-5 bg-[#141120] shadow-[0_0_10px_rgba(192,132,252,0.1)]">
              Part 1. 속마음
            </div>
            {/* 💡 요청하신 대표 텍스트 1 그라데이션 및 CSS 적용 */}
            <h2 className="text-center font-['Noto_Serif_KR'] text-[24px] font-bold leading-[34.8px] tracking-[-0.5px] text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#f472b6] mb-3">
              상대방의 감춰진 진심
            </h2>
            <p className="text-[#9d8fba] text-[12px] mb-8 text-center break-keep font-light leading-[1.6]">
              단순한 그리움인지, 아니면 정리가 끝난 냉정함인지<br/>사주로 읽어내는 상대의 현재 심리
            </p>

            <LandingCard 
              num="01" 
              category="상대방 속마음" 
              icon="💭" 
              title="지금 그 사람은 나를 어떻게 생각할까요"
              visibleContent={
                <p>지금 상대방은 겉으로는 아무렇지 않아 보일 수 있어요. 그런데 이 사람의 에너지 흐름을 보면, 내면에서는 꽤 많은 것들을 혼자 소화하고 있는 상태예요. 이 사람은 원래 감정 표현이 서툰 편이라, 마음에 뭔가가 남아 있어도 먼저 내색하지 않아요. 상처받았을 때 더 멀리 물러나는 방식으로 자신을 보호하는 타입이거든요.</p>
              }
              blurredContent={
                <>
                  <p>올해 이 사람에게 흐르는 기운은, 새로운 무언가를 향해 달려가기보다 지나온 시간을 돌아보게 만드는 흐름이에요. 이런 시기에는 예전 인연이나 기억들이 자연스럽게 떠오르거든요. 당신과의 기억도 그 안에 분명히 있을 거예요.</p>
                  <p>지금의 거리감을 "나한테 마음이 없다"고 받아들이지 않으셨으면 해요. 이 사람은 아직 정리 중이에요. 그 정리의 결론이 어디로 향할지는, 지금 당신이 어떻게 행동하느냐에도 달려 있어요.</p>
                </>
              }
            />

            <LandingCard 
              num="02" 
              category="새로운 인연 가능성" 
              icon="👁️" 
              title="상대방에게 새로운 사람이 생겼을까요"
              visibleContent={
                <p>지금 상대방의 에너지 흐름을 보면, 올해 새로운 이성을 끌어당기는 도화살 기운이 강하게 활성화된 시기는 아니에요. 새 인연이 열릴 때 나타나는 특유의 에너지가 지금 이 사람한테는 두드러지지 않거든요. 오히려 지금은 외부보다 자기 자신을 향해 에너지가 흐르는 시기예요.</p>
              }
              blurredContent={
                <>
                  <p>완전히 안심할 수는 없지만, 지금 당장 다른 누군가에게 마음이 가있을 가능성은 낮아요. 상대방이 아직 정리 중인 이 시간 안에 자연스럽게 연결이 되면, 그 흐름이 당신 쪽으로 기울 수 있어요.</p>
                  <p>다만 하반기로 넘어가면 상대방의 외부 인연운이 조금씩 열리기 시작해요. 상반기, 특히 7월 이전이 당신에게 훨씬 유리한 시간이에요. 지금 안심하되, 행동은 미루지 마세요.</p>
                </>
              }
            />
          </div>

          {/* Part 2 */}
          <div className="flex flex-col items-center mb-16 w-full">
            <div className="px-5 py-1.5 rounded-full border border-[#f472b6]/30 text-[#f472b6] text-[10px] font-bold tracking-[2px] mb-5 bg-[#141120] shadow-[0_0_10px_rgba(244,114,182,0.1)]">
              Part 2. 타이밍
            </div>
            {/* 💡 요청하신 대표 텍스트 2 그라데이션 및 CSS 적용 */}
            <h2 className="text-center font-['Noto_Serif_KR'] text-[24px] font-bold leading-[34.8px] tracking-[-0.5px] text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#f472b6] mb-3">
              운명의 골든타임
            </h2>
            <p className="text-[#9d8fba] text-[12px] mb-8 text-center break-keep font-light leading-[1.6]">
              연락하기 가장 좋은 시기와<br/>안좋은 시기를 파악하여 제공
            </p>

            <LandingCard
              num="03"
              category="재회 가능성"
              icon="🔮"
              title="두 사람이 다시 만날 확률은 얼마나 될까요"
              visibleContent={
                <>
                  {/* 🔮 원형 프로그래스바 + 설명 박스 */}
                  <div className="flex items-center gap-5 bg-[#0f0d18] p-4 rounded-2xl mb-6 border border-[rgba(180,140,255,0.08)]">
                    
                    {/* 원형 프로그래스바 */}
                    <div className="relative w-[60px] h-[60px] flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 84 84">
                        <circle
                          cx="42"
                          cy="42"
                          r="38"
                          stroke="rgba(192,132,252,0.15)"
                          strokeWidth="5"
                          fill="none"
                        />
                        <circle
                          cx="42"
                          cy="42"
                          r="38"
                          stroke="#c084fc"
                          strokeWidth="5"
                          fill="none"
                          strokeLinecap="round"
                          style={{
                            strokeDasharray: 238.76,
                            strokeDashoffset: 238.76 - (89 / 100) * 238.76,
                            transition: 'stroke-dashoffset 1.5s ease-out',
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#c084fc] text-center font-['Noto_Serif_KR'] text-[18px] font-black tracking-tighter">
                          89<span className="text-[10px] ml-0.5 font-sans">%</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="text-[#4A4068] font-['Noto_Sans_KR'] text-[9px] font-light tracking-[1px] leading-normal">
                        현재 재회 가능성
                      </div>
                      <div className="text-[#F0EAF8] font-['Noto_Sans_KR'] text-[12px] font-light leading-[19.2px] break-keep">
                        두 사람의 기운이 올해 안으로<br />
                        다시 교차하는 구간이 있어요.
                      </div>
                    </div>
                  </div>

                  <p className="text-[#C0BAD0] font-['Noto_Sans_KR'] text-[13.5px] font-light leading-[27.68px] break-keep">
                    두 사람 사이에는 기본적으로 서로를 끌어당기는 관계(합)의 에너지가 흐르고 있어요.
                    헤어졌다고 해서 그 에너지가 사라진 게 아니에요. 처음부터 끌렸던 이유,
                    함께 있을 때 편했던 기억들 — 이건 두 사람의 타고난 관계 구조에서 오고 있어요.
                  </p>
                </>
              }
              blurredContent={
                <>
                  <p>
                    지금 당신의 흐름은 인연을 끌어당기기 좋은 시기예요. 반면 상대방은 아직 결정을 내리기
                    어려운, 머뭇거리는 단계에 있어요. 지금 당신이 먼저 자연스럽게 다가간다면,
                    그 머뭇거림이 당신 쪽으로 기울 가능성이 있거든요.
                  </p>
                  <p>
                    올바른 타이밍에 올바른 방식으로 움직일 때 이 가능성이 현실이 돼요.
                    가만히 기다리기만 하면 기회가 지나갈 수 있어요.
                  </p>
                </>
              }
            />

            <LandingCard 
              num="04" 
              category="재회 최적 타이밍" 
              icon="📅" 
              title="언제 연락하는 게 가장 좋을까요"
              visibleContent={
                <>
                  <div className="grid grid-cols-5 gap-2 mb-6 justify-items-center">
                    <span className="inline-flex h-[33px] w-full items-center justify-center rounded-[30px] border border-[#c084fc]/[0.23] text-[#c084fc] text-[11px] font-bold tracking-wide">4월 ✓</span>
                    <span className="inline-flex h-[33px] w-full items-center justify-center rounded-[30px] border border-[#3a4460]/40 bg-[#3a4460]/30 text-[#9d8fba] text-[11px] tracking-wide">5월 ⚠️</span>
                    <span className="inline-flex h-[33px] w-full items-center justify-center rounded-[30px] border border-[#c084fc]/[0.23] text-[#c084fc] text-[11px] font-bold tracking-wide">6월 ✓</span>
                    <span className="inline-flex h-[33px] w-full items-center justify-center rounded-[30px] border border-[#f472b6]/[0.23] bg-[#f472b6]/[0.09] text-[#f472b6] text-[11px] font-bold tracking-wide">7월 🔥</span>
                    <span className="inline-flex h-[33px] w-full items-center justify-center rounded-[30px] border border-[#3a4460]/40 bg-[#3a4460]/30 text-[#9d8fba] text-[11px] tracking-wide">8월 ⚠️</span>
                    
                    <span className="inline-flex h-[33px] w-full items-center justify-center rounded-[30px] border border-[#c084fc]/[0.23] text-[#c084fc] text-[11px] font-bold tracking-wide">9월 ✓</span>
                    <span className="inline-flex h-[33px] w-full items-center justify-center rounded-[30px] border border-[#c084fc]/[0.23] text-[#c084fc] text-[11px] font-bold tracking-wide">10월 ✓</span>
                    <span className="inline-flex h-[33px] w-full items-center justify-center rounded-[30px] border border-[#c084fc]/[0.23] text-[#c084fc] text-[11px] font-bold tracking-wide">11월 ✓</span>
                    <span className="inline-flex h-[33px] w-full items-center justify-center rounded-[30px] border border-[#c084fc]/[0.23] text-[#c084fc] text-[11px] font-bold tracking-wide">12월 ✓</span>
                    <div className="w-full"></div> 
                  </div>
                  
                  <p>
                    <span className="text-[#f0eaf8] font-medium">7월이 올해 두 사람에게 가장 중요한 시기예요.</span> 이 달에는 두 사람의 기운이 자연스럽게 같은 방향을 향하는 구간이 생겨요. 이 시기에는 같은 말을 해도 훨씬 잘 전달되고, 상대방도 마음이 열리기 쉬운 상태예요.
                  </p>
                </>
              }
              blurredContent={
                <>
                  <p>4월과 10월, 11월도 두 사람의 흐름이 잘 맞는 달이에요. 이 시기에는 가벼운 연락이나 짧은 만남도 좋은 계기가 될 수 있어요. 부담 없이 시작하기에 좋은 때예요.</p>
                  <p>반면 5월과 8월은 두 사람의 기운이 서로 다른 방향을 향하는 시기예요. 이 두 달엔 중요한 연락이나 고백, 만남 시도는 잠시 미뤄두세요. 그 시간엔 자기 자신을 가꾸고 준비하는 시간으로 쓰면 돼요.</p>
                </>
              }
            />
          </div>

          {/* Part 3 */}
          <div className="flex flex-col items-center mb-16 w-full">
            <div className="px-5 py-1.5 rounded-full border border-[rgba(180,140,255,0.2)] text-[#7eb8f7] text-[10px] font-bold tracking-[2px] mb-5 bg-[#141120] shadow-[0_0_10px_rgba(126,184,247,0.1)]">
              Part 3. 솔루션
            </div>
            {/* 💡 요청하신 대표 텍스트 3 그라데이션 및 CSS 적용 */}
            <h2 className="text-center font-['Noto_Serif_KR'] text-[24px] font-bold leading-[34.8px] tracking-[-0.5px] text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#f472b6] mb-3">
              재회 시그널 대처법
            </h2>
            <p className="text-[#9d8fba] text-[12px] mb-8 text-center break-keep font-light leading-[1.6]">
              연락하기 가장 좋은 시기와<br/>안좋은 시기를 파악하여 제공
            </p>

            <LandingCard 
              num="05" 
              category="효과적인 접근법" 
              icon="💌" 
              title="어떻게 다가가야 마음이 열릴까요"
              visibleContent={
                <p>상대방은 감정적인 호소나 눈물보다 일상적이고 자연스러운 연결에 마음이 열리는 타입이에요. 이 사람은 원래 공간을 중요하게 여기는 성향이라, "보고싶다", "잊을 수가 없다"는 직접적인 감정 표현은 오히려 부담으로 느껴질 수 있어요.</p>
              }
              blurredContent={
                <>
                  <p>첫 연락은 가볍고 짧게 하는 게 좋아요. 함께 봤던 영화가 재개봉했다거나, 자주 가던 카페가 생각났다거나, 공통의 추억을 건드리는 소재가 가장 자연스럽게 대화의 문을 열어요.</p>
                  <p>가장 중요한 건 답장을 기다리는 여유예요. 이 사람은 자기 속도로 생각하고 반응하는 타입이에요. 여유를 보여주는 것 자체가 매력으로 작용해요. "나 아직 여기 있어, 근데 조급하지는 않아"라는 태도가 이 사람 마음을 가장 크게 움직일 거예요.</p>
                </>
              }
            />

            <LandingCard 
              num="06" 
              category="재회 후 지속 가능성" 
              icon="🌱" 
              title="다시 만나도 오래 갈 수 있을까요"
              visibleContent={
                <p>두 사람 사이에 흐르는 기본 기운을 보면, 이건 단순히 스쳐가는 인연이 아니에요. 서로에게 의미있는 영향을 주는 구조로 연결되어 있어요. 재회를 하게 된다면, 초반 3~6개월은 이전과 다른 안정감이 있을 거예요.</p>
              }
              blurredContent={
                <>
                  <p>그런데 1년 내외가 지나면, 당신의 확인 욕구와 상대방의 공간 필요 — 이게 다시 고개를 들 수 있어요. 이건 두 사람이 나쁜 게 아니라, 서로 부딪히고 긴장하는 관계(상극)에서 오는 구조적인 문제예요.</p>
                  <p>재회 전에 이 패턴에 대해 충분히 이야기를 나눠두는 것이 정말 중요해요. 재회 자체보다 "이번엔 어떻게 다르게 할 것인가"를 먼저 합의하는 것, 그게 이 관계를 오래 가게 만드는 가장 큰 열쇠예요.</p>
                </>
              }
            />

            <LandingCard 
              num="07" 
              category="지금 당장의 행동 지침" 
              icon="⚡" 
              title="해야 할 것과 절대 하면 안 될 것"
              visibleContent={
                <p>지금 당신의 기운은 먼저 움직이는 게 유리한 시기예요. 기다리기만 하면 기회가 지나갈 수 있어요. 단, 조급하게 굴면 역효과가 나요. 적극적이지만 여유 있는 태도가 핵심이에요.</p>
              }
              blurredContent={
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-[#0f0d18] p-4 rounded-xl border border-[rgba(180,140,255,0.08)]">
                    <div className="text-[#C084FC] font-['Noto_Sans_KR'] text-[10px] font-bold tracking-[1.5px] mb-2">
                      ✦ 지금 해야 할 것
                    </div>
                    <ul className="text-[11.5px] space-y-1.5 text-[#b0a8c4] list-none leading-relaxed">
                      <li>✓ 자연스러운 안부 연락 (짧고 가볍게)</li>
                      <li>✓ 공통의 추억을 소재로 한 대화 시도</li>
                      <li>✓ 답장을 기다리는 여유 갖기</li>
                      <li>✓ 나 자신을 가꾸고 성장하는 모습 보여주기</li>
                      <li>✓ 4월~7월 사이에 집중적으로 행동하기</li>
                    </ul>
                  </div>
                  <div className="bg-[#0f0d18] p-4 rounded-xl border border-[#f472b6]/20">
                    <div className="text-[#F472B6] font-['Noto_Sans_KR'] text-[10px] font-bold tracking-[1.5px] mb-2">
                      ✦ 절대 하면 안 될 것
                    </div>
                    <ul className="text-[11.5px] space-y-1.5 text-[#b0a8c4] list-none leading-relaxed">
                      <li>✗ 재회를 강요하거나 결론 재촉하기</li>
                      <li>✗ 과거의 잘못을 끄집어내며 따지기</li>
                      <li>✗ 읽씹에 연속 메시지 보내기</li>
                      <li>✗ 술 마신 상태에서 감정적 연락하기</li>
                      <li>✗ SNS로 현재 상태를 과시하며 어필하기</li>
                    </ul>
                  </div>
                </div>
              }
            />
          </div>

          {/* 종합 총평 배너 (이미지에 맞게 다른 카드들과 통일된 디자인으로 수정) */}
          <div className="w-full bg-[#141120] rounded-[1.5rem] border border-[rgba(180,140,255,0.11)] p-8 text-center relative overflow-hidden mb-12 shadow-lg">
            <div className="blur-[6px] opacity-40 select-none pointer-events-none flex flex-col items-center">
              <div className="text-[#f0eaf8] font-black mb-4 font-['Noto_Serif_KR'] text-[18px]">종합 총평</div>
              <p className="text-[#C0BAD0] font-['Noto_Sans_KR'] text-[13.5px] font-light leading-[27.68px] mb-6 break-keep">
                두 사람의 관계는 단순히 감정적인 미련으로만 이어진 인연이 아니에요. 가장 중요한 건 7월 이전, 4~7월 사이에 자연스럽고 가볍게 접근하는 거예요.
              </p>
              <div className="bg-[#0f0d18] border border-[rgba(180,140,255,0.11)] text-[#f472b6] font-bold text-[12px] py-2.5 px-5 rounded-full inline-block shadow-sm">
                재회해도 좋은 인연이에요 💜
              </div>
            </div>
          </div>

          {/* 가장 하단: 행동 유도(Call to Action) 버튼 */}
          <div className="w-full text-center mb-20 relative z-20">
            <div className="text-[11px] font-bold text-[#c084fc] mb-3 tracking-[2px]">지금 바로 확인하세요</div>
            <button 
              onClick={onStart}
              className="w-full h-[56px] flex items-center justify-center gap-2 bg-[linear-gradient(135deg,#C084FC,#F472B6)] text-white font-black rounded-[1.2rem] shadow-[0_4px_20px_rgba(192,132,252,0.3)] hover:scale-[1.02] transition-transform"
            >
              <span className="text-[16px] tracking-wide">우리, 다시 만날 수 있을까요?</span>
            </button>
          </div>

          {/* Footer (푸터) */}
          <div className="w-full border-t border-[rgba(180,140,255,0.08)] pt-8 pb-4 text-left">
            <div className="text-[#9d8fba] text-[10px] leading-[1.8] font-light mb-6">
              <strong className="font-bold text-[#b0a8c4]">사주페어링</strong><br/>
              대표자명: 김순천<br/>
              상호명: 모두모두상점<br/>
              사업자번호: 799-25-01441<br/>
              통신판매번호: 2023-경남김해-0823
            </div>
            <div className="text-[#9d8fba] text-[10px] leading-[1.8] font-light mb-6">
              <strong className="font-bold text-[#b0a8c4]">고객센터</strong><br/>
              이메일: 2019ootd@gmail.com<br/>
              사업자주소: 서울특별시 영등포구 국회대로 632, 11층 5호<br/>
              유선번호: 070-8098-9363<br/>
              전화상담은 제공하지 않습니다.<br/>
              설정 내 문의하기를 통해 문의해주세요.
            </div>
            <div className="text-center text-[#6b5e8a] text-[10px] underline decoration-[#6b5e8a] underline-offset-2">
              이용약관 및 개인정보처리방침
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}