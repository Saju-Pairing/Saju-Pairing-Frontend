import { useState } from 'react';
import { calculateSaju } from '@fullstackfamily/manseryeok';
import type { PersonInput, SajuResult, RelationResult } from './types/saju';
import { getElements, getFortuneFlow, getRelation, getScoreComment, buildServerPayload } from './utils/sajuEngine';
import SajuInputForm from './components/SajuInputForm';
import SajuResultView from './components/SajuResultView';

export default function App() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ 초기값 수정: 이름 빈칸, 2000-01-01, 23:30(자시)
  const [me, setMe] = useState<PersonInput>({ name: '', gender: 'F', date: '2000-01-01', time: '23:30', isUnknownTime: false });
  const [pt, setPt] = useState<PersonInput>({ name: '', gender: 'M', date: '2000-01-01', time: '23:30', isUnknownTime: false });
  
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

      const serverPayload = {
        me: buildServerPayload(meRaw, meElements, meFortune, me.isUnknownTime),
        partner: buildServerPayload(ptRaw, ptElements, ptFortune, pt.isUnknownTime)
      };

      console.log("🚀 [서버 전송용 JSON 완벽본]:", JSON.stringify(serverPayload, null, 2));

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
    // ✅ 배경색을 #07060c로 맞추고, 불필요한 하얀색 박스(bg-white, border)를 제거했습니다.
    <div className="min-h-screen bg-[#07060c] flex justify-center font-sans text-[#f0eaf8]">
      <div className="w-full max-w-md relative">
        
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