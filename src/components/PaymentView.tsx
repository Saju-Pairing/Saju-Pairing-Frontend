import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPayment, type PayMethod } from '../lib/portone';
import { verifyPayment } from '../lib/payment';
import { getSession, signInWithKakao } from '../lib/auth';
import { analyzePaid } from '../lib/analyze';
import { buildAnalyzePayload } from '../utils/sajuEngine';

import naverLogo from '../assets/images/logo_naverpay.png';
import kakaoLogo from '../assets/images/logo_kakaopay.png';

export default function PaymentView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (payMethod: PayMethod) => {
    if (loading) return;

    try {
      setLoading(true);

      // 1. 로그인 체크
      const session = await getSession();
      if (!session) {
        alert("카카오 로그인이 필요합니다.");
        await signInWithKakao();
        return;
      }

      // 2. 주문 ID 생성 (order_시간)
      const orderId = `order_${Date.now()}`;
      const userName = session.user.user_metadata?.full_name || "고객";

      // 3. 결제창 호출 (lib/portone.ts)
      const payResult = await requestPayment(payMethod, orderId, userName);

      if (!payResult) {
        // 유저가 결제창을 닫았을 때
        setLoading(false);
        return;
      }

      // 4. 서버 결제 검증 (lib/payment.ts -> Supabase Edge Function)
      const { success, error } = await verifyPayment(payResult.paymentId, orderId);

      if (!success) {
        alert(`결제 실패: ${error}`);
        setLoading(false);
        return;
      }

      // 5. 성공 시 다음 단계 이동
      alert("결제가 완료되었습니다! 분석 중입니다...");

      const rawMe = JSON.parse(sessionStorage.getItem('saju_raw_me') || '{}');
      const rawPt = JSON.parse(sessionStorage.getItem('saju_raw_pt') || '{}');
      const me = JSON.parse(sessionStorage.getItem('saju_me') || '{}');
      const pt = JSON.parse(sessionStorage.getItem('saju_pt') || '{}');

      const meSaju = buildAnalyzePayload(rawMe.rawSaju, rawMe.isUnknown);
      const partnerSaju = buildAnalyzePayload(rawPt.rawSaju, rawPt.isUnknown);

      const formData = {
        me: { name: me.name, birth: me.date, gender: me.gender, time: me.time },
        partner: { name: pt.name, birth: pt.date, gender: pt.gender, time: pt.time },
        breakupDuration: '',
        breakupReason: '',
      };

      const result = await analyzePaid(formData, meSaju, partnerSaju, payResult.paymentId);
      sessionStorage.setItem('saju_paid_result', JSON.stringify(result));
      navigate('/result');

    } catch (e: any) {
      console.error(e);
      alert(e.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 반복되는 스타일 공통화
  const footerTextStyle = {
    fontFamily: '"Noto Sans KR", sans-serif',
    fontSize: '11px',
    lineHeight: '18.7px',
    fontWeight: 300,
    color: '#9D8FBA'
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
                onClick={() => handlePayment('kakao')}
                disabled={loading}
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
                onClick={() => handlePayment('naver')}
                disabled={loading}
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
              onClick={() => handlePayment('card')}
              disabled={loading}
              className={`w-full max-w-[335px] h-[54px] rounded-[14px] font-bold border transition-all active:scale-[0.96]
                ${loading ? 'border-[rgba(180,140,255,0.2)] text-[#c084fc]/70' : 'border-[#c084fc] bg-[#c084fc]/10 text-[#c084fc]'}`}
            >
              신용카드 / 체크카드
            </button>
          </div>
        </div>

        {/* 하단 정보 섹션 */}
        <footer className="w-full flex flex-col items-center gap-[40px] pt-[20px] pb-[60px] text-center">

          {/* 이용약관 안내 */}
          <div className="flex flex-col gap-[8px] items-center">
            <span style={footerTextStyle}>
              결제 즉시 분석 결과가 잠금 해제됩니다.
            </span>
            <button
              style={{
                ...footerTextStyle,
                textDecoration: 'underline',
                textUnderlineOffset: '4px' // 밑줄과 텍스트 사이 간격 (선택사항)
              }}
            >
              이용약관 및 개인정보처리방침
            </button>
          </div>

          {/* 사업자 정보 */}
          <div className="w-full flex flex-col gap-[24px] items-start text-left px-1">
            <div className="flex flex-col gap-[4px]">
              <h3 className="text-[11px] font-bold text-[#9D8FBA]">사주페어링</h3>
              <div className="flex flex-col gap-[2px]">
                <span style={{ ...footerTextStyle, fontSize: '10px' }}>대표자명: 김순천</span>
                <span style={{ ...footerTextStyle, fontSize: '10px' }}>상호명: 모두모두상점</span>
                <span style={{ ...footerTextStyle, fontSize: '10px' }}>사업자번호: 799-25-01441</span>
                <span style={{ ...footerTextStyle, fontSize: '10px' }}>통신판매번호: </span>
              </div>
            </div>

            <div className="flex flex-col gap-[4px]">
              <h3 className="text-[11px] font-bold text-[#9D8FBA]">고객센터</h3>
              <div className="flex flex-col gap-[2px]">
                <span style={{ ...footerTextStyle, fontSize: '10px' }}>이메일: 2019ootd@gmail.com</span>
                <span style={{ ...footerTextStyle, fontSize: '10px', color: '#4A4068' }}>사업자주소: 서울특별시 영등포구 국회대로 632, 11층 5호</span>
                <span style={{ ...footerTextStyle, fontSize: '10px', color: '#4A4068' }}>유선번호: 000-0000-0000</span>
                <span style={{ ...footerTextStyle, fontSize: '10px', color: '#4A4068' }}>전화상담은 제공하지 않습니다.</span>
                <span style={{ ...footerTextStyle, fontSize: '10px', color: '#4A4068' }}>설정 내 문의하기를 통해 문의해주세요.</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}