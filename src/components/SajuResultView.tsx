import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PersonInput, SajuResult, RelationResult } from '../types/saju';
import { HANJA_TO_HANGUL } from '../constants/sajuData';
import { getSipseong } from '../utils/sajuEngine';
import crystalBall from '../assets/icon-crystal-ball.svg';
import heartIcon from '../assets/icon-heart.svg';
import type { PaidResult } from '../types/saju';
import { saveAsPdf } from '../lib/pdf';
import { enableSharing } from '../lib/payment';

import download from '../assets/images/download.png';
import link from '../assets/images/link.png';

interface Props {
  me: PersonInput;
  pt: PersonInput;
  analysis: { meSaju: SajuResult; ptSaju: SajuResult; score: number; relation: RelationResult; scoreComment: { title: string; desc: string } };
  onReset: () => void;
  paidResult?: PaidResult | null;
  readOnly?: boolean;
}

// PremiumCard 컴포넌트
interface PremiumCardProps {
  num: string;
  category: string;
  title: string;
  icon: string;
  onUnlock: () => void;
  children: React.ReactNode;
}

const PremiumCard = ({ num, title, icon, onUnlock, children }: PremiumCardProps) => (
  <div className="bg-[#141120] rounded-[2rem] border border-[rgba(180,140,255,0.11)] overflow-hidden relative mb-4 shadow-lg">
    <div className="p-5 border-b border-[rgba(180,140,255,0.05)] flex items-center gap-4">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#0f0d18] border border-[rgba(180,140,255,0.11)] text-[#f0eaf8]">{icon}</div>
      <div>
        <div className="text-[10px] text-[#c084fc] font-bold mb-0.5">{num}</div>
        <div className="text-sm font-bold text-[#f0eaf8]">{title}</div>
      </div>
    </div>
    <div className="relative">
      <div className="p-6 text-[13px] text-[#c0bad0] leading-relaxed space-y-4 blur-[6px] opacity-40 select-none transition-all duration-500">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(180deg,rgba(20,17,32,0)_0%,rgba(20,17,32,0.96)_40%)] z-10">
        <div className="text-2xl mb-2">🔒</div>
        <div className="text-[11px] text-[#9d8fba] mb-4">결제 후 모든 내용을 확인할 수 있어요</div>
        {/* ⭐️ 혹시 모를 폼 제출(새로고침) 방지를 위해 type="button" 추가 */}
        <button type="button" onClick={onUnlock} className="px-5 py-2.5 bg-[linear-gradient(135deg,#C084FC,#F472B6)] hover:opacity-90 text-white text-[12px] font-bold rounded-full transition-opacity shadow-[0_4px_14px_rgba(192,132,252,0.39)]">
          잠금 해제하기
        </button>
      </div>
    </div>
  </div>
);

