import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { calculateSaju } from '@fullstackfamily/manseryeok';

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

function AppContent() {
  const navigate = useNavigate();

  // ✔ 홈 화면에서 `/input` 으로 이동시키는 함수
  const onStart = () => {
    navigate('/input');
  };

  const [isLoading, setIsLoading] = useState(false);

  // 로그인 유저 정보
  const [isLoggedIn] = useState(false);
  const [userName] = useState("김지은");

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

      <TopBar
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLoginClick={() => navigate('/login')}
      />

      <Routes>

        {/* ⭐ 홈 화면 — onStart 전달됨 */}
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
              onRequireLogin={() => navigate('/login')}
            />
          ) : <Navigate to="/" />
        } />

        <Route path="/payment" element={<PaymentView />} />
        <Route path="/mypage" element={<MyPageView />} />
        <Route path="/login" element={<LoginScreen />} />

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