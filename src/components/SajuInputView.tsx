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
const inputStyle = "w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 text-[16px] text-[#f0eaf8] placeholder-[#4a4068] focus:outline-none focus:border-[rgba(180,140,255,0.4)] transition-colors";
const inputErrorStyle = "w-full bg-[#141120] border border-[rgba(255,100,100,0.5)] rounded-xl p-3.5 text-[16px] text-[#f0eaf8] placeholder-[#4a4068] focus:outline-none focus:border-[rgba(255,100,100,0.7)] transition-colors";
const errorMsgStyle = "text-[#ff6b6b] text-[11px] mt-1.5 font-['Noto_Sans_KR'] font-light";

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

function validateDate(display: string): string {
  const digits = display.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.length < 8) return '날짜를 끝까지 입력해주세요';

  const year = parseInt(digits.slice(0, 4));
  const month = parseInt(digits.slice(4, 6));
  const day = parseInt(digits.slice(6, 8));

  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) return `연도는 1900~${currentYear} 사이로 입력해주세요`;
  if (month < 1 || month > 12) return '월은 01~12 사이로 입력해주세요';

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return `${month}월은 ${daysInMonth}일까지 있어요`;

  return '';
}

function validateTime(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '';
  if (digits.length < 4) return '시간을 끝까지 입력해주세요';

  const hour = parseInt(digits.slice(0, 2));
  const minute = parseInt(digits.slice(2, 4));

  if (hour > 23) return '시간은 00~23 사이로 입력해주세요';
  if (minute > 59) return '분은 00~59 사이로 입력해주세요';

  return '';
}

interface TimeFieldProps {
  testIdPrefix: string; // 'my-time' 또는 'pt-time'
  value: string;
  unknown: boolean;
  onChangeValue: (val: string) => void;
  onChangeUnknown: (val: boolean) => void;
  error?: string;
}

