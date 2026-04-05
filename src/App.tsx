import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router'; 
import { calculateSaju } from '@fullstackfamily/manseryeok';

// Types & Utils
import type { PersonInput, SajuResult, RelationResult } from './types/saju';
import { getElements, getFortuneFlow, getRelation, getScoreComment, buildServerPayload } from './utils/sajuEngine';
<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


// Components
import SajuInputForm from './components/SajuInputForm';
import SajuResultView from './components/SajuResultView';
import LoadingScreen from './components/LoadingScreen';
import LoginScreen from './components/LoginScreen'; 
import HomeScreen from './components/HomeScreen';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import MyPageView from './components/MyPageView';
import LoadingScreen from './components/LoadingScreen';
import PaymentView from './components/PaymentView';

export default function App() {
  // --- 상태 관리 ---
  // step: 0(홈), 1(입력), 1.5(로딩), 2(결과), 99(로그인)
  const [step, setStep] = useState(0); 
function AppContent() {
  const navigate = useNavigate();

// Components
import SajuInputForm from './components/SajuInputForm';
import SajuResultView from './components/SajuResultView';
import LoadingScreen from './components/LoadingScreen';
import PaymentView from './components/PaymentView';

function AppContent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // 로그인 유저 정보 (추후 Supabase 연동 시 동적 업데이트 예정)
  const [isLoggedIn] = useState(false); 
  const [userName] = useState("김지은"); 

<<<<<<< HEAD
  // 사주 입력 폼 데이터
  const [me, setMe] = useState<PersonInput>({ name: '', gender: 'F', date: '2000-01-01', time: '23:30', isUnknownTime: false });
  const [pt, setPt] = useState<PersonInput>({ name: '', gender: 'M', date: '2000-01-01', time: '23:30', isUnknownTime: false });
  // 데이터 상태 관리
  const [me, setMe] = useState<PersonInput>({ 
    name: '', gender: 'F', date: '2000-01-01', time: '23:30', isUnknownTime: false 
  });
  const [pt, setPt] = useState<PersonInput>({ 
    name: '', gender: 'M', date: '2000-01-01', time: '23:30', isUnknownTime: false 
  });
  
  // 사주 분석 결과 데이터
  const [analysis, setAnalysis] = useState<{ 
<<<<<<< HEAD
    meSaju: SajuResult, ptSaju: SajuResult, score: number, relation: RelationResult, scoreComment: { title: string, desc: string }
    meSaju: SajuResult, 
    ptSaju: SajuResult,
    score: number, 
    relation: RelationResult,
    scoreComment: { title: string, desc: string }
  } | null>(null);

  // --- 사주 계산 로직 ---
  // 계산 및 페이지 이동 로직
  const handleCalculate = async () => {
    try {
      setIsLoading(true);
      setStep(1.5); 
      // 1. 로딩 페이지로 이동 (기존 setStep(0.5) 대체)
      navigate('/loading');

      // 본인 사주 계산
      const [y1, m1, d1] = me.date.split('-').map(Number); const [hh1, mm1] = me.time.split(':').map(Number);
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

<<<<<<< HEAD
      // 상대방 사주 계산
      const [y2, m2, d2] = pt.date.split('-').map(Number); const [hh2, mm2] = pt.time.split(':').map(Number);
      const [y2, m2, d2] = pt.date.split('-').map(Number); 
      const [hh2, mm2] = pt.time.split(':').map(Number);
      const ptRaw = pt.isUnknownTime ? calculateSaju(y2, m2, d2) : calculateSaju(y2, m2, d2, hh2, mm2);
      const ptElements = getElements(ptRaw, pt.isUnknownTime);
      const ptFortune = getFortuneFlow(y2, d2, pt.gender, ptRaw.yearPillarHanja || '', ptRaw.monthPillarHanja || '');

      // 관계 분석 (궁합 점수 및 코멘트)
      const relationTexts = getRelation(meRaw.dayPillarHanja || '甲子', ptRaw.dayPillarHanja || '甲子');
      const scoreComment = getScoreComment(relationTexts.finalScore, relationTexts, meElements.stats, ptElements.stats);

      setAnalysis({
        meSaju: { year: meRaw.yearPillarHanja || '??', month: meRaw.monthPillarHanja || '??', day: meRaw.dayPillarHanja || '??', hour: me.isUnknownTime ? '??' : (meRaw.hourPillarHanja || '??'), elements: meElements.stats, totalChars: meElements.total, fortune: meFortune },
        ptSaju: { year: ptRaw.yearPillarHanja || '??', month: ptRaw.monthPillarHanja || '??', day: ptRaw.dayPillarHanja || '??', hour: pt.isUnknownTime ? '??' : (ptRaw.hourPillarHanja || '??'), elements: ptElements.stats, totalChars: ptElements.total, fortune: ptFortune },
        score: relationTexts.finalScore, relation: relationTexts, scoreComment: scoreComment
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

      // 자연스러운 로딩 연출을 위한 딜레이
      // 서버 전송 로그 (선택 사항)
      const serverPayload = {
        me: buildServerPayload(meRaw, meElements, meFortune, me.isUnknownTime),
        partner: buildServerPayload(ptRaw, ptElements, ptFortune, pt.isUnknownTime)
      };
      console.log("🚀 Server Payload:", serverPayload);

      // 2. 인위적 딜레이 후 결과 페이지로 이동 (기존 setStep(1) 대체)
      await new Promise(resolve => setTimeout(resolve, 3200));
      setStep(2); 
      navigate('/result');

    } catch (error) { 
      console.error("계산 중 에러 발생:", error);
      alert('입력하신 날짜를 다시 확인해주세요.'); 
      setStep(1); 
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

<<<<<<< HEAD
  const SajuService = () => (
    <div className={`w-full max-w-md relative ${step === 1 || step === 2 ? 'pt-[70px]' : ''}`}>
      {step === 0 && <HomeScreen onStart={() => setStep(1)} />}
      {step === 1 && <SajuInputForm me={me} setMe={setMe} pt={pt} setPt={setPt} onCalculate={handleCalculate} isLoading={isLoading} />}
      {step === 1.5 && <LoadingScreen />}
      {step === 2 && analysis && (
        <SajuResultView 
          me={me} pt={pt} analysis={analysis} 
          onReset={() => { window.scrollTo(0,0); setStep(0); }} 
          isLoggedIn={isLoggedIn}
          onRequireLogin={() => { window.scrollTo(0, 0); setStep(99); }}
        />
      )}
      {step === 99 && <LoginScreen />}
    </div>
  );

  // --- UI 렌더링 ---
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#07060c] flex justify-center font-sans text-[#f0eaf8]">
        
        <TopBar 
          isLoggedIn={isLoggedIn} 
          userName={userName} 
          onLoginClick={() => { window.scrollTo(0, 0); setStep(99); }} 
        />
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

        {/* 라우팅 설정 영역 */}
        <Routes>
          {/* 기본 경로(/)에서는 메인 화면 노출 */}
          <Route path="/" element={<SajuService />} />
          
          {/* /mypage 경로에서는 마이페이지 노출 */}
          <Route path="/mypage" element={<MyPageView />} />
          
          {/* 잘못된 경로는 홈으로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {/* 하단 탭바: 모든 페이지에서 노출되도록 Routes 밖에 배치 */}
        <BottomNav />

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