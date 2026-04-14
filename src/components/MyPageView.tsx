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

  const [userEmail, setUserEmail] = useState<string>("로그인 정보 없음");
  const [userName, setUserName] = useState<string>("사용자");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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

  // ⭐️ 탈퇴하기 기능 (서버 친구와 연동 필요)
  const handleWithdraw = async () => {
    // 1. 실수로 누를 수 있으니 재차 확인합니다.
    const isConfirm = window.confirm("정말로 탈퇴하시겠습니까?\n저장된 모든 사주 정보가 삭제되며 되돌릴 수 없습니다.");

    if (!isConfirm) return; // '취소'를 누르면 여기서 멈춤

    try {
      // 🚨 서버 친구가 탈퇴 기능을 만들어주면 이곳의 주석을 풀고 코드를 넣으세요!
      // 예시: const { error } = await supabase.rpc('delete_user');
      // if (error) throw error;

      // 2. 현재 기기에서 로그아웃(세션 삭제) 처리합니다.
      await supabase.auth.signOut();

      // 3. 안내창을 띄우고 홈 화면으로 쫓아냅니다.
      alert("회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
      navigate('/');

    } catch (error) {
      console.error("탈퇴 에러:", error);
      alert("탈퇴 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
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
  const navigate = useNavigate();

  // 문의하기 클릭 핸들러
  const handleInquiryClick = () => {
    const email = "2019ootd@gmail.com";
    const subject = encodeURIComponent("[사주페어링] 서비스 문의사항");

    // 메일 앱 호출 (수신자, 제목, 본문 미리 채우기)
    window.location.href = `mailto:${email}?subject=${subject}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] relative overflow-hidden flex flex-col items-center font-sans text-[#f0eaf8]">

      {/* 배경 블러 효과 (유지) */}
      <div className="background-blur absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-[#60a5fa] opacity-[0.18] blur-[40px]"></div>
      <div className="background-blur2 absolute -left-[80px] -top-[80px] w-[300px] h-[300px] rounded-full bg-[#c084fc] opacity-10 blur-[40px]"></div>
      <div className="background-blur3 absolute -right-[60px] -bottom-[60px] w-[250px] h-[250px] rounded-full bg-[#f472b6] opacity-[0.18] blur-[40px]"></div>

      {/* 미세 별 입자 컨테이너 (유지) */}
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
    </div>
  );
}