const TimeField = ({ testIdPrefix, value, unknown, onChangeValue, onChangeUnknown, error }: TimeFieldProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5 select-none">
        <span className="text-[#9D8FBA] font-['Noto_Sans_KR'] text-[11px] font-light leading-normal tracking-[0.3px]">
          태어난 시간 (필수)
        </span>

        <div
          className="relative cursor-pointer flex items-center justify-center"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <svg className="block mt-[1.5px]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(157,143,186,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>

          {showTooltip && (
            <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-max bg-[#635b75] rounded-[10px] px-5 py-3 shadow-lg z-50 pointer-events-none">
              <div className="text-[#d6bdfa] text-[13px] font-light font-['Noto_Sans_KR'] text-center leading-[1.6] tracking-wide whitespace-nowrap">
                실제 태양위치에 맞게<br />시간이 30분 자동 보정됩니다
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#635b75]"></div>
            </div>
          )}
        </div>
      </div>

      <input
        type="text"
        inputMode="numeric"
        placeholder="24시 기준으로 입력 (예: 17:30)"
        value={value}
        disabled={unknown}
        onChange={e => onChangeValue(formatTimeInput(e.target.value))}
        className={`${error ? inputErrorStyle : inputStyle} disabled:opacity-40`}
        data-testid={`${testIdPrefix}-input`}
      />
      {error && <p className={errorMsgStyle} data-testid={`${testIdPrefix}-error`}>⚠ {error}</p>}

      <label className="flex items-center gap-2 mt-2.5 cursor-pointer select-none" data-testid={`${testIdPrefix}-unknown-checkbox`}>
        <div
          onClick={() => onChangeUnknown(!unknown)}
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer ${unknown ? 'bg-[#c084fc] border-[#c084fc]' : 'border-[rgba(180,140,255,0.3)] bg-transparent'}`}
        >
          {unknown && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
      <path d="M1 1l5 5 5-5" />
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

  const [meDateError, setMeDateError] = useState("");
  const [meTimeError, setMeTimeError] = useState("");
  const [ptDateError, setPtDateError] = useState("");
  const [ptTimeError, setPtTimeError] = useState("");

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

  const isFormValid =
    !!me.name?.trim() &&
    !!pt.name?.trim() &&
    !!meDateInput && !validateDate(meDateInput) &&
    !!ptDateInput && !validateDate(ptDateInput) &&
    (meTimeUnknown || (!!meTimeInput && !validateTime(meTimeInput))) &&
    (ptTimeUnknown || (!!ptTimeInput && !validateTime(ptTimeInput))) &&
    !!me.gender &&
    !!pt.gender;

  const handleCalculate = () => {
    const meDateErr = meDateInput ? validateDate(meDateInput) : '생년월일을 입력해주세요';
    const ptDateErr = ptDateInput ? validateDate(ptDateInput) : '생년월일을 Instruments를 입력해주세요';
    const meTimeErr = (!meTimeUnknown && meTimeInput) ? validateTime(meTimeInput) : '';
    const ptTimeErr = (!ptTimeUnknown && ptTimeInput) ? validateTime(ptTimeInput) : '';

    setMeDateError(meDateErr);
    setPtDateError(ptDateErr);
    setMeTimeError(meTimeErr);
    setPtTimeError(ptTimeErr);

    if (meDateErr || ptDateErr || meTimeErr || ptTimeErr) return;

    onCalculate();
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans text-[#f0eaf8] p-5 pb-12 pt-[70px] bg-[#07060c]">

      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#c084fc] rounded-full blur-[120px] opacity-10 -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#f472b6] rounded-full blur-[140px] opacity-10 -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="fixed top-[30%] left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-[#60a5fa] rounded-full blur-[40px] opacity-[0.18] -z-10 pointer-events-none"></div>

      <header className="text-center mb-8 animate-fade-in-up">
        <div className="inline-block px-5 py-1.5 rounded-full bg-[#141120] border border-[rgba(192,132,252,0.5)] text-[#C084FC] text-[10px] font-light tracking-[2.5px] mb-6 font-['Noto_Sans_KR']">
          ✦ 재회 사주 ✦
        </div>
        <h1 className="text-[26px] font-['Noto_Serif_KR'] font-bold leading-snug tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f472b6] to-[#c084fc]">다시 시작하고 싶은</span><br />
          <span className="text-[#f0eaf8]">당신을 위해</span>
        </h1>
        <p className="text-center text-[#9D8FBA] text-[13px] font-light leading-[23.4px] font-['Noto_Sans_KR']">
          두 사람의 재회 가능성,<br />최적의 타이밍, 접근법을 분석해드려요.
        </p>
      </header>

      <div className="max-w-md mx-auto space-y-4">

        <div className="bg-[#0f0d18] rounded-[1.5rem] p-5 border border-[rgba(180,140,255,0.11)] shadow-lg">
          <div className="text-[#7eb8f7] font-['Noto_Sans_KR'] text-[12px] font-light tracking-[2px] mb-5 flex items-center gap-2">
            <img src={sunIcon} alt="" className="w-[14px] h-[14px] drop-shadow-[0_0_8px_rgba(126,184,247,0.6)]" />
            나의 정보
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelStyle}>이름 (필수)</label>
              <input
                type="text"
                maxLength={5}
                placeholder="최대 5글자까지 입력 가능"
                value={me.name || ''}
                onChange={e => setMe({ ...me, name: e.target.value })}
                className={inputStyle}
                data-testid="my-name-input"
              />
            </div>

            <div>
              <label className={labelStyle}>생년월일 (필수)</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="2000.01.01"
                value={meDateInput}
                onChange={e => {
                  const formatted = formatDateInput(e.target.value);
                  setMeDateInput(formatted);
                  setMeDateError(validateDate(formatted));
                  const iso = dateDisplayToISO(formatted);
                  if (iso) setMe({ ...me, date: iso });
                }}
                className={meDateError ? inputErrorStyle : inputStyle}
                data-testid="my-birth-input"
              />
              {meDateError && <p className={errorMsgStyle} data-testid="my-birth-error">⚠ {meDateError}</p>}
            </div>

            <TimeField
              testIdPrefix="my-time"
              value={meTimeInput}
              unknown={meTimeUnknown}
              error={meTimeError}
              onChangeValue={val => {
                setMeTimeInput(val);
                setMeTimeError(validateTime(val));
                setMe({ ...me, time: val, isUnknownTime: false });
              }}
              onChangeUnknown={val => {
                setMeTimeUnknown(val);
                setMeTimeError('');
                if (val) {
                  setMeTimeInput('');
                  setMe({ ...me, time: '', isUnknownTime: true });
                } else {
                  setMe({ ...me, isUnknownTime: false });
                }
              }}
            />

            <div>
              <label className={labelStyle}>성별</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setMe({ ...me, gender: 'F' })}
                  className={`py-3 rounded-xl text-[14px] transition-all ${me.gender === 'F' ? 'bg-[rgba(192,132,252,0.08)] border border-[rgba(192,132,252,0.5)] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba]'}`}
                  data-testid="my-gender-female">
                  여성
                </button>
                <button type="button" onClick={() => setMe({ ...me, gender: 'M' })}
                  className={`py-3 rounded-xl text-[14px] transition-all ${me.gender === 'M' ? 'bg-[rgba(192,132,252,0.08)] border border-[rgba(192,132,252,0.5)] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba]'}`}
                  data-testid="my-gender-male">
                  남성
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0f0d18] rounded-[1.5rem] p-5 border border-[rgba(180,140,255,0.11)] shadow-lg">
          <div className="text-[#c084fc] font-['Noto_Sans_KR'] text-[12px] font-light tracking-[2px] mb-5 flex items-center gap-2">
            <span className="text-[10px]">🌙</span>
            상대방 정보
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelStyle}>이름 (필수)</label>
              <input
                type="text"
                maxLength={5}
                placeholder="최대 5글자까지 입력 가능"
                value={pt.name || ''}
                onChange={e => setPt({ ...pt, name: e.target.value })}
                className={inputStyle}
                data-testid="pt-name-input"
              />
            </div>

            <div>
              <label className={labelStyle}>생년월일 (필수)</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="2000.01.01"
                value={ptDateInput}
                onChange={e => {
                  const formatted = formatDateInput(e.target.value);
                  setPtDateInput(formatted);
                  setPtDateError(validateDate(formatted));
                  const iso = dateDisplayToISO(formatted);
                  if (iso) setPt({ ...pt, date: iso });
                }}
                className={ptDateError ? inputErrorStyle : inputStyle}
                data-testid="pt-birth-input"
              />
              {ptDateError && <p className={errorMsgStyle} data-testid="pt-birth-error">⚠ {ptDateError}</p>}
            </div>

            <TimeField
              testIdPrefix="pt-time"
              value={ptTimeInput}
              unknown={ptTimeUnknown}
              error={ptTimeError}
              onChangeValue={val => {
                setPtTimeInput(val);
                setPtTimeError(validateTime(val));
                setPt({ ...pt, time: val, isUnknownTime: false });
              }}
              onChangeUnknown={val => {
                setPtTimeUnknown(val);
                setPtTimeError('');
                if (val) {
                  setPtTimeInput('');
                  setPt({ ...pt, time: '', isUnknownTime: true });
                } else {
                  setPt({ ...pt, isUnknownTime: false });
                }
              }}
            />

            <div>
              <label className={labelStyle}>성별</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setPt({ ...pt, gender: 'F' })}
                  className={`py-3 rounded-xl text-[14px] transition-all ${pt.gender === 'F' ? 'bg-[rgba(192,132,252,0.08)] border border-[rgba(192,132,252,0.5)] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba]'}`}
                  data-testid="pt-gender-female"
                >
                  여성
                </button>
                <button type="button" onClick={() => setPt({ ...pt, gender: 'M' })}
                  className={`py-3 rounded-xl text-[14px] transition-all ${pt.gender === 'M' ? 'bg-[rgba(192,132,252,0.08)] border border-[rgba(192,132,252,0.5)] text-[#c084fc]' : 'bg-[#141120] border border-[rgba(180,140,255,0.11)] text-[#9d8fba]'}`}
                  data-testid="pt-gender-male"
                >
                  남성
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#141120] rounded-[16px] border border-[rgba(180,140,255,0.11)] p-4">
          <div className="text-[#c084fc] font-['Noto_Sans_KR'] text-[12px] font-light tracking-[2px] mb-3">
            ✦ 추가정보(선택・더 정확한 분석)
          </div>
          <div className="space-y-3" ref={dropdownRef}>
            <div>
              <label className={labelStyle}>헤어진 지 얼마나 됐나요?</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setBreakupDurOpen(!breakupDurOpen)}
                  className="w-full bg-[#141120] border border-[rgba(180,140,255,0.11)] rounded-xl p-3.5 pr-10 text-left text-[16px] text-[#f0eaf8] focus:outline-none h-[48px] flex items-center"
                  data-testid="breakup-duration-select"
                >
                  <span className={breakupDur ? 'text-[#f0eaf8]' : 'text-[#4a4068]'}>
                    {breakupDur || '선택 안 함'}
                  </span>
                </button>
                <SelectIcon />
                {breakupDurOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-[#141120] border border-[rgba(180,140,255,0.2)] rounded-xl overflow-hidden shadow-xl" data-testid="breakup-duration-options">
                    {breakupDurOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setBreakupDur(opt.value); setBreakupDurOpen(false); }}
                        className={`w-full px-4 py-3 text-left text-[14px] transition-colors hover:bg-[rgba(180,140,255,0.08)] ${breakupDur === opt.value ? 'text-[#c084fc] font-bold bg-[rgba(180,140,255,0.06)]' : 'text-[#9d8fba]'}`}
                        data-testid={`breakup-duration-option-${opt.value}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={labelStyle}>이별한 이유</label>
              <input
                type="text"
                maxLength={20}
                placeholder="예) 자주 싸워서, 연락이 줄어서"
                value={breakupReason}
                onChange={e => setBreakupReason(e.target.value)}
                className={inputStyle}
                data-testid="breakup-reason-input"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          disabled={isLoading || !isFormValid}
          className="w-full h-[54px] bg-[linear-gradient(99.16deg,#C084FC_0%,#F472B6_100%)] text-white font-bold text-[16px] rounded-[14px] shadow-[0px_8px_32px_0px_rgba(192,132,252,0.3)] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="analyze-button"
        >
          {isLoading ? '✦ 사주 분석 중...' : '✦  지금 바로 분석하기'}
        </button>
      </div>
    </div>
  );
}