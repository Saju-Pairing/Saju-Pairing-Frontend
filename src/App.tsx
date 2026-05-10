import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { calculateSaju } from '@fullstackfamily/manseryeok';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';

// Types & Utils
import type { PersonInput, SajuResult, RelationResult } from './types/saju';
import { getElements, getFortuneFlow, getRelation, getScoreComment, buildServerPayload } from './utils/sajuEngine';
import type { PaidResult } from './types/saju';

import SajuInputForm from './components/SajuInputView';
import SajuResultView from './components/SajuResultView';
import LoadingScreen from './components/LoadingView';
import LoginScreen from './components/LoginView';
import HomeScreen from './components/HomeView';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import MyPageView from './components/MyPageView';
import PaymentHistoryView from './components/PaymentHistoryView';
import SajuStorageView from './components/SajuStorageView';
import PaymentView from './components/PaymentView';
import AuthCallback from './components/AuthCallback';
import TermsOfServiceView from './components/TermsOfServiceView';
import ScrollToTop from "./components/ScrollToTop";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const onStart = () => {
    navigate('/input');
  };

  // 상단바를 숨길 경로 설정
  const hideTopBarPaths = ['/payment-history', '/saju-storage', '/terms-of-service'];
  const shouldHideTopBar = hideTopBarPaths.includes(location.pathname);

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

  useEffect(() => {
    if (location.state?.paidResult) {
      setPaidResult(location.state.paidResult);
    }
  }, [location.state]);

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

  // paidResult 상태 추가
  const [paidResult, setPaidResult] = useState<PaidResult | null>(() => {
    const saved = sessionStorage.getItem('saju_paid_result');
    return saved ? JSON.parse(saved) : null;
  });

  // 결과 초기화 함수 (처음으로 돌아갈 때 스토리지도 비워줌)
  const handleReset = () => {
    sessionStorage.removeItem('saju_me');
    sessionStorage.removeItem('saju_pt');
    sessionStorage.removeItem('saju_analysis');
    sessionStorage.removeItem('saju_paid_result');
    setPaidResult(null);
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

      // rawSaju 데이터 sessionStorage에 저장 (AnalyzeLoadingScreen에서 사용)
      sessionStorage.setItem('saju_raw_me', JSON.stringify({
        rawSaju: meRaw, isUnknown: me.isUnknownTime
      }));
      sessionStorage.setItem('saju_raw_pt', JSON.stringify({
        rawSaju: ptRaw, isUnknown: pt.isUnknownTime
      }));

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

      {!shouldHideTopBar && (
        <TopBar
          isLoggedIn={isLoggedIn}
          userName={userName}
          onLoginClick={() => navigate('/login', { state: { from: location.pathname } })}
          onLogoutClick={async () => {
            await supabase.auth.signOut();
          }}
        />
      )}

      {/* 라우팅 설정 영역 */}
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
              // 수정: 잠금 해제(결제)를 위해 로그인하는 것이므로 목적지를 /payment로 변경
              onRequireLogin={() => navigate('/login', { state: { from: '/payment' } })}
              paidResult={paidResult}
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

        {/* /mypage 경로에서는 마이페이지 노출 */}
        <Route path="/mypage" element={<MyPageView />} />
        <Route path="/payment-history" element={<PaymentHistoryView />} />
        <Route path="/saju-storage" element={<SajuStorageView />} />
        <Route path="/terms-of-service" element={<TermsOfServiceView />} />

        {/* 잘못된 경로는 홈으로 리다이렉트 */}
        <Route path="/login" element={<LoginScreen />} />

        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

      {/* 하단 탭바: 모든 페이지에서 노출되도록 Routes 밖에 배치 */}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#07060c] flex justify-center font-sans text-[#f0eaf8]">
        <ScrollToTop />
        <AppContent />
      </div>
    </BrowserRouter>
  );
}