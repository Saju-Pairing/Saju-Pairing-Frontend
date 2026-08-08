import { verifyPayment, getReadingByPaymentId } from './payment'
import { analyzePaid } from './analyze'
import { buildAnalyzePayload } from '../utils/sajuEngine'

function buildFormPayload() {
    const rawMe = JSON.parse(sessionStorage.getItem('saju_raw_me') || '{}')
    const rawPt = JSON.parse(sessionStorage.getItem('saju_raw_pt') || '{}')
    const me = JSON.parse(sessionStorage.getItem('saju_me') || '{}')
    const pt = JSON.parse(sessionStorage.getItem('saju_pt') || '{}')
    const freeResultRaw = sessionStorage.getItem('saju_free_result')
    const freeResult = freeResultRaw ? JSON.parse(freeResultRaw) : { compatibility: 0, score: 0 }

    const meSaju = buildAnalyzePayload(rawMe.rawSaju, rawMe.isUnknown)
    const partnerSaju = buildAnalyzePayload(rawPt.rawSaju, rawPt.isUnknown)

    const formData = {
        me: { name: me.name, birth: me.date, gender: me.gender, time: me.time },
        partner: { name: pt.name, birth: pt.date, gender: pt.gender, time: pt.time },
        breakupDuration: me.breakupDuration || pt.breakupDuration || sessionStorage.getItem('saju_breakup_duration') || '미입력',
        breakupReason: me.breakupReason || pt.breakupReason || sessionStorage.getItem('saju_breakup_reason') || '미입력',
    }

    return { formData, meSaju, partnerSaju, freeResult }
}

async function runAnalysisAndFetchReading(paymentId: string) {
    const { formData, meSaju, partnerSaju, freeResult } = buildFormPayload()

    const result = await analyzePaid(formData, meSaju, partnerSaju, paymentId, freeResult)
    if (!result) throw new Error('서버에서 분석 결과를 생성하는 데 실패했습니다.')

    let readingId: string | undefined
    try {
        const reading = await getReadingByPaymentId(paymentId)
        readingId = reading?.id
    } catch (e) {
        console.error('reading 조회 실패:', e)
    }

    if (!readingId) {
        throw new Error('결과 조회에 실패했습니다. 마이페이지에서 다시 확인해주세요.')
    }

    return { ...result, readingId }
}

export async function completeOrder(paymentId: string, orderId: string) {
    const { success, error } = await verifyPayment(paymentId, orderId)
    if (!success) {
        throw new Error(`결제 실패: ${error}`)
    }

    return runAnalysisAndFetchReading(paymentId)
}

export async function completeFreeOrder(paymentId: string) {
    return runAnalysisAndFetchReading(paymentId)
}