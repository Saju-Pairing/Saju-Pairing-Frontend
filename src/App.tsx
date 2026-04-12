import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { calculateSaju } from '@fullstackfamily/manseryeok';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js'; // 👈 1. Session 타입 불러오기 추가

// Types & Utils
import type { PersonInput, SajuResult, RelationResult } from './types/saju';
import { getElements, getFortuneFlow, getRelation, getScoreComment, buildServerPayload } from './utils/sajuEngine';

import SajuInputForm from './components/SajuInputForm';
import SajuResultView from './components/SajuResultView';
import LoadingScreen from './components/LoadingScreen';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import MyPageView from './components/MyPageView';
import PaymentHistoryView from './components/PaymentHistoryView';
import SajuStorageView from './components/SajuStorageView';
import PaymentView from './components/PaymentView';
import AuthCallback from './components/AuthCallback';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const onStart = () => {
    navigate('/input');
  };

  // 상단바를 숨길 경로 설정
  const hideTopBarPaths = ['/payment-history', '/saju-storage'];
  const shouldHideTopBar = hideTopBarPaths.includes(location.pathname);

  const [isLoading, setIsLoading] = useState(false);

  // 실제 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("사용자");

  // 앱 로드 및 로그인 상태 변경 감지
  useEffect(() => {
    // any 대신 Session | null 타입으로 명시
    const extractNameAndSet = (session: Session | null) => {
      if (session) {
        // 카카오에서 넘겨준 닉네임이 있으면 쓰고, 없으면 이메일 아이디 부분, 둘 다 없으면 "사용자"
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
      console.log("🧐 [초기 세션 확인] 로그인 상태:", loggedIn, session?.user?.email);
    });

    // 2. 로그인 상태가 바뀔 때
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const loggedIn = !!session;
      setIsLoggedIn(loggedIn);
      extractNameAndSet(session);
      console.log(`🧐 [상태 변경: ${event}] 로그인 상태:`, loggedIn, session?.user?.email);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 입력값 상태
  const [me, setMe] = useState<PersonInput>({
    name: '', gender: 'F', date: '2000-01-01', time: '23:30', isUnknownTime: false
  });
  const [pt, setPt] = useState<PersonInput>({
    name: '', gender: 'M', date: '2000-01-01', time: '23:30', isUnknownTime: false
  });

  // 결과 상태
  const [analysis, setAnalysis] = useState<{
    meSaju: SajuResult;
    ptSaju: SajuResult;
    score: number;
    relation: RelationResult;
    scoreComment: { title: string; desc: string };
  } | null>(null);

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
              onReset={() => navigate('/')}
              isLoggedIn={isLoggedIn}
              onRequireLogin={() => navigate('/login', { state: { from: '/result' } })}
            />
          ) : <Navigate to="/" />
        } />

        <Route path="/payment" element={
          isLoggedIn 
            ? <PaymentView /> 
            : <Navigate to="/login" state={{ from: '/payment' }} replace />
        } />

        {/* /mypage 경로에서는 마이페이지 노출 */}
        <Route path="/mypage" element={<MyPageView />} />
        <Route path="/payment-history" element={<PaymentHistoryView />} />
        <Route path="/saju-storage" element={<SajuStorageView />} />

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
        <AppContent />
      </div>
    </BrowserRouter>
  );
}