export default function SajuResultView({ me, pt, analysis, onReset, paidResult, readOnly }: Props) {
  const navigate = useNavigate();
  const pdfRef = React.useRef<HTMLDivElement>(null);
  const [shareLoading, setShareLoading] = useState(false);

  React.useEffect(() => {
    if (paidResult) {
      sessionStorage.removeItem('saju_paid_result');
    }
  }, [paidResult]);

  // ⭐️ 가장 핵심적인 수정: 로그인 상태를 따질 필요 없이 무조건 결제창으로 보냅니다!
  // App.tsx의 라우터가 알아서 가로채서 로그인->결제창으로 완벽하게 안내해 줍니다.
  const handleUnlockClick = () => {
    navigate('/payment');
  };

  // 사주 팔자 렌더링 함수
  const renderSajuChar = (char: string | undefined, dayMaster: string, isDayPillar: boolean) => {
    if (!char || char === '?') {
      return (
        <div className="flex flex-col items-center justify-center py-2">
          <span className="text-2xl font-serif text-[#4a4068]">?</span>
        </div>
      );
    }
    const sipseong = getSipseong(dayMaster, char);
    const hangul = HANJA_TO_HANGUL[char] || '';

    const sipseongColor = isDayPillar ? 'text-[#c084fc]' : 'text-[#4a4068]';
    const hangulColor = isDayPillar ? 'text-[#f472b6]' : 'text-[#4a4068]';
    const hanjaStyle = isDayPillar
      ? "text-[28px] font-['Noto_Serif_KR'] font-black text-transparent bg-clip-text bg-gradient-to-b from-[#c084fc] to-[#f472b6] [.is-pdf-capturing_&]:text-[#f472b6] [.is-pdf-capturing_&]:bg-none"
      : "text-[28px] font-['Noto_Serif_KR'] font-black text-[#f0eaf8]";

    return (
      <div className="flex flex-col items-center justify-center py-1">
        <span className={`text-[10px] font-bold mb-2 ${sipseongColor}`}>{sipseong}</span>
        <span className={hanjaStyle}>{char}</span>
        <span className={`text-[10px] mt-2 font-bold ${hangulColor}`}>{hangul}</span>
      </div>
    );
  };

  // 문의하기 클릭 핸들러
  const handleInquiryClick = () => {
    const email = "2019ootd@gmail.com";
    const subject = encodeURIComponent("[사주페어링] 서비스 문의사항");
    window.location.href = `mailto:${email}?subject=${subject}`;
  };

  // pdf 저장 클릭 핸들러 
  const handleDownloadPdf = () => {
    if (pdfRef.current) {
      saveAsPdf(pdfRef.current, '사주페어링_결과.pdf');
    }
  };

  // 링크 공유 클릭 핸들러
  const handleShareLink = async () => {
    if (shareLoading) return;
    const readingId = paidResult?.readingId;

    if (!readingId) {
      alert('공유할 수 있는 결과가 없습니다.');
      return;
    }

    setShareLoading(true);
    try {
      const shareUrl = await enableSharing(readingId);

      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch (clipboardErr) {
        console.error('클립보드 복사 실패:', clipboardErr);
      }

      if (navigator.share) {
        await navigator.share({ title: '사주페어링 결과', url: shareUrl });
      } else {
        alert('링크가 복사되었습니다!');
      }
    } catch (err) {
      console.error('공유 처리 실패:', err);
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setShareLoading(false);
    }
  };

  return (
    <div ref={pdfRef} className="min-h-screen relative overflow-x-hidden font-sans text-[#f0eaf8] bg-[#07060c] pb-20 pt-[70px] animate-fade-in-up [&.is-pdf-capturing]:animate-none">
      {/* 몽환적 배경 */}
      <div data-html2canvas-ignore="true" className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#c084fc] rounded-full blur-[120px] opacity-10 -z-10 mix-blend-screen pointer-events-none"></div>
      <div data-html2canvas-ignore="true" className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#f472b6] rounded-full blur-[140px] opacity-10 -z-10 mix-blend-screen pointer-events-none"></div>

      <div className="max-w-md mx-auto p-5 space-y-6">

        {/* 상단: 분석 완료 라벨 */}
        <div className="flex justify-center mb-6">
          <div className="px-5 py-1.5 rounded-full bg-[#141120] border border-[rgba(180,140,255,0.20)] text-[#9D8FBA] text-[10px] font-light tracking-[0.3px] shadow-[0_0_15px_rgba(192,132,252,0.15)] flex items-center gap-2 font-['Noto_Sans_KR']">
            <span className="text-[#c084fc]">✦</span> 분석 완료 <span className="text-[#c084fc]">✦</span>
          </div>
        </div>

        {/* 히어로 카드 (궁합 점수) */}
        <div className="bg-[#141120] rounded-[2rem] p-6 flex justify-between items-center border border-[rgba(180,140,255,0.11)] shadow-lg mb-8">
          <div className="text-center flex-1">
            <div className="text-[11px] text-[#4a4068] mb-1.5 font-bold">나</div>
            <div className="text-[18px] font-['Noto_Serif_KR'] font-bold text-[#f0eaf8] truncate">{me.name || '나'}</div>
            <div className="text-[10px] text-[#4a4068] mt-1.5 font-bold tracking-widest">{me.date.replace(/-/g, '.')}</div>
          </div>

          <div className="flex flex-col items-center px-2">
            <div className="w-14 h-14 rounded-full bg-[rgba(180,140,255,0.08)] border border-[rgba(180,140,255,0.2)] flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(192,132,252,0.15)]">
              <img src={heartIcon} alt="heart icon" className="w-[24px] h-[24px]" />
            </div>
            <div className="text-[12px] font-black text-[#f472b6]">궁합 {analysis.score}점</div>
          </div>

          <div className="text-center flex-1">
            <div className="text-[11px] text-[#4a4068] mb-1.5 font-bold">상대방</div>
            <div className="text-[18px] font-['Noto_Serif_KR'] font-bold text-[#f0eaf8] truncate">{pt.name || '상대방'}</div>
            <div className="text-[10px] text-[#4a4068] mt-1.5 font-bold tracking-widest">{pt.date.replace(/-/g, '.')}</div>
          </div>
        </div>

        {/* ☀️ 나의 사주 원국표 */}
        <div className="bg-[#141120] rounded-[2rem] border border-[rgba(180,140,255,0.11)] shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(180,140,255,0.05)] flex items-center gap-2 bg-[#0f0d18]">
            <span className="text-[12px]">👤</span>
            <span className="text-[#7eb8f7] font-['Noto_Sans_KR'] text-[11px] font-medium leading-normal tracking-[1.5px]">나 ({me.name || '나'})</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-4 text-center mb-3 border-b border-[rgba(180,140,255,0.05)] pb-3">
              {['시주', '일주', '월주', '년주'].map((label, i) => (
                <div key={i} className={`text-[10px] font-bold ${i === 1 ? 'text-[#c084fc]' : 'text-[#4a4068]'}`}>{label}</div>
              ))}
            </div>
            <div className="grid grid-cols-4 text-center mb-4">
              {[analysis.meSaju.hour.charAt(0), analysis.meSaju.day.charAt(0), analysis.meSaju.month.charAt(0), analysis.meSaju.year.charAt(0)].map((char, i) => (
                <div key={`me-top-${i}`}>{renderSajuChar(char, analysis.meSaju.day.charAt(0), i === 1)}</div>
              ))}
            </div>
            <div className="grid grid-cols-4 text-center">
              {[analysis.meSaju.hour.charAt(1), analysis.meSaju.day.charAt(1), analysis.meSaju.month.charAt(1), analysis.meSaju.year.charAt(1)].map((char, i) => (
                <div key={`me-bot-${i}`}>{renderSajuChar(char, analysis.meSaju.day.charAt(0), i === 1)}</div>
              ))}
            </div>
          </div>
        </div>

        {/* 🌙 상대방 사주 원국표 */}
        <div className="bg-[#141120] rounded-[2rem] border border-[rgba(180,140,255,0.11)] shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(180,140,255,0.05)] flex items-center gap-2 bg-[#0f0d18]">
            <span className="text-[12px]">👤</span>
            <span className="text-[#c084fc] font-['Noto_Sans_KR'] text-[11px] font-medium leading-normal tracking-[1.5px]">상대방 ({pt.name || '상대방'})</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-4 text-center mb-3 border-b border-[rgba(180,140,255,0.05)] pb-3">
              {['시주', '일주', '월주', '년주'].map((label, i) => (
                <div key={i} className={`text-[10px] font-bold ${i === 1 ? 'text-[#c084fc]' : 'text-[#4a4068]'}`}>{label}</div>
              ))}
            </div>
            <div className="grid grid-cols-4 text-center mb-4">
              {[analysis.ptSaju.hour.charAt(0), analysis.ptSaju.day.charAt(0), analysis.ptSaju.month.charAt(0), analysis.ptSaju.year.charAt(0)].map((char, i) => (
                <div key={`pt-top-${i}`}>{renderSajuChar(char, analysis.ptSaju.day.charAt(0), i === 1)}</div>
              ))}
            </div>
            <div className="grid grid-cols-4 text-center">
              {[analysis.ptSaju.hour.charAt(1), analysis.ptSaju.day.charAt(1), analysis.ptSaju.month.charAt(1), analysis.ptSaju.year.charAt(1)].map((char, i) => (
                <div key={`pt-bot-${i}`}>{renderSajuChar(char, analysis.ptSaju.day.charAt(0), i === 1)}</div>
              ))}
            </div>
          </div>
        </div>

        {/* 합/충 카드 */}
        <div className="grid grid-cols-2 gap-3 mt-8">

          {/* 핑크색 합(合) 카드 */}
          <div className="bg-[#f472b6]/[0.06] p-5 rounded-[14px] border border-[#f472b6]/20 flex flex-col items-center text-center">
            <div className="text-2xl mb-2">💕</div>
            <h3 className="text-[14px] font-bold text-[#f472b6] mb-2">일지 합</h3>

            {/* 분석 결과 */}
            <div className="w-full text-[#9D8FBA] font-['Noto_Sans_KR'] text-[10px] font-light leading-[15.5px] break-keep">
              <div className="mb-1">{analysis.relation.hapTitle}</div>
              <div>{analysis.relation.hapDesc}</div>
            </div>
          </div>

          {/* 오렌지색 충(沖) 카드 */}
          <div className="bg-[#fb923c]/[0.06] p-5 rounded-[14px] border border-[#fb923c]/20 flex flex-col items-center text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-[14px] font-bold text-[#fb923c] mb-2">일간 상극</h3>

            {/* 분석 결과 */}
            <div className="w-full text-[#9D8FBA] font-['Noto_Sans_KR'] text-[10px] font-light leading-[15.5px] break-keep">
              <div className="mb-1">{analysis.relation.chungTitle}</div>
              <div>{analysis.relation.chungDesc}</div>
            </div>
          </div>

        </div>

        {/* 오행 구성 비교 */}
        <div className="bg-[#141120] rounded-[2rem] p-6 border border-[rgba(180,140,255,0.11)] shadow-lg mt-8">
          <div className="text-[#7eb8f7] font-['Noto_Sans_KR'] text-[11px] font-medium leading-normal tracking-[1px] mb-6 flex justify-between items-center px-1">
            <span>🌿 오행 구성 비교</span>
          </div>
          <div className="grid grid-cols-[28px_1fr_1fr] gap-5 mb-5 text-center">
            <div></div>
            <div className="text-[#4A4068] text-center font-['Noto_Sans_KR'] text-[9px] font-light leading-normal">나</div>
            <div className="text-[#4A4068] text-center font-['Noto_Sans_KR'] text-[9px] font-light leading-normal">상대</div>
          </div>
          <div className="space-y-4">
            {['목', '화', '토', '금', '수'].map((el) => {
              const hanjaMap: Record<string, string> = { '목': '木', '화': '火', '토': '土', '금': '金', '수': '水' };
              const mePct = (analysis.meSaju.elements[el] / analysis.meSaju.totalChars) * 100;
              const ptPct = (analysis.ptSaju.elements[el] / analysis.ptSaju.totalChars) * 100;
              return (
                <div key={el} className="grid grid-cols-[28px_1fr_1fr] gap-5 items-center">
                  <div className="text-[#9d8fba] text-center font-['Noto_Sans_KR'] text-[12px] font-light leading-normal">{hanjaMap[el]}</div>
                  <div className="h-2 w-full bg-[#0f0d18] rounded-full overflow-hidden shadow-inner border border-[rgba(180,140,255,0.05)]">
                    <div className="h-full bg-[#7eb8f7] rounded-full transition-all duration-1000" style={{ width: `${mePct}%` }}></div>
                  </div>
                  <div className="h-2 w-full bg-[#0f0d18] rounded-full overflow-hidden shadow-inner border border-[rgba(180,140,255,0.05)]">
                    <div className="h-full bg-[#c084fc] rounded-full transition-all duration-1000" style={{ width: `${ptPct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 궁합 상세 설명 */}
        <div className="bg-[#141120] rounded-[2rem] p-6 border border-[rgba(180,140,255,0.11)] shadow-lg mt-8">
          <div className="text-[#7eb8f7] font-['Noto_Sans_KR'] text-[11px] font-medium leading-normal tracking-[1px] mb-5 flex items-center gap-2 px-1">
            <span>⭐</span>
            <h3>궁합 점수</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-[84px] h-[84px] flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 84 84">
                <circle cx="42" cy="42" r="36" stroke="rgba(126, 184, 247, 0.15)" strokeWidth="6" fill="none" />
                <circle
                  cx="42" cy="42" r="36" stroke="#7eb8f7" strokeWidth="6" fill="none" strokeLinecap="round"
                  style={{
                    strokeDasharray: 226.2,
                    strokeDashoffset: 226.2 - (analysis.score / 100) * 226.2,
                    transition: 'stroke-dashoffset 1.5s ease-out'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#7eb8f7] text-center font-['Noto_Serif_KR'] text-[18px] font-bold leading-normal">
                  {analysis.score}
                  <span className="text-[#7eb8f7] font-['Noto_Sans_KR'] text-[9px] font-light leading-normal tracking-[1px] ml-0.5">점</span>
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[#f0eaf8] font-['Noto_Sans_KR'] text-[13px] font-bold leading-normal mb-1.5 break-keep">
                {analysis.scoreComment.title}
              </div>
              <p className="text-[#9d8fba] font-['Noto_Sans_KR'] text-[11.5px] font-light leading-[18.4px] break-keep">
                {analysis.scoreComment.desc}
              </p>
            </div>
          </div>
        </div>

        {/* 운의 흐름 */}
        <div className="bg-[#141120] rounded-[2rem] p-6 border border-[rgba(180,140,255,0.11)] shadow-lg mb-12">
          <div className="text-[#7eb8f7] font-['Noto_Sans_KR'] text-[11px] font-medium leading-normal tracking-[1px] mb-6 flex items-center gap-2 px-1">
            <span>🌊</span> 현재 운의 흐름
          </div>
          <div className="space-y-6">
            <div>
              <div className="text-[#4a4068] font-['Noto_Sans_KR'] text-[10px] font-light tracking-[1px] mb-3 px-1">나의 운</div>
              <div className="grid grid-cols-3 gap-3">

                <div className="bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-[11px] flex flex-col items-center justify-center py-4 shadow-sm">
                  <span className="text-[#4a4068] text-center font-['Noto_Sans_KR'] text-[9px] font-light tracking-[1px] mb-2">대운</span>
                  <span className="text-[#f0eaf8] text-center font-['Noto_Serif_KR'] text-[18px] font-semibold">{analysis.meSaju.fortune.daeUnAge}</span>
                  <span className="text-[#9d8fba] text-center font-['Noto_Sans_KR'] text-[10px] font-light mt-2">{analysis.meSaju.fortune.daeUnPillar}</span>
                </div>

                <div className="bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-[11px] flex flex-col items-center justify-center py-4 shadow-sm">
                  <span className="text-[#4a4068] text-center font-['Noto_Sans_KR'] text-[9px] font-light tracking-[1px] mb-2">세운</span>
                  <span className="text-[#f0eaf8] text-center font-['Noto_Serif_KR'] text-[18px] font-semibold">{analysis.meSaju.fortune.seUnYear}</span>
                  <span className="text-[#9d8fba] text-center font-['Noto_Sans_KR'] text-[10px] font-light mt-2">{analysis.meSaju.fortune.seUnPillar}</span>
                </div>

                <div className="bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-[11px] flex flex-col items-center justify-center py-4 shadow-sm">
                  <span className="text-[#4a4068] text-center font-['Noto_Sans_KR'] text-[9px] font-light tracking-[1px] mb-2">월운</span>
                  <span className="text-[#f0eaf8] text-center font-['Noto_Serif_KR'] text-[18px] font-semibold">{analysis.meSaju.fortune.wolUnMonth}</span>
                  <span className="text-[#9d8fba] text-center font-['Noto_Sans_KR'] text-[10px] font-light mt-2">{analysis.meSaju.fortune.wolUnPillar}</span>
                </div>

              </div>
            </div>

            <div>
              <div className="text-[#4a4068] font-['Noto_Sans_KR'] text-[10px] font-light tracking-[1px] mb-3 px-1">상대방의 운</div>
              <div className="grid grid-cols-3 gap-3">

                <div className="bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-[11px] flex flex-col items-center justify-center py-4 shadow-sm">
                  <span className="text-[#4a4068] text-center font-['Noto_Sans_KR'] text-[9px] font-light tracking-[1px] mb-2">대운</span>
                  <span className="text-[#f0eaf8] text-center font-['Noto_Serif_KR'] text-[18px] font-semibold">{analysis.ptSaju.fortune.daeUnAge}</span>
                  <span className="text-[#9d8fba] text-center font-['Noto_Sans_KR'] text-[10px] font-light mt-2">{analysis.ptSaju.fortune.daeUnPillar}</span>
                </div>

                <div className="bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-[11px] flex flex-col items-center justify-center py-4 shadow-sm">
                  <span className="text-[#4a4068] text-center font-['Noto_Sans_KR'] text-[9px] font-light tracking-[1px] mb-2">세운</span>
                  <span className="text-[#f0eaf8] text-center font-['Noto_Serif_KR'] text-[18px] font-semibold">{analysis.ptSaju.fortune.seUnYear}</span>
                  <span className="text-[#9d8fba] text-center font-['Noto_Sans_KR'] text-[10px] font-light mt-2">{analysis.ptSaju.fortune.seUnPillar}</span>
                </div>

                <div className="bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-[11px] flex flex-col items-center justify-center py-4 shadow-sm">
                  <span className="text-[#4a4068] text-center font-['Noto_Sans_KR'] text-[9px] font-light tracking-[1px] mb-2">월운</span>
                  <span className="text-[#f0eaf8] text-center font-['Noto_Serif_KR'] text-[18px] font-semibold">{analysis.ptSaju.fortune.wolUnMonth}</span>
                  <span className="text-[#9d8fba] text-center font-['Noto_Sans_KR'] text-[10px] font-light mt-2">{analysis.ptSaju.fortune.wolUnPillar}</span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* 심층 분석 라벨 */}
        <div className="flex flex-col items-center mb-6 mt-16">
          <div className="px-5 py-1.5 rounded-full bg-[#141120] border border-[rgba(180,140,255,0.20)] text-[#c084fc] text-[10px] font-bold tracking-[0.2em] flex items-center gap-2 mb-4">
            <span>✦</span> 심층 분석 <span>✦</span>
          </div>
          <div className="w-16 h-px bg-[rgba(180,140,255,0.2)]"></div>
        </div>

        {/* ✅ 변경점 4: 결제 전/후 분기 시작 */}
        {paidResult ? (
          // ── 결제 완료 상태: 유료 결과 노출 ──
          <div className="space-y-4">

            {/* 01 · 상대방 속마음 */}
            <div className="bg-[#141120] rounded-[2rem] border border-[rgba(180,140,255,0.11)] overflow-hidden shadow-lg">
              <div className="p-5 border-b border-[rgba(180,140,255,0.05)] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#0f0d18] border border-[rgba(180,140,255,0.11)]">💭</div>
                <div>
                  <div className="text-[10px] text-[#c084fc] font-bold mb-0.5">01</div>
                  <div className="text-sm font-bold text-[#f0eaf8]">지금 그 사람은 나를 어떻게 생각할까요</div>
                </div>
              </div>
              <div className="p-6 text-[13px] text-[#c0bad0] leading-relaxed space-y-4">
                <p>{paidResult.sections.속마음}</p>
              </div>
            </div>

            {/* 02 · 새로운 인연 가능성 */}
            <div className="bg-[#141120] rounded-[2rem] border border-[rgba(180,140,255,0.11)] overflow-hidden shadow-lg">
              <div className="p-5 border-b border-[rgba(180,140,255,0.05)] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#0f0d18] border border-[rgba(180,140,255,0.11)]">👁️</div>
                <div>
                  <div className="text-[10px] text-[#c084fc] font-bold mb-0.5">02</div>
                  <div className="text-sm font-bold text-[#f0eaf8]">상대방에게 새로운 사람이 생겼을까요</div>
                </div>
              </div>
              <div className="p-6 text-[13px] text-[#c0bad0] leading-relaxed space-y-4">
                <p>{paidResult.sections.새인연}</p>
              </div>
            </div>

            {/* 03 · 재회 가능성 */}
            <div className="bg-[#141120] rounded-[2rem] border border-[rgba(180,140,255,0.11)] overflow-hidden shadow-lg">
              <div className="p-5 border-b border-[rgba(180,140,255,0.05)] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#0f0d18] border border-[rgba(180,140,255,0.11)]">✨</div>
                <div>
                  <div className="text-[10px] text-[#c084fc] font-bold mb-0.5">03</div>
                  <div className="text-sm font-bold text-[#f0eaf8]">두 사람이 다시 만날 확률은 얼마나 될까요</div>
                </div>
              </div>
              <div className="p-6 text-[13px] text-[#c0bad0] leading-relaxed space-y-4">

                {/* 원형 프로그래스바 위젯 */}
                <div className="flex items-center gap-6 bg-[#0f0d18] p-5 rounded-2xl mb-4 border border-[rgba(180,140,255,0.08)]">
                  <div className="relative w-[74px] h-[74px] flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 84 84">
                      <circle cx="42" cy="42" r="36" stroke="rgba(192, 132, 252, 0.15)" strokeWidth="8" fill="none" />
                      <circle
                        cx="42" cy="42" r="36" stroke="#c084fc" strokeWidth="8" fill="none" strokeLinecap="round"
                        style={{
                          strokeDasharray: 226.2,
                          strokeDashoffset: 226.2 - (paidResult.reunionProbability / 100) * 226.2,
                          transition: 'stroke-dashoffset 1.5s ease-out'
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[#c084fc] text-center font-['Noto_Serif_KR'] text-[16px] font-bold">
                        {paidResult.reunionProbability}%
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 text-[11.5px] text-[#9d8fba] leading-[1.6] break-keep font-medium">
                    {paidResult.reunionDesc}
                  </div>
                </div>

                <p>{paidResult.sections.재회가능성설명}</p>
              </div>
            </div>

            {/* 04 · 재회 최적 타이밍 */}
            <div className="bg-[#141120] rounded-[2rem] border border-[rgba(180,140,255,0.11)] overflow-hidden shadow-lg">
              <div className="p-5 border-b border-[rgba(180,140,255,0.05)] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#0f0d18] border border-[rgba(180,140,255,0.11)]">📅</div>
                <div>
                  <div className="text-[10px] text-[#c084fc] font-bold mb-0.5">04</div>
                  <div className="text-sm font-bold text-[#f0eaf8]">언제 연락하는 게 가장 좋을까요</div>
                </div>
              </div>
              <div className="p-6 text-[13px] text-[#c0bad0] leading-relaxed space-y-4">
                {/* 타이밍 칩 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {paidResult.goodMonths.map((month) => (
                    <span key={month} className="px-3 py-1 bg-[#0f0d18] border border-[rgba(180,140,255,0.08)] text-[#c084fc] rounded-full text-[10px] font-bold">
                      {month} ✓
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-[#0f0d18] text-[#f472b6] rounded-full text-[10px] font-bold border border-[#f472b6]/30">
                    {paidResult.bestMonth} 🔥 최고
                  </span>
                  {paidResult.badMonths.map((month) => (
                    <span key={month} className="px-3 py-1 bg-[#0f0d18] border border-[rgba(180,140,255,0.08)] text-[#4a4068] rounded-full text-[10px]">
                      {month} ⚠️
                    </span>
                  ))}
                </div>
                <p>{paidResult.sections.타이밍설명}</p>
              </div>
            </div>

            {/* 05 · 효과적인 접근법 */}
            <div className="bg-[#141120] rounded-[2rem] border border-[rgba(180,140,255,0.11)] overflow-hidden shadow-lg">
              <div className="p-5 border-b border-[rgba(180,140,255,0.05)] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#0f0d18] border border-[rgba(180,140,255,0.11)]">💌</div>
                <div>
                  <div className="text-[10px] text-[#c084fc] font-bold mb-0.5">05</div>
                  <div className="text-sm font-bold text-[#f0eaf8]">어떻게 다가가야 마음이 열릴까요</div>
                </div>
              </div>
              <div className="p-6 text-[13px] text-[#c0bad0] leading-relaxed space-y-4">
                <p>{paidResult.sections.접근법}</p>
              </div>
            </div>

            {/* 06 · 재회 후 지속 가능성 */}
            <div className="bg-[#141120] rounded-[2rem] border border-[rgba(180,140,255,0.11)] overflow-hidden shadow-lg">
              <div className="p-5 border-b border-[rgba(180,140,255,0.05)] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#0f0d18] border border-[rgba(180,140,255,0.11)]">🌱</div>
                <div>
                  <div className="text-[10px] text-[#c084fc] font-bold mb-0.5">06</div>
                  <div className="text-sm font-bold text-[#f0eaf8]">다시 만나도 오래 갈 수 있을까요</div>
                </div>
              </div>
              <div className="p-6 text-[13px] text-[#c0bad0] leading-relaxed space-y-4">
                <p>{paidResult.sections.지속가능성}</p>
              </div>
            </div>

            {/* 07 · 행동 지침 */}
            <div className="bg-[#141120] rounded-[2rem] border border-[rgba(180,140,255,0.11)] overflow-hidden shadow-lg">
              <div className="p-5 border-b border-[rgba(180,140,255,0.05)] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#0f0d18] border border-[rgba(180,140,255,0.11)]">⚡</div>
                <div>
                  <div className="text-[10px] text-[#c084fc] font-bold mb-0.5">07</div>
                  <div className="text-sm font-bold text-[#f0eaf8]">해야 할 것과 절대 하면 안 될 것</div>
                </div>
              </div>
              <div className="p-6 text-[13px] text-[#c0bad0] leading-relaxed space-y-4">
                <p>{paidResult.sections.행동지침설명}</p>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  <div className="bg-[#0f0d18] p-4 rounded-xl border border-[#c084fc]/20">
                    <div className="text-[10px] text-[#c084fc] font-bold mb-2">✦ 지금 해야 할 것</div>
                    <ul className="text-[11px] space-y-1.5 text-[#b0a8c4]">
                      {paidResult.doList.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#c084fc] mt-0.5">✓</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#0f0d18] p-4 rounded-xl border border-[#f472b6]/20">
                    <div className="text-[10px] text-[#f472b6] font-bold mb-2">✦ 절대 하면 안 될 것</div>
                    <ul className="text-[11px] space-y-1.5 text-[#b0a8c4]">
                      {paidResult.dontList.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[#f472b6] mt-0.5">✗</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* 08 · 종합 총평 */}
            <div className="bg-[linear-gradient(135deg,rgba(192,132,252,0.06),rgba(244,114,182,0.04))] rounded-[2rem] p-8 border border-[rgba(180,140,255,0.15)] text-center shadow-lg">
              <div className="text-[#f0c060] text-2xl mb-3">✦</div>
              <div className="text-[#f0eaf8] font-black mb-4 font-['Noto_Serif_KR'] text-[18px]">종합 총평</div>
              <p className="text-[12.5px] text-[#c0bad0] leading-relaxed mb-6 text-left break-keep">
                {paidResult.sections.총평}
              </p>
              <div
                className="inline-flex items-center gap-2 py-3 px-8 rounded-full font-normal text-[13px] text-[#ffffff] shadow-sm transition-all"
                style={{
                  backgroundColor: 'rgba(192, 132, 252, 0.14)',
                  border: '1px solid rgba(192, 132, 252, 0.18)',
                }}
              >
                <span>{paidResult.verdict}</span>
              </div>
            </div>

            {/* 공유 및 안내 섹션 */}
            {!readOnly && (
              <div data-html2canvas-ignore="true" className="mt-20 space-y-8 px-2 pt-8 border-t border-[rgba(180,140,255,0.1)]">

                {/* 1. 상단 버튼 그룹 (PDF저장 / 링크 공유) */}
                <div className="grid grid-cols-2 gap-5 px-2 max-w-[300px] mx-auto">
                  <button onClick={handleDownloadPdf} className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#c084fc] to-[#f472b6] text-white rounded-[1.2rem] shadow-[0_4px_15px_rgba(192,132,252,0.3)] active:scale-[0.98] transition-transform">
                    <img
                      src={download}
                      alt="pdf저장"
                      className="h-[17px] w-auto object-contain"
                    />
                    <span className="text-[14px] font-bold">PDF 저장</span>
                  </button>
                  <button
                    onClick={handleShareLink}
                    disabled={shareLoading}
                    className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#c084fc] to-[#f472b6] text-white rounded-[1.2rem] shadow-[0_4px_15px_rgba(192,132,252,0.3)] active:scale-[0.98] transition-transform">
                    <img
                      src={link}
                      alt="링크공유"
                      className="h-[17px] w-auto object-contain"
                    />
                    <span className="text-[14px] font-bold">링크 공유</span>
                  </button>
                </div>

                {/* 2. 공유 안내 문구 */}
                <div className="text-center space-y-1.5">
                  <p className="text-[12px] text-[#9d8fba] font-light">
                    링크 공유는 <span className="font-bold text-[#9d8fba]">7일 후 만료</span>되요.
                  </p>
                  <p className="text-[12px] text-[#9d8fba] font-light">
                    영구 소장은 <span className="font-bold text-[#9d8fba]">PDF저장을 이용</span>해주세요.
                  </p>
                </div>

                {/* 3. 이용 문의하기 버튼 */}
                <button
                  onClick={() => handleInquiryClick()}
                  className="w-full max-w-[300px] mx-auto block py-4 rounded-[1.2rem] font-bold text-[14px] text-[#c084fc] transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: 'rgba(192, 132, 252, 0.08)',
                    border: '1px solid rgba(192, 132, 252, 0.18)',
                  }}
                >
                  이용 문의하기
                </button>

                {/* 4. 최종 안내 문구 */}
                <div className="text-center space-y-1.5 opacity-60">
                  <p className="text-[12px] text-[#9d8fba] font-light">
                    결과 페이지가 뜨지 않는다면, <span className="font-bold text-[#9d8fba]">새로고침</span>을 해주세요.
                  </p>
                  <p className="text-[12px] text-[#9d8fba] font-light">
                    결과는 <span className="font-bold text-[#9d8fba]">마이페이지</span>에서 다시 볼 수 있어요.
                  </p>
                </div>

              </div>
            )}

          </div>
        ) : (
          <>

            {/* 결제 유도 메인 배너 */}
            <div className="bg-[#141120] rounded-[2rem] p-8 text-center border border-[rgba(180,140,255,0.15)] shadow-[0_0_30px_rgba(192,132,252,0.05)] mb-8">
              <div className="flex justify-center mb-5">
                <img src={crystalBall} alt="" width={38} height={38} className="drop-shadow-[0_0_8px_rgba(192,132,252,0.8)] animate-bounce" />
              </div>
              <h3 className="text-[20px] font-['Noto_Serif_KR'] font-bold mb-3 text-[#f0eaf8] tracking-tight">심층 분석 전체 보기</h3>
              <p className="text-[12px] text-[#9d8fba] mb-8 leading-relaxed font-medium">10년차 전문 연애 상담가가<br />두 사람의 상황을 깊이 분석해 드려요.</p>

              <div className="inline-block text-left text-[11px] text-[#b0a8c4] space-y-3 mb-8 font-medium">
                <div className="flex items-center gap-2"><span className="text-[#c084fc] text-[10px]">✦</span> 상대방 속마음 · 새로운 인연 가능성</div>
                <div className="flex items-center gap-2"><span className="text-[#c084fc] text-[10px]">✦</span> 재회 가능성 % · 재회 최적 타이밍</div>
                <div className="flex items-center gap-2"><span className="text-[#c084fc] text-[10px]">✦</span> 효과적인 접근법 · 재회 후 지속 가능성</div>
                <div className="flex items-center gap-2"><span className="text-[#c084fc] text-[10px]">✦</span> 지금 당장의 행동 지침 · 종합 총평</div>
              </div>

              <button onClick={handleUnlockClick} className="w-full py-3.5 bg-[linear-gradient(135deg,#C084FC,#F472B6)] text-white rounded-[1.2rem] shadow-[0_4px_20px_rgba(192,132,252,0.3)] hover:scale-[1.02] transition-transform flex flex-col items-center justify-center gap-0.5">
                <span className="font-black text-[15px]">지금 바로 분석 보기</span>
                <span className="text-[10px] text-white/90 font-medium">₩990 · 평생 소장</span>
              </button>
            </div>

            {/* 프리미엄 리포트 카드들 */}
            <PremiumCard num="01" category="상대방 속마음" title="지금 그 사람은 나를 어떻게 생각할까요" icon="💭" onUnlock={handleUnlockClick}>
              <p>지금 상대방은 겉으로는 아무렇지 않아 보일 수 있어요. 그런데 이 사람의 에너지 흐름을 보면, 내면에서는 꽤 많은 것들을 혼자 소화하고 있는 상태예요. 이 사람은 원래 감정 표현이 서툰 편이라, 마음에 뭔가가 남아 있어도 먼저 내색하지 않아요.</p>
              <p>올해 이 사람에게 흐르는 기운은, 새로운 무언가를 향해 달려가기보다 지나온 시간을 돌아보게 만드는 흐름이에요. 이런 시기에는 예전 인연이나 기억들이 자연스럽게 떠오르거든요.</p>
            </PremiumCard>

            <PremiumCard num="02" category="새로운 인연 가능성" title="혹시 다른 사람이 생겼을까요?" icon="👁️" onUnlock={handleUnlockClick}>
              <p>지금 상대방의 에너지 흐름을 보면, 올해 새로운 이성을 끌어당기는 도화살 기운이 강하게 활성화된 시기는 아니에요.</p>
              <p>완전히 안심할 수는 없지만, 지금 당장 다른 누군가에게 마음이 가있을 가능성은 낮아요. 상대방이 아직 정리 중인 이 시간 안에 자연스럽게 연결이 되면, 그 흐름이 당신 쪽으로 기울 수 있어요.</p>
            </PremiumCard>

            <PremiumCard num="03" category="재회 가능성" title="우리가 다시 만날 확률은?" icon="✨" onUnlock={handleUnlockClick}>
              <div className="flex items-center gap-4 bg-[#0f0d18] p-4 rounded-2xl mb-4 border border-[rgba(180,140,255,0.08)]">
                <div className="text-3xl font-black text-[#c084fc]">68%</div>
                <div className="text-[11px] text-[#9d8fba]">두 사람의 기운이 올해 안으로<br />다시 교차하는 구간이 있어요.</div>
              </div>
              <p>두 사람 사이에는 기본적으로 <span className="text-[#f472b6] font-bold">서로를 끌어당기는 관계(합)의 에너지</span>가 흐르고 있어요. 헤어졌다고 해서 그 에너지가 사라진 게 아니에요.</p>
            </PremiumCard>

            <PremiumCard num="04" category="재회 최적 타이밍" title="언제 연락하는 것이 가장 좋을까요?" icon="📅" onUnlock={handleUnlockClick}>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-[#0f0d18] border border-[rgba(180,140,255,0.08)] text-[#9d8fba] rounded-full text-[10px] font-bold">4월 ✓</span>
                <span className="px-3 py-1 bg-[#0f0d18] text-[#f472b6] rounded-full text-[10px] font-bold border border-[#f472b6]/30">7월 🔥 최고</span>
                <span className="px-3 py-1 bg-[#0f0d18] border border-[rgba(180,140,255,0.08)] text-[#4a4068] rounded-full text-[10px]">5월 ⚠️</span>
              </div>
              <p><span className="text-[#f472b6] font-bold">7월이 올해 두 사람에게 가장 중요한 시기예요.</span> 이 시기에는 같은 말을 해도 훨씬 잘 전달되고, 상대방도 마음이 열리기 쉬운 상태예요.</p>
            </PremiumCard>

            <PremiumCard num="05" category="행동 지침" title="지금 당장 내가 해야 할 행동" icon="⚡" onUnlock={handleUnlockClick}>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-[#0f0d18] p-4 rounded-xl border border-[rgba(180,140,255,0.08)]">
                  <div className="text-[10px] text-[#c084fc] font-bold mb-2">✦ 지금 해야 할 것</div>
                  <ul className="text-[11px] space-y-1.5 text-[#b0a8c4] list-disc pl-4">
                    <li>자연스러운 안부 연락 (짧고 가볍게)</li>
                    <li>공통의 추억을 소재로 한 대화 시도</li>
                    <li>답장을 기다리는 여유 갖기</li>
                  </ul>
                </div>
                <div className="bg-[#0f0d18] p-4 rounded-xl border border-[#f472b6]/20">
                  <div className="text-[10px] text-[#f472b6] font-bold mb-2">✦ 절대 하면 안 될 것</div>
                  <ul className="text-[11px] space-y-1.5 text-[#b0a8c4] list-disc pl-4">
                    <li>재회를 강요하거나 결론 재촉하기</li>
                    <li>읽씹에 연속 메시지 보내기</li>
                  </ul>
                </div>
              </div>
            </PremiumCard>

            {/* 총평 카드 */}
            <div className="bg-[linear-gradient(135deg,rgba(192,132,252,0.06),rgba(244,114,182,0.04))] rounded-[2rem] p-8 border border-[rgba(180,140,255,0.15)] text-center relative overflow-hidden mt-8 shadow-lg">
              <div className="blur-[8px] opacity-30 select-none transition-all duration-500">
                <div className="text-[#f0c060] text-2xl mb-3">✦</div>
                <div className="text-[#f0eaf8] font-black mb-4 font-['Noto_Serif_KR'] text-[18px]">종합 총평</div>
                <p className="text-[12.5px] text-[#c0bad0] leading-relaxed mb-6 text-left break-keep">
                  두 사람의 관계는 단순히 감정적인 미련으로만 이어진 인연이 아니에요. 기본적으로 서로를 끌어당기는 기운(합)이 있고, 올해의 흐름도 재회에 우호적이에요. 가장 중요한 건 <span className="text-[#c084fc] font-bold">7월 이전, 4~7월 사이에 자연스럽고 가볍게 접근</span>하는 거예요.
                </p>
                <div className="bg-[#0f0d18] border border-[rgba(180,140,255,0.11)] text-[#f472b6] font-bold text-[12px] py-2.5 px-5 rounded-full inline-block shadow-sm">
                  재회해도 좋은 인연이에요 💜
                </div>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(180deg,rgba(7,6,12,0)_0%,rgba(7,6,12,0.98)_60%)] z-10">
                <div className="text-3xl mb-3 text-[#f0c060]">🔒</div>
                <div className="text-[12px] text-[#9d8fba] mb-5">결제 후 종합 총평을 확인하세요</div>
                <button onClick={handleUnlockClick} className="px-6 py-3.5 bg-[linear-gradient(135deg,#C084FC,#F472B6)] hover:scale-[1.02] text-white text-[13px] font-bold rounded-[1rem] transition-transform shadow-[0_4px_14px_rgba(192,132,252,0.3)] flex flex-col items-center gap-0.5">
                  <span>잠금 해제하고 전체 보기</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* 하단 다시하기 버튼 */}
        <button data-html2canvas-ignore="true" type="button" onClick={onReset} className="block w-full mt-10 mb-6 text-[12px] font-bold text-[#4a4068] py-4 hover:text-[#9d8fba] transition-colors">
          처음으로 돌아가기
        </button>

      </div>
    </div>
  );
}