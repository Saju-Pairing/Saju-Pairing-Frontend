import { useState, useEffect } from 'react';
import crystalBall from '../assets/icon-crystal-ball.svg';

export default function LoadingScreen() {
  const [step, setStep] = useState(0);
  const steps = [
    "사주 원국 계산 중",
    "두 사람의 기운 비교 중",
    "재회 가능성 분석 중",
    "심층 리포트 작성 중"
  ];

  // 처음 화면에 뜰 때 스크롤을 맨 위로 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // 0.8초마다 다음 단계로 진행
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length ? prev + 1 : prev));
    }, 800);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    // 전체 화면 컨테이너: h-full과 justify-center로 요소를 수직 중앙에 배치
    <div className="h-[100dvh] bg-[#07060c] flex justify-center font-sans text-[#f0eaf8] relative overflow-x-hidden overflow-y-auto">
      
      {/* --- 배경 애니메이션 요소 --- */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] max-w-[400px] h-[60vw] max-h-[400px] bg-[#c084fc] rounded-full blur-[120px] opacity-15 pointer-events-none"></div>
      <div className="fixed bottom-[10%] right-[-10%] w-[50vw] max-w-[300px] h-[50vw] max-h-[300px] bg-[#f472b6] rounded-full blur-[130px] opacity-10 pointer-events-none"></div>
      
      {/* 밤하늘 별빛 레이어 */}
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
      <div className="w-full max-w-md flex flex-col relative z-10 animate-fade-in-up h-full">

        {/* 전체 콘텐츠를 시각적 중앙에 배치 (하단 바 여백 pb-20 고려) */}
        <div className="flex-1 flex flex-col items-center justify-center w-full pb-20">
          
          {/* 1. 중앙 수정구슬 일러스트 */}
          <div className="relative w-[140px] h-[140px] mb-[28px] flex items-center justify-center">
            <div className="absolute w-[140px] h-[140px] rounded-full border border-[rgba(180,140,255,0.08)]"></div>
            <div className="absolute w-[100px] h-[100px] rounded-full border border-[rgba(180,140,255,0.15)]"></div>
            <div className="absolute w-[60px] h-[60px] rounded-full bg-[#c084fc]/10 border border-[rgba(180,140,255,0.3)] shadow-[0_0_30px_rgba(192,132,252,0.2)]"></div>
            <img src={crystalBall} alt="" className="w-[38px] h-[38px] drop-shadow-[0_0_20px_rgba(192,132,252,0.8)] animate-bounce" style={{ animationDuration: '3s' }} />
          </div>

          {/* 2. 메인 타이틀 및 가이드 문구 */}
          <div className="text-center mb-[32px]">
            <h2 className="text-[22px] font-['Noto_Serif_KR'] font-bold text-[#f0eaf8] leading-snug tracking-tight mb-4">
              두 사람의 인연을<br />읽고 있어요
            </h2>
            <p className="text-[#9d8fba] text-[13px] break-keep">잠시만 기다려주세요.</p>
          </div>

          {/* 3. 단계별 로딩 상태 리스트 */}
          <div className="w-full max-w-[280px] space-y-3">
            {steps.map((text, i) => {
              const isPast = i < step;
              const isActive = i === step;
              
              let textColor = 'text-[#4a4068]';
              let dotColor = 'bg-[#4a4068]';
              let borderColor = 'border-[rgba(180,140,255,0.05)]';
              let bgColor = 'bg-[#141120]';

              if (isPast) {
                textColor = 'text-[#c084fc]';
                dotColor = 'bg-[#c084fc] shadow-[0_0_8px_#c084fc]';
                borderColor = 'border-[rgba(180,140,255,0.2)]';
              } else if (isActive) {
                textColor = 'text-[#f472b6]';
                dotColor = 'bg-[#f472b6] shadow-[0_0_8px_#f472b6]';
                borderColor = 'border-[#f472b6]/30';
                bgColor = 'bg-[#f472b6]/[0.03]';
              }

              // 모든 단계 완료 시 스타일 유지
              if (step >= steps.length) {
                textColor = 'text-[#c084fc]';
                dotColor = 'bg-[#c084fc] shadow-[0_0_8px_#c084fc]';
                borderColor = 'border-[rgba(180,140,255,0.2)]';
                bgColor = 'bg-[#141120]';
              }

              return (
                <div 
                  key={i} 
                  className={`flex items-center gap-4 px-5 py-4 rounded-[1.2rem] border ${borderColor} ${bgColor} transition-all duration-700`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${dotColor}`} />
                  <span className={`text-[13px] font-medium tracking-tight transition-all duration-500 ${textColor}`}>
                    {text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}