import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import navLeftIcon from '../assets/icon-bottomnav-left.png';
import navRightIcon from '../assets/icon-bottomnav-right.png';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSaju = location.pathname === '/' || location.pathname.includes('saju');
  const isMyPage = location.pathname === '/mypage';

  return (
    // z-40 레이어 설정 및 뒤쪽 클릭 방지
    <div className="fixed bottom-0 left-0 w-full z-40 pointer-events-none flex justify-center">
      
      {/* 배경을 탑바처럼 화면 전체(w-full)로 덮도록 수정 */}
      <div className="w-full h-[60px] bg-[#0a0812] border-t border-[rgba(180,140,255,0.08)] pointer-events-auto">
        <div className="max-w-md w-full mx-auto h-full flex items-center justify-center pb-safe gap-[34px]">
          
          <button 
            onClick={() => navigate('/')}
            className={`flex flex-col items-center gap-1.5 cursor-pointer group w-[64px] transition-opacity ${isSaju ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
          >
            <img 
              src={navLeftIcon} 
              alt="재회사주" 
              className="w-[24px] h-[24px] object-contain group-hover:scale-110 transition-transform"
            />
            <span className={`text-[10px] transition-colors ${isSaju ? 'font-bold text-[#f0eaf8]' : 'font-medium text-[#c0bad0]'}`}>
              재회사주
            </span>
          </button>
          
          <button 
            onClick={() => navigate('/mypage')}
            className={`flex flex-col items-center gap-1.5 cursor-pointer group w-[64px] transition-opacity ${isMyPage ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
          >
            <img 
              src={navRightIcon} 
              alt="마이페이지" 
              className="w-[24px] h-[24px] object-contain group-hover:scale-110 transition-transform"
            />
            <span className={`text-[10px] transition-colors ${isMyPage ? 'font-bold text-[#f0eaf8]' : 'font-medium text-[#c0bad0]'}`}>
              마이페이지
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}