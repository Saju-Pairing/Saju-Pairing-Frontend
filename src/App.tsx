import { useState } from 'react';
import { calculateSaju } from '@fullstackfamily/manseryeok';
import type { PersonInput, SajuResult, RelationResult } from './types/saju';
import { getElements, getFortuneFlow, getRelation, getScoreComment, buildServerPayload } from './utils/sajuEngine';
import SajuInputForm from './components/SajuInputForm';
import SajuResultView from './components/SajuResultView';
import LoadingScreen from './components/LoadingScreen';
import LoginScreen from './components/LoginScreen'; // 💡 로그인 스크린 임포트 추가!

export default function App() {
  // 💡 step 관리: 0(입력), 0.5(로딩), 1(결과), 99(로그인 화면)
  const [step, setStep] = useState(0); 
  const [isLoading, setIsLoading] = useState(false);
  
  // 💡 무조건 로그인 안 된 상태로 고정 (테스트용)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      setStep(0.5);

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

      setAnalysis({
        meSaju: { year: meRaw.yearPillarHanja || '??', month: meRaw.monthPillarHanja || '??', day: meRaw.dayPillarHanja || '??', hour: me.isUnknownTime ? '??' : (meRaw.hourPillarHanja || '??'), elements: meElements.stats, totalChars: meElements.total, fortune: meFortune },
        ptSaju: { year: ptRaw.yearPillarHanja || '??', month: ptRaw.monthPillarHanja || '??', day: ptRaw.dayPillarHanja || '??', hour: pt.isUnknownTime ? '??' : (ptRaw.hourPillarHanja || '??'), elements: ptElements.stats, totalChars: ptElements.total, fortune: ptFortune },
        score: relationTexts.finalScore, 
        relation: relationTexts,
        scoreComment: scoreComment
      });

      await new Promise(resolve => setTimeout(resolve, 3200));

      setStep(1);
    } 
    catch (error) { 
      console.error("계산 중 에러 발생:", error);
      alert('입력하신 날짜를 다시 확인해주세요.'); 
      setStep(0); 
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#07060c] flex justify-center font-sans text-[#f0eaf8]">
      <div className="w-full max-w-md relative">
        
        {step === 0 && (
          <SajuInputForm me={me} setMe={setMe} pt={pt} setPt={setPt} onCalculate={handleCalculate} isLoading={isLoading} />
        )}
        
        {step === 0.5 && <LoadingScreen />}
        
        {step === 1 && analysis && (
          <SajuResultView 
            me={me} pt={pt} 
            analysis={analysis} 
            onReset={() => setStep(0)}
            
            // 💡 로그인 상태와, 로그인 화면으로 이동하는 함수를 전달!
            isLoggedIn={isLoggedIn} // 현재 false로 고정됨
            onRequireLogin={() => {
              window.scrollTo(0, 0); // 화면 맨 위로 올리기
              setStep(99); // 로그인 화면 단계로 이동
            }}
          />
        )}

        {/* 💡 99단계: 로그인 화면 렌더링 */}
        {step === 99 && (
          <LoginScreen />
        )}

      </div>
    </div>
  );
}