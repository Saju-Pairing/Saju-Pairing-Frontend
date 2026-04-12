import React, { useState } from 'react';
import Picker from 'react-mobile-picker';
import { years, months, days } from '../constants/sajuInputOptions';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: string) => void;
  initialDate: string; // "2000-01-01" 형식
}

export default function SajuWheelPickerModal({ isOpen, onClose, onSave, initialDate }: ModalProps) {
  // 1. useState 초기값에서 바로 initialDate를 파싱합니다 (useEffect 필요 없음)
  const [dateValue, setDateValue] = useState(() => {
    const [y = '2000', m = '01', d = '01'] = (initialDate || '').split('-');
    return { year: y, month: m, day: d };
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#0f0d18] rounded-t-[2rem] p-6 border-t border-[rgba(180,140,255,0.2)] animate-in slide-in-from-bottom duration-300">
        
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6 px-2">
          <button onClick={onClose} className="text-[#9d8fba] font-medium text-[14px]">취소</button>
          <h3 className="text-[#f0eaf8] font-bold text-[15px]">생년월일 선택</h3>
          <button 
            onClick={() => onSave(`${dateValue.year}-${dateValue.month}-${dateValue.day}`)}
            className="text-[#c084fc] font-bold text-[14px]"
          >완료</button>
        </div>

        {/* 날짜 피커 영역 */}
        <div className="h-[200px] relative">
          <div className="absolute top-1/2 left-0 w-full h-10 -translate-y-1/2 border-y border-[rgba(180,140,255,0.15)] bg-[rgba(180,140,255,0.04)] pointer-events-none z-10" />

          <Picker value={dateValue} onChange={setDateValue} height={200} itemHeight={40}>
            <Picker.Column name="year">
              {years.map((y: string) => (
                <Picker.Item key={y} value={y}>
                  {({ selected }: { selected: boolean }) => (
                    <span className={`transition-all ${selected ? 'text-[#c084fc] font-bold text-[15px]' : 'text-[#4a4068] text-[13px]'}`}>
                      {y}년
                    </span>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
            <Picker.Column name="month">
              {months.map((m: string) => (
                <Picker.Item key={m} value={m}>
                  {({ selected }: { selected: boolean }) => (
                    <span className={`transition-all ${selected ? 'text-[#c084fc] font-bold text-[15px]' : 'text-[#4a4068] text-[13px]'}`}>
                      {m}월
                    </span>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
            <Picker.Column name="day">
              {days.map((d: string) => (
                <Picker.Item key={d} value={d}>
                  {({ selected }: { selected: boolean }) => (
                    <span className={`transition-all ${selected ? 'text-[#c084fc] font-bold text-[15px]' : 'text-[#4a4068] text-[13px]'}`}>
                      {d}일
                    </span>
                  )}
                </Picker.Item>
              ))}
            </Picker.Column>
          </Picker>
        </div>
      </div>
    </div>
  );
}