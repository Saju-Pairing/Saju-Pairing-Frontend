import React, { useState, useEffect } from 'react';

interface Props {
  isLoggedIn: boolean;
  userName?: string;
  onLoginClick: () => void;
}

export default function TopBar({ isLoggedIn, userName, onLoginClick }: Props) {
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
      <div className="w-full bg-[#07060c]/80 backdrop-blur-md border-b border-[rgba(180,140,255,0.08)]">
        <div className="max-w-md mx-auto flex items-center justify-between px-6 py-4">
          
          {/* (Noto Serif KR, 14px, SemiBold, Line-height 18.9px) */}
          <div className="cursor-pointer font-['Noto_Serif_KR'] text-[14px] font-semibold leading-[18.9px] tracking-tight">
            <span className="text-[#f0eaf8]">사주</span>
            <span className="text-[#c084fc]">페어링</span>
          </div>
          
          {/* 로그인 여부에 따라 UI 변경 */}
          {isLoggedIn ? (
            <div className="text-[13px] font-bold text-[#f472b6]">
              {userName || '사용자'}님
            </div>
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