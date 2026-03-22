import { useState } from 'react';
import { calculateSaju } from '@fullstackfamily/manseryeok';
import type { PersonInput, SajuResult, RelationResult } from './types/saju';
import { getElements, getFortuneFlow, getRelation, getScoreComment, buildServerPayload } from './utils/sajuEngine';
import SajuInputForm from './components/SajuInputForm';
import SajuResultView from './components/SajuResultView';
import LoadingScreen from './components/LoadingScreen'; // 🚀 로딩 컴포넌트 추가

export default function App() {
  const [step, setStep] = useState(0); // 0: 입력, 0.5: 로딩, 1: 결과
  const [isLoading, setIsLoading] = useState(false);

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
      setStep(0.5); // 🚀 로딩 화면으로 전환 (0.5단계)

      // 1. 실제 사주 계산 로직 (즉시 실행됨)
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

      // 2. ⏳ 인위적인 딜레이 추가 (약 3초 동안 로딩 화면을 보여줌)
      // 로딩 화면의 4단계 텍스트가 모두 뜰 수 있는 충분한 시간을 줍니다.
      await new Promise(resolve => setTimeout(resolve, 3200));

      setStep(1); // 🚀 결과 화면으로 전환
    } 
    catch (error) { 
      console.error("계산 중 에러 발생:", error);
      alert('입력하신 날짜를 다시 확인해주세요.'); 
      setStep(0); // 에러 발생 시 입력 폼으로 복귀
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#07060c] flex justify-center font-sans text-[#f0eaf8]">
      <div className="w-full max-w-md relative">
        
        {/* 입력 단계 */}
        {step === 0 && (
          <SajuInputForm 
            me={me} setMe={setMe} 
            pt={pt} setPt={setPt} 
            onCalculate={handleCalculate} 
            isLoading={isLoading} 
          />
        )}
        
        {/* 🚀 로딩 단계 */}
        {step === 0.5 && <LoadingScreen />}
        
        {/* 결과 단계 */}
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