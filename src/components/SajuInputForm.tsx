import React, { useState } from 'react';
import type { PersonInput } from '../types/saju';

interface Props {
  me: PersonInput;
  setMe: React.Dispatch<React.SetStateAction<PersonInput>>;
  pt: PersonInput;
  setPt: React.Dispatch<React.SetStateAction<PersonInput>>;
  onCalculate: () => void;
  isLoading: boolean;
}

// ✅ 컴포넌트 밖으로 분리된 SelectIcon (에러 해결)
const SelectIcon = () => (
  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#4a4068]">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  </div>
);

export default function SajuInputForm({ me, setMe, pt, setPt, onCalculate, isLoading }: Props) {
  // 추가 정보 (헤어진 기간, 이별 이유) 상태 관리
  const [breakupDur, setBreakupDur] = useState("");
  const [breakupReason, setBreakupReason] = useState("");

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans text-[#f0eaf8] p-5 pb-12 bg-[#07060c]">
      
      {/* 몽환적인 오라 (Orbs) 배경 효과 */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#c084fc] rounded-full blur-[120px] opacity-10 -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#f472b6] rounded-full blur-[140px] opacity-10 -z-10 mix-blend-screen pointer-events-none"></div>

      {/* 헤더 (Hero) */}
      <header className="text-center mb-8 pt-6 animate-fade-in-up">
        <div className="inline-block px-5 py-1.5 rounded-full bg-[#141120] border border-[rgba(180,140,255,0.20)] text-[#c084fc] text-[11px] font-bold tracking-widest mb-6">
          ✦ 재회 사주 분석 ✦
        </div>
        {/* font-['Noto_Serif_KR'] 과 font-bold(700) 적용 */}
        <h1 className="text-3xl font-['Noto_Serif_KR'] font-bold tracking-tight text-[#f0eaf8] leading-snug mb-3">
          두 사람의 인연을<br/>
          <em className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#f472b6] not-italic">사주로 읽어드립니다</em>
        </h1>
        <p className="text-[#9d8fba] text-[12px] font-medium leading-relaxed">
          생년월일과 태어난 시간을 입력하시면<br/>AI가 두 사람의 재회 가능성을 분석해드려요.
        </p>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        
        {/* ☀️ 나의 정보 카드 */}
        <div className="bg-[#0f0d18] rounded-[1.5rem] p-6 border border-[rgba(180,140,255,0.11)] shadow-lg">
          {/* 👇 이 부분의 클래스를 요청하신 수치로 완벽하게 맞췄습니다! */}
          <div className="text-[#7eb8f7] font-['Noto_Sans_KR'] text-[10px] font-light tracking-[2px] mb-5 flex items-center gap-2">
            <span>☀️</span> 나의 정보
          </div>

          <div className="space-y-4">
            {/* 이름 입력 (초기값 비워둠) */}
            <div>
              <label className="text-[11px] font-bold text-[#9d8fba] mb-1.5 block">이름 (선택)</label>
              <input 
                type="text" 
                placeholder="예) 김지은"
                value={(me as any).name || ''} 
                onChange={e => setMe({...me, name: e.target.value} as any)} 
                className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 text-[14px] text-[#f0eaf8] placeholder-[#4a4068] focus:outline-none focus:border-[rgba(180,140,255,0.4)] transition-colors" 
              />
            </div>

            {/* 생년월일 & 태어난 시간 (2열 배치) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#9d8fba] mb-1.5 block">생년월일</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={me.date} 
                    onChange={e => setMe({...me, date: e.target.value})} 
                    className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 text-[14px] text-[#f0eaf8] focus:outline-none focus:border-[rgba(180,140,255,0.4)] transition-colors appearance-none" 
                    style={{ colorScheme: 'dark' }} 
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#9d8fba] mb-1.5 block">태어난 시간</label>
                <div className="relative">
                  <select 
                    value={me.time} 
                    onChange={e => setMe({...me, time: e.target.value, isUnknownTime: e.target.value === ""})} 
                    className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 pr-10 text-[14px] text-[#f0eaf8] focus:outline-none focus:border-[rgba(180,140,255,0.4)] transition-colors appearance-none"
                  >
                    <option value="">모름</option>
                    <option value="23:30">자시 (23~01시)</option>
                    <option value="01:30">축시 (01~03시)</option>
                    <option value="03:30">인시 (03~05시)</option>
                    <option value="05:30">묘시 (05~07시)</option>
                    <option value="07:30">진시 (07~09시)</option>
                    <option value="09:30">사시 (09~11시)</option>
                    <option value="11:30">오시 (11~13시)</option>
                    <option value="13:30">미시 (13~15시)</option>
                    <option value="15:30">신시 (15~17시)</option>
                    <option value="17:30">유시 (17~19시)</option>
                    <option value="19:30">술시 (19~21시)</option>
                    <option value="21:30">해시 (21~23시)</option>
                  </select>
                  <SelectIcon />
                </div>
              </div>
            </div>

            {/* 성별 선택 (2열 배치) */}
            <div>
              <label className="text-[11px] font-bold text-[#9d8fba] mb-1.5 block">성별</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setMe({...me, gender: 'F'})} 
                  className={`py-3.5 rounded-xl font-bold text-[14px] transition-all ${me.gender === 'F' ? 'bg-[#141120] border border-[#c084fc] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba] hover:text-[#f0eaf8]'}`}
                >
                  여성
                </button>
                <button 
                  onClick={() => setMe({...me, gender: 'M'})} 
                  className={`py-3.5 rounded-xl font-bold text-[14px] transition-all ${me.gender === 'M' ? 'bg-[#141120] border border-[#c084fc] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba] hover:text-[#f0eaf8]'}`}
                >
                  남성
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 🌙 상대방 정보 카드 */}
        <div className="bg-[#0f0d18] rounded-[1.5rem] p-6 border border-[rgba(180,140,255,0.11)] shadow-lg">
          <div className="text-[#c084fc] font-['Noto_Sans_KR'] text-[10px] font-light tracking-[2px] mb-5 flex items-center gap-2">
            <span>🌙</span> 상대방 정보
          </div>

          <div className="space-y-4">
            {/* 이름 입력 (초기값 비워둠) */}
            <div>
              <label className="text-[11px] font-bold text-[#9d8fba] mb-1.5 block">이름 (선택)</label>
              <input 
                type="text" 
                placeholder="예) 이민준"
                value={(pt as any).name || ''} 
                onChange={e => setPt({...pt, name: e.target.value} as any)} 
                className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 text-[14px] text-[#f0eaf8] placeholder-[#4a4068] focus:outline-none focus:border-[rgba(180,140,255,0.4)] transition-colors" 
              />
            </div>

            {/* 생년월일 & 태어난 시간 (2열 배치) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#9d8fba] mb-1.5 block">생년월일</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={pt.date} 
                    onChange={e => setPt({...pt, date: e.target.value})} 
                    className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 text-[14px] text-[#f0eaf8] focus:outline-none focus:border-[rgba(180,140,255,0.4)] transition-colors appearance-none" 
                    style={{ colorScheme: 'dark' }} 
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#9d8fba] mb-1.5 block">태어난 시간</label>
                <div className="relative">
                  <select 
                    value={pt.time} 
                    onChange={e => setPt({...pt, time: e.target.value, isUnknownTime: e.target.value === ""})} 
                    className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 pr-10 text-[14px] text-[#f0eaf8] focus:outline-none focus:border-[rgba(180,140,255,0.4)] transition-colors appearance-none"
                  >
                    <option value="">모름</option>
                    <option value="23:30">자시 (23~01시)</option>
                    <option value="01:30">축시 (01~03시)</option>
                    <option value="03:30">인시 (03~05시)</option>
                    <option value="05:30">묘시 (05~07시)</option>
                    <option value="07:30">진시 (07~09시)</option>
                    <option value="09:30">사시 (09~11시)</option>
                    <option value="11:30">오시 (11~13시)</option>
                    <option value="13:30">미시 (13~15시)</option>
                    <option value="15:30">신시 (15~17시)</option>
                    <option value="17:30">유시 (17~19시)</option>
                    <option value="19:30">술시 (19~21시)</option>
                    <option value="21:30">해시 (21~23시)</option>
                  </select>
                  <SelectIcon />
                </div>
              </div>
            </div>

            {/* 성별 선택 (2열 배치) */}
            <div>
              <label className="text-[11px] font-bold text-[#9d8fba] mb-1.5 block">성별</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setPt({...pt, gender: 'F'})} 
                  className={`py-3.5 rounded-xl font-bold text-[14px] transition-all ${pt.gender === 'F' ? 'bg-[#141120] border border-[#c084fc] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba] hover:text-[#f0eaf8]'}`}
                >
                  여성
                </button>
                <button 
                  onClick={() => setPt({...pt, gender: 'M'})} 
                  className={`py-3.5 rounded-xl font-bold text-[14px] transition-all ${pt.gender === 'M' ? 'bg-[#141120] border border-[#c084fc] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba] hover:text-[#f0eaf8]'}`}
                >
                  남성
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ✦ 추가 정보 (선택) 카드 */}
        <div className="bg-[#0f0d18] rounded-[1.5rem] p-6 border border-[rgba(180,140,255,0.11)] shadow-lg">
          <div className="text-[12px] font-bold text-[#4a4068] mb-5 flex items-center gap-2">
            ✦ 추가 정보 <span className="text-[10px] font-normal">(선택 · 더 정확한 분석을 위해)</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-[#9d8fba] mb-1.5 block">헤어진 지 얼마나 됐나요?</label>
              <div className="relative">
                <select 
                  value={breakupDur}
                  onChange={(e) => setBreakupDur(e.target.value)}
                  className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 pr-10 text-[14px] text-[#f0eaf8] focus:outline-none focus:border-[rgba(180,140,255,0.4)] transition-colors appearance-none"
                >
                  <option value="">선택 안 함</option>
                  <option value="1개월 미만">1개월 미만</option>
                  <option value="1~3개월">1~3개월</option>
                  <option value="3~6개월">3~6개월</option>
                  <option value="6개월~1년">6개월~1년</option>
                  <option value="1년 이상">1년 이상</option>
                </select>
                <SelectIcon />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#9d8fba] mb-1.5 block">이별한 이유 (간단히)</label>
              <input 
                type="text" 
                placeholder="예) 자주 싸워서, 연락이 줄어서"
                value={breakupReason}
                onChange={(e) => setBreakupReason(e.target.value)}
                className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 text-[14px] text-[#f0eaf8] placeholder-[#4a4068] focus:outline-none focus:border-[rgba(180,140,255,0.4)] transition-colors" 
              />
            </div>
          </div>
        </div>

        {/* ✦ 분석 시작 CTA 버튼 */}
        <button 
          onClick={onCalculate} 
          disabled={isLoading} 
          className="w-full mt-4 h-[54px] bg-[linear-gradient(135deg,#C084FC,#F472B6)] text-white font-black text-[16px] rounded-2xl shadow-[0_4px_20px_rgba(192,132,252,0.3)] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2 text-[14px]">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              사주 분석 중...
            </span>
          ) : '✦ 지금 바로 분석하기'}
        </button>

      </div>
    </div>
  );
}