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
import PaymentHistoryView from './components/PaymentHistoryView';
import SajuStorageView from './components/SajuStorageView';
import PaymentView from './components/PaymentView';

function AppContent() {
  const location = useLocation();
  
  // 상단바를 숨길 경로 설정
  const hideTopBarPaths = ['/payment-history', '/saju-storage'];
  const shouldHideTopBar = hideTopBarPaths.includes(location.pathname);

  // --- 상태 관리 ---
  // step: 0(홈), 1(입력), 1.5(로딩), 2(결과), 99(로그인)
  const [step, setStep] = useState(0); 
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // 로그인 유저 정보 (추후 Supabase 연동 시 동적 업데이트 예정)
  const [isLoggedIn] = useState(false); 
  const [userName] = useState("김지은"); 

  // 사주 입력 폼 데이터 상태 관리
  const [me, setMe] = useState<PersonInput>({ 
    name: '', gender: 'F', date: '2000-01-01', time: '23:30', isUnknownTime: false 
  });
  const [pt, setPt] = useState<PersonInput>({ 
    name: '', gender: 'M', date: '2000-01-01', time: '23:30', isUnknownTime: false 
  });
  
  // 사주 분석 결과 데이터
  const [analysis, setAnalysis] = useState<{ 
    meSaju: SajuResult;
    ptSaju: SajuResult;
    score: number;
    relation: RelationResult;
    scoreComment: { title: string; desc: string };
  } | null>(null);

  // --- 사주 계산 및 페이지 이동 로직 ---
  const handleCalculate = async () => {
    try {
      setIsLoading(true);
      // 1. 로딩 페이지로 이동
      navigate('/loading');

      // 본인 사주 계산
      const [y1, m1, d1] = me.date.split('-').map(Number); 
      const [hh1, mm1] = me.time.split(':').map(Number);
      const meRaw = me.isUnknownTime ? calculateSaju(y1, m1, d1) : calculateSaju(y1, m1, d1, hh1, mm1);
      const meElements = getElements(meRaw, me.isUnknownTime);
      const meFortune = getFortuneFlow(y1, d1, me.gender, meRaw.yearPillarHanja || '', meRaw.monthPillarHanja || '');

      // 상대방 사주 계산
      const [y2, m2, d2] = pt.date.split('-').map(Number); 
      const [hh2, mm2] = pt.time.split(':').map(Number);
      const ptRaw = pt.isUnknownTime ? calculateSaju(y2, m2, d2) : calculateSaju(y2, m2, d2, hh2, mm2);
      const ptElements = getElements(ptRaw, pt.isUnknownTime);
      const ptFortune = getFortuneFlow(y2, d2, pt.gender, ptRaw.yearPillarHanja || '', ptRaw.monthPillarHanja || '');

      // 관계 분석 (궁합 점수 및 코멘트)
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

      // 2. 인위적 딜레이(자연스러운 로딩 연출) 후 결과 페이지로 이동
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

  // --- UI 렌더링 ---
  return (
    <div className="w-full max-w-md relative pb-[70px]"> {/* 하단 탭바를 위해 pb 추가 */}
      {/* 상단바 */}
      <TopBar 
        isLoggedIn={isLoggedIn} 
        userName={userName} 
        onLoginClick={() => navigate('/login')} 
      />

      {/* 라우팅 설정 영역 */}
      <Routes>
        {/* 1. 홈 (입력 폼) */}
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
              isLoggedIn={isLoggedIn}
              onRequireLogin={() => navigate('/login')}
            />
          ) : <Navigate to="/" />
        } />
        
        {/* 4. 기타 화면들 */}
        <Route path="/payment" element={<PaymentView />} />
        <Route path="/mypage" element={<MyPageView />} />
        <Route path="/login" element={<LoginScreen />} />
        
        {/* 잘못된 경로는 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* 하단 탭바: 모든 페이지에서 노출 */}
      <BottomNav />
    </div>
  );
}

// 메인 App 컴포넌트
export default function App() {
  return (
    <div className="min-h-screen bg-[#07060c] flex justify-center font-sans text-[#f0eaf8]">
        
        {!shouldHideTopBar && (
        <TopBar 
          isLoggedIn={isLoggedIn} 
          userName={userName} 
          onLoginClick={() => { window.scrollTo(0, 0); setStep(99); }} 
        />
      )}

        {/* 라우팅 설정 영역 */}
        <Routes>
          {/* 기본 경로(/)에서는 메인 화면 노출 */}
          <Route path="/" element={<SajuService />} />
          
          {/* /mypage 경로에서는 마이페이지 노출 */}
          <Route path="/mypage" element={<MyPageView />} />
          <Route path="/payment-history" element={<PaymentHistoryView />} />
          <Route path="/saju-storage" element={<SajuStorageView />} />
          
          {/* 잘못된 경로는 홈으로 리다이렉트 */}
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
      <AppContent />
    </BrowserRouter>
  );
}