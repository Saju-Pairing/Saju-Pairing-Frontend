import { supabase } from './supabase'

export const PRICE = 990

// 결제 검증 (결제 완료 후 호출)
export async function verifyPayment(
  paymentId: string,
  orderId: string,
): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase.functions.invoke('verify-payment', {
    body: { paymentId, orderId },
  })

  if (error) return { success: false, error: error.message }
  if (!data?.success) return { success: false, error: data?.error ?? '결제 검증 실패' }

  return { success: true }
}

// 유저의 결제 내역 조회 (유료 콘텐츠 접근 여부 확인)
export async function getMyPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 저장된 분석 결과 조회 (결과 다시 보기)
export async function getMyReadings() {
  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 특정 결제의 분석 결과 조회
export async function getReadingByPaymentId(paymentId: string) {
  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('payment_id', paymentId)
    .single()

  if (error) throw error
  return data
}

// UUID로 공개 결과 조회 (비로그인도 가능)
export async function getPublicReading(readingId: string) {
  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('id', readingId)
    .eq('is_public', true)
    .single()

  if (error) throw error
  return data
}

// 공유 링크 생성 (is_public = true로 변경)
export async function enableSharing(readingId: string): Promise<string> {
  const { error } = await supabase
    .from('readings')
    .update({ is_public: true })
    .eq('id', readingId)

  if (error) throw error
  return `${window.location.origin}/result/${readingId}`
}

// 공유 링크 해제 (is_public = false로 변경)
export async function disableSharing(readingId: string) {
  const { error } = await supabase
    .from('readings')
    .update({ is_public: false })
    .eq('id', readingId)

  if (error) throw error
}
