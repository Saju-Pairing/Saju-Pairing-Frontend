import React, { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [step, setStep] = useState(0);
  // 💡 마지막 단계 텍스트도 스크린샷에 맞춰 "심층 리포트 작성 중"으로 수정했습니다.
  const steps = ["사주 원국 계산 중", "두 사람의 기운 비교 중", "재회 가능성 분석 중", "심층 리포트 작성 중"];

  useEffect(() => {
    // 1초마다 다음 단계로 넘어갑니다.
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length ? prev + 1 : prev));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-5 bg-[#07060c] animate-fade-in-up">
      
      {/* 🔮 중앙 수정구슬 및 신비로운 동심원 효과 */}
      <div className="relative w-[140px] h-[140px] mb-8 flex items-center justify-center">
        {/* 바깥쪽 궤도 */}
        <div className="absolute w-[140px] h-[140px] rounded-full border border-[rgba(180,140,255,0.08)]"></div>
        {/* 중간 궤도 */}
        <div className="absolute w-[100px] h-[100px] rounded-full border border-[rgba(180,140,255,0.15)]"></div>
        {/* 안쪽 궤도 (글로우) */}
        <div className="absolute w-[60px] h-[60px] rounded-full bg-[#c084fc]/10 border border-[rgba(180,140,255,0.3)] shadow-[0_0_30px_rgba(192,132,252,0.2)]"></div>
        
        {/* 수정구슬 (위아래 둥둥 + 빛남 효과) */}
        <div className="relative z-10 text-[52px] drop-shadow-[0_0_20px_rgba(192,132,252,0.8)] animate-bounce" style={{ animationDuration: '3s' }}>
          🔮
        </div>
      </div>

      <h2 className="text-[22px] font-['Noto_Serif_KR'] font-bold text-[#f0eaf8] mb-3 leading-snug tracking-tight">
        두 사람의 인연을<br />읽고 있어요
      </h2>
      <p className="text-[#9d8fba] text-[13px] mb-10">잠시만 기다려주세요.</p>

      {/* 📋 카드 형태의 단계별 체크리스트 */}
      <div className="w-full max-w-[280px] space-y-3 text-left">
        {steps.map((text, i) => {
          const isPast = i < step;    // 이미 지나간 단계 (보라색)
          const isActive = i === step; // 현재 진행 중인 단계 (핑크색)
          
          // 상태별 색상 지정
          let textColor = 'text-[#4a4068]';
          let dotColor = 'bg-[#4a4068]';
          let borderColor = 'border-[rgba(180,140,255,0.05)]';
          let bgColor = 'bg-[#141120]';

          if (isPast) {
            textColor = 'text-[#c084fc]';
            dotColor = 'bg-[#c084fc] shadow-[0_0_8px_#c084fc]';
            borderColor = 'border-[rgba(180,140,255,0.2)]';
          } else if (isActive) {
            textColor = 'text-[#f472b6]'; // 활성화 시 핑크색 포인트
            dotColor = 'bg-[#f472b6] shadow-[0_0_8px_#f472b6]';
            borderColor = 'border-[#f472b6]/30';
            bgColor = 'bg-[#f472b6]/[0.03]'; // 살짝 핑크빛 배경
          }

          // 모든 단계 완료 시 예외 처리 (모두 보라색으로)
          if (step >= steps.length && (isPast || isActive)) {
            textColor = 'text-[#c084fc]';
            dotColor = 'bg-[#c084fc] shadow-[0_0_8px_#c084fc]';
            borderColor = 'border-[rgba(180,140,255,0.2)]';
            bgColor = 'bg-[#141120]';
          }

          return (
            <div 
              key={i} 
              className={`flex items-center gap-4 px-5 py-4 rounded-[1rem] border ${borderColor} ${bgColor} transition-all duration-700`}
            >
              <div className={`w-2 h-2 rounded-full transition-all duration-500 ${dotColor}`} />
              <span className={`text-[13px] font-medium tracking-tight transition-all duration-500 ${textColor}`}>
                {text}
              </span>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}