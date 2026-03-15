import React from 'react';
import type { PersonInput, SajuResult, RelationResult } from '../types/saju';
import { HANJA_TO_HANGUL, TEXT_COLORS, CHAR_INFO } from '../constants/saju';
import { getSipseong, formatPillar } from '../utils/sajuEngine';

interface Props {
  me: PersonInput;
  pt: PersonInput;
  analysis: { meSaju: SajuResult; ptSaju: SajuResult; score: number; relation: RelationResult; scoreComment: { title: string; desc: string } };
  onReset: () => void;
}

export default function SajuResultView({ me, pt, analysis, onReset }: Props) {
  
  // 🌟 오행별 프로그레스 바 색상 매핑
  const ELEMENT_BAR_COLORS: Record<string, { me: string, pt: string }> = {
    '목': { me: 'bg-emerald-500/40', pt: 'bg-emerald-400' },
    '화': { me: 'bg-rose-500/40', pt: 'bg-rose-400' },
    '토': { me: 'bg-amber-500/40', pt: 'bg-amber-400' },
    '금': { me: 'bg-slate-400/40', pt: 'bg-slate-200' },
    '수': { me: 'bg-indigo-500/40', pt: 'bg-indigo-400' }
  };

  const renderSajuCard = (char: string | undefined, dayMaster: string) => {
    if (!char || char === '?') {
      return (
        <div className="bg-white/5 rounded-2xl p-2 flex flex-col items-center justify-center border border-white/5 h-[84px]">
          <span className="text-2xl font-serif text-white/10">?</span>
        </div>
      );
    }
    const sipseong = getSipseong(dayMaster, char);
    const hangul = HANJA_TO_HANGUL[char] || '';
    const element = CHAR_INFO[char]?.e || '';
    const textColor = TEXT_COLORS[element] || 'text-slate-200';

    return (
      <div className="bg-white/5 rounded-2xl p-2 flex flex-col items-center justify-center border border-white/10 shadow-sm">
        <span className="text-[9px] text-slate-500 font-bold mb-1.5 uppercase tracking-tighter">{sipseong}</span>
        <span className={`text-2xl font-serif font-black ${textColor}`}>{char}</span>
        <span className={`text-[10px] mt-1.5 font-bold ${textColor} opacity-80`}>{hangul}</span>
      </div>
    );
  };

  return (
    <div className="animate-fade-in-up pb-10 min-h-full" style={{ backgroundColor: '#07070C' }}>
      {/* 상단 헤더 섹션 */}
      <header className="bg-white/[0.02] border-b border-white/5 p-6 pt-12">
        <div className="flex justify-between items-center max-w-[280px] mx-auto">
          <div className="text-center w-20">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Me</div>
            <div className="text-xs font-bold text-slate-200">{me.date.replace(/-/g, '.')}</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-2xl mb-1">💜</span>
            <div className="text-sm font-black text-white tracking-tighter">궁합 {analysis.score}점</div>
          </div>
          <div className="text-center w-20">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Partner</div>
            <div className="text-xs font-bold text-slate-200">{pt.date.replace(/-/g, '.')}</div>
          </div>
        </div>
        <button onClick={onReset} className="block mx-auto mt-8 text-[10px] text-slate-500 border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 hover:text-slate-300 transition-all">
          ← 정보 수정하기
        </button>
      </header>

      <div className="p-5 space-y-8">
        
        {/* 기본 사주 원국 데이터 */}
        <div className="space-y-6">
          <div className="bg-white/[0.03] rounded-[2rem] p-5 border border-white/5">
            <div className="text-[10px] font-black text-slate-400 mb-5 flex items-center gap-2 px-1 uppercase tracking-widest">
              <span className="w-1 h-1 bg-emerald-500 rounded-full"></span> My Saju
            </div>
            <div className="grid grid-cols-4 gap-2 text-center mb-3">
              {['시주', '일주', '월주', '연주'].map((label, i) => (
                <div key={i} className="text-[10px] font-bold text-slate-600">{label}</div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[analysis.meSaju.hour.charAt(0), analysis.meSaju.day.charAt(0), analysis.meSaju.month.charAt(0), analysis.meSaju.year.charAt(0)].map((char, i) => (
                <div key={`me-top-${i}`}>{renderSajuCard(char, analysis.meSaju.day.charAt(0))}</div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[analysis.meSaju.hour.charAt(1), analysis.meSaju.day.charAt(1), analysis.meSaju.month.charAt(1), analysis.meSaju.year.charAt(1)].map((char, i) => (
                <div key={`me-bot-${i}`}>{renderSajuCard(char, analysis.meSaju.day.charAt(0))}</div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] rounded-[2rem] p-5 border border-white/5">
            <div className="text-[10px] font-black text-slate-400 mb-5 flex items-center gap-2 px-1 uppercase tracking-widest">
              <span className="w-1 h-1 bg-amber-500 rounded-full"></span> Partner Saju
            </div>
            <div className="grid grid-cols-4 gap-2 text-center mb-3">
              {['시주', '일주', '월주', '연주'].map((label, i) => (
                <div key={i} className="text-[10px] font-bold text-slate-600">{label}</div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[analysis.ptSaju.hour.charAt(0), analysis.ptSaju.day.charAt(0), analysis.ptSaju.month.charAt(0), analysis.ptSaju.year.charAt(0)].map((char, i) => (
                <div key={`pt-top-${i}`}>{renderSajuCard(char, analysis.ptSaju.day.charAt(0))}</div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[analysis.ptSaju.hour.charAt(1), analysis.ptSaju.day.charAt(1), analysis.ptSaju.month.charAt(1), analysis.ptSaju.year.charAt(1)].map((char, i) => (
                <div key={`pt-bot-${i}`}>{renderSajuCard(char, analysis.ptSaju.day.charAt(0))}</div>
              ))}
            </div>
          </div>
        </div>

        {/* 오행 구성 비교 */}
        <div className="bg-white/[0.03] rounded-[2rem] p-6 border border-white/5">
          <h3 className="text-[10px] font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-widest">🌿 Element Balance</h3>
          <div className="space-y-5">
            {['목', '화', '토', '금', '수'].map((el) => {
              const hanjaMap: Record<string, string> = { '목': '木', '화': '火', '토': '土', '금': '金', '수': '水' };
              const mePct = (analysis.meSaju.elements[el] / analysis.meSaju.totalChars) * 100;
              const ptPct = (analysis.ptSaju.elements[el] / analysis.ptSaju.totalChars) * 100;
              const barColor = ELEMENT_BAR_COLORS[el];
              
              return (
                <div key={el} className="flex items-center gap-4">
                  <span className="font-bold text-slate-500 w-10 text-[11px]">{el}({hanjaMap[el]})</span>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor.me} rounded-full transition-all duration-700`} style={{ width: `${mePct}%` }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor.pt} shadow-[0_0_8px_rgba(255,255,255,0.1)] rounded-full transition-all duration-700`} style={{ width: `${ptPct}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-4 mt-4 px-1">
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-white/20"></div><span className="text-[9px] font-bold text-slate-600 uppercase">나</span></div>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-white/60"></div><span className="text-[9px] font-bold text-slate-600 uppercase">상대</span></div>
          </div>
        </div>

        {/* 합/충 카드 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 shadow-sm">
            <div className="text-xl mb-2">💕</div>
            <h3 className="text-[11px] font-black text-rose-400 mb-1">{analysis.relation.hapTitle}</h3>
            <p className="text-[10px] text-slate-500 leading-tight opacity-80">{analysis.relation.hapDesc}</p>
          </div>
          <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 shadow-sm">
            <div className="text-xl mb-2">⚡</div>
            <h3 className="text-[11px] font-black text-amber-400 mb-1">{analysis.relation.chungTitle}</h3>
            <p className="text-[10px] text-slate-500 leading-tight opacity-80">{analysis.relation.chungDesc}</p>
          </div>
        </div>

        {/* 궁합 상세 설명 */}
        <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">⭐</span>
            <h3 className="text-sm font-black text-white">궁합 점수 {analysis.score}점</h3>
          </div>
          <div className="text-xs font-black text-indigo-400 mb-2 uppercase tracking-tight">
            {analysis.scoreComment.title}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            {analysis.scoreComment.desc}
          </p>
        </div>

        {/* 운의 흐름 */}
        <div className="bg-white/[0.02] rounded-[2rem] p-6 border border-white/5">
          <h3 className="text-[10px] font-black text-slate-500 mb-5 flex items-center gap-2 uppercase tracking-widest">🌊 Current Fortune</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <span className="text-[10px] font-black text-indigo-400/70 block mb-3 uppercase tracking-tighter px-1">Me</span>
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                  <span className="text-slate-500 font-bold">대운 <span className="text-[8px] opacity-50">({analysis.meSaju.fortune.daeUnAge})</span></span>
                  <span className="font-black text-slate-200">{formatPillar(analysis.meSaju.fortune.daeUnPillar)}</span>
                </div>
                <div className="flex justify-between bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                  <span className="text-slate-500 font-bold">세운 <span className="text-[8px] opacity-50">({analysis.meSaju.fortune.seUnYear})</span></span>
                  <span className="font-black text-slate-200">{formatPillar(analysis.meSaju.fortune.seUnPillar)}</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-black text-rose-400/70 block mb-3 uppercase tracking-tighter px-1">Partner</span>
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                  <span className="text-slate-500 font-bold">대운 <span className="text-[8px] opacity-50">({analysis.ptSaju.fortune.daeUnAge})</span></span>
                  <span className="font-black text-slate-200">{formatPillar(analysis.ptSaju.fortune.daeUnPillar)}</span>
                </div>
                <div className="flex justify-between bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                  <span className="text-slate-500 font-bold">세운 <span className="text-[8px] opacity-50">({analysis.ptSaju.fortune.seUnYear})</span></span>
                  <span className="font-black text-slate-200">{formatPillar(analysis.ptSaju.fortune.seUnPillar)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 결제 CTA 영역 */}
        <div className="mt-12 relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900/40 backdrop-blur-xl"></div>
          <div className="relative p-8 text-white text-center">
             <div className="text-3xl mb-4 animate-bounce">🔮</div>
             <h3 className="text-lg font-black mb-2 text-white tracking-tighter">우리의 진짜 인연은 어떨까?</h3>
             <p className="text-[11px] text-slate-400 mb-8 leading-relaxed font-medium">전문 연애 상담 AI가 두 사람의 관계를<br/>사주 원국을 통해 직접 풀어드립니다.</p>
             <button className="w-full py-4.5 bg-white text-slate-950 rounded-2xl font-black text-xs shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] transition-all uppercase tracking-widest">
               Get Deep Analysis
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}