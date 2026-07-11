import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { completeOrder } from '../lib/paymentFlow'

export default function PaymentRedirect() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const paymentId = params.get('payment_id')
        if (!paymentId) {
            setError('결제 정보를 확인할 수 없습니다.')
            return
        }

        let cancelled = false
        completeOrder(paymentId, paymentId)
            .then((result) => {
                if (!cancelled) navigate('/result', { state: { paidResult: result }, replace: true })
            })
            .catch((e) => {
                if (!cancelled) setError(e.message || '결제 확인 중 오류가 발생했습니다.')
            })

        return () => { cancelled = true }
    }, [params, navigate])

    if (error) {
        return (
            <div className="min-h-screen w-full bg-[#07060c] flex flex-col items-center justify-center gap-4 px-6 text-center text-[#f0eaf8]">
                <p className="text-[14px] text-[#c084fc]">{error}</p>
                <button onClick={() => navigate('/payment')} className="text-[12px] underline text-[#9d8fba]">
                    다시 시도하기
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-[#07060c] flex flex-col items-center justify-center text-[#f0eaf8]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c084fc] mb-4"></div>
            <p className="text-[14px] font-light text-[#9d8fba] animate-pulse">결제 결과를 확인하고 있습니다...</p>
        </div>
    )
}