import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getMyReadings } from '../lib/payment';

// 서버에서 받아올 실제 데이터 타입 구조 정의
interface ServerReadingItem {
    id: string;
    user_id: string;
    payment_id: string;
    form_data: {
        me: { name: string;[key: string]: any };
        partner: { name: string;[key: string]: any };
        breakupDuration: string;
        breakupReason: string;
    };
    free_result: {
        compatibility: number;
        [key: string]: any;
    };
    paid_result: {
        reunionProbability: number;
        [key: string]: any;
    };
    created_at: string;
}

export default function SajuStorageView() {
    const navigate = useNavigate();
    const stars = Array.from({ length: 45 }, (_, i) => i + 1);

    // 내부 상태 관리
    const [readings, setReadings] = useState<ServerReadingItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSajuRecords = async () => {
            try {
                setIsLoading(true);

                // 1. 로그인 세션 확인 (비로그인 방어)
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    alert("로그인이 필요한 서비스입니다.");
                    navigate('/login', { state: { from: '/saju-storage' } });
                    return;
                }

                // 2. 서버에서 사주 저장 내역 로드
                const data = await getMyReadings();
                setReadings(data || []);
            } catch (error) {
                console.error("사주 보관함 로드 실패:", error);
                alert("보관된 사주 데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSajuRecords();
    }, [navigate]);

    // 날짜 포맷 및 7일 만료일 계산 함수
    const getExpiryStatus = (createdAtString: string) => {
        const createdDate = new Date(createdAtString);
        const currentDate = new Date();

        // 2026.04.09 형식의 분석 날짜 문자열 추출
        const analysisDate = `${createdDate.getFullYear()}.${String(createdDate.getMonth() + 1).padStart(2, '0')}.${String(createdDate.getDate()).padStart(2, '0')}`;

        // 만료일시 계산 (생성시각 + 7일)
        const expiryDate = new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        // 남은 시간 계산 (밀리초 단위)
        const diffTime = expiryDate.getTime() - currentDate.getTime();

        // 남은 일수 계산 (올림 처리하여 하루 미만으로 남았어도 D-0 혹은 D-1 표현 유지)
        const dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isExpired = diffTime <= 0;

        return { analysisDate, dDay: isExpired ? 0 : dDay, isExpired };
    };

    return (
        <div className="min-h-screen w-full bg-[#0a0a0c] relative overflow-hidden flex flex-col items-center font-sans text-[#f0eaf8]">

            {/* 배경 디자인 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-[#60a5fa] opacity-[0.12] blur-[40px]"></div>
            <div className="absolute -left-[80px] -top-[40px] w-[250px] h-[250px] rounded-full bg-[#c084fc] opacity-[0.08] blur-[40px]"></div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {stars.map((s) => (
                    <div key={s} className="absolute bg-white rounded-full" style={{ width: '1px', height: '1px', opacity: Math.random() * 0.1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
                ))}
            </div>

            {/* 상단 헤더 영역 */}
            <header className="w-full px-[20px] py-[15px] mt-[44px] flex flex-row items-center justify-between z-20 shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="#f0eaf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="text-[#c084fc] text-[14px] font-normal font-['Noto_Sans_KR'] leading-[20px]">
                    사주보관
                </div>
                <div className="w-[24px]"></div>
            </header>

            <div className="w-full max-w-[375px] min-h-screen relative z-10">

                {/* 보관함 요약 정보 */}
                <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[335px] bg-[rgba(192,132,252,0.07)] rounded-[12px] border border-[rgba(192,132,252,0.22)] p-[16px_24px] flex flex-row justify-center items-center gap-[8px] z-10">
                    <div className="flex flex-col items-center justify-center gap-[8px] flex-shrink-0 relative">
                        <div className="text-center flex items-center justify-center text-[12px] font-normal font-['Noto_Sans_KR']">
                            <span>
                                <span className="text-[#9d8fba] font-light">심층 분석 결과는 </span>
                                <span className="text-[#c084fc] font-normal">결제일로부터 7일 후 만료</span>
                                <span className="text-[#9d8fba] font-light"> 됩니다.</span>
                            </span>
                        </div>
                        <div className="text-[#4a4068] text-center text-[10px] font-light font-['Noto_Sans_KR'] flex items-center justify-center">
                            영구 소장은 결과 페이지 내의 PDF저장을 이용해주세요.
                        </div>
                    </div>
                </div>

                {/* 리스트 타이틀 */}
                <div className="absolute top-[120px] left-[20px] text-[#9d8fba] text-[13px] font-light">
                    내 결과
                </div>

                {/* 사주 리스트 컨테이너 */}
                <div className="absolute top-[150px] left-[20px] w-[335px] flex flex-col gap-[20px] z-10 overflow-y-auto max-h-[480px] pb-10 scrollbar-hide">
                    {isLoading ? (
                        <div className="text-center text-[#9d8fba] py-12 text-[14px]">보관 기록을 불러오는 중...</div>
                    ) : readings.length === 0 ? (
                        <div className="text-center text-[#9d8fba] py-12 text-[14px]">보관된 분석 결과가 없습니다.</div>
                    ) : (
                        readings.map((record) => {
                            // 각 데이터의 날짜, D-day, 만료상태 계산
                            const { analysisDate, dDay, isExpired } = getExpiryStatus(record.created_at);

                            // 서버 form_data 내 이름 가져오기 (예외처리 방어코드 포함)
                            const myName = record.form_data?.me?.name || '나';
                            const partnerName = record.form_data?.partner?.name || '상대방';

                            // 궁합 점수 (무료 결과 혹은 유료 결과의 스코어 연동 - 명세 기준 compatibility 매칭)
                            const score = record.free_result?.score || record.free_result?.compatibility || 0;

                            return (
                                <div
                                    key={record.id}
                                    className={`w-full rounded-[20px] border border-[rgba(192,132,252,0.2)] overflow-hidden transition-all
                                    ${isExpired ? 'bg-[#0f0d18] opacity-60' : 'bg-[#0f0d18] shadow-lg'}`}
                                >
                                    {/* 상단 바 */}
                                    <div className="bg-[#141120] border-b border-[rgba(180,140,255,0.11)] p-[12px_16px] flex flex-row items-center justify-between">
                                        <div className="text-[#4a4068] text-[10px] font-light font-['Noto_Sans_KR']">
                                            {analysisDate} 분석
                                        </div>
                                        <div className={`text-[10px] font-light font-['Noto_Sans_KR'] ${isExpired ? 'text-[#4a4068]' : 'text-[#f472b6]'}`}>
                                            {isExpired ? '만료' : `D-${dDay}`}
                                        </div>
                                    </div>

                                    {/* 내용 섹션 */}
                                    <div className="p-[16px_20px] flex flex-col gap-[8px] self-stretch relative overflow-hidden min-h-[100px] justify-center">
                                        {isExpired ? (
                                            <div className="flex flex-row items-center justify-center gap-[6px] py-[10px]">
                                                <span className="text-[10px]">⚠️</span>
                                                <span className="text-[#9D8FBA] text-[10px] font-light font-['Noto_Sans_KR'] tracking-tight">
                                                    열람 기간이 만료되었어요.
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-row items-center justify-between self-stretch flex-shrink-0 relative">
                                                {/* 왼쪽: 이름 영역 */}
                                                <div className="flex flex-row gap-[8px] items-center justify-center flex-shrink-0 relative">
                                                    <div className="flex flex-col gap-0 items-center justify-center flex-shrink-0 relative">
                                                        <div className="text-[#4a4068] text-center text-[9px] tracking-[1px] font-light font-['Noto_Sans_KR']">나</div>
                                                        <div className="text-[#f0eaf8] text-center text-[14px] leading-[18.9px] font-semibold font-['Noto_Serif_KR']">
                                                            {myName}
                                                        </div>
                                                    </div>

                                                    <div className="w-[12px] h-[12px] flex-shrink-0 opacity-40">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 10.5S1 7.5 1 4a2.5 2.5 0 014.5-1.5h1A2.5 2.5 0 0111 4c0 3.5-5 6.5-5 6.5z" fill="#c084fc" /></svg>
                                                    </div>

                                                    <div className="flex flex-col gap-0 items-center justify-center flex-shrink-0 relative">
                                                        <div className="text-[#4a4068] text-center text-[9px] tracking-[1px] font-light font-['Noto_Sans_KR']">상대방</div>
                                                        <div className="text-[#f0eaf8] text-center text-[14px] leading-[18.9px] font-semibold font-['Noto_Serif_KR']">
                                                            {partnerName}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 오른쪽: 궁합 점수 영역 */}
                                                <div className="flex flex-col gap-[8px] items-center justify-start flex-shrink-0 relative">
                                                    <div className="rounded-[36px] flex flex-row gap-0 items-center justify-center flex-shrink-0 relative">
                                                        <div className="relative w-[42px] h-[42px] flex-shrink-0">
                                                            <div className="absolute inset-0 rounded-full border-[4px] border-[rgba(180,140,255,0.11)]"></div>
                                                            <div className="absolute inset-0 flex items-center justify-center text-[#c084fc] text-center text-[16px] font-semibold font-['Noto_Serif_KR']">
                                                                {score}
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
                                                                    strokeDashoffset={`${2 * Math.PI * 19 * (1 - score / 100)}`}
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

                                    {/* 하단 버튼 제어 */}
                                    {!isExpired ? (
                                        <button
                                            onClick={() => {
                                                navigate('/result', {
                                                    state: {
                                                        paidResult: {
                                                            ...(record.paid_result || {}),
                                                            id: record.id,

                                                            formData: record.form_data,
                                                            form_data: record.form_data,

                                                            freeResult: record.free_result,
                                                            free_result: record.free_result
                                                        }
                                                    }
                                                });
                                            }}
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
                                        <div className="h-[12px]"></div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div >
    );
}