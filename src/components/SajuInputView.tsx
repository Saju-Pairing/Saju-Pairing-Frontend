import React, { useState, useRef, useEffect } from 'react';
import type { PersonInput } from '../types/saju';
import { breakupDurOptions } from '../constants/sajuInputOptions';
import sunIcon from '../assets/icon-sun.svg';

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

const labelStyle = "text-[#9D8FBA] font-['Noto_Sans_KR'] text-[11px] font-light leading-normal tracking-[0.3px] mb-1.5 block";

const inputStyle = "w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 text-[14px] text-[#f0eaf8] placeholder-[#4a4068] focus:outline-none focus:border-[rgba(180,140,255,0.4)] transition-colors";

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length >= 7) return digits.slice(0, 4) + '.' + digits.slice(4, 6) + '.' + digits.slice(6);
  if (digits.length >= 5) return digits.slice(0, 4) + '.' + digits.slice(4);
  return digits;
}

function dateDisplayToISO(display: string): string {
  const digits = display.replace(/\D/g, '');
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  return '';
}

function formatTimeInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + ':' + digits.slice(2);
  return digits;
}

interface TimeFieldProps {
  value: string;
  unknown: boolean;
  onChangeValue: (val: string) => void;
  onChangeUnknown: (val: boolean) => void;
}

