import React, { useState } from 'react';
import type { PersonInput, SajuResult, RelationResult } from '../types/saju';
import { HANJA_TO_HANGUL } from '../constants/saju';
import { getSipseong } from '../utils/sajuEngine';
import { useNavigate } from 'react-router';
import crystalBall from '../assets/icon-crystal-ball.svg';
import heartIcon from '../assets/icon-heart.svg';
=======
import { useNavigate } from 'react-router';
>>>>>>> feature/1

interface Props {
  me: PersonInput;
  pt: PersonInput;
  analysis: { meSaju: SajuResult; ptSaju: SajuResult; score: number; relation: RelationResult; scoreComment: { title: string; desc: string } };
  onReset: () => void;
  isLoggedIn: boolean; //로그인 관련
  onRequireLogin: () => void; 
}

// PremiumCard 컴포넌트 (카테고리 기능 추가 & 깔끔한 잠금화면)
interface PremiumCardProps {
  num: string;
  category: string;
  title: string;    
  icon: string;
  isUnlocked: boolean;
  onUnlock: () => void;
  children: React.ReactNode;
}

const PremiumCard = ({ num, title, icon, isUnlocked, onUnlock, children }: PremiumCardProps) => (
  <div className="bg-[#141120] rounded-[2rem] border border-[rgba(180,140,255,0.11)] overflow-hidden relative mb-4 shadow-lg">
    <div className="p-5 border-b border-[rgba(180,140,255,0.05)] flex items-center gap-4">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-[#0f0d18] border border-[rgba(180,140,255,0.11)] text-[#f0eaf8]">{icon}</div>
      <div>
        <div className="text-[10px] text-[#c084fc] font-bold mb-0.5">{num}</div>
        <div className="text-sm font-bold text-[#f0eaf8]">{title}</div>
      </div>
    </div>
    <div className="relative">
      <div className={`p-6 text-[13px] text-[#c0bad0] leading-relaxed space-y-4 transition-all duration-500 ${!isUnlocked ? 'blur-[6px] opacity-40 select-none' : ''}`}>
        {children}
      </div>
      {!isUnlocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(180deg,rgba(20,17,32,0)_0%,rgba(20,17,32,0.96)_40%)] z-10">
          <div className="text-2xl mb-2">🔒</div>
          <div className="text-[11px] text-[#9d8fba] mb-4">결제 후 모든 내용을 확인할 수 있어요</div>
          <button onClick={onUnlock} className="px-5 py-2.5 bg-[linear-gradient(135deg,#C084FC,#F472B6)] hover:opacity-90 text-white text-[12px] font-bold rounded-full transition-opacity shadow-[0_4px_14px_rgba(192,132,252,0.39)]">
            잠금 해제하기
          </button>
        </div>
      )}
    </div>
  </div>
);

