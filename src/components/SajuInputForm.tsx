import React from 'react';
import type { PersonInput } from '../types/saju';

interface Props {
  me: PersonInput;
  setMe: React.Dispatch<React.SetStateAction<PersonInput>>;
  pt: PersonInput;
  setPt: React.Dispatch<React.SetStateAction<PersonInput>>;
  onCalculate: () => void;
  isLoading: boolean;
}

export default function SajuInputForm({ me, setMe, pt, setPt, onCalculate, isLoading }: Props) {
  return (
    <div className="p-6 min-h-full" style={{ backgroundColor: '#07070C' }}>
      <header className="text-center mb-12 pt-4">
        <h1 className="text-2xl font-black tracking-tighter text-white"> 재회 사주 분석 </h1>
        <p className="text-slate-500 text-[10px] mt-2 font-bold tracking-widest uppercase opacity-60">Deep Relationship Analysis</p>
      </header>

      {/* 나의 정보 섹션 */}
      <div className="mb-10 space-y-5">
        <div className="flex items-center gap-3 px-1">
          <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">My Info</span>
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>
        
        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setMe({...me, gender: 'F'})} 
            className={`flex-1 text-xs py-3.5 rounded-xl font-bold transition-all ${me.gender === 'F' ? 'bg-white/10 text-white border border-white/20 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            여성
          </button>
          <button 
            onClick={() => setMe({...me, gender: 'M'})} 
            className={`flex-1 text-xs py-3.5 rounded-xl font-bold transition-all ${me.gender === 'M' ? 'bg-white/10 text-white border border-white/20 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            남성
          </button>
        </div>

        <div className="space-y-3">
          <input 
            type="date" 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-slate-200 focus:outline-none focus:border-white/30 transition-colors appearance-none" 
            style={{ colorScheme: 'dark' }}
            value={me.date} 
            onChange={e => setMe({...me, date: e.target.value})} 
          />
          <div className="flex gap-3 items-center">
            <input 
              type="time" 
              disabled={me.isUnknownTime} 
              className={`flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-slate-200 focus:outline-none focus:border-white/30 transition-colors appearance-none ${me.isUnknownTime ? 'opacity-20' : ''}`} 
              style={{ colorScheme: 'dark' }}
              value={me.time} 
              onChange={e => setMe({...me, time: e.target.value})} 
            />
            <label className="text-[11px] text-slate-500 flex items-center gap-2 cursor-pointer select-none font-bold hover:text-slate-300 transition-colors">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-white/20 bg-transparent checked:bg-white/20 accent-white/40"
                checked={me.isUnknownTime} 
                onChange={e => setMe({...me, isUnknownTime: e.target.checked})} 
              /> 
              시간모름
            </label>
          </div>
        </div>
      </div>

      {/* 상대방 정보 섹션 */}
      <div className="mb-12 space-y-5">
        <div className="flex items-center gap-3 px-1">
          <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Partner Info</span>
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>

        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setPt({...pt, gender: 'F'})} 
            className={`flex-1 text-xs py-3.5 rounded-xl font-bold transition-all ${pt.gender === 'F' ? 'bg-white/10 text-white border border-white/20 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            여성
          </button>
          <button 
            onClick={() => setPt({...pt, gender: 'M'})} 
            className={`flex-1 text-xs py-3.5 rounded-xl font-bold transition-all ${pt.gender === 'M' ? 'bg-white/10 text-white border border-white/20 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            남성
          </button>
        </div>

        <div className="space-y-3">
          <input 
            type="date" 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-slate-200 focus:outline-none focus:border-white/30 transition-colors" 
            style={{ colorScheme: 'dark' }}
            value={pt.date} 
            onChange={e => setPt({...pt, date: e.target.value})} 
          />
          <div className="flex gap-3 items-center">
            <input 
              type="time" 
              disabled={pt.isUnknownTime} 
              className={`flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-slate-200 focus:outline-none focus:border-white/30 transition-colors ${pt.isUnknownTime ? 'opacity-20' : ''}`} 
              style={{ colorScheme: 'dark' }}
              value={pt.time} 
              onChange={e => setPt({...pt, time: e.target.value})} 
            />
            <label className="text-[11px] text-slate-500 flex items-center gap-2 cursor-pointer select-none font-bold hover:text-slate-300 transition-colors">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-white/20 bg-transparent accent-white/40"
                checked={pt.isUnknownTime} 
                onChange={e => setPt({...pt, isUnknownTime: e.target.checked})} 
              /> 
              시간모름
            </label>
          </div>
        </div>
      </div>

      <button 
        onClick={onCalculate} 
        disabled={isLoading} 
        className="w-full py-5 bg-white text-slate-950 font-black text-sm rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-slate-200 active:scale-[0.97] transition-all disabled:opacity-20"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5 text-slate-950" viewBox="0 0 24 24">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            ANALYZING...
          </span>
        ) : 'ANALYSIS START'}
      </button>
    </div>
  );
}