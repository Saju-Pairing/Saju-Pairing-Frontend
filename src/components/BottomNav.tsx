import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 재회사주 탭: 홈("/") 경로일 때 활성화
  const isSaju = location.pathname === '/';

  // 2. 마이페이지 탭: 마이페이지, 결제내역, 사주보관 경로일 때 활성화 
  const myPagePaths = ['/mypage', '/payment-history', '/saju-storage'];
  const isMyPage = myPagePaths.includes(location.pathname);

  return (
    // 하단 탭바 래퍼 (항상 하단 고정, 뒤쪽 클릭 방지용 pointer-events 제어)
    <div className="fixed bottom-0 left-0 w-full z-40 flex justify-center pointer-events-none">
      <div className="w-full max-w-md bg-[#0a0812] border-t border-[rgba(180,140,255,0.08)] h-[84px] pointer-events-auto flex items-start justify-center pt-3 pb-safe gap-[34px]">

        {/* 재회사주 탭 */}
        <button onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1.5 cursor-pointer group w-[64px] transition-opacity ${isSaju ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
        >
          <svg
            width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke={isSaju ? "#f0eaf8" : "#c0bad0"}
            strokeWidth="2" strokeDasharray="3 3"
            className="group-hover:scale-110 transition-transform"
          >
            <rect x="3" y="3" width="18" height="18" rx="4" />
          </svg>
          <span className="text-[10px] font-bold text-[#f0eaf8]">재회사주</span>
        </button>

        {/* 마이페이지 탭 */}
        <button onClick={() => navigate('/mypage')}
          className={`flex flex-col items-center gap-1.5 cursor-pointer group w-[64px] transition-opacity ${isMyPage ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
        >
          <svg
            width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke={isSaju ? "#f0eaf8" : "#c0bad0"}
            strokeWidth="2" strokeDasharray="3 3"
            className="group-hover:scale-110 transition-transform"
          >
            <rect x="3" y="3" width="18" height="18" rx="4" />
          </svg>
          <span className="text-[10px] font-medium text-[#c0bad0]">마이페이지</span>
        </button>

      </div>
    </div>
  );
}