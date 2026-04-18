import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; 

export default function AuthCallback() {
  const navigate = useNavigate();
  // 중복 이동을 막기 위한 스위치 생성
  const hasNavigated = useRef(false);

  useEffect(() => {
    // 화면이 켜지자마자 로컬 스토리지에서 주소를 한 번만 딱 꺼내서 변수에 안전하게 보관
    const returnPath = localStorage.getItem('returnPath') || '/';

    // 성공 시 실행할 공통 함수
    const handleSuccess = () => {
      // 이미 이동 처리를 했다면 무시
      if (hasNavigated.current) return; 
      
      hasNavigated.current = true; // 이동했다고 스위치 켜기
      console.log("로그인 성공! 돌아갈 곳:", returnPath);
      
      localStorage.removeItem('returnPath'); // 메모지 삭제
      navigate(returnPath, { replace: true }); // 진짜 목적지로 이동
    };

    // 1. 이벤트 감지 로직
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || session) {
        handleSuccess();
      }
    });

    // 2. 수동 체크 로직 (이벤트가 이미 처리했으면 handleSuccess 안에서 걸러짐)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        handleSuccess();
      } else {
        // 주소창에 토큰(hash)이나 에러(search) 흔적조차 없다면 진짜 로그인 실패로 간주
        if (!window.location.hash && !window.location.search) {
          navigate('/', { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
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