import { useEffect } from 'react'; 
import crystalBall from '../assets/icon-crystal-ball.svg';

export default function LoginScreen() {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY; 
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI; 
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  // 스크롤을 맨 위로 초기화
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="h-[100dvh] bg-[#07060c] flex justify-center font-sans text-[#f0eaf8] relative overflow-x-hidden overflow-y-auto">
      
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
      <div className="w-full max-w-md flex flex-col relative z-10 animate-fade-in-up h-full">

        {/* 전체를 화면 중앙에 정렬 */}
        <div className="flex-1 flex flex-col items-center justify-center w-full pb-[84px]">
          
          {/* 1. 상단 일러스트 (아래 텍스트와 28px 간격) */}
          <div className="relative w-[100px] h-[100px] flex items-center justify-center mb-[28px]">
            <div className="absolute w-[100px] h-[100px] rounded-full border border-[rgba(180,140,255,0.15)] animate-[spin_12s_linear_infinite]">
              <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-[#c084fc] shadow-[0_0_10px_#c084fc]"></div>
            </div>
            <div className="absolute w-[72px] h-[72px] rounded-full border border-[rgba(180,140,255,0.25)]"></div>
            <div className="absolute w-[62px] h-[62px] rounded-full bg-gradient-to-b from-[#1d162d] to-[#0a0812] shadow-[0_0_50px_rgba(192,132,252,0.3)] flex items-center justify-center">
              <img src={crystalBall} alt="" className="w-[38px] h-[38px] drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]" />
            </div>
          </div>

          {/* 2. 중앙 텍스트 (화면의 진짜 중심) */}
          <div className="text-center">
            <h1 className="text-[26px] font-['Noto_Serif_KR'] font-bold leading-snug tracking-tight mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f472b6] to-[#c084fc]">다시 시작하고 싶은</span><br />
              <span className="text-[#f0eaf8]">당신을 위해</span>
            </h1>
            <p className="text-[#9d8fba] text-[12px] font-light leading-[1.8] break-keep">
              두 사람의 재회 가능성,<br />
              최적의 타이밍, 접근법을 분석해드려요.
            </p>
          </div>

          {/* 3. 하단 카카오 버튼 영역 (위 텍스트와 28px 간격) */}
          <div className="w-full px-[20px] mt-[28px] relative flex flex-col items-center">
            <button 
              onClick={handleKakaoLogin}
              className="w-full h-[52px] flex items-center justify-center gap-2.5 bg-[#FEE500] hover:bg-[#e6cf00] text-[#000000] font-black rounded-[1rem] transition-transform hover:scale-[1.02] shadow-[0_4px_14px_rgba(254,229,0,0.15)]"
            >
              <span className="text-lg">💬</span>
              <span className="text-[15px]">카카오로 5초만에 시작</span>
            </button>

            {/* 약관 안내 텍스트 */}
            <div className="absolute top-[calc(100%+16px)] text-[11px] text-[#4a4068]">
              로그인 시 <a href="#" className="underline decoration-[#4a4068] hover:text-[#9d8fba]">개인정보처리방침</a> 및 <a href="#" className="underline decoration-[#4a4068] hover:text-[#9d8fba]">이용약관</a>에 동의합니다
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}