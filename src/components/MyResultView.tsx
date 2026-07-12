import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReadingById } from '../lib/payment';
import SajuResultView from './SajuResultView';
import type { PersonInput, PaidResult } from '../types/saju';

type ReadingRow = {
    id: string;
    form_data: {
        me: { name?: string; birth: string; gender: string; time?: string };
        partner: { name?: string; birth: string; gender: string; time?: string };
    };
    free_result: any;
    paid_result: PaidResult;
};

export default function MyResultView() {
    const { readingId } = useParams<{ readingId: string }>();
    const navigate = useNavigate();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [data, setData] = useState<ReadingRow | null>(null);

    useEffect(() => {
        if (!readingId) {
            setStatus('error');
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                const row = await getReadingById(readingId);
                if (cancelled) return;

                if (!row) {
                    setStatus('error');
                    return;
                }

                setData(row as ReadingRow);
                setStatus('success');
            } catch (err) {
                console.error('내 결과 조회 실패:', err);
                if (!cancelled) setStatus('error');
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [readingId]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#07060c] text-[#f0eaf8]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c084fc] mb-4"></div>
                <p className="text-[13px] text-[#9d8fba]">결과를 불러오는 중이에요...</p>
            </div>
        );
    }

    if (status === 'error' || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#07060c] text-[#f0eaf8] px-6 text-center gap-4">
                <div className="text-3xl">⚠️</div>
                <p className="text-[14px] font-bold">결과를 불러올 수 없어요</p>
                <p className="text-[12px] text-[#9d8fba]">삭제되었거나 접근 권한이 없는 결과예요.</p>
                <button
                    onClick={() => navigate('/saju-storage')}
                    className="mt-4 px-6 py-3 bg-[linear-gradient(135deg,#C084FC,#F472B6)] text-white text-[13px] font-bold rounded-[1rem]"
                >
                    보관함으로 돌아가기
                </button>
            </div>
        );
    }

    const me: PersonInput = {
        name: data.form_data?.me?.name,
        gender: data.form_data?.me?.gender as 'F' | 'M',
        date: data.form_data?.me?.birth,
        time: data.form_data?.me?.time || '',
        isUnknownTime: !data.form_data?.me?.time,
    };

    const pt: PersonInput = {
        name: data.form_data?.partner?.name,
        gender: data.form_data?.partner?.gender as 'F' | 'M',
        date: data.form_data?.partner?.birth,
        time: data.form_data?.partner?.time || '',
        isUnknownTime: !data.form_data?.partner?.time,
    };

    const paidResultWithId = { ...(data.paid_result || {}), readingId: data.id };

    return (
        <SajuResultView
            me={me}
            pt={pt}
            analysis={data.free_result}
            paidResult={paidResultWithId}
            onReset={() => navigate('/')}
        />
    );
}