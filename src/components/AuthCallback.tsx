import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // 본인의 경로에 맞게 수정 필요

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        console.log("✅ 로그인 성공! 환영합니다:", data.session.user.email);
        
        // ⭐️ 로컬 스토리지에서 원래 목적지 꺼내기 (없으면 홈으로)
        const returnPath = localStorage.getItem('returnPath') || '/';
        localStorage.removeItem('returnPath'); // 사용 후 삭제
        
        // 해당 주소로 이동 (뒤로가기 방지를 위해 replace 옵션 사용)
        navigate(returnPath, { replace: true }); 
      } else {
        console.log("❌ 세션이 없습니다. 로그인 실패.");
        navigate('/', { replace: true }); 
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-[#07060c] text-[#f0eaf8]">
      <div className="flex flex-col items-center gap-4">
        {/* 보라색 로딩 스피너 */}
        <div className="w-8 h-8 rounded-full border-2 border-[#c084fc] border-t-transparent animate-spin"></div>
        <p className="text-[15px] text-[#9d8fba] font-light">로그인 처리 중입니다...</p>
      </div>
    </div>
  );
}