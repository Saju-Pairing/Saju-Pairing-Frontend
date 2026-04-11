import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // supabase 설정 파일 불러오기

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      // Supabase가 URL에 있는 인증 데이터를 알아서 처리
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        // 로그인 성공 시 결제 페이지로 이동
        navigate('/payment'); 
      } else {
        // 실패 또는 세션이 없으면 로그인 화면으로 이동
        navigate('/'); 
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-[#07060c] text-[#f0eaf8]">
      <div className="flex flex-col items-center gap-4">
        {/* 기존 테마에 맞춘 보라색 로딩 스피너 */}
        <div className="w-8 h-8 rounded-full border-2 border-[#c084fc] border-t-transparent animate-spin"></div>
        <p className="text-[15px] text-[#9d8fba] font-light">로그인 처리 중입니다...</p>
      </div>
    </div>
  );
}