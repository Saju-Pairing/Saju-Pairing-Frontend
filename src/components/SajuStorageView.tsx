import React from 'react';
import { useNavigate } from 'react-router-dom';

// 서버에서 받아올 데이터 타입 정의
interface SajuRecord {
    id: number;
    name: string;        // 상대방 이름
    partnerName: string; // 본인 이름 
    score: number;       // 궁합 점수
    analysisDate: string; // 분석 진행 날짜 
    dDay: number;         // 남은 일수 
    isExpired: boolean;  // 만료 여부
}

export default function SajuStorageView() {
    const navigate = useNavigate();
    const stars = Array.from({ length: 45 }, (_, i) => i + 1);

    // 샘플 데이터 (추후 API 연동)
    const sajuRecords: SajuRecord[] = [
        {
            id: 1,
            name: '페어링1',
            partnerName: '페어링2',
            score: 85,
            analysisDate: '2025.03.26',
            dDay: 2,
            isExpired: false,
        },
        {
            id: 2,
            name: '페어링1',
            partnerName: '페어링2',
            score: 42,
            analysisDate: '2025.02.10',
            dDay: 0,
            isExpired: true,
        },
    ];

    return (
        <div className="min-h-screen w-full bg-[#0a0a0c] relative overflow-hidden flex flex-col items-center font-sans text-[#f0eaf8]">

            {/* 배경 디자인 (동일 유지) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-[#60a5fa] opacity-[0.12] blur-[40px]"></div>
            <div className="absolute -left-[80px] -top-[40px] w-[250px] h-[250px] rounded-full bg-[#c084fc] opacity-[0.08] blur-[40px]"></div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {stars.map((s) => (
                    <div key={s} className="absolute bg-white rounded-full" style={{ width: '1px', height: '1px', opacity: Math.random() * 0.1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
                ))}
            </div>

            {/* 상단 헤더 영역 (frame-1707482468) */}
            <header className="w-full px-[20px] py-[15px] mt-[44px] flex flex-row items-center justify-between z-20 shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="arrows-chevron-left w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#f0eaf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="div3 text-[#c084fc] text-[14px] font-normal font-['Noto_Sans_KR'] leading-[20px]">
                    사주보관
                </div>
                <div className="w-[24px]"></div> {/* 좌측 버튼과의 균형을 위한 빈 공간 */}
            </header>

            <div className="w-full max-w-[375px] min-h-screen relative z-10">

                {/* 보관함 요약 (frame-1707482464) */}
                <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[335px] bg-[rgba(192,132,252,0.07)] rounded-[12px] border border-[rgba(192,132,252,0.22)] p-[16px_24px] flex flex-row justify-center items-center gap-[8px] z-10">
                    <div className="flex flex-col items-center justify-center gap-[8px] flex-shrink-0 relative">

                        {/* 메인 문구 */}
                        <div className="text-center flex items-center justify-center text-[12px] font-normal font-['Noto_Sans_KR']">
                            <span>
                                <span className="text-[#9d8fba] font-light">심층 분석 결과는 </span>
                                <span className="text-[#c084fc] font-normal">결제일로부터 7일 후 만료</span>
                                <span className="text-[#9d8fba] font-light"> 됩니다.</span>
                            </span>
                        </div>

                        {/* 하단 PDF 안내 */}
                        <div className="text-[#4a4068] text-center text-[10px] font-light font-['Noto_Sans_KR'] flex items-center justify-center">
                            영구 소장은 결과 페이지 내의 PDF저장을 이용해주세요.
                        </div>
                    </div>
                </div>

                {/* 리스트 타이틀 (div10) */}
                <div className="absolute top-[120px] left-[20px] text-[#9d8fba] text-[13px] font-light">
                    내 결과
                </div>

                {/* 사주 리스트 컨테이너 */}
                <div className="absolute top-[150px] left-[20px] w-[335px] flex flex-col gap-[20px] z-10 overflow-y-auto max-h-[480px] pb-10 scrollbar-hide">
                    {sajuRecords.map((record) => (
                        <div
                            key={record.id}
                            className={`w-full rounded-[20px] border border-[rgba(192,132,252,0.2)] overflow-hidden transition-all
              ${record.isExpired ? 'bg-[#0f0d18] opacity-60' : 'bg-[#0f0d18] shadow-lg'}`}
                        >
                            {/* 상단바 (background-horizontal-border) */}
                            <div className="bg-[#141120] border-b border-[rgba(180,140,255,0.11)] p-[12px_16px] flex flex-row items-center justify-between">
                                <div className="text-[#4a4068] text-[10px] font-light font-['Noto_Sans_KR']">
                                    {record.analysisDate} 분석
                                </div>
                                <div className={`text-[10px] font-light font-['Noto_Sans_KR'] ${record.isExpired ? 'text-[#4a4068]' : 'text-[#f472b6]'}`}>
                                    {record.isExpired ? '만료' : `D-${record.dDay}`}
                                </div>
                            </div>

                            {/* 내용 섹션 (container2) */}
                            <div className="p-[16px_20px] flex flex-col gap-[8px] self-stretch relative overflow-hidden min-h-[100px] justify-center">

                                {record.isExpired ? (
                                    /* --- 만료된 경우 노출될 문구 --- */
                                    <div className="flex flex-row items-center justify-center gap-[6px] py-[10px]">
                                        <span className="text-[10px]">⚠️</span>
                                        <span className="text-[#9D8FBA] text-[10px] font-light font-['Noto_Sans_KR'] tracking-tight">
                                            열람 기간이 만료되었어요.
                                        </span>
                                    </div>
                                ) : (
                                    /* --- 만료되지 않은 경우 (기존 이름 및 점수 UI) --- */
                                    <div className="flex flex-row items-center justify-between self-stretch flex-shrink-0 relative">

                                        {/* 왼쪽: 이름 영역 */}
                                        <div className="flex flex-row gap-[8px] items-center justify-center flex-shrink-0 relative">
                                            {/* 나 */}
                                            <div className="flex flex-col gap-0 items-center justify-center flex-shrink-0 relative">
                                                <div className="text-[#4a4068] text-center text-[9px] tracking-[1px] font-light font-['Noto_Sans_KR']">나</div>
                                                <div className="text-[#f0eaf8] text-center text-[14px] leading-[18.9px] font-semibold font-['Noto_Serif_KR']">
                                                    {record.partnerName}
                                                </div>
                                            </div>

                                            {/* 중간 아이콘 */}
                                            <div className="w-[12px] h-[12px] flex-shrink-0 opacity-40">
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 10.5S1 7.5 1 4a2.5 2.5 0 014.5-1.5h1A2.5 2.5 0 0111 4c0 3.5-5 6.5-5 6.5z" fill="#c084fc" /></svg>
                                            </div>

                                            {/* 상대방 */}
                                            <div className="flex flex-col gap-0 items-center justify-center flex-shrink-0 relative">
                                                <div className="text-[#4a4068] text-center text-[9px] tracking-[1px] font-light font-['Noto_Sans_KR']">상대방</div>
                                                <div className="text-[#f0eaf8] text-center text-[14px] leading-[18.9px] font-semibold font-['Noto_Serif_KR']">
                                                    {record.name}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 오른쪽: 궁합 점수 영역 */}
                                        <div className="flex flex-col gap-[8px] items-center justify-start flex-shrink-0 relative">
                                            <div className="rounded-[36px] flex flex-row gap-0 items-center justify-center flex-shrink-0 relative">
                                                <div className="relative w-[42px] h-[42px] flex-shrink-0">
                                                    <div className="absolute inset-0 rounded-full border-[4px] border-[rgba(180,140,255,0.11)]"></div>
                                                    <div className="absolute inset-0 flex items-center justify-center text-[#c084fc] text-center text-[16px] font-semibold font-['Noto_Serif_KR']">
                                                        {record.score}
                                                    </div>
                                                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 42 42">
                                                        <circle
                                                            cx="21"
                                                            cy="21"
                                                            r="19"
                                                            fill="none"
                                                            stroke="#c084fc"
                                                            strokeWidth="4"
                                                            strokeDasharray={`${2 * Math.PI * 19}`}
                                                            strokeDashoffset={`${2 * Math.PI * 19 * (1 - record.score / 100)}`}
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="text-[#4a4068] text-center text-[9px] tracking-[1px] font-light font-['Noto_Sans_KR']">궁합점수</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 하단 버튼 (frame-17074824842 / 17074824843) */}
                            {!record.isExpired ? (
                                /* 만료되지 않은 경우 */
                                <button
                                    className="w-full py-[12px] flex flex-row items-center justify-center gap-[4px] border-t border-[rgba(192,132,252,0.12)] cursor-pointer active:bg-white/5"
                                >
                                    <span className="text-[10px] text-[#9D8FBA] font-light font-['Noto_Sans_KR']">
                                        결과 보러가기
                                    </span>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                        <path d="M9 18L15 12L9 6" stroke="#9D8FBA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            ) : (
                                /* 만료된 경우 */
                                <div className="h-[12px]"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}   