import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { calculateSaju } from '@fullstackfamily/manseryeok';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';

// Types & Utils
import type { PersonInput, SajuResult, RelationResult } from './types/saju';
import { getElements, getFortuneFlow, getRelation, getScoreComment, buildServerPayload } from './utils/sajuEngine';

// Components
import SajuInputForm from './components/SajuInputForm';
import SajuResultView from './components/SajuResultView';
import LoadingScreen from './components/LoadingScreen';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import MyPageView from './components/MyPageView';
import PaymentView from './components/PaymentView';
import AuthCallback from './components/AuthCallback';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const onStart = () => {
    navigate('/input');
  };

  const [isLoading, setIsLoading] = useState(false);

  const [isAuthLoading, setIsAuthLoading] = useState(true); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("사용자");

  useEffect(() => {
    const extractNameAndSet = (session: Session | null) => {
      if (session) {
        const name = session.user.user_metadata?.name 
                  || session.user.email?.split('@')[0] 
                  || "사용자";
        setUserName(name);
      } else {
        setUserName("사용자");
      }
    };

    // 1. 처음 켜졌을 때
    supabase.auth.getSession().then(({ data: { session } }) => {
      const loggedIn = !!session;
      setIsLoggedIn(loggedIn);
      extractNameAndSet(session);
      setIsAuthLoading(false); 
    });

    // 2. 로그인 상태가 바뀔 때
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const loggedIn = !!session;
      setIsLoggedIn(loggedIn);
      extractNameAndSet(session);
      setIsAuthLoading(false); 
    });

    return () => subscription.unsubscribe();
  }, []);

  // 입력값과 분석 결과를 초기화할 때, sessionStorage에 저장된 게 있으면 가져오도록 설정
  const [me, setMe] = useState<PersonInput>(() => {
    const saved = sessionStorage.getItem('saju_me');
    return saved ? JSON.parse(saved) : { name: '', gender: 'F', date: '2000-01-01', time: '23:30', isUnknownTime: false };
  });
  
  const [pt, setPt] = useState<PersonInput>(() => {
    const saved = sessionStorage.getItem('saju_pt');
    return saved ? JSON.parse(saved) : { name: '', gender: 'M', date: '2000-01-01', time: '23:30', isUnknownTime: false };
  });

  const [analysis, setAnalysis] = useState<{
    meSaju: SajuResult;
    ptSaju: SajuResult;
    score: number;
    relation: RelationResult;
    scoreComment: { title: string; desc: string };
  } | null>(() => {
    const saved = sessionStorage.getItem('saju_analysis');
    return saved ? JSON.parse(saved) : null;
  });

  // 결과 초기화 함수 (처음으로 돌아갈 때 스토리지도 비워줌)
  const handleReset = () => {
    sessionStorage.removeItem('saju_me');
    sessionStorage.removeItem('saju_pt');
    sessionStorage.removeItem('saju_analysis');
    setAnalysis(null);
    navigate('/');
  };

  // 계산 로직
  const handleCalculate = async () => {
    try {
      setIsLoading(true);
      navigate('/loading');

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

      const newAnalysis = {
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
      };

      // 상태 업데이트
      setAnalysis(newAnalysis);

      // 새로고침에 대비해 세션 스토리지에 계산 결과 저장
      sessionStorage.setItem('saju_me', JSON.stringify(me));
      sessionStorage.setItem('saju_pt', JSON.stringify(pt));
      sessionStorage.setItem('saju_analysis', JSON.stringify(newAnalysis));

      const serverPayload = {
        me: buildServerPayload(meRaw, meElements, meFortune, me.isUnknownTime),
        partner: buildServerPayload(ptRaw, ptElements, ptFortune, pt.isUnknownTime),
      };

      console.log("🚀 Server Payload:", serverPayload);

      await new Promise(resolve => setTimeout(resolve, 3200));
      navigate('/result');

    } catch (error) {
      console.error("에러:", error);
      alert('입력값을 확인해주세요.');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative pb-[70px]">

      <TopBar
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLoginClick={() => navigate('/login', { state: { from: location.pathname } })}
        onLogoutClick={async () => {
          await supabase.auth.signOut();
        }}
      />

      <Routes>

        <Route path="/" element={<HomeScreen onStart={onStart} />} />

        <Route path="/input" element={
          <SajuInputForm
            me={me} setMe={setMe}
            pt={pt} setPt={setPt}
            onCalculate={handleCalculate}
            isLoading={isLoading}
          />
        } />

        <Route path="/loading" element={<LoadingScreen />} />

        <Route path="/result" element={
          analysis ? (
            <SajuResultView
              me={me} pt={pt}
              analysis={analysis}
              onReset={handleReset}
              isLoggedIn={isLoggedIn}
              // ⭐️ 수정: 잠금 해제(결제)를 위해 로그인하는 것이므로 목적지를 /payment로 변경!
              onRequireLogin={() => navigate('/login', { state: { from: '/payment' } })}
            />
          ) : <Navigate to="/" />
        } />

        <Route path="/payment" element={
          isAuthLoading ? (
            <LoadingScreen /> 
          ) : (
            isLoggedIn 
              ? <PaymentView /> 
              : <Navigate to="/login" state={{ from: '/payment' }} replace />
          )
        } />
        
        <Route path="/mypage" element={<MyPageView />} />
        <Route path="/login" element={<LoginScreen />} />
        
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

      <BottomNav />
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