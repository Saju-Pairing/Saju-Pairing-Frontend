import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PersonInput, SajuResult, RelationResult, PaidResult } from '../types/saju';
import { HANJA_TO_HANGUL } from '../constants/sajuData';
import { getSipseong, monthToSortKey } from '../utils/sajuEngine';
import crystalBall from '../assets/icon-crystal-ball.svg';
import heartIcon from '../assets/icon-heart.svg';
import { saveAsPdf } from '../lib/pdf';
import { enableSharing } from '../lib/payment';
import ReactGA from 'react-ga4';
import download from '../assets/images/download.png';
import link from '../assets/images/link.png';

interface Props {
  me: PersonInput;
  pt: PersonInput;
  analysis: { meSaju: SajuResult; ptSaju: SajuResult; score: number; relation: RelationResult; scoreComment: { title: string; desc: string } };
  onReset: () => void;
  paidResult?: PaidResult | null;
  readOnly?: boolean;
  showFreeEvent?: boolean; // ⭐️ 선착순 이벤트 말풍선 노출 여부 (기본값: true)
}

// 공통 LandingCard 컴포넌트
interface LandingCardProps {
  num: string;
  category: string;
  icon: string;
  title: string;
  visibleContent?: React.ReactNode;
  blurredContent?: React.ReactNode;
  isLocked?: boolean;
  onUnlock?: () => void;
}

const LandingCard = ({ num, category, icon, title, visibleContent, blurredContent, isLocked, onUnlock }: LandingCardProps) => (
  <div className="w-full bg-[#110c1d] rounded-[1.5rem] border border-[rgba(192,132,252,0.18)] overflow-hidden relative shadow-lg text-left mb-4">
    <div className="p-5 border-b border-[rgba(180,140,255,0.05)] flex items-center gap-4">
      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center text-lg bg-[rgba(244,114,182,0.12)] border border-[rgba(180,140,255,0.11)] text-[#f0eaf8] flex-shrink-0 shadow-inner">
        {icon}
      </div>
      <div>
        <div className="text-[#4A4068] font-['Noto_Sans_KR'] text-[9px] font-light tracking-[2px] mb-1">
          {num} · {category}
        </div>
        <div className="text-[#F0EAF8] font-['Noto_Serif_KR'] text-[14px] font-semibold leading-[18.9px]">
          {title}
        </div>
      </div>
    </div>

    <div className="p-6 relative">
      {/* ⭐️ isLocked 일 때 전체 컨텐츠 영역을 감싸서 블러 처리 */}
      <div className={isLocked ? 'blur-[6px] opacity-40 select-none pointer-events-none' : ''}>
        {visibleContent && (
          <div className="text-[#C0BAD0] font-['Noto_Sans_KR'] text-[13.5px] font-light leading-[27.68px] break-keep mb-6 text-left">
            {visibleContent}
          </div>
        )}
        {blurredContent && (
          <div className="text-[#C0BAD0] font-['Noto_Sans_KR'] text-[13.5px] font-light leading-[27.68px] break-keep space-y-4 text-left">
            {blurredContent}
          </div>
        )}
      </div>

      {/* 잠금 해제 오버레이 */}
      {isLocked && onUnlock && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(180deg,rgba(7,6,12,0)_0%,rgba(7,6,12,0.96)_40%)] z-10 p-4">
          <div className="text-2xl mb-2">🔒</div>
          <div className="text-[11px] text-[#9d8fba] mb-4">결제 후 모든 내용을 확인할 수 있어요</div>
          <button type="button" onClick={onUnlock} className="px-5 py-2.5 bg-[linear-gradient(135deg,#C084FC,#F472B6)] hover:opacity-90 text-white text-[12px] font-bold rounded-full transition-opacity shadow-[0_4px_14px_rgba(192,132,252,0.39)]">
            잠금 해제하기
          </button>
        </div>
      )}
    </div>
  </div>
);

