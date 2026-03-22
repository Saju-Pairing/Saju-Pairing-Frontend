import React from 'react';

export default function LoginScreen() {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY; 
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI; 
  
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="min-h-screen bg-[#07060c] flex justify-center font-sans text-[#f0eaf8] relative overflow-hidden">
      
      {/* 🌌 배경 몽환적인 블러 효과 */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] max-w-[400px] h-[60vw] max-h-[400px] bg-[#c084fc] rounded-full blur-[120px] opacity-15 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[50vw] max-w-[300px] h-[50vw] max-h-[300px] bg-[#f472b6] rounded-full blur-[130px] opacity-10 pointer-events-none"></div>

      {/* ✨ 잔잔한 별빛(Stars) 배경 효과 */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-[12%] left-[22%] w-[2px] h-[2px] bg-white rounded-full opacity-30"></div>
        <div className="absolute top-[25%] left-[15%] w-[1px] h-[1px] bg-white rounded-full opacity-50"></div>
        <div className="absolute top-[18%] right-[25%] w-[3px] h-[3px] bg-white rounded-full opacity-20"></div>
        <div className="absolute top-[35%] right-[10%] w-[2px] h-[2px] bg-white rounded-full opacity-40"></div>
        <div className="absolute top-[48%] left-[8%] w-[2px] h-[2px] bg-white rounded-full opacity-20"></div>
        <div className="absolute top-[65%] right-[18%] w-[1px] h-[1px] bg-white rounded-full opacity-60"></div>
        <div className="absolute top-[80%] left-[25%] w-[3px] h-[3px] bg-white rounded-full opacity-20"></div>
        <div className="absolute bottom-[15%] right-[32%] w-[2px] h-[2px] bg-white rounded-full opacity-40"></div>
      </div>

      <div className="w-full max-w-md flex flex-col h-screen relative z-10 animate-fade-in-up">
        
        {/* 1️⃣ 상단바 (Top Bar) */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="text-xl font-black tracking-tighter">
            <span className="text-[#f0eaf8]">사주</span>
            <span className="text-[#c084fc]">페어링</span>
          </div>
          <button className="text-[12px] font-bold text-[#c0bad0] bg-[#141120] border border-[rgba(180,140,255,0.15)] px-4 py-1.5 rounded-full hover:bg-[rgba(180,140,255,0.1)] transition-colors">
            로그인
          </button>
        </div>

        {/* 2️⃣ 중앙 메인 컨텐츠 영역 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          
          {/* 🔮 중앙 일러스트 */}
          <div className="relative w-[140px] h-[140px] mb-10 flex items-center justify-center">
            
            {/* 💡 수정됨: 바깥쪽 궤도 (12초 주기로 무한 회전하는 애니메이션 적용) */}
            <div className="absolute w-[130px] h-[130px] rounded-full border border-[rgba(180,140,255,0.15)] animate-[spin_12s_linear_infinite]">
              {/* 궤도를 도는 보라색 행성(점) - 정가운데 위에 고정되어 같이 회전함 */}
              <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] rounded-full bg-[#c084fc] shadow-[0_0_10px_#c084fc]"></div>
            </div>
            
            {/* 안쪽 궤도 */}
            <div className="absolute w-[100px] h-[100px] rounded-full border border-[rgba(180,140,255,0.25)]"></div>
            
            {/* 어둡고 은은하게 빛나는 구체 */}
            <div className="absolute w-[86px] h-[86px] rounded-full bg-gradient-to-b from-[#1d162d] to-[#0a0812] shadow-[0_0_50px_rgba(192,132,252,0.3)]"></div>
            
            {/* 💡 수정됨: ☯️ 보라색 사각 박스는 애니메이션을 빼고 정중앙에 단단하게 고정! */}
            <div className="relative z-10 w-[42px] h-[42px] bg-[#9D7DF5] border-[2.5px] border-[#07060c] flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
              <svg viewBox="0 0 24 24" fill="white" className="w-[26px] h-[26px]">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm0-14a4 4 0 0 0 0 8 2 2 0 0 1 0 4 6 6 0 0 1 0-12zm0 6a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"/>
              </svg>
            </div>
            
          </div>

          {/* 메인 카피 */}
          <div className="text-center mb-12">
            <h1 className="text-[28px] font-['Noto_Serif_KR'] font-bold leading-snug tracking-tight mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f472b6] to-[#c084fc]">다시 시작하고 싶은</span><br />
              <span className="text-[#f0eaf8]">당신을 위해</span>
            </h1>
            <p className="text-[#9d8fba] text-[13px] font-light leading-[23.4px] break-keep">
              두 사람의 재회 가능성,<br />
              최적의 타이밍, 접근법을 분석해드려요.
            </p>
          </div>

          {/* 카카오 버튼 */}
          <button 
            onClick={handleKakaoLogin}
            className="w-full flex items-center justify-center gap-2.5 bg-[#FEE500] hover:bg-[#e6cf00] text-[#000000] font-black py-4 px-4 rounded-[1rem] transition-transform hover:scale-[1.02] shadow-[0_4px_14px_rgba(254,229,0,0.15)] mb-6"
          >
            <span className="text-lg">💬</span>
            <span className="text-[15px]">카카오로 5초만에 시작</span>
          </button>

          {/* 약관 동의 */}
          <div className="text-[11px] text-[#4a4068]">
            로그인 시 <a href="#" className="underline decoration-[#4a4068] hover:text-[#9d8fba]">개인정보처리방침</a> 및 <a href="#" className="underline decoration-[#4a4068] hover:text-[#9d8fba]">이용약관</a>에 동의합니다
          </div>
        </div>

        {/* 3️⃣ 하단 탭바 (Tab Bar) */}
        <div className="absolute bottom-0 w-full h-[84px] bg-[#0f0d18] border-t border-[rgba(180,140,255,0.08)] flex items-start justify-around pt-3 pb-safe z-20">
          <button className="flex flex-col items-center gap-1.5 flex-1 cursor-pointer group">
            <div className="text-xl opacity-100 group-hover:scale-110 transition-transform">🏠</div>
            <span className="text-[10px] font-bold text-[#c084fc]">재회사주</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 flex-1 cursor-pointer opacity-40 hover:opacity-100 transition-opacity group">
            <div className="text-xl group-hover:scale-110 transition-transform">👤</div>
            <span className="text-[10px] font-medium text-[#c0bad0]">마이페이지</span>
          </button>
        </div>

      </div>
    </div>
  );
}