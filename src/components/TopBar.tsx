import React, { useState, useEffect } from 'react';

interface Props {
  isLoggedIn: boolean;
  userName?: string;
  onLoginClick: () => void;
  onLogoutClick?: () => void; // 👈 로그아웃 클릭 함수 추가
}

export default function TopBar({ isLoggedIn, onLoginClick, onLogoutClick }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤 방향 감지 로직
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div 
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* 반투명 블랙 배경 + 블러 효과 */}
      <div className="w-full h-[54px] bg-[#07060c]/80 backdrop-blur-md border-b border-[rgba(180,140,255,0.08)] flex items-center">
        <div className="max-w-md w-full mx-auto flex items-center justify-between px-6">
          
          {/* 로고 영역 */}
          <div className="cursor-pointer font-['Noto_Serif_KR'] text-[14px] font-semibold leading-[18.9px] tracking-tight">
            <span className="text-[#f0eaf8]">사주</span>
            <span className="text-[#c084fc]">페어링</span>
          </div>
          
          {/* 로그인 여부에 따라 UI 변경 */}
          {isLoggedIn ? (
            <button 
              onClick={onLogoutClick}
              className="
                flex flex-col justify-center items-center
                px-3 py-1
                text-[12.5px] font-light leading-[19.38px]
                font-['Noto_Sans_KR'] 
                text-[#9d8fba] text-center
                bg-[#141120] border border-[rgba(180,140,255,0.15)]
                rounded-full 
                hover:bg-[rgba(180,140,255,0.1)] 
                transition-colors
              "
            >
              로그아웃
            </button>
          ) : (
            <button 
              onClick={onLoginClick}
              className="
                flex flex-col justify-center items-center
                px-3 py-1
                text-[12.5px] font-light leading-[19.38px]
                font-['Noto_Sans_KR'] 
                text-[#C084FC] text-center
                bg-[#141120] border border-[rgba(180,140,255,0.15)]
                rounded-full 
                hover:bg-[rgba(180,140,255,0.1)] 
                transition-colors
              "
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </div>
  );
}