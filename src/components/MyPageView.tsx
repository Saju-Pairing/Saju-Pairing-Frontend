import React, { useState } from 'react';
import kakaoLogo from '../assets/images/logo_kakao_profile.png';
import mailIcon from '../assets/images/mail.png';
import storageIcon from '../assets/images/storage.png';
import payIcon from '../assets/images/pay.png';
import { useNavigate } from 'react-router-dom';

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
    <div className="app-wrapper mx-auto">
      <div className="div w-[375px] h-[812px] bg-[#0a0a0c] relative overflow-hidden">

        {/* 배경 블러 효과 (background-blur 1, 2, 3) */}
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

        {/* 상단 프로필 영역 */}
        <div className="frame-1707482110 absolute top-[114px] left-1/2 -translate-x-1/2 w-[335px] flex flex-row items-center gap-[20px]">
          <div className="group-36333 relative w-[40px] h-[40px] flex-shrink-0">
            <div className="absolute inset-0 rounded-full border border-[#f472b6] opacity-20"></div>
            <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-[#c084fc4d] to-[#f472b626]">
              <span className="text-[20px]">🔮</span>
            </div>
          </div>

          <div className="frame-1707481497 flex flex-col gap-[4px] justify-center flex-shrink-0">
            <div className="div7 text-white text-[14px] font-normal font-['Noto_Sans_KR']">
              카카오 로그인 사용자입니다.
            </div>
            <div className="frame-1707482109 flex flex-row gap-[4px] items-center">
              <img
                src={kakaoLogo}
                alt="카카오"
                className="h-[16px] w-auto object-contain"
              />
              <div className="sajuparing-kko-com text-[#9d8fba] text-[14px] font-normal leading-[133.4%] tracking-[0.0252em]">
                sajuparing@kko.com
              </div>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="rectangle-1091 absolute top-[182px] left-0 w-[375px] h-[8px] bg-[#c084fc1f]"></div>

        {/* 메뉴 리스트 */}
        <div className="frame-1707482466 absolute top-[202px] left-[20px] w-[335px] flex flex-col">

          {/* 메뉴 아이템: 결제내역 */}
          <div
            onClick={() => navigate('/payment-history')}
            className="background-border border-b border-[#c084fc33] p-[16px_14px] flex flex-row items-center gap-[12px] self-stretch">
            <img
              src={payIcon}
              alt="결제내역"
              className="h-[24px] w-auto object-contain"
            />
            <div className="div8 text-white text-[13px] font-light font-['Noto_Sans_KR'] flex items-center justify-center">
              결제내역
            </div>
          </div>

          {/* 메뉴 아이템: 사주보관 */}
          <div
            onClick={() => navigate('/saju-storage')}
            className="background-border border-b border-[#c084fc33] p-[16px_14px] flex flex-row items-center gap-[12px] self-stretch">
            <img
              src={storageIcon}
              alt="사주보관"
              className="h-[24px] w-auto object-contain"
            />
            <div className="div8 text-white text-[13px] font-light font-['Noto_Sans_KR'] flex items-center justify-center">
              사주보관
            </div>
          </div>

          {/* 메뉴 아이템: 문의하기 */}
          <div
            onClick={() => handleInquiryClick()}
            className="background-border p-[16px_14px] flex flex-row items-center gap-[12px] self-stretch">
            <img
              src={mailIcon}
              alt="문의하기"
              className="h-[24px] w-auto object-contain"
            />
            <div className="div8 text-white text-[13px] font-light font-['Noto_Sans_KR'] flex items-center justify-center">
              문의하기
            </div>
          </div>
        </div>

        {/* 하단 링크 영역 */}
        <div className="absolute bottom-[110px] left-0 w-full flex flex-row justify-center items-center gap-[40px] z-10">
          <button className="text-[#9d8fba] text-[13px] font-light opacity-80 hover:opacity-100 transition-opacity">
            개인정보 및 이용약관
          </button>
          <button className="text-[#9d8fba] text-[13px] font-light opacity-80 hover:opacity-100 transition-opacity">
            탈퇴하기
          </button>
        </div>

      </div>
    </div>
  );
}