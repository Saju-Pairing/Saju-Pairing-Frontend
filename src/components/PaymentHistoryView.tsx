import React from 'react';
import { useNavigate } from 'react-router-dom';

// 결제 내역 데이터 타입 정의
interface PaymentItem {
    id: number;
    date: string;       // 결제 일자 (예: 2026.03.28)
    title: string;      // 상품명 (예: 심층 분석 결제)
    amount: string;     // 금액 (예: ₩990)
    time: string;     // 결제 시간 (예: 07:01)
}

export default function PaymentHistoryView() {
    const navigate = useNavigate();
    const stars = Array.from({ length: 40 }, (_, i) => i + 1);

    // 샘플 데이터 (추후 API 연동)
    const paymentData: PaymentItem[] = [
        { id: 1, date: '03.26', time: '07:01', title: '심층분석 구매', amount: '-990원' },
        { id: 2, date: '03.25', time: '14:20', title: '심층분석 구매', amount: '-990원' },
        { id: 3, date: '03.22', time: '18:45', title: '심층분석 구매', amount: '-990원' },
    ];

    return (
        <div className="app-wrapper mx-auto">
            <div className="div w-[375px] h-[812px] bg-[#07060c] relative overflow-hidden">

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
                <header className="absolute top-[44px] left-1/2 -translate-x-1/2 w-[375px] px-[20px] py-[15px] flex flex-row items-center justify-between z-20">
                    <button
                        onClick={() => navigate(-1)}
                        className="arrows-chevron-left w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
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

                {/* 결제 내역 리스트 (frame-1707482483) */}
                <div className="absolute top-[110px] left-[20px] w-[335px] flex flex-col z-10 overflow-y-auto max-h-[520px] scrollbar-hide">
                    {paymentData.map((item) => (
                        <div key={item.id} className="frame-1707482481 border-b border-[rgba(192,132,252,0.2)] py-[16px] flex flex-row gap-[16px] items-start self-stretch">

                            {/* 날짜 (_03-26) */}
                            <div className="text-[#9d8fba] text-[13px] font-normal font-['Noto Sans KR'] min-w-[38px]">
                                {item.date}
                            </div>

                            {/* 오른쪽 상세 내용 (frame-1707482479) */}
                            <div className="flex flex-row justify-between items-start flex-1">

                                {/* 제목 및 시간 (frame-1707482478) */}
                                <div className="flex flex-col gap-[2px]">
                                    <div className="text-[#f0eaf8] text-[14px] font-normal font-['Noto Sans KR']">
                                        {item.title}
                                    </div>
                                    <div className="text-[#4a4068] text-[13px] font-normal font-['Noto Sans KR']">
                                        {item.time}
                                    </div>
                                </div>

                                {/* 금액 (_990) */}
                                <div className="text-[#f0eaf8] text-[14px] font-normal font-['Noto Sans KR']">
                                    {item.amount}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

                {/* 하단 안내 문구 */}
                <div className="absolute top-[648px] left-1/2 -translate-x-1/2 w-full text-center text-[#9d8fba] text-[13px] font-normal font-['Noto Sans KR'] opacity-60">
                    최근 50건까지 표시됩니다.
                </div>
            </div>
        </div>
    );
}