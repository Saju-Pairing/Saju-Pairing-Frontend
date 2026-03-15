import { useState } from 'react';
import { calculateSaju } from '@fullstackfamily/manseryeok';
import type { PersonInput, SajuResult, RelationResult } from './types/saju';import { getElements, getFortuneFlow, getRelation, getScoreComment, buildServerPayload } from './utils/sajuEngine';
import SajuInputForm from './components/SajuInputForm';
import SajuResultView from './components/SajuResultView';

export default function App() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [me, setMe] = useState<PersonInput>({ name: '나', gender: 'F', date: '1995-08-12', time: '14:30', isUnknownTime: false });
  const [pt, setPt] = useState<PersonInput>({ name: '그 사람', gender: 'M', date: '1993-04-05', time: '09:00', isUnknownTime: false });
  const [analysis, setAnalysis] = useState<{ 
    meSaju: SajuResult, 
    ptSaju: SajuResult, 
    score: number, 
    relation: RelationResult,
    scoreComment: { title: string, desc: string }
  } | null>(null);

  const handleCalculate = async () => {
    try {
      setIsLoading(true);
      
      const [y1, m1, d1] = me.date.split('-').map(Number); const [hh1, mm1] = me.time.split(':').map(Number);
      const meRaw = me.isUnknownTime ? calculateSaju(y1, m1, d1) : calculateSaju(y1, m1, d1, hh1, mm1);
      const meElements = getElements(meRaw, me.isUnknownTime);
      const meFortune = getFortuneFlow(y1, d1, me.gender, meRaw.yearPillarHanja || '', meRaw.monthPillarHanja || '');

      const [y2, m2, d2] = pt.date.split('-').map(Number); const [hh2, mm2] = pt.time.split(':').map(Number);
      const ptRaw = pt.isUnknownTime ? calculateSaju(y2, m2, d2) : calculateSaju(y2, m2, d2, hh2, mm2);
      const ptElements = getElements(ptRaw, pt.isUnknownTime);
      const ptFortune = getFortuneFlow(y2, d2, pt.gender, ptRaw.yearPillarHanja || '', ptRaw.monthPillarHanja || '');

      const relationTexts = getRelation(meRaw.dayPillarHanja || '甲子', ptRaw.dayPillarHanja || '甲子');
      const scoreComment = getScoreComment(relationTexts.finalScore, relationTexts, meElements.stats, ptElements.stats);

      // ==========================================
      // 🚀 서버 전송용 JSON 객체 생성
      // ==========================================
      const serverPayload = {
        me: buildServerPayload(meRaw, meElements, meFortune, me.isUnknownTime),
        partner: buildServerPayload(ptRaw, ptElements, ptFortune, pt.isUnknownTime)
      };

      console.log("🚀 [서버 전송용 JSON 완벽본]:", JSON.stringify(serverPayload, null, 2));

      // 💡 [여기에 서버 API 호출 로직을 넣으세요]
      /*
      await fetch('https://api.yourdomain.com/saju', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serverPayload),
      });
      */
      // ==========================================

      setAnalysis({
        meSaju: { year: meRaw.yearPillarHanja || '??', month: meRaw.monthPillarHanja || '??', day: meRaw.dayPillarHanja || '??', hour: me.isUnknownTime ? '??' : (meRaw.hourPillarHanja || '??'), elements: meElements.stats, totalChars: meElements.total, fortune: meFortune },
        ptSaju: { year: ptRaw.yearPillarHanja || '??', month: ptRaw.monthPillarHanja || '??', day: ptRaw.dayPillarHanja || '??', hour: pt.isUnknownTime ? '??' : (ptRaw.hourPillarHanja || '??'), elements: ptElements.stats, totalChars: ptElements.total, fortune: ptFortune },
        score: relationTexts.finalScore, 
        relation: relationTexts,
        scoreComment: scoreComment
      });

      setStep(1);
    } 
    catch (error) { 
      console.error("계산 중 에러 발생:", error);
      alert('입력하신 날짜를 다시 확인해주세요.'); 
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center font-sans text-slate-800 pb-10 pt-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden relative border border-slate-200">
        
        {step === 0 && (
          <SajuInputForm 
            me={me} setMe={setMe} 
            pt={pt} setPt={setPt} 
            onCalculate={handleCalculate} 
            isLoading={isLoading} 
          />
        )}
        
        {step === 1 && analysis && (
          <SajuResultView 
            me={me} pt={pt} 
            analysis={analysis} 
            onReset={() => setStep(0)} 
          />
        )}

      </div>
    </div>
  );
}