export default function SajuResultView({ me, pt, analysis, onReset, isLoggedIn, onRequireLogin }: Props) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const handleUnlock = () => setIsUnlocked(true);
  const navigate = useNavigate();

  // 잠금 해제 버튼 눌렀을 때의 동작 수정
  const handleUnlock = () => {
    if (!isLoggedIn) {
      // 로그인이 안 되어 있다면? -> App.tsx가 넘겨준 함수 실행 (step 99로 이동!)
      onRequireLogin();
      return; 
    }
    
    // 로그인이 되어 있다면? -> 잠금 해제 (나중엔 결제창 띄우는 로직이 들어갈 자리)
    setIsUnlocked(true);
  };

  // 사주 팔자 렌더링 함수 (이미지처럼 배경 없이 깔끔하게, 일주만 보라색 그라데이션)
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
    
    // 일주(Day Pillar) 강조 색상
    const sipseongColor = isDayPillar ? 'text-[#c084fc]' : 'text-[#4a4068]';
    const hangulColor = isDayPillar ? 'text-[#f472b6]' : 'text-[#4a4068]';
    const hanjaStyle = isDayPillar 
      ? "text-[28px] font-['Noto_Serif_KR'] font-black text-transparent bg-clip-text bg-gradient-to-b from-[#c084fc] to-[#f472b6]" 
      : "text-[28px] font-['Noto_Serif_KR'] font-black text-[#f0eaf8]";

    return (
      <div className="flex flex-col items-center justify-center py-1">
        <span className={`text-[10px] font-bold mb-2 ${sipseongColor}`}>{sipseong}</span>
        <span className={hanjaStyle}>{char}</span>
        <span className={`text-[10px] mt-2 font-bold ${hangulColor}`}>{hangul}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans text-[#f0eaf8] bg-[#07060c] pb-20 pt-8 animate-fade-in-up">
      
      {/* 몽환적 배경 */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#c084fc] rounded-full blur-[120px] opacity-10 -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#f472b6] rounded-full blur-[140px] opacity-10 -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="max-w-md mx-auto p-5 space-y-6">
        
        {/* 상단: 분석 완료 라벨 */}
        <div className="flex justify-center mb-6">
          <div className="px-5 py-1.5 rounded-full bg-[#141120] border border-[rgba(180,140,255,0.20)] text-[#9D8FBA] text-[10px] font-light tracking-[0.3px] shadow-[0_0_15px_rgba(192,132,252,0.15)] flex items-center gap-2 font-['Noto_Sans_KR']">
            <span className="text-[#c084fc]">✦</span> 
            분석 완료 
            <span className="text-[#c084fc]">✦</span>
          </div>
        </div>

        {/* 히어로 카드 (이미지 스타일: 나 - 하트 - 상대방) */}
        <div className="bg-[#141120] rounded-[2rem] p-6 flex justify-between items-center border border-[rgba(180,140,255,0.11)] shadow-lg mb-8">
          <div className="text-center flex-1">
            <div className="text-[11px] text-[#4a4068] mb-1.5 font-bold">나</div>
            <div className="text-[18px] font-['Noto_Serif_KR'] font-bold text-[#f0eaf8] truncate">{me.name || '나'}</div>
            <div className="text-[10px] text-[#4a4068] mt-1.5 font-bold tracking-widest">{me.date.replace(/-/g, '.')}</div>
          </div>
          
          <div className="flex flex-col items-center px-2">
            <div className="w-14 h-14 rounded-full bg-[rgba(180,140,255,0.08)] border border-[rgba(180,140,255,0.2)] flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(192,132,252,0.15)]">
              <img
                src={heartIcon}
                alt="heart icon"
                className="w-[24px] h-[24px]"
              />
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
            <span className="text-[12px] font-bold text-[#7eb8f7]">나 ({me.name || '나'})</span>
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
            <span className="text-[12px] font-bold text-[#f0c060]">상대방 ({pt.name || '상대방'})</span>
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
            <h3 className="text-[14px] font-bold text-[#f472b6] mb-1.5">
              {analysis.relation.hapTitle.split(' (')[0]}
            </h3>
            {analysis.relation.hapTitle.includes(' (') && (
              <div className="text-[11px] text-[#9d8fba] mb-1.5">
                {analysis.relation.hapTitle.split(' (')[1].replace(')', '')}
              </div>
            )}
            <p className="text-[11px] text-[#c0bad0] leading-snug opacity-80 break-keep">
              {analysis.relation.hapDesc}
            </p>
          </div>

          {/* 오렌지색 충(沖) 카드 */}
          <div className="bg-[#fb923c]/[0.06] p-5 rounded-[14px] border border-[#fb923c]/20 flex flex-col items-center text-center">
            <div className="text-2xl mb-2">⚡</div>
            {/* 타이틀 색상도 피그마 오렌지 색상(#fb923c)으로 완벽하게 맞췄습니다 */}
            <h3 className="text-[14px] font-bold text-[#fb923c] mb-1.5">
              {analysis.relation.chungTitle.split(' (')[0]}
            </h3>
            {analysis.relation.chungTitle.includes(' (') && (
              <div className="text-[11px] text-[#9d8fba] mb-1.5">
                {analysis.relation.chungTitle.split(' (')[1].replace(')', '')}
              </div>
            )}
            <p className="text-[11px] text-[#c0bad0] leading-snug opacity-80 break-keep">
              {analysis.relation.chungDesc}
            </p>
          </div>
        </div>

        {/* 오행 구성 비교 */}
        <div className="bg-[#141120] rounded-[2rem] p-6 border border-[rgba(180,140,255,0.11)] shadow-lg mt-8">
          <div className="text-[13px] font-bold text-[#7eb8f7] mb-6 flex justify-between items-center px-1">
            <span>🌿 오행 구성 비교</span>
          </div>
          <div className="grid grid-cols-[28px_1fr_1fr] gap-5 mb-5 text-center">
            <div></div>
            <div className="text-[11px] text-[#4a4068] font-bold">나</div>
            <div className="text-[11px] text-[#4a4068] font-bold">상대</div>
          </div>
          <div className="space-y-4">
            {['목', '화', '토', '금', '수'].map((el) => {
              const hanjaMap: Record<string, string> = { '목': '木', '화': '火', '토': '土', '금': '金', '수': '水' };
              const mePct = (analysis.meSaju.elements[el] / analysis.meSaju.totalChars) * 100;
              const ptPct = (analysis.ptSaju.elements[el] / analysis.ptSaju.totalChars) * 100;
              return (
                <div key={el} className="grid grid-cols-[28px_1fr_1fr] gap-5 items-center">
                  <div className="text-[16px] font-['Noto_Serif_KR'] font-black text-[#9d8fba] text-left">{hanjaMap[el]}</div>
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

        {/* 궁합 상세 설명 (원형 프로그레스 바 적용) */}
        <div className="bg-[#141120] rounded-[2rem] p-6 border border-[rgba(180,140,255,0.11)] shadow-lg mt-8">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[14px]">⭐</span>
            <h3 className="text-[13px] font-bold text-[#f0eaf8]">궁합 점수</h3>
          </div>

          <div className="flex items-center gap-6">
            {/* 왼쪽: 원형 프로그레스 바 */}
            <div className="relative w-[84px] h-[84px] flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 84 84">
                {/* 배경 궤도 */}
                <circle
                  cx="42" cy="42" r="36"
                  stroke="rgba(126, 184, 247, 0.15)"
                  strokeWidth="6"
                  fill="none"
                />
                {/* 점수 게이지 (파란색) */}
                <circle
                  cx="42" cy="42" r="36"
                  stroke="#7eb8f7"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 226.2, /* 2 * PI * 36 */
                    strokeDashoffset: 226.2 - (analysis.score / 100) * 226.2,
                    transition: 'stroke-dashoffset 1.5s ease-out'
                  }}
                />
              </svg>
              {/* 가운데 점수 텍스트 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[24px] font-['Noto_Serif_KR'] font-black text-[#7eb8f7]">
                  {analysis.score}<span className="text-[12px] font-sans font-normal ml-0.5 text-[#7eb8f7]">점</span>
                </span>
              </div>
            </div>

            {/* 오른쪽: 타이틀 및 설명 텍스트 */}
            <div className="flex-1">
              <div className="text-[15px] font-bold text-[#f0eaf8] mb-2 leading-snug tracking-tight">
                {analysis.scoreComment.title}
              </div>
              <p className="text-[12px] text-[#9d8fba] leading-relaxed break-keep">
                {analysis.scoreComment.desc}
              </p>
            </div>
          </div>
        </div>

        {/* 운의 흐름 */}
        <div className="bg-[#141120] rounded-[2rem] p-6 border border-[rgba(180,140,255,0.11)] shadow-lg mb-12">
          <div className="text-[13px] font-bold text-[#7eb8f7] mb-6 flex items-center gap-2 px-1">
            <span>🌊</span> 현재 운의 흐름
          </div>
          
          <div className="space-y-6">
            {/* 나의 운 */}
            <div>
              <div className="text-[11px] font-bold text-[#4a4068] mb-3 px-1">나의 운</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#0f0d18] border border-[rgba(180,140,255,0.08)] rounded-2xl flex flex-col items-center justify-center py-4 shadow-sm">
                  <span className="text-[10px] text-[#4a4068] font-bold mb-2">대운</span>
                  <span className="text-[20px] font-['Noto_Serif_KR'] font-black text-[#f0eaf8] tracking-tight">{analysis.meSaju.fortune.daeUnAge}</span>
                  <span className="text-[12px] text-[#9d8fba] mt-2 font-medium tracking-widest">{analysis.meSaju.fortune.daeUnPillar}</span>
                </div>
                <div className="bg-[#0f0d18] border border-[rgba(180,140,255,0.08)] rounded-2xl flex flex-col items-center justify-center py-4 shadow-sm">
                  <span className="text-[10px] text-[#4a4068] font-bold mb-2">세운</span>
                  <span className="text-[20px] font-['Noto_Serif_KR'] font-black text-[#f0eaf8] tracking-tight">{analysis.meSaju.fortune.seUnYear}</span>
                  <span className="text-[12px] text-[#9d8fba] mt-2 font-medium tracking-widest">{analysis.meSaju.fortune.seUnPillar}</span>
                </div>
                <div className="bg-[#0f0d18] border border-[rgba(180,140,255,0.08)] rounded-2xl flex flex-col items-center justify-center py-4 shadow-sm">
                  <span className="text-[10px] text-[#4a4068] font-bold mb-2">월운</span>
                  <span className="text-[20px] font-['Noto_Serif_KR'] font-black text-[#f0eaf8] tracking-tight">{analysis.meSaju.fortune.wolUnMonth}</span>
                  <span className="text-[12px] text-[#9d8fba] mt-2 font-medium tracking-widest">{analysis.meSaju.fortune.wolUnPillar}</span>
                </div>
              </div>
            </div>

            {/* 상대방의 운 */}
            <div>
              <div className="text-[11px] font-bold text-[#4a4068] mb-3 px-1">상대방의 운</div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#0f0d18] border border-[rgba(180,140,255,0.08)] rounded-2xl flex flex-col items-center justify-center py-4 shadow-sm">
                  <span className="text-[10px] text-[#4a4068] font-bold mb-2">대운</span>
                  <span className="text-[20px] font-['Noto_Serif_KR'] font-black text-[#f0eaf8] tracking-tight">{analysis.ptSaju.fortune.daeUnAge}</span>
                  <span className="text-[12px] text-[#9d8fba] mt-2 font-medium tracking-widest">{analysis.ptSaju.fortune.daeUnPillar}</span>
                </div>
                <div className="bg-[#0f0d18] border border-[rgba(180,140,255,0.08)] rounded-2xl flex flex-col items-center justify-center py-4 shadow-sm">
                  <span className="text-[10px] text-[#4a4068] font-bold mb-2">세운</span>
                  <span className="text-[20px] font-['Noto_Serif_KR'] font-black text-[#f0eaf8] tracking-tight">{analysis.ptSaju.fortune.seUnYear}</span>
                  <span className="text-[12px] text-[#9d8fba] mt-2 font-medium tracking-widest">{analysis.ptSaju.fortune.seUnPillar}</span>
                </div>
                <div className="bg-[#0f0d18] border border-[rgba(180,140,255,0.08)] rounded-2xl flex flex-col items-center justify-center py-4 shadow-sm">
                  <span className="text-[10px] text-[#4a4068] font-bold mb-2">월운</span>
                  <span className="text-[20px] font-['Noto_Serif_KR'] font-black text-[#f0eaf8] tracking-tight">{analysis.ptSaju.fortune.wolUnMonth}</span>
                  <span className="text-[12px] text-[#9d8fba] mt-2 font-medium tracking-widest">{analysis.ptSaju.fortune.wolUnPillar}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✦ 심층 분석 라벨 (이미지 참고) */}
        <div className="flex flex-col items-center mb-6 mt-16">
          <div className="px-5 py-1.5 rounded-full bg-[#141120] border border-[rgba(180,140,255,0.20)] text-[#c084fc] text-[10px] font-bold tracking-[0.2em] flex items-center gap-2 mb-4">
            <span>✦</span> 심층 분석 <span>✦</span>
          </div>
          <div className="w-16 h-px bg-[rgba(180,140,255,0.2)]"></div>
        </div>

        {/* 결제 유도 메인 배너 */}
        {!isUnlocked && (
          <div className="bg-[#141120] rounded-[2rem] p-8 text-center border border-[rgba(180,140,255,0.15)] shadow-[0_0_30px_rgba(192,132,252,0.05)] mb-8">
            <div className="flex justify-center mb-5">
                  <img src={crystalBall} alt="" width={38} height={38} 
                    className="drop-shadow-[0_0_8px_rgba(192,132,252,0.8)] animate-bounce" 
                  />
                </div>
            <h3 className="text-[20px] font-['Noto_Serif_KR'] font-bold mb-3 text-[#f0eaf8] tracking-tight">심층 분석 전체 보기</h3>
            <p className="text-[12px] text-[#9d8fba] mb-8 leading-relaxed font-medium">10년차 전문 연애 상담가가<br/>두 사람의 상황을 깊이 분석해 드려요.</p>
            
            <div className="inline-block text-left text-[11px] text-[#b0a8c4] space-y-3 mb-8 font-medium">
              <div className="flex items-center gap-2"><span className="text-[#c084fc] text-[10px]">✦</span> 상대방 속마음 · 새로운 인연 가능성</div>
              <div className="flex items-center gap-2"><span className="text-[#c084fc] text-[10px]">✦</span> 재회 가능성 % · 재회 최적 타이밍</div>
              <div className="flex items-center gap-2"><span className="text-[#c084fc] text-[10px]">✦</span> 효과적인 접근법 · 재회 후 지속 가능성</div>
              <div className="flex items-center gap-2"><span className="text-[#c084fc] text-[10px]">✦</span> 지금 당장의 행동 지침 · 종합 총평</div>
            </div>
            
            <button onClick={() => navigate('/payment')} className="w-full py-3.5 bg-[linear-gradient(135deg,#C084FC,#F472B6)] text-white rounded-[1.2rem] shadow-[0_4px_20px_rgba(192,132,252,0.3)] hover:scale-[1.02] transition-transform flex flex-col items-center justify-center gap-0.5">
              <span className="font-black text-[15px]">지금 바로 분석 보기</span>
              <span className="text-[10px] text-white/90 font-medium">₩990 · 평생 소장</span>
            </button>
          </div>
        )}

        {/* ⑩~⑰ 프리미엄 리포트 카드들 */}
        <PremiumCard num="01" category="상대방 속마음" title="지금 그 사람은 나를 어떻게 생각할까요" icon="💭" isUnlocked={isUnlocked} onUnlock={handleUnlock}>
          <p>지금 상대방은 겉으로는 아무렇지 않아 보일 수 있어요. 그런데 이 사람의 에너지 흐름을 보면, 내면에서는 꽤 많은 것들을 혼자 소화하고 있는 상태예요. 이 사람은 원래 감정 표현이 서툰 편이라, 마음에 뭔가가 남아 있어도 먼저 내색하지 않아요.</p>
          <p>올해 이 사람에게 흐르는 기운은, 새로운 무언가를 향해 달려가기보다 지나온 시간을 돌아보게 만드는 흐름이에요. 이런 시기에는 예전 인연이나 기억들이 자연스럽게 떠오르거든요.</p>
        </PremiumCard>

        <PremiumCard num="02" category="새로운 인연 가능성" title="혹시 다른 사람이 생겼을까요?" icon="👁️" isUnlocked={isUnlocked} onUnlock={handleUnlock}>
          <p>지금 상대방의 에너지 흐름을 보면, 올해 새로운 이성을 끌어당기는 도화살 기운이 강하게 활성화된 시기는 아니에요.</p>
          <p>완전히 안심할 수는 없지만, 지금 당장 다른 누군가에게 마음이 가있을 가능성은 낮아요. 상대방이 아직 정리 중인 이 시간 안에 자연스럽게 연결이 되면, 그 흐름이 당신 쪽으로 기울 수 있어요.</p>
        </PremiumCard>

        <PremiumCard num="03" category="재회 가능성" title="우리가 다시 만날 확률은?" icon="✨" isUnlocked={isUnlocked} onUnlock={handleUnlock}>
          <div className="flex items-center gap-4 bg-[#0f0d18] p-4 rounded-2xl mb-4 border border-[rgba(180,140,255,0.08)]">
            <div className="text-3xl font-black text-[#c084fc]">68%</div>
            <div className="text-[11px] text-[#9d8fba]">두 사람의 기운이 올해 안으로<br/>다시 교차하는 구간이 있어요.</div>
          </div>
          <p>두 사람 사이에는 기본적으로 <span className="text-[#f472b6] font-bold">서로를 끌어당기는 관계(합)의 에너지</span>가 흐르고 있어요. 헤어졌다고 해서 그 에너지가 사라진 게 아니에요.</p>
        </PremiumCard>

        <PremiumCard num="04" category="재회 최적 타이밍" title="언제 연락하는 것이 가장 좋을까요?" icon="📅" isUnlocked={isUnlocked} onUnlock={handleUnlock}>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-[#0f0d18] border border-[rgba(180,140,255,0.08)] text-[#9d8fba] rounded-full text-[10px] font-bold">4월 ✓</span>
            <span className="px-3 py-1 bg-[#0f0d18] text-[#f472b6] rounded-full text-[10px] font-bold border border-[#f472b6]/30">7월 🔥 최고</span>
            <span className="px-3 py-1 bg-[#0f0d18] border border-[rgba(180,140,255,0.08)] text-[#4a4068] rounded-full text-[10px]">5월 ⚠️</span>
          </div>
          <p><span className="text-[#f472b6] font-bold">7월이 올해 두 사람에게 가장 중요한 시기예요.</span> 이 시기에는 같은 말을 해도 훨씬 잘 전달되고, 상대방도 마음이 열리기 쉬운 상태예요.</p>
        </PremiumCard>

        <PremiumCard num="05" category="행동 지침" title="지금 당장 내가 해야 할 행동" icon="⚡" isUnlocked={isUnlocked} onUnlock={handleUnlock}>
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
          <div className={`transition-all duration-500 ${!isUnlocked ? 'blur-[8px] opacity-30 select-none' : ''}`}>
            <div className="text-[#f0c060] text-2xl mb-3">✦</div>
            <div className="text-[#f0eaf8] font-black mb-4 font-['Noto_Serif_KR'] text-[18px]">종합 총평</div>
            <p className="text-[12.5px] text-[#c0bad0] leading-relaxed mb-6 text-left break-keep">
              두 사람의 관계는 단순히 감정적인 미련으로만 이어진 인연이 아니에요. 기본적으로 서로를 끌어당기는 기운(합)이 있고, 올해의 흐름도 재회에 우호적이에요. 가장 중요한 건 <span className="text-[#c084fc] font-bold">7월 이전, 4~7월 사이에 자연스럽고 가볍게 접근</span>하는 거예요.
            </p>
            <div className="bg-[#0f0d18] border border-[rgba(180,140,255,0.11)] text-[#f472b6] font-bold text-[12px] py-2.5 px-5 rounded-full inline-block shadow-sm">
              재회해도 좋은 인연이에요 💜
            </div>
          </div>
          
          {!isUnlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(180deg,rgba(7,6,12,0)_0%,rgba(7,6,12,0.98)_60%)] z-10">
              <div className="text-3xl mb-3 text-[#f0c060]">🔒</div>
              <div className="text-[12px] text-[#9d8fba] mb-5">결제 후 종합 총평을 확인하세요</div>
              {/* 메인 배너 버튼과 동일하게 맞춤 */}
              <button onClick={handleUnlock} className="px-6 py-3.5 bg-[linear-gradient(135deg,#C084FC,#F472B6)] hover:scale-[1.02] text-white text-[13px] font-bold rounded-[1rem] transition-transform shadow-[0_4px_14px_rgba(192,132,252,0.3)] flex flex-col items-center gap-0.5">
                <span>잠금 해제하고 전체 보기</span>
              </button>
            </div>
          )}
        </div>

        {/* 하단 다시하기 버튼 */}
        <button onClick={onReset} className="block w-full mt-10 mb-6 text-[12px] font-bold text-[#4a4068] py-4 hover:text-[#9d8fba] transition-colors">
          처음으로 돌아가기
        </button>

      </div>
    </div>
  );
}