export default function SajuResultView({ me, pt, analysis, onReset, paidResult, readOnly, showFreeEvent = true }: Props) {
  const navigate = useNavigate();
  const pdfRef = React.useRef<HTMLDivElement>(null);
  const [shareLoading, setShareLoading] = useState(false);

  React.useEffect(() => {
    if (paidResult) {
      sessionStorage.removeItem('saju_paid_result');
    }
  }, [paidResult]);

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

  const handleInquiryClick = () => {
    const email = "2019ootd@gmail.com";
    const subject = encodeURIComponent("[사주페어링] 서비스 문의사항");
    window.location.href = `mailto:${email}?subject=${subject}`;
  };

  const handleDownloadPdf = () => {
    if (pdfRef.current) {
      saveAsPdf(pdfRef.current, '사주페어링_결과.pdf');
    }
  };

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

      // 공유 링크 생성
      ReactGA.event({
        category: 'saju',
        action: 'share_link',
      });

      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch (clipboardErr) {
        console.error('클립보드 복사 실패:', clipboardErr);
      }

      if (navigator.share) {
        try {
          await navigator.share({ title: '사주페어링 결과', url: shareUrl });
        } catch (shareErr: any) {
          if (shareErr?.name !== 'AbortError') {
            console.error('공유 시트 오류:', shareErr);
          }
        }
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
    <div ref={pdfRef} className="min-h-screen relative overflow-x-hidden font-sans text-[#f0eaf8] bg-[#07060c] pb-20 pt-[70px] animate-fade-in-up [&.is-pdf-capturing]:animate-none" data-testid={paidResult ? 'saju-result-view-paid' : 'saju-result-view-free'}>
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
            <div className="text-[12px] font-black text-[#f472b6]" data-testid="compatibility-score">궁합 {analysis.score}점</div>
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

            <div className="w-full text-[#9D8FBA] font-['Noto_Sans_KR'] text-[10px] font-light leading-[15.5px] break-keep">
              <div className="mb-1">{analysis.relation.hapTitle}</div>
              <div>{analysis.relation.hapDesc}</div>
            </div>
          </div>

          {/* 오렌지색 충(沖) 카드 */}
          <div className="bg-[#fb923c]/[0.06] p-5 rounded-[14px] border border-[#fb923c]/20 flex flex-col items-center text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-[14px] font-bold text-[#fb923c] mb-2">일간 상극</h3>

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

        {/* ── 결제 여부에 따른 카드뷰 분기 ── */}
        {paidResult ? (
          // ── 결제 완료 상태 ──
          <div className="w-full">
            {/* 01 · 상대방 속마음 */}
            <LandingCard
              num="01"
              category="상대방 속마음"
              icon="💭"
              title="지금 그 사람은 나를 어떻게 생각할까요"
              visibleContent={<p>{paidResult.sections.속마음}</p>}
            />

            {/* 02 · 새로운 인연 가능성 */}
            <LandingCard
              num="02"
              category="새로운 인연 가능성"
              icon="👁️"
              title="상대방에게 새로운 사람이 생겼을까요"
              visibleContent={<p>{paidResult.sections.새인연}</p>}
            />

            {/* 03 · 재회 가능성 */}
            <LandingCard
              num="03"
              category="재회 가능성"
              icon="🔮"
              title="두 사람이 다시 만날 확률은 얼마나 될까요"
              visibleContent={
                <>
                  <div className="flex items-center gap-5 bg-[#0f0d18] p-4 rounded-2xl mb-6 border border-[rgba(180,140,255,0.08)]">
                    <div className="relative w-[60px] h-[60px] flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 84 84">
                        <circle cx="42" cy="42" r="38" stroke="rgba(192,132,252,0.15)" strokeWidth="5" fill="none" />
                        <circle
                          cx="42" cy="42" r="38"
                          stroke="#c084fc" strokeWidth="5" fill="none" strokeLinecap="round"
                          style={{
                            strokeDasharray: 238.76,
                            strokeDashoffset: 238.76 - (paidResult.reunionProbability / 100) * 238.76,
                            transition: 'stroke-dashoffset 1.5s ease-out'
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center justify-center leading-none -translate-y-[1px]">
                          <span className="text-[#C084FC] font-['Noto_Serif_KR'] text-[18px] font-black tracking-tighter">
                            {paidResult.reunionProbability}
                          </span>
                          <span className="text-[#C084FC] font-['Noto_Sans_KR'] text-[9px] font-light tracking-[1px] ml-[1px] translate-y-[1px]">
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-[#4A4068] font-['Noto_Sans_KR'] text-[9px] font-light tracking-[1px] leading-normal">
                        현재 재회 가능성
                      </div>
                      <div className="text-[#F0EAF8] font-['Noto_Sans_KR'] text-[12px] font-light leading-[19.2px] break-keep">
                        {paidResult.reunionDesc}
                      </div>
                    </div>
                  </div>
                  <p>{paidResult.sections.재회가능성설명}</p>
                </>
              }
            />

            {/* 04 · 재회 최적 타이밍 */}
            <LandingCard
              num="04"
              category="재회 최적 타이밍"
              icon="📅"
              title="언제 연락하는 게 가장 좋을까요"
              visibleContent={
                <div>
                  <div className="flex flex-wrap gap-2 justify-start max-w-[312px] mx-auto mb-[18px]">
                    {[
                      ...paidResult.goodMonths
                        .filter((m) => m !== paidResult.bestMonth)
                        .map((m) => ({ month: m, status: 'good' as const })),
                      ...(paidResult.bestMonth ? [{ month: paidResult.bestMonth, status: 'best' as const }] : []),
                      ...paidResult.badMonths
                        .filter((m) => m !== paidResult.bestMonth)
                        .map((m) => ({ month: m, status: 'avoid' as const })),
                    ]
                      .sort((a, b) => monthToSortKey(a.month) - monthToSortKey(b.month))
                      .map(({ month, status }) => {
                        const baseStyles = 'w-[56px] h-[30px] px-3 py-[6px] justify-center items-center rounded-[30px] text-[12px] font-medium';
                        const statusStyles =
                          status === 'avoid'
                            ? 'border border-[rgba(58,68,96,0.40)] bg-[rgba(58,68,96,0.30)] text-[#4A4068]'
                            : status === 'best'
                              ? 'border border-[rgba(244,114,182,0.23)] bg-[rgba(244,114,182,0.09)] text-[#F472B6] font-bold'
                              : 'border border-[rgba(192,132,252,0.23)] text-[#C084FC]';

                        const mark = status === 'best' ? '🔥' : status === 'good' ? '✓' : '⚠';

                        return (
                          <div key={month} className={`font-['Noto_Sans_KR'] flex gap-1 ${baseStyles} ${statusStyles}`}>
                            <span>{month}</span>
                            <span className="text-[10px]">{mark}</span>
                          </div>
                        );
                      })}
                  </div>
                  <p>{paidResult.sections.타이밍설명}</p>
                </div>
              }
            />

            {/* 05 · 효과적인 접근법 */}
            <LandingCard
              num="05"
              category="효과적인 접근법"
              icon="💌"
              title="어떻게 다가가야 마음이 열릴까요"
              visibleContent={<p>{paidResult.sections.접근법}</p>}
            />

            {/* 06 · 재회 후 지속 가능성 */}
            <LandingCard
              num="06"
              category="재회 후 지속 가능성"
              icon="🌱"
              title="다시 만나도 오래 갈 수 있을까요"
              visibleContent={<p>{paidResult.sections.지속가능성}</p>}
            />

            {/* 07 · 지금 당장의 행동 지침 */}
            <LandingCard
              num="07"
              category="지금 당장의 행동 지침"
              icon="⚡"
              title="해야 할 것과 절대 하면 안 될 것"
              visibleContent={
                <div className="space-y-6">
                  <p>{paidResult.sections.행동지침설명}</p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-[#0f0d18] p-4 rounded-xl border border-[rgba(192,132,252,0.18)]">
                      <div className="text-[#C084FC] font-['Noto_Sans_KR'] text-[10px] font-bold tracking-[1.5px] mb-2">✦ 지금 해야 할 것</div>
                      <ul className="text-[11.5px] space-y-1.5 text-[#b0a8c4] list-none leading-relaxed text-left">
                        {paidResult.doList.map((item, i) => (
                          <li key={i}><span className="text-[#C084FC]">✓</span> {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-[#0f0d18] p-4 rounded-xl border border-[#f472b6]/20">
                      <div className="text-[#F472B6] font-['Noto_Sans_KR'] text-[10px] font-bold tracking-[1.5px] mb-2">✦ 절대 하면 안 될 것</div>
                      <ul className="text-[11.5px] space-y-1.5 text-[#b0a8c4] list-none leading-relaxed text-left">
                        {paidResult.dontList.map((item, i) => (
                          <li key={i}><span className="text-[#F472B6]">✗</span> {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              }
            />

            {/* 08 · 종합 총평 */}
            <div className="mt-4 w-full bg-[#110c1d] rounded-[24px] border border-[rgba(192,132,252,0.18)] p-10 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
              <div className="text-white font-bold mb-8 font-['Noto_Serif_KR'] text-[18px] tracking-wider">
                ✦ 종합 총평 ✦
              </div>
              <div className="text-[#d1c9e0] font-['Noto_Sans_KR'] text-[14px] font-light leading-[1.8] mb-10 space-y-4 break-keep text-left">
                <p>{paidResult.sections.총평}</p>
              </div>
              <div className="inline-flex flex-col justify-center items-center px-[28px] py-[12px] gap-[9px] rounded-full border border-[rgba(192,132,252,0.18)] bg-[rgba(192,132,252,0.14)] text-white text-center font-['Noto_Sans_KR'] text-[13.3px] font-normal leading-normal">
                재회해도 좋은 인연이에요 💜
              </div>
            </div>

            {/* 공유 및 안내 섹션 */}
            {!readOnly && (
              <div data-html2canvas-ignore="true" className="mt-20 space-y-8 px-2 pt-8 border-t border-[rgba(180,140,255,0.1)]">
                <div className="grid grid-cols-2 gap-5 px-2 max-w-[300px] mx-auto">
                  <button onClick={handleDownloadPdf} className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#c084fc] to-[#f472b6] text-white rounded-[1.2rem] shadow-[0_4px_15px_rgba(192,132,252,0.3)] active:scale-[0.98] transition-transform" data-testid="pdf-download-button">
                    <img src={download} alt="pdf저장" className="h-[17px] w-auto object-contain" />
                    <span className="text-[14px] font-bold">PDF 저장</span>
                  </button>
                  <button onClick={handleShareLink} disabled={shareLoading} className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#c084fc] to-[#f472b6] text-white rounded-[1.2rem] shadow-[0_4px_15px_rgba(192,132,252,0.3)] active:scale-[0.98] transition-transform" data-testid="share-link-button">
                    <img src={link} alt="링크공유" className="h-[17px] w-auto object-contain" />
                    <span className="text-[14px] font-bold">링크 공유</span>
                  </button>
                </div>

                <div className="text-center space-y-1.5">
                  <p className="text-[12px] text-[#9d8fba] font-light">
                    링크 공유는 <span className="font-bold text-[#9d8fba]">7일 후 만료</span>돼요.
                  </p>
                  <p className="text-[12px] text-[#9d8fba] font-light">
                    영구 소장은 <span className="font-bold text-[#9d8fba]">PDF저장을 이용</span>해주세요.
                  </p>
                </div>

                <button
                  onClick={() => handleInquiryClick()}
                  className="w-full max-w-[300px] mx-auto block py-4 rounded-[1.2rem] font-bold text-[14px] text-[#c084fc] transition-all active:scale-[0.98]"
                  data-testid="inquiry-button"
                  style={{
                    backgroundColor: 'rgba(192, 132, 252, 0.08)',
                    border: '1px solid rgba(192, 132, 252, 0.18)',
                  }}
                >
                  이용 문의하기
                </button>

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
          // ── 미결제 상태 (프리미엄 블러 카드 리스트) ──
          <div className="w-full">
            {/* ⭐️ 요청해주신 디자인 스펙 적용 (border-radius: 20px 및 linear-gradient) */}
            <div className="rounded-[20px] p-8 text-center border border-[rgba(192,132,252,0.22)] bg-[linear-gradient(135deg,rgba(192,132,252,0.10)_0%,rgba(244,114,182,0.07)_100%)] shadow-[0_0_30px_rgba(192,132,252,0.05)] mb-8 relative">
              <div className="flex justify-center mb-5">
                <img src={crystalBall} alt="" width={38} height={38} className="drop-shadow-[0_0_8px_rgba(192,132,252,0.8)] animate-bounce" />
              </div>
              <h3 className="text-[20px] font-['Noto_Serif_KR'] font-bold mb-3 text-[#f0eaf8] tracking-tight">심층 분석 전체 보기</h3>
              <p className="text-[12px] text-[#9d8fba] mb-8 leading-relaxed font-medium">10년차 전문 연애 상담가가<br />두 사람의 상황을 깊이 분석해 드려요.</p>

              {/* 항목 목록 (상단 마진은 말풍선의 my-[10px]와 대칭으로 깔끔히 정렬) */}
              <div className="inline-block text-left text-[11px] text-[#b0a8c4] space-y-3 font-medium">
                <div className="flex items-center gap-2"><span className="text-[#c084fc] text-[10px]">✦</span> 상대방 속마음 · 새로운 인연 가능성</div>
                <div className="flex items-center gap-2"><span className="text-[#c084fc] text-[10px]">✦</span> 재회 가능성 % · 재회 최적 타이밍</div>
                <div className="flex items-center gap-2"><span className="text-[#c084fc] text-[10px]">✦</span> 효과적인 접근법 · 재회 후 지속 가능성</div>
                <div className="flex items-center gap-2"><span className="text-[#c084fc] text-[10px]">✦</span> 지금 당장의 행동 지침 · 종합 총평</div>
              </div>

              {/* ⭐️ 버튼 & 말풍선 영역 (위/아래 균등한 my-[10px] 여백 + 우측 정렬 + 정삼각형 꼬리) */}
              <div className="w-full max-w-sm mx-auto flex flex-col items-end">
                {showFreeEvent && (
                  <div className="my-[10px] animate-fade-in-up">
                    <div className="relative bg-[#251b3a] border border-[rgba(192,132,252,0.4)] text-white text-[12px] font-[300] font-['Noto_Sans_KR'] leading-normal text-center px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <span>🎉</span>
                      <span>최초 1회 심층 분석 무료 이벤트</span>
                      {/* 정삼각형 형태 꼬리 */}
                      <div className="absolute -bottom-[5px] right-7 w-2.5 h-2.5 bg-[#251b3a] border-r border-b border-[rgba(192,132,252,0.4)] rotate-45"></div>
                    </div>
                  </div>
                )}

                <button onClick={handleUnlockClick} className="w-full py-3.5 bg-[linear-gradient(135deg,#C084FC,#F472B6)] text-white rounded-[1.2rem] shadow-[0_4px_20px_rgba(192,132,252,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-transform flex flex-col items-center justify-center gap-0.5" data-testid="unlock-main-button">
                  <span className="font-black text-[15px]">지금 바로 분석 보기</span>
                  <span className="text-[10px] text-white/90 font-medium">₩990 · 평생 소장</span>
                </button>
              </div>
            </div>

            {/* Part 1. 속마음 */}
            <LandingCard
              num="01"
              category="상대방 속마음"
              icon="💭"
              title="지금 그 사람은 나를 어떻게 생각할까요"
              visibleContent={
                <p>지금 상대방은 겉으로는 아무렇지 않아 보일 수 있어요. 그런데 이 사람의 에너지 흐름을 보면, 내면에서는 꽤 많은 것들을 혼자 소화하고 있는 상태예요. 이 사람은 원래 감정 표현이 서툰 편이라, 마음에 뭔가가 남아 있어도 먼저 내색하지 않아요. 상처받았을 때 더 멀리 물러나는 방식으로 자신을 보호하는 타입이거든요.</p>
              }
              blurredContent={
                <>
                  <p>올해 이 사람에게 흐르는 기운은, 새로운 무언가를 향해 달려가기보다 지나온 시간을 돌아보게 만드는 흐름이에요. 이런 시기에는 예전 인연이나 기억들이 자연스럽게 떠오르거든요. 당신과의 기억도 그 안에 분명히 있을 거예요.</p>
                  <p>지금의 거리감을 "나한테 마음이 없다"고 받아들이지 않으셨으면 해요. 이 사람은 아직 정리 중이에요. 그 정리의 결론이 어디로 향할지는, 지금 당신이 어떻게 행동하느냐에도 달려 있어요.</p>
                </>
              }
              isLocked
              onUnlock={handleUnlockClick}
            />

            <LandingCard
              num="02"
              category="새로운 인연 가능성"
              icon="👁️"
              title="상대방에게 새로운 사람이 생겼을까요"
              visibleContent={
                <p>지금 상대방의 에너지 흐름을 보면, 올해 새로운 이성을 끌어당기는 도화살 기운이 강하게 활성화된 시기는 아니에요. 새 인연이 열릴 때 나타나는 특유의 에너지가 지금 이 사람한테는 두드러지지 않거든요. 오히려 지금은 외부보다 자기 자신을 향해 에너지가 흐르는 시기예요.</p>
              }
              blurredContent={
                <>
                  <p>완전히 안심할 수는 없지만, 지금 당장 다른 누군가에게 마음이 가있을 가능성은 낮아요. 상대방이 아직 정리 중인 이 시간 안에 자연스럽게 연결이 되면, 그 흐름이 당신 쪽으로 기울 수 있어요.</p>
                  <p>다만 하반기로 넘어가면 상대방의 외부 인연운이 조금씩 열리기 시작해요. 상반기, 특히 7월 이전이 당신에게 훨씬 유리한 시간이에요. 지금 안심하되, 행동은 미루지 마세요.</p>
                </>
              }
              isLocked
              onUnlock={handleUnlockClick}
            />

            {/* Part 2. 타이밍 */}
            <LandingCard
              num="03"
              category="재회 가능성"
              icon="🔮"
              title="두 사람이 다시 만날 확률은 얼마나 될까요"
              visibleContent={
                <>
                  <div className="flex items-center gap-5 bg-[#0f0d18] p-4 rounded-2xl mb-6 border border-[rgba(180,140,255,0.08)]">
                    <div className="relative w-[60px] h-[60px] flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 84 84">
                        <circle cx="42" cy="42" r="38" stroke="rgba(192,132,252,0.15)" strokeWidth="5" fill="none" />
                        <circle
                          cx="42" cy="42" r="38"
                          stroke="#c084fc" strokeWidth="5" fill="none" strokeLinecap="round"
                          style={{ strokeDasharray: 238.76, strokeDashoffset: 238.76 - (89 / 100) * 238.76, transition: 'stroke-dashoffset 1.5s ease-out' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center justify-center leading-none -translate-y-[1px]">
                          <span className="text-[#C084FC] font-['Noto_Serif_KR'] text-[18px] font-black tracking-tighter">
                            89
                          </span>
                          <span className="text-[#C084FC] font-['Noto_Sans_KR'] text-[9px] font-light tracking-[1px] ml-[1px] translate-y-[1px]">
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-[#4A4068] font-['Noto_Sans_KR'] text-[9px] font-light tracking-[1px] leading-normal">
                        현재 재회 가능성
                      </div>
                      <div className="text-[#F0EAF8] font-['Noto_Sans_KR'] text-[12px] font-light leading-[19.2px] break-keep">
                        두 사람의 기운이 올해 안으로<br />다시 교차하는 구간이 있어요.
                      </div>
                    </div>
                  </div>
                  <p className="text-[#C0BAD0] font-['Noto_Sans_KR'] text-[13.5px] font-light leading-[27.68px] break-keep">
                    두 사람 사이에는 기본적으로 서로를 끌어당기는 관계(합)의 에너지가 흐르고 있어요. 헤어졌다고 해서 그 에너지가 사라진 게 아니에요. 처음부터 끌렸던 이유, 함께 있을 때 편했던 기억들 — 이건 두 사람의 타고난 관계 구조에서 오고 있어요.
                  </p>
                </>
              }
              blurredContent={
                <>
                  <p>지금 당신의 흐름은 인연을 끌어당기기 좋은 시기예요. 반면 상대방은 아직 결정을 내리기 어려운, 머뭇거리는 단계에 있어요. 지금 당신이 먼저 자연스럽게 다가간다면, 그 머뭇거림이 당신 쪽으로 기울 가능성이 있거든요.</p>
                  <p>올바른 타이밍에 올바른 방식으로 움직일 때 이 가능성이 현실이 돼요. 가만히 기다리기만 하면 기회가 지나갈 수 있어요.</p>
                </>
              }
              isLocked
              onUnlock={handleUnlockClick}
            />

            <LandingCard
              num="04"
              category="재회 최적 타이밍"
              icon="📅"
              title="언제 연락하는 게 가장 좋을까요"
              visibleContent={
                <div>
                  <div className="flex flex-wrap gap-2 justify-start max-w-[312px] mx-auto mb-[18px]">
                    {[
                      { label: '4월', status: 'good' },
                      { label: '5월', status: 'avoid' },
                      { label: '6월', status: 'avoid' },
                      { label: '7월', status: 'best' },
                      { label: '8월', status: 'avoid' },
                      { label: '9월', status: 'good' },
                      { label: '10월', status: 'good' },
                      { label: '11월', status: 'good' },
                      { label: '12월', status: 'good' },
                    ].map((m) => {
                      const baseStyles = 'w-[56px] h-[30px] px-3 py-[6px] justify-center items-center rounded-[30px] text-[12px] font-medium';
                      const statusStyles =
                        m.status === 'avoid'
                          ? 'border border-[rgba(58,68,96,0.40)] bg-[rgba(58,68,96,0.30)] text-[#4A4068]'
                          : m.status === 'best'
                            ? 'border border-[rgba(244,114,182,0.23)] bg-[rgba(244,114,182,0.09)] text-[#F472B6] font-bold'
                            : 'border border-[rgba(192,132,252,0.23)] text-[#C084FC]';

                      const mark = m.status === 'best' ? '🔥' : m.status === 'good' ? '✓' : '⚠';

                      return (
                        <div key={m.label} className={`font-['Noto_Sans_KR'] flex gap-1 ${baseStyles} ${statusStyles}`}>
                          <span>{m.label}</span>
                          <span className="text-[10px]">{mark}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p>7월이 올해 두 사람에게 가장 중요한 시기예요. 이 달에는 두 사람의 기운이 자연스럽게 같은 방향을 향하는 구간이 생겨요. 이 시기에는 같은 말을 해도 훨씬 잘 전달되고, 상대방도 마음이 열리기 쉬운 상태예요.</p>
                </div>
              }
              blurredContent={
                <>
                  <p>4월과 10월, 11월도 두 사람의 흐름이 잘 맞는 달이에요. 이 시기에는 가벼운 연락이나 짧은 만남도 좋은 계기가 될 수 있어요. 부담 없이 시작하기에 좋은 때예요.</p>
                  <p>반면 5월과 8월은 두 사람의 기운이 서로 다른 방향을 향하는 시기예요. 이 두 달엔 중요한 연락이나 고백, 만남 시도는 잠시 미뤄두세요. 그 시간엔 자기 자신을 가꾸고 준비하는 시간으로 쓰면 돼요.</p>
                </>
              }
              isLocked
              onUnlock={handleUnlockClick}
            />

            {/* Part 3. 솔루션 */}
            <LandingCard
              num="05"
              category="효과적인 접근법"
              icon="💌"
              title="어떻게 다가가야 마음이 열릴까요"
              visibleContent={
                <p>상대방은 감정적인 호소나 눈물보다 일상적이고 자연스러운 연결에 마음이 열리는 타입이에요. 이 사람은 원래 공간을 중요하게 여기는 성향이라, "보고싶다", "잊을 수가 없다"는 직접적인 감정 표현은 오히려 부담으로 느껴질 수 있어요.</p>
              }
              blurredContent={
                <>
                  <p>첫 연락은 가볍고 짧게 하는 게 좋아요. 함께 봤던 영화가 재개봉했다거나, 자주 가던 카페가 생각났다거나, 공통의 추억을 건드리는 소재가 가장 자연스럽게 대화의 문을 열어요.</p>
                  <p>가장 중요한 건 답장을 기다리는 여유예요. 이 사람은 자기 속도로 생각하고 반응하는 타입이에요. 여유를 보여주는 것 자체가 매력으로 작용해요. "나 아직 여기 있어, 근데 조급하지는 않아"라는 태도가 이 사람 마음을 가장 크게 움직일 거예요.</p>
                </>
              }
              isLocked
              onUnlock={handleUnlockClick}
            />

            <LandingCard
              num="06"
              category="재회 후 지속 가능성"
              icon="🌱"
              title="다시 만나도 오래 갈 수 있을까요"
              visibleContent={
                <p>두 사람 사이에 흐르는 기본 기운을 보면, 이건 단순히 스쳐가는 인연이 아니에요. 서로에게 의미있는 영향을 주는 구조로 연결되어 있어요. 재회를 하게 된다면, 초반 3~6개월은 이전과 다른 안정감이 있을 거예요.</p>
              }
              blurredContent={
                <>
                  <p>그런데 1년 내외가 지나면, 당신의 확인 욕구와 상대방의 공간 필요 — 이게 다시 고개를 들 수 있어요. 이건 두 사람이 나쁜 게 아니라, 서로 부딪히고 긴장하는 관계(상극)에서 오는 구조적인 문제예요.</p>
                  <p>재회 전에 이 패턴에 대해 충분히 이야기를 나눠두는 것이 정말 중요해요. 재회 자체보다 "이번엔 어떻게 다르게 할 것인가"를 먼저 합의하는 것, 그게 이 관계를 오래 가게 만드는 가장 큰 열쇠예요.</p>
                </>
              }
              isLocked
              onUnlock={handleUnlockClick}
            />

            <LandingCard
              num="07"
              category="지금 당장의 행동 지침"
              icon="⚡"
              title="해야 할 것과 절대 하면 안 될 것"
              visibleContent={
                <div className="space-y-6">
                  <p>지금 당신의 기운은 먼저 움직이는 게 유리한 시기예요. 기다리기만 하면 기회가 지나갈 수 있어요. 단, 조급하게 굴면 역효과가 나요. 적극적이지만 여유 있는 태도가 핵심이에요.</p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-[#0f0d18] p-4 rounded-xl border border-[rgba(192,132,252,0.18)]">
                      <div className="text-[#C084FC] font-['Noto_Sans_KR'] text-[10px] font-bold tracking-[1.5px] mb-2">✦ 지금 해야 할 것</div>
                      <ul className="text-[11.5px] space-y-1.5 text-[#b0a8c4] list-none leading-relaxed blur-[3px] opacity-70 select-none text-left">
                        <li><span className="text-[#C084FC]">✓</span> 자연스러운 안부 연락 (짧고 가볍게)</li>
                        <li><span className="text-[#C084FC]">✓</span> 공통의 추억을 소재로 한 대화 시도</li>
                        <li><span className="text-[#C084FC]">✓</span> 답장을 기다리는 여유 갖기</li>
                        <li><span className="text-[#C084FC]">✓</span> 나 자신을 가꾸고 성장하는 모습 보여주기</li>
                        <li><span className="text-[#C084FC]">✓</span> 4월~7월 사이에 집중적으로 행동하기</li>
                      </ul>
                    </div>
                    <div className="bg-[#0f0d18] p-4 rounded-xl border border-[#f472b6]/20">
                      <div className="text-[#F472B6] font-['Noto_Sans_KR'] text-[10px] font-bold tracking-[1.5px] mb-2">✦ 절대 하면 안 될 것</div>
                      <ul className="text-[11.5px] space-y-1.5 text-[#b0a8c4] list-none leading-relaxed blur-[3px] opacity-70 select-none text-left">
                        <li><span className="text-[#F472B6]">✗</span> 재회를 강요하거나 결론 재촉하기</li>
                        <li><span className="text-[#F472B6]">✗</span> 과거의 잘못을 끄집어내며 따지기</li>
                        <li><span className="text-[#F472B6]">✗</span> 읽씹에 연속 메시지 보내기</li>
                        <li><span className="text-[#F472B6]">✗</span> 술 마신 상태에서 감정적 연락하기</li>
                        <li><span className="text-[#F472B6]">✗</span> SNS로 현재 상태를 과시하며 어필하기</li>
                      </ul>
                    </div>
                  </div>
                </div>
              }
              blurredContent={
                <p className="leading-relaxed">이 중에서 가장 중요한 건 상대방이 숨 쉴 공간을 주는 것이에요. 진심을 담되, 조급하지 않게. 그게 이 사람한테 가장 크게 작동하는 방식이에요.</p>
              }
              isLocked
              onUnlock={handleUnlockClick}
            />

            {/* 총평 카드 */}
            <div className="mt-4 w-full bg-[#110c1d] rounded-[24px] border border-[rgba(192,132,252,0.18)] p-10 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
              <div className="text-white font-bold mb-8 font-['Noto_Serif_KR'] text-[18px] tracking-wider">
                ✦ 종합 총평 ✦
              </div>
              <div className="text-[#d1c9e0] font-['Noto_Sans_KR'] text-[14px] font-light leading-[1.8] mb-10 space-y-4 break-keep blur-[3px] opacity-40 select-none pointer-events-none text-left">
                <p>두 사람의 관계는 단순히 감정적인 미련으로만 이어진 인연이 아니에요. 기본적으로 서로를 끌어당기는 기운(합)이 있고, 올해의 흐름도 재회에 우호적이에요. 가장 중요한 건 7월 이전, 4~7월 사이에 자연스럽고 가볍게 접근하는 거예요.</p>
                <p>다만 재회 후에도 두 사람의 타고난 방식 차이는 여전히 있어요. 이번엔 그 차이를 이해하고 대화하는 방식을 달리해보세요. 아는 만큼 달라질 수 있거든요.</p>
              </div>
              <div className="inline-flex flex-col justify-center items-center px-[28px] py-[12px] gap-[9px] rounded-full border border-[rgba(192,132,252,0.18)] bg-[rgba(192,132,252,0.14)] text-white text-center font-['Noto_Sans_KR'] text-[13.3px] font-normal leading-normal">
                재회해도 좋은 인연이에요 💜
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(180deg,rgba(7,6,12,0)_0%,rgba(7,6,12,0.96)_40%)] z-10">
                <div className="text-3xl mb-3 text-[#f0c060]">🔒</div>
                <div className="text-[12px] text-[#9d8fba] mb-5">결제 후 종합 총평을 확인하세요</div>
                <button type="button" onClick={handleUnlockClick} className="px-6 py-3.5 bg-[linear-gradient(135deg,#C084FC,#F472B6)] hover:scale-[1.02] text-white text-[13px] font-bold rounded-[1rem] transition-transform shadow-[0_4px_14px_rgba(192,132,252,0.3)] flex flex-col items-center gap-0.5" data-testid="unlock-summary-button">
                  <span>잠금 해제하고 전체 보기</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 하단 다시하기 버튼 */}
        <button data-html2canvas-ignore="true" type="button" onClick={onReset} className="block w-full mt-10 mb-6 text-[12px] font-bold text-[#4a4068] py-4 hover:text-[#9d8fba] transition-colors" data-testid="reset-button">
          처음으로 돌아가기
        </button>

      </div>
    </div>
  );
}