const TimeField = ({ value, unknown, onChangeValue, onChangeUnknown }: TimeFieldProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5 relative w-max">
        <span className="text-[#9D8FBA] font-['Noto_Sans_KR'] text-[11px] font-light leading-normal tracking-[0.3px]">
          태어난 시간
        </span>
        
        <div 
          className="cursor-pointer flex items-center justify-center"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(157,143,186,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>

        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-max bg-[#635b75] rounded-[10px] px-5 py-3 shadow-lg z-50">
            <div className="text-[#d6bdfa] text-[13px] font-light font-['Noto_Sans_KR'] text-center leading-[1.6] tracking-wide">
              실제 태양위치에 맞게<br />시간이 30분 자동 보정됩니다
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-[#635b75]"></div>
          </div>
        )}
      </div>

      <input
        type="text"
        inputMode="numeric"
        placeholder="24시 기준으로 입력 (예: 17:30)"
        value={value}
        disabled={unknown}
        onChange={e => onChangeValue(formatTimeInput(e.target.value))}
        className={`${inputStyle} disabled:opacity-40`}
      />
      <label className="flex items-center gap-2 mt-2.5 cursor-pointer select-none">
        <div
          onClick={() => onChangeUnknown(!unknown)}
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer ${unknown ? 'bg-[#c084fc] border-[#c084fc]' : 'border-[rgba(180,140,255,0.3)] bg-transparent'}`}
        >
          {unknown && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <span className="text-[#9d8fba] text-[13px] font-light">태어난 시간 모름</span>
      </label>
    </div>
  );
};

const SelectIcon = () => (
  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#4a4068]">
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 1l5 5 5-5"/>
    </svg>
  </div>
);

export default function SajuInputForm({ me, setMe, pt, setPt, onCalculate, isLoading }: Props) {
  const [breakupDur, setBreakupDur] = useState("");
  const [breakupReason, setBreakupReason] = useState("");
  const [breakupDurOpen, setBreakupDurOpen] = useState(false);

  const [meDateInput, setMeDateInput] = useState("");
  const [meTimeInput, setMeTimeInput] = useState("");
  const [meTimeUnknown, setMeTimeUnknown] = useState(false);

  const [ptDateInput, setPtDateInput] = useState("");
  const [ptTimeInput, setPtTimeInput] = useState("");
  const [ptTimeUnknown, setPtTimeUnknown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBreakupDurOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans text-[#f0eaf8] p-5 pb-12 pt-[70px] bg-[#07060c]">

      {/* 배경 블러 */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#c084fc] rounded-full blur-[120px] opacity-10 -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#f472b6] rounded-full blur-[140px] opacity-10 -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="fixed top-[30%] left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-[#60a5fa] rounded-full blur-[40px] opacity-[0.18] -z-10 pointer-events-none"></div>

      {/* 헤더 */}
      <header className="text-center mb-8 animate-fade-in-up">
        <div className="inline-block px-5 py-1.5 rounded-full bg-[#141120] border border-[rgba(192,132,252,0.5)] text-[#C084FC] text-[10px] font-light tracking-[2.5px] mb-6 font-['Noto_Sans_KR']">
          ✦ 재회 사주 ✦
        </div>
        <h1 className="text-[26px] font-['Noto_Serif_KR'] font-bold leading-snug tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f472b6] to-[#c084fc]">다시 시작하고 싶은</span><br />
          <span className="text-[#f0eaf8]">당신을 위해</span>
        </h1>
        <p className="text-center text-[#9D8FBA] text-[13px] font-light leading-[23.4px] font-['Noto_Sans_KR']">
          두 사람의 재회 가능성,<br/>최적의 타이밍, 접근법을 분석해드려요.
        </p>
      </header>

      <div className="max-w-md mx-auto space-y-4">

        {/* 나의 정보 카드 */}
        <div className="bg-[#0f0d18] rounded-[1.5rem] p-5 border border-[rgba(180,140,255,0.11)] shadow-lg">
          <div className="text-[#7eb8f7] font-['Noto_Sans_KR'] text-[12px] font-light tracking-[2px] mb-5 flex items-center gap-2">
            <img src={sunIcon} alt="" className="w-[14px] h-[14px] drop-shadow-[0_0_8px_rgba(126,184,247,0.6)]" />
            나의 정보
          </div>

          <div className="space-y-4">
            {/* 이름 */}
            <div>
              <label className={labelStyle}>이름</label>
              <input
                type="text"
                maxLength={5}
                placeholder="최대 5글자까지 입력 가능"
                value={me.name || ''}
                onChange={e => setMe({ ...me, name: e.target.value })}
                className={inputStyle}
              />
            </div>

            {/* 생년월일 */}
            <div>
              <label className={labelStyle}>생년월일</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="2000.01.01"
                value={meDateInput}
                onChange={e => {
                  const formatted = formatDateInput(e.target.value);
                  setMeDateInput(formatted);
                  const iso = dateDisplayToISO(formatted);
                  if (iso) setMe({ ...me, date: iso });
                }}
                className={inputStyle}
              />
            </div>

            {/* 태어난 시간 */}
            <TimeField
              value={meTimeInput}
              unknown={meTimeUnknown}
              onChangeValue={val => {
                setMeTimeInput(val);
                setMe({ ...me, time: val, isUnknownTime: false });
              }}
              onChangeUnknown={val => {
                setMeTimeUnknown(val);
                if (val) {
                  setMeTimeInput('');
                  setMe({ ...me, time: '', isUnknownTime: true });
                } else {
                  setMe({ ...me, isUnknownTime: false });
                }
              }}
            />

            {/* 성별 */}
            <div>
              <label className={labelStyle}>성별</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMe({ ...me, gender: 'F' })}
                  className={`py-3 rounded-xl text-[14px] transition-all ${me.gender === 'F' ? 'bg-[rgba(192,132,252,0.08)] border border-[rgba(192,132,252,0.5)] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba]'}`}
                >
                  여성
                </button>
                <button
                  type="button"
                  onClick={() => setMe({ ...me, gender: 'M' })}
                  className={`py-3 rounded-xl text-[14px] transition-all ${me.gender === 'M' ? 'bg-[rgba(192,132,252,0.08)] border border-[rgba(192,132,252,0.5)] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba]'}`}
                >
                  남성
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 상대방 정보 카드 */}
        <div className="bg-[#0f0d18] rounded-[1.5rem] p-5 border border-[rgba(180,140,255,0.11)] shadow-lg">
          <div className="text-[#c084fc] font-['Noto_Sans_KR'] text-[12px] font-light tracking-[2px] mb-5 flex items-center gap-2">
            <span className="text-[10px]">🌙</span>
            상대방 정보
          </div>

          <div className="space-y-4">
            {/* 이름 */}
            <div>
              <label className={labelStyle}>이름</label>
              <input
                type="text"
                maxLength={5}
                placeholder="최대 5글자까지 입력 가능"
                value={pt.name || ''}
                onChange={e => setPt({ ...pt, name: e.target.value })}
                className={inputStyle}
              />
            </div>

            {/* 생년월일 */}
            <div>
              <label className={labelStyle}>생년월일</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="2000.01.01"
                value={ptDateInput}
                onChange={e => {
                  const formatted = formatDateInput(e.target.value);
                  setPtDateInput(formatted);
                  const iso = dateDisplayToISO(formatted);
                  if (iso) setPt({ ...pt, date: iso });
                }}
                className={inputStyle}
              />
            </div>

            {/* 태어난 시간 */}
            <TimeField
              value={ptTimeInput}
              unknown={ptTimeUnknown}
              onChangeValue={val => {
                setPtTimeInput(val);
                setPt({ ...pt, time: val, isUnknownTime: false });
              }}
              onChangeUnknown={val => {
                setPtTimeUnknown(val);
                if (val) {
                  setPtTimeInput('');
                  setPt({ ...pt, time: '', isUnknownTime: true });
                } else {
                  setPt({ ...pt, isUnknownTime: false });
                }
              }}
            />

            {/* 성별 */}
            <div>
              <label className={labelStyle}>성별</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPt({ ...pt, gender: 'F' })}
                  className={`py-3 rounded-xl text-[14px] transition-all ${pt.gender === 'F' ? 'bg-[rgba(192,132,252,0.08)] border border-[rgba(192,132,252,0.5)] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba]'}`}
                >
                  여성
                </button>
                <button
                  type="button"
                  onClick={() => setPt({ ...pt, gender: 'M' })}
                  className={`py-3 rounded-xl text-[14px] transition-all ${pt.gender === 'M' ? 'bg-[rgba(192,132,252,0.08)] border border-[rgba(192,132,252,0.5)] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba]'}`}
                >
                  남성
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 추가 정보 카드 */}
        <div className="bg-[#141120] rounded-[16px] border border-[rgba(180,140,255,0.11)] p-4">
          <div className="text-[#c084fc] font-['Noto_Sans_KR'] text-[12px] font-light tracking-[2px] mb-3">
            ✦ 추가정보(선택・더 정확한 분석)
          </div>

          <div className="space-y-3" ref={dropdownRef}>
            {/* 헤어진 기간 */}
            <div>
              <label className={labelStyle}>헤어진 지 얼마나 됐나요?</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setBreakupDurOpen(!breakupDurOpen)}
                  className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 pr-10 text-left text-[14px] text-[#f0eaf8] focus:outline-none h-[48px] flex items-center"
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

            {/* 이별 이유 */}
            <div>
              <label className={labelStyle}>이별한 이유</label>
              <input
                type="text"
                maxLength={30}
                placeholder="예) 자주 싸워서, 연락이 줄어서"
                value={breakupReason}
                onChange={e => setBreakupReason(e.target.value)}
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* 분석하기 버튼 */}
        <button
          type="button"
          onClick={onCalculate}
          disabled={isLoading}
          className="w-full h-[54px] bg-[linear-gradient(99.16deg,#C084FC_0%,#F472B6_100%)] text-white font-bold text-[16px] rounded-[14px] shadow-[0px_8px_32px_0px_rgba(192,132,252,0.3)] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isLoading ? '✦ 사주 분석 중...' : '✦  지금 바로 분석하기'}
        </button>
      </div>
    </div>
  );
}