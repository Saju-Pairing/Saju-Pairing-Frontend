import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getMyPayments } from '../lib/payment';
import type { PaymentRecord } from '../lib/payment';

export default function PaymentHistoryView() {
    const navigate = useNavigate();
    const stars = Array.from({ length: 40 }, (_, i) => i + 1);

    // 상태 관리
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const initPaymentHistory = async () => {
            try {
                setIsLoading(true);

                // 1. 로그인 세션 확인 (비로그인 방어)
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    alert("로그인이 필요한 서비스입니다.");
                    navigate('/login', { state: { from: '/payment-history' } });
                    return;
                }

                // 2. 서버에서 결제 내역 로드
                const data = await getMyPayments();
                setPayments(data || []);
            } catch (error) {
                console.error("결제 내역 로드 실패:", error);
                alert("결제 내역을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        initPaymentHistory();
    }, [navigate]);

    // 날짜/시간 포맷팅 함수 (2026-04-09T12:00:00Z -> 04.09 / 12:00)
    const formatDateTime = (isoString: string) => {
        const dateObj = new Date(isoString);
        const date = `${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
        const time = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
        return { date, time };
    };

    return (
        <div className="min-h-screen w-full bg-[#0a0a0c] relative overflow-hidden flex flex-col items-center font-sans text-[#f0eaf8]" data-testid="payment-history-view">

            {/* 배경 효과 (마이페이지와 동일) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-[#60a5fa] opacity-[0.12] blur-[40px]"></div>
            <div className="absolute -left-[80px] -top-[40px] w-[250px] h-[250px] rounded-full bg-[#c084fc] opacity-[0.08] blur-[40px]"></div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {stars.map((star) => (
                    <div
                        key={star}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: star % 5 === 0 ? '2px' : '1px',
                            height: star % 5 === 0 ? '2px' : '1px',
                            opacity: Math.random() * 0.1,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* 상단 헤더 영역 (frame-1707482468) */}
            <header className="w-full px-[20px] py-[15px] mt-[44px] flex flex-row items-center justify-between z-20 shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="arrows-chevron-left w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
                    data-testid="payment-history-back-button"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#f0eaf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="div3 text-[#c084fc] text-[14px] font-normal font-['Noto_Sans_KR'] leading-[20px]">
                    결제내역
                </div>
                <div className="w-[24px]"></div> {/* 좌측 버튼과의 균형을 위한 빈 공간 */}
            </header>

            {/* 결제 내역 리스트 */}
            <div className="absolute top-[110px] left-1/2 -translate-x-1/2 w-[335px] flex flex-col z-10 overflow-y-auto max-h-[520px] scrollbar-hide">
                {isLoading ? (
                    <div className="text-center text-[#9d8fba] py-12 text-[14px] font-['Noto Sans KR']" data-testid="payment-history-loading">
                        결제 내역을 불러오는 중입니다...
                    </div>
                ) : payments.length === 0 ? (
                    <div className="text-center text-[#9d8fba] py-12 text-[14px] font-['Noto Sans KR']" data-testid="payment-history-empty">
                        결제 내역이 존재하지 않습니다.
                    </div>
                ) : (
                    <div data-testid="payment-history-list">
                        {payments.map((item) => {
                            const { date, time } = formatDateTime(item.created_at);
                            const isCancelled = item.status === 'CANCELLED' || item.status === 'PARTIAL_CANCELLED';

                            return (
                                <div key={item.id} className="border-b border-[rgba(192,132,252,0.2)] py-[16px] flex flex-row gap-[16px] items-start w-full">

                                    {/* 날짜 */}
                                    <div className="text-[#9d8fba] text-[13px] font-normal font-['Noto Sans KR'] min-w-[38px]">
                                        {date}
                                    </div>

                                    {/* 상세 내용 */}
                                    <div className="flex flex-row justify-between items-start flex-1">
                                        <div className="flex flex-col gap-[2px]">
                                            <div className="text-[#f0eaf8] text-[14px] font-normal font-['Noto Sans KR']">
                                                {isCancelled ? '심층분석 구매 취소' : '심층분석 구매'}
                                            </div>
                                            <div className="text-[#4a4068] text-[13px] font-normal font-['Noto Sans KR']">
                                                {time}
                                            </div>
                                        </div>

                                        {/* 금액 — 취소 시 색상 흐리게 */}
                                        <div className={`text-[14px] font-normal font-['Noto Sans KR'] ${isCancelled ? 'text-[#6b5f80] line-through' : 'text-[#f0eaf8]'}`}>
                                            -{item.amount.toLocaleString()}원
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {/* 하단 안내 문구 */}
            <div className="absolute top-[648px] left-1/2 -translate-x-1/2 w-full text-center text-[#9d8fba] text-[13px] font-normal font-['Noto Sans KR'] opacity-60">
                최근 50건까지 표시됩니다.
            </div>
        </div>
    );
}