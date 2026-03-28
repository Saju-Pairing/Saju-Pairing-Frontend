import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router'; 
import { calculateSaju } from '@fullstackfamily/manseryeok';

// Types & Utils
import type { PersonInput, SajuResult, RelationResult } from './types/saju';
import { getElements, getFortuneFlow, getRelation, getScoreComment, buildServerPayload } from './utils/sajuEngine';

// Components
import SajuInputForm from './components/SajuInputForm';
import SajuResultView from './components/SajuResultView';
import LoadingScreen from './components/LoadingScreen';
import PaymentView from './components/PaymentView';

function AppContent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 데이터 상태 관리
  const [me, setMe] = useState<PersonInput>({ 
    name: '', gender: 'F', date: '2000-01-01', time: '23:30', isUnknownTime: false 
  });
  const [pt, setPt] = useState<PersonInput>({ 
    name: '', gender: 'M', date: '2000-01-01', time: '23:30', isUnknownTime: false 
  });
  
  const [analysis, setAnalysis] = useState<{ 
    meSaju: SajuResult, 
    ptSaju: SajuResult,
    score: number, 
    relation: RelationResult,
    scoreComment: { title: string, desc: string }
  } | null>(null);

  // 계산 및 페이지 이동 로직
  const handleCalculate = async () => {
    try {
      setIsLoading(true);
      // 1. 로딩 페이지로 이동 (기존 setStep(0.5) 대체)
      navigate('/loading');

      // 사주 계산 로직 시작
      const [y1, m1, d1] = me.date.split('-').map(Number); 
      const [hh1, mm1] = me.time.split(':').map(Number);
      const meRaw = me.isUnknownTime ? calculateSaju(y1, m1, d1) : calculateSaju(y1, m1, d1, hh1, mm1);
      const meElements = getElements(meRaw, me.isUnknownTime);
      const meFortune = getFortuneFlow(y1, d1, me.gender, meRaw.yearPillarHanja || '', meRaw.monthPillarHanja || '');

      const [y2, m2, d2] = pt.date.split('-').map(Number); 
      const [hh2, mm2] = pt.time.split(':').map(Number);
      const ptRaw = pt.isUnknownTime ? calculateSaju(y2, m2, d2) : calculateSaju(y2, m2, d2, hh2, mm2);
      const ptElements = getElements(ptRaw, pt.isUnknownTime);
      const ptFortune = getFortuneFlow(y2, d2, pt.gender, ptRaw.yearPillarHanja || '', ptRaw.monthPillarHanja || '');

      const relationTexts = getRelation(meRaw.dayPillarHanja || '甲子', ptRaw.dayPillarHanja || '甲子');
      const scoreComment = getScoreComment(relationTexts.finalScore, relationTexts, meElements.stats, ptElements.stats);

      // 분석 결과 저장
      setAnalysis({
        meSaju: { 
          year: meRaw.yearPillarHanja || '??', 
          month: meRaw.monthPillarHanja || '??', 
          day: meRaw.dayPillarHanja || '??', 
          hour: me.isUnknownTime ? '??' : (meRaw.hourPillarHanja || '??'), 
          elements: meElements.stats, 
          totalChars: meElements.total, 
          fortune: meFortune 
        },
        ptSaju: { 
          year: ptRaw.yearPillarHanja || '??', 
          month: ptRaw.monthPillarHanja || '??', 
          day: ptRaw.dayPillarHanja || '??', 
          hour: pt.isUnknownTime ? '??' : (ptRaw.hourPillarHanja || '??'), 
          elements: ptElements.stats, 
          totalChars: ptElements.total, 
          fortune: ptFortune 
        },
        score: relationTexts.finalScore, 
        relation: relationTexts,
        scoreComment: scoreComment
      });

      // 서버 전송 로그 (선택 사항)
      const serverPayload = {
        me: buildServerPayload(meRaw, meElements, meFortune, me.isUnknownTime),
        partner: buildServerPayload(ptRaw, ptElements, ptFortune, pt.isUnknownTime)
      };
      console.log("🚀 Server Payload:", serverPayload);

      // 2. 인위적 딜레이 후 결과 페이지로 이동 (기존 setStep(1) 대체)
      await new Promise(resolve => setTimeout(resolve, 3200));
      navigate('/result');

    } catch (error) { 
      console.error("계산 중 에러 발생:", error);
      alert('입력하신 날짜를 다시 확인해주세요.'); 
      navigate('/'); // 에러 시 홈으로 복귀
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="w-full max-w-md relative">
      <Routes>
        {/* 1. 입력 홈 */}
        <Route path="/" element={
          <SajuInputForm 
            me={me} setMe={setMe} 
            pt={pt} setPt={setPt} 
            onCalculate={handleCalculate} 
            isLoading={isLoading} 
          />
        } />
        
        {/* 2. 로딩 화면 */}
        <Route path="/loading" element={<LoadingScreen />} />
        
        {/* 3. 결과 화면 */}
        <Route path="/result" element={
          analysis ? (
            <SajuResultView 
              me={me} pt={pt} 
              analysis={analysis} 
              onReset={() => navigate('/')} 
            />
          ) : <Navigate to="/" />
        } />
        
        {/* 4. 결제 화면 */}
        <Route path="/payment" element={<PaymentView />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#07060c] flex justify-center font-sans text-[#f0eaf8]">
        <AppContent />
      </div>
    </BrowserRouter>
  );
}