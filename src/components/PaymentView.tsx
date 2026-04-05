import React, { useState } from 'react';
import * as PortOne from "@portone/browser-sdk/v2"; 
import naverLogo from '../assets/images/logo_naverpay.png';
import kakaoLogo from '../assets/images/logo_kakaopay.png';

export default function PaymentView() {
  const [method, setMethod] = useState<'KAKAOPAY' | 'NAVERPAY' | 'CARD'>('CARD');

  // 결제 실행 함수 (인자로 결제 수단을 직접 받음)
  const handlePayment = async (payMethod: 'KAKAOPAY' | 'NAVERPAY' | 'CARD') => {
    try {
      // 상태 업데이트 
      setMethod(payMethod);
      const shortPaymentId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // 포트원 결제 요청
      const paymentData: any = {
        storeId: "store-2cf5377e-b840-4c17-9e08-5d82a22476da", // Store ID
        channelKey: "channel-key-7c435daf-c7a1-43aa-95bf-f8aa17dd4fe5", // Channel Key
        paymentId: shortPaymentId,
        orderName: "재회 사주 심층 분석",
        totalAmount: 990,
        currency: "CURRENCY_KRW",
        customer: {
          fullName: "홍길동",
          phoneNumber: "010-0000-0000",
        },
      };

      if (payMethod === 'CARD') {
        // 1. 일반 신용카드 설정
        paymentData.payMethod = "CARD";
      } else {
        // 2. 간편결제 설정 (KAKAOPAY 또는 NAVERPAY)
        paymentData.payMethod = "EASY_PAY";
        paymentData.easyPay = {
          easyPayProvider: payMethod, 
        };
      }

      const response = await PortOne.requestPayment(paymentData);

      if (response && 'code' in response) {
        return alert(`결제 실패: ${response.message}`);
      }

      alert("테스트 결제가 완료되었습니다!");
      console.log("결제 결과:", response);

    } catch (e) {
      console.error(e);
      alert("결제창을 띄우는 중 오류가 발생했습니다.");
    }
  };

  // 반복되는 푸터 스타일 공통화
  const footerTextStyle = {
    fontFamily: '"Noto Sans KR", sans-serif',
    fontSize: '11px',
    lineHeight: '18.7px',
    fontWeight: 300,
    color: '#4a4068'
  };

  return (
    <div className="min-h-screen w-full bg-[#000] text-[#f0eaf8] font-sans flex justify-center overflow-x-hidden antialiased select-none">
      {/* 배경 효과 */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#c084fc] rounded-full blur-[120px] opacity-10 -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-[#f472b6] rounded-full blur-[160px] opacity-10 -z-10 pointer-events-none"></div>

      {/* 너비 유연성 확보 */}
      <div className="w-full max-w-[375px] flex flex-col px-[20px] py-[32px] gap-[32px] relative z-10 items-center">
        
        <header className="py-[16px] w-full min-h-[52px]"></header>

        {/* 상단 카드 */}
        <div className="w-full rounded-[20px] border border-[rgba(192,132,252,0.22)] bg-[#0f0d18] p-[30px_24px] flex flex-col gap-[24px]">
          
          <div className="flex flex-col gap-[8px] items-center text-center">
            <div className="text-[26px]" aria-hidden="true">🔮</div>
            <div className="flex flex-col gap-[8px]">
              <div className="text-[17px] font-bold font-['Noto_Serif_KR']">심층 분석 결제</div>
              <div className="text-[12px] text-[#9d8fba] leading-[1.5] font-light font-['Noto_Sans_KR']">
                전문 연애 상담가가<br />두 사람의 재회 가능성을 깊이 분석해드려요.
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[4px] items-start">
            {[
              "상대방 속마음 · 새로운 인연 가능성",
              "재회 가능성 % · 재회 최적 타이밍",
              "효과적인 접근법 · 재회 후 지속 가능성",
              "지금 당장의 행동 지침 · 종합 총평"
            ].map((text, index) => (
              <div key={index} className="flex flex-row items-center gap-[7.01px]">
                <div className="w-[7.13px] flex justify-center" aria-hidden="true">
                  <span className="text-[#c084fc] text-[9px]">✦</span>
                </div>
                <div className="text-[12px] text-[#9d8fba] font-light font-['Noto_Sans_KR']">
                  {text}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-[16px] border-t border-[rgba(180,140,255,0.11)] flex flex-row justify-between items-center">
            <div className="text-[13px] text-[#9d8fba] font-light font-['Noto_Sans_KR']">결제 금액</div>
            <div className="flex flex-col items-end gap-[6px]">
              <div className="text-[24px] font-bold text-[#c084fc] font-['Noto_Serif_KR'] leading-none">₩990</div>
              <div className="text-[10px] text-[#4a4068] font-light font-['Noto_Sans_KR']">일회성 결제 · 소장가능</div>
            </div>
          </div>
        </div>

        {/* 결제 수단 선택 */}
        <div className="w-full flex flex-col gap-[14px]">
          <div className="text-[11px] text-[#4a4068] font-light tracking-[1.5px] px-1">결제 수단 선택</div>
          <div className="flex flex-col gap-3">

          {/* 간편결제 (카카오 & 네이버) */}
          <div className="flex flex-row gap-3 w-full">
            {/* 카카오페이 */}
            <button
              onClick={() => handlePayment('KAKAOPAY')}
              className="flex-1 h-[54px] rounded-[14px] bg-[#FFEB00] flex flex-col items-center justify-center gap-1 active:scale-[0.96] transition-all"
            >
              <div className="flex items-center gap-1">
                <img 
                    src={kakaoLogo}
                    alt="카카오페이"
                    className="h-[13px] w-auto object-contain" 
                  />
                <span className="text-[14px] font-bold text-black">카카오페이</span>
              </div>
            </button>
            
            {/* 네이버페이 */}
            <button
              onClick={() => handlePayment('NAVERPAY')}
              className="flex-1 h-[54px] rounded-[14px] bg-[#58D662] flex flex-col items-center justify-center gap-1 active:scale-[0.96] transition-all"
            >
              <div className="flex items-center gap-1">
                <img 
                    src={naverLogo}
                    alt="네이버페이"
                    className="h-[17px] w-auto object-contain" 
                  />
                <span className="text-[14px] font-bold text-black">네이버페이</span>
              </div>
            </button>
          </div>

            {/* 신용카드/체크카드 결제 */}
            <button
              onClick={() => handlePayment('CARD')}
              className={`w-full max-w-[335px] h-[54px] rounded-[14px] font-bold border transition-all active:scale-[0.96]
                ${method === 'CARD' ? 'border-[#c084fc] bg-[#c084fc]/10 text-[#c084fc]' : 'border-[rgba(180,140,255,0.2)] text-[#c084fc]/70'}`}
            >
              신용카드 / 체크카드
            </button>
          </div>
        </div>

        <footer className="text-center pb-[40px] w-full">
          <span className="block" style={footerTextStyle}>
            결제 즉시 분석 결과가 잠금 해제됩니다.
          </span>
          <div className="flex items-center justify-center gap-[4px]">
            <span style={{ ...footerTextStyle, textDecoration: 'underline', cursor: 'pointer' }}>환불 정책 보기</span>
            <span style={footerTextStyle}>·</span>
            <span style={{ ...footerTextStyle, textDecoration: 'underline', cursor: 'pointer' }}>이용약관</span>
          </div>
        </footer>
      </div>
    </div>
  );
}