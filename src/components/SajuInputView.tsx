import React, { useState, useRef, useEffect } from 'react';
import type { PersonInput } from '../types/saju';
import SajuWheelPickerModal from './SajuWheelPickerModal';
import { breakupDurOptions, timeOptions } from '../constants/sajuInputOptions';
import sunIcon from '../assets/icon-sun.svg';

// name 속성이 포함된 타입을 내부적으로 정의
interface ExtendedPersonInput extends PersonInput {
  name?: string;
}

interface Props {
  me: ExtendedPersonInput;
  setMe: React.Dispatch<React.SetStateAction<ExtendedPersonInput>>;
  pt: ExtendedPersonInput;
  setPt: React.Dispatch<React.SetStateAction<ExtendedPersonInput>>;
  onCalculate: () => void;
  isLoading: boolean;
}

const SelectIcon = () => (
  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#4a4068]">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  </div>
);

type ActivePicker = 'me' | 'pt' | null;

// 공통 라벨 스타일 정의
const labelStyle = "text-[#9D8FBA] font-['Noto_Sans_KR'] text-[11px] font-light leading-normal tracking-[0.3px] mb-1.5 block";

export default function SajuInputForm({ me, setMe, pt, setPt, onCalculate, isLoading }: Props) {
  const [breakupDur, setBreakupDur] = useState("");
  const [breakupReason, setBreakupReason] = useState("");
  
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);
  
  const [meTimeOpen, setMeTimeOpen] = useState(false);
  const [ptTimeOpen, setPtTimeOpen] = useState(false);
  const [breakupDurOpen, setBreakupDurOpen] = useState(false);

  const meTimeRef = useRef<HTMLDivElement>(null);
  const ptTimeRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (meTimeRef.current && !meTimeRef.current.contains(target)) setMeTimeOpen(false);
      if (ptTimeRef.current && !ptTimeRef.current.contains(target)) setPtTimeOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(target)) setBreakupDurOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveDate = (date: string) => {
    if (!activePicker) return;
    if (activePicker === 'me') setMe({ ...me, date });
    else setPt({ ...pt, date });
    setActivePicker(null);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans text-[#f0eaf8] p-5 pb-12 pt-[70px] bg-[#07060c]">
      
      {/* 배경 효과 */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#c084fc] rounded-full blur-[120px] opacity-10 -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#f472b6] rounded-full blur-[140px] opacity-10 -z-10 mix-blend-screen pointer-events-none"></div>

      <header className="text-center mb-8 animate-fade-in-up">
        <div className="inline-block px-5 py-1.5 rounded-full bg-[#141120] border border-[rgba(180,140,255,0.20)] text-center text-[#C084FC] text-[10px] font-light tracking-[2.5px] mb-6 font-['Noto_Sans_KR']">
          <span className="text-[#c084fc]">✦</span> 
            재회 사주 
          <span className="text-[#c084fc]">✦</span>
        </div>
        <h1 className="text-[26px] font-['Noto_Serif_KR'] font-bold leading-snug tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f472b6] to-[#c084fc]">다시 시작하고 싶은</span><br />
          <span className="text-[#f0eaf8]">당신을 위해</span>
        </h1>
        <p className="text-center text-[#9D8FBA] text-[13px] font-light leading-[23.4px] font-['Noto_Sans_KR']">
          두 사람의 재회 가능성,<br/>
          최적의 타이밍, 접근법을 분석해드려요.
        </p>
      </header>

      <div className="max-w-md mx-auto space-y-6">
        
        {/* ☀️ 나의 정보 카드 */}
        <div className="bg-[#0f0d18] rounded-[1.5rem] p-5 border border-[rgba(180,140,255,0.11)] shadow-lg">
          <div className="text-[#7eb8f7] font-['Noto_Sans_KR'] text-[10px] font-light tracking-[2px] mb-5 flex items-center gap-2">
            <img
              src={sunIcon}
              alt="sun icon"
              className="w-[14px] h-[14px] drop-shadow-[0_0_8px_rgba(126,184,247,0.6)]"
            />
            나의 정보
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelStyle}>이름 (선택)</label>
              <input
                type="text"
                maxLength={4} // 최대 5자 제한 추가
                placeholder="최대 5글자까지 입력 가능"
                value={me.name || ''}
                onChange={e => setMe({...me, name: e.target.value})}
                className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 text-[14px] text-[#f0eaf8] placeholder-[#4a4068] focus:outline-none focus:border-[rgba(180,140,255,0.4)] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelStyle}>생년월일*</label>
                <button
                  type="button"
                  onClick={() => setActivePicker('me')}
                  className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 text-left text-[14px] text-[#f0eaf8] transition-colors"
                >
                  {me.date ? me.date.replace(/-/g, '.') : <span className="text-[#4a4068]">날짜 선택</span>}
                </button>
              </div>

              <div ref={meTimeRef}>
                <label className={labelStyle}>태어난 시간</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMeTimeOpen(!meTimeOpen)}
                    className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 pr-10 text-left text-[14px] text-[#f0eaf8] transition-colors"
                  >
                    {timeOptions.find(t => t.value === me.time)?.label || '모름'}
                  </button>
                  <SelectIcon />
                  {meTimeOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-[#141120] border border-[rgba(180,140,255,0.2)] rounded-xl overflow-hidden shadow-xl max-h-[200px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                      {timeOptions.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setMe({ ...me, time: opt.value, isUnknownTime: opt.value === '' }); setMeTimeOpen(false); }}
                          className={`w-full px-4 py-3 text-left text-[13px] hover:bg-[rgba(180,140,255,0.08)] ${me.time === opt.value ? 'text-[#c084fc] font-bold' : 'text-[#9d8fba]'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className={labelStyle}>성별</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setMe({...me, gender: 'F'})} className={`py-3.5 rounded-xl font-bold text-[14px] transition-all ${me.gender === 'F' ? 'bg-[#141120] border border-[#c084fc] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba]'}`}>여성</button>
                <button onClick={() => setMe({...me, gender: 'M'})} className={`py-3.5 rounded-xl font-bold text-[14px] transition-all ${me.gender === 'M' ? 'bg-[#141120] border border-[#c084fc] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba]'}`}>남성</button>
              </div>
            </div>
          </div>
        </div>

        {/* 🌙 상대방 정보 카드 */}
        <div className="bg-[#0f0d18] rounded-[1.5rem] p-5 border border-[rgba(180,140,255,0.11)] shadow-lg">
          <div className="text-[#c084fc] font-['Noto_Sans_KR'] text-[10px] font-light tracking-[2px] mb-5 flex items-center gap-2">
            <span>🌙</span> 상대방 정보
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelStyle}>이름 (선택)</label>
              <input
                type="text"
                maxLength={4} // 최대 5자 제한 추가
                placeholder="최대 5글자까지 입력 가능"
                value={pt.name || ''}
                onChange={e => setPt({...pt, name: e.target.value})}
                className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 text-[14px] text-[#f0eaf8] placeholder-[#4a4068] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelStyle}>생년월일*</label>
                <button
                  type="button"
                  onClick={() => setActivePicker('pt')}
                  className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 text-left text-[14px] text-[#f0eaf8]"
                >
                  {pt.date ? pt.date.replace(/-/g, '.') : <span className="text-[#4a4068]">날짜 선택</span>}
                </button>
              </div>
              <div ref={ptTimeRef}>
                <label className={labelStyle}>태어난 시간</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setPtTimeOpen(!ptTimeOpen)}
                    className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 pr-10 text-left text-[14px] text-[#f0eaf8]"
                  >
                    {timeOptions.find(t => t.value === pt.time)?.label || '모름'}
                  </button>
                  <SelectIcon />
                  {ptTimeOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-[#141120] border border-[rgba(180,140,255,0.2)] rounded-xl overflow-hidden shadow-xl max-h-[200px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                      {timeOptions.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { setPt({ ...pt, time: opt.value, isUnknownTime: opt.value === '' }); setPtTimeOpen(false); }}
                          className={`w-full px-4 py-3 text-left text-[13px] hover:bg-[rgba(180,140,255,0.08)] ${pt.time === opt.value ? 'text-[#c084fc] font-bold' : 'text-[#9d8fba]'}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className={labelStyle}>성별</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setPt({...pt, gender: 'F'})} className={`py-3.5 rounded-xl font-bold text-[14px] transition-all ${pt.gender === 'F' ? 'bg-[#141120] border border-[#c084fc] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba]'}`}>여성</button>
                <button onClick={() => setPt({...pt, gender: 'M'})} className={`py-3.5 rounded-xl font-bold text-[14px] transition-all ${pt.gender === 'M' ? 'bg-[#141120] border border-[#c084fc] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba]'}`}>남성</button>
              </div>
            </div>
          </div>
        </div>

        {/* ✦ 추가 정보 카드 */}
        <div className="bg-[#0f0d18] rounded-[1.5rem] p-5 border border-[rgba(180,140,255,0.11)] shadow-lg">
          <div className="text-[12px] font-bold text-[#4a4068] mb-5 flex items-center gap-2 font-['Noto_Sans_KR']">
            ✦ 추가 정보 <span className="text-[10px] font-normal">(선택 · 더 정확한 분석을 위해)</span>
          </div>

          <div className="space-y-4" ref={dropdownRef}>
            <div>
              <label className={labelStyle}>헤어진 지 얼마나 됐나요?</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setBreakupDurOpen(!breakupDurOpen)}
                  className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 pr-10 text-left text-[14px] transition-colors focus:outline-none"
                >
                  <span className={breakupDur ? 'text-[#f0eaf8]' : 'text-[#4a4068]'}>
                    {breakupDur || '선택 안 함'}
                  </span>
                </button>
                <SelectIcon />
                {breakupDurOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-[#141120] border border-[rgba(180,140,255,0.2)] rounded-xl overflow-hidden shadow-xl">
                    {breakupDurOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setBreakupDur(opt.value); setBreakupDurOpen(false); }}
                        className={`w-full px-4 py-3 text-left text-[14px] transition-colors hover:bg-[rgba(180,140,255,0.08)] ${breakupDur === opt.value ? 'text-[#c084fc] font-bold bg-[rgba(180,140,255,0.06)]' : 'text-[#9d8fba]'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={labelStyle}>이별한 이유 (간단히)</label>
              <input
                type="text"
                maxLength={29} // 최대 30자 제한 추가
                placeholder="예) 자주 싸워서, 연락이 줄어서"
                value={breakupReason}
                onChange={(e) => setBreakupReason(e.target.value)}
                className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 text-[14px] text-[#f0eaf8] placeholder-[#4a4068] focus:outline-none focus:border-[rgba(180,140,255,0.4)] transition-colors"
              />
            </div>
          </div>
        </div>

        <button
          onClick={onCalculate}
          disabled={isLoading}
          className="w-full mt-4 h-[54px] bg-[linear-gradient(135deg,#C084FC,#F472B6)] text-white font-black text-[16px] rounded-2xl shadow-[0_4px_20px_rgba(192,132,252,0.3)] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isLoading ? '✦ 사주 분석 중...' : '✦ 지금 바로 분석하기'}
        </button>
      </div>

      <SajuWheelPickerModal
        key={activePicker || 'closed'}
        isOpen={activePicker !== null}
        onClose={() => setActivePicker(null)}
        onSave={handleSaveDate}
        initialDate={activePicker === 'me' ? me.date : pt.date}
      />

    </div>
  );
}