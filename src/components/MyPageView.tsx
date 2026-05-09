import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

import kakaoLogo from '../assets/images/logo_kakao_profile.png';
import mailIcon from '../assets/images/mail.png';
import storageIcon from '../assets/images/storage.png';
import payIcon from '../assets/images/pay.png';

// 별 스타일의 타입 정의
interface StarStyle {
  id: number;
  width: string;
  height: string;
  opacity: string;
  left: string;
  top: string;
}

export default function MyPageView() {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState<string>("로그인 정보 없음");
  const [userName, setUserName] = useState<string>("사용자");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // 로그인 안내 팝업을 띄울지 결정하는 상태
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUserEmail(session.user.email || "이메일 정보 없음");
        const name = session.user.user_metadata?.name || session.user.email?.split('@')[0] || "사용자";
        setUserName(name);
        setAvatarUrl(session.user.user_metadata?.avatar_url || null);
      }
    };

    fetchUserInfo();
  }, []);

  // 탈퇴하기 클릭 핸들러
  const handleWithdraw = async () => {
    // 1. 현재 세션(로그인) 상태를 먼저 확인합니다.
    const { data: { session } } = await supabase.auth.getSession();
    
    // 2. 로그아웃 상태라면 예쁜 팝업창을 띄우고 함수를 멈춥니다!
    if (!session) {
      setShowLoginPopup(true);
      return;
    }

    // 3. 로그인 상태라면 원래대로 탈퇴 진행 여부를 묻습니다.
    const isConfirm = window.confirm("정말로 탈퇴하시겠습니까?\n저장된 모든 사주 정보가 삭제되며 되돌릴 수 없습니다.");
    if (!isConfirm) return;

    try {
      const { data, error } = await supabase.functions.invoke('delete-account', {
        method: 'POST',
      });

      if (error) {
        console.error("서버 응답 에러:", error);
        alert(error.message || "탈퇴 처리에 실패했어요.");
        return; 
      }

      console.log("탈퇴 성공:", data);
      await supabase.auth.signOut();
      
      alert("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
      navigate('/');

    } catch (err) {
      console.error("네트워크 에러:", err);
      alert("통신 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const [starStyles] = useState<StarStyle[]>(() => {
    const stars = Array.from({ length: 55 }, (_, i) => i + 1);
    return stars.map((star) => ({
      id: star,
      width: star % 3 === 0 ? '3px' : '1px',
      height: star % 3 === 0 ? '3px' : '1px',
      opacity: (Math.random() * 0.2 + 0.05).toFixed(2),
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
  });

  // 문의하기 클릭 핸들러
  const handleInquiryClick = () => {
    const email = "2019ootd@gmail.com";
    const subject = encodeURIComponent("[사주페어링] 서비스 문의사항");
    window.location.href = `mailto:${email}?subject=${subject}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] relative overflow-hidden flex flex-col items-center font-sans text-[#f0eaf8]">

      {/* 배경 블러 효과 */}
      <div className="background-blur absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-[#60a5fa] opacity-[0.18] blur-[40px]"></div>
      <div className="background-blur2 absolute -left-[80px] -top-[80px] w-[300px] h-[300px] rounded-full bg-[#c084fc] opacity-10 blur-[40px]"></div>
      <div className="background-blur3 absolute -right-[60px] -bottom-[60px] w-[250px] h-[250px] rounded-full bg-[#f472b6] opacity-[0.18] blur-[40px]"></div>

      {/* 미세 별 입자 컨테이너 */}
      <div className="container absolute inset-0 overflow-hidden pointer-events-none">
        {starStyles.map((star) => (
          <div
            key={star.id}
            className={`background${star.id} absolute bg-white rounded-full`}
            style={{
              width: star.width,
              height: star.height,
              opacity: star.opacity,
              left: star.left,
              top: star.top,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-[375px] min-h-screen flex flex-col justify-between relative z-10 px-[20px]">

        {/* --- 상단 및 메뉴 영역 --- */}
        <div className="relative w-full h-[450px]">
          {/* 상단 프로필 영역 */}
          <div className="frame-1707482110 absolute top-[114px] left-1/2 -translate-x-1/2 w-[335px] flex flex-row items-center gap-[20px]">
            <div className="group-36333 relative w-[40px] h-[40px] flex-shrink-0 overflow-hidden rounded-full">
              <div className="absolute inset-0 rounded-full border border-[#f472b6] opacity-20 z-10 pointer-events-none"></div>
              {avatarUrl ? (
                <img src={avatarUrl} alt="프로필" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#c084fc4d] to-[#f472b626]">
                  <span className="text-[20px]">🔮</span>
                </div>
              )}
            </div>

            <div className="frame-1707481497 flex flex-col gap-[4px] justify-center flex-shrink-0">
              <div className="div7 text-white text-[14px] font-normal font-['Noto_Sans_KR']">
                {userName}님, 반가워요!
              </div>
              <div className="frame-1707482109 flex flex-row gap-[4px] items-center">
                <img src={kakaoLogo} alt="카카오" className="h-[16px] w-auto object-contain" />
                <div className="sajuparing-kko-com text-[#9d8fba] text-[14px] font-normal leading-[133.4%] tracking-[0.0252em]">
                  {userEmail}
                </div>
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="rectangle-1091 absolute top-[182px] left-1/2 -translate-x-1/2 w-[100vw] h-[8px] bg-[#c084fc1f]"></div>

          {/* 메뉴 리스트 */}
          <div className="frame-1707482466 absolute top-[202px] left-0 w-full flex flex-col">
            <div
              onClick={() => navigate('/payment-history')}
              className="background-border border-b border-[#c084fc33] p-[16px_14px] flex flex-row items-center gap-[12px] cursor-pointer">
              <img src={payIcon} alt="결제내역" className="h-[24px] w-auto object-contain" />
              <div className="div8 text-white text-[13px] font-light font-['Noto_Sans_KR']">결제내역</div>
            </div>

            <div
              onClick={() => navigate('/saju-storage')}
              className="background-border border-b border-[#c084fc33] p-[16px_14px] flex flex-row items-center gap-[12px] cursor-pointer">
              <img src={storageIcon} alt="사주보관" className="h-[24px] w-auto object-contain" />
              <div className="div8 text-white text-[13px] font-light font-['Noto_Sans_KR']">사주보관</div>
            </div>

            <div
              onClick={() => handleInquiryClick()}
              className="background-border p-[16px_14px] flex flex-row items-center gap-[12px] cursor-pointer">
              <img src={mailIcon} alt="문의하기" className="h-[24px] w-auto object-contain" />
              <div className="div8 text-white text-[13px] font-light font-['Noto_Sans_KR']">문의하기</div>
            </div>
          </div>
        </div>

        {/* 하단 링크 영역 */}
        <div className="pb-[60px] w-full flex flex-row justify-center items-center gap-[40px] z-10">
          <button
            onClick={() => navigate('/terms-of-service')}
            className="text-[#9d8fba] text-[13px] font-light opacity-80 hover:opacity-100 transition-opacity">
            개인정보 및 이용약관
          </button>
          <button
            onClick={handleWithdraw}
            className="text-[#9d8fba] text-[13px] font-light opacity-80 hover:opacity-100 transition-opacity">
            탈퇴하기
          </button>
        </div>

      </div>

      {/* ⭐️ 로그인 필요 팝업 (모달) */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in-up">
          <div className="bg-[#141120] border border-[rgba(180,140,255,0.15)] rounded-[1.5rem] p-7 w-full max-w-[320px] shadow-2xl flex flex-col items-center text-center">
            
            {/* 아이콘 */}
            <div className="w-14 h-14 rounded-full bg-[rgba(180,140,255,0.1)] flex items-center justify-center text-2xl mb-4 border border-[rgba(180,140,255,0.2)]">
              🔒
            </div>
            
            <h3 className="text-[17px] font-bold text-[#f0eaf8] mb-2 font-['Noto_Sans_KR']">
              로그인이 필요해요
            </h3>
            
            <p className="text-[13px] text-[#9d8fba] leading-relaxed mb-8 font-light font-['Noto_Sans_KR'] break-keep">
              회원 탈퇴를 진행하시려면<br />먼저 카카오 로그인을 해주세요.
            </p>
            
            <div className="flex flex-row w-full gap-3">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="flex-1 py-3.5 bg-[#0f0d18] border border-[rgba(180,140,255,0.15)] text-[#9d8fba] text-[13px] font-medium rounded-xl hover:bg-[rgba(180,140,255,0.05)] transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => navigate('/login', { state: { from: '/mypage' } })}
                className="flex-1 py-3.5 bg-[linear-gradient(135deg,#C084FC,#F472B6)] text-white text-[13px] font-bold rounded-xl shadow-[0_4px_14px_rgba(192,132,252,0.3)] hover:scale-[1.02] transition-transform"
              >
                로그인하기
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}