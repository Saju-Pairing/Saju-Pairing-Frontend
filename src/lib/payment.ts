import { supabase } from './supabase'

export const PRICE = 990

// 결제 레코드 타입
export interface PaymentRecord {
  id: string
  user_id: string
  payment_id: string
  order_id: string
  amount: number
  status: 'PAID' | 'CANCELLED' | 'PARTIAL_CANCELLED'
  cancelled_at: string | null
  created_at: string
}

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
export async function getMyPayments(): Promise<PaymentRecord[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

// 유료 접근 가능 여부 (취소되지 않은 결제가 1건 이상)
export async function hasValidPayment(): Promise<boolean> {
  const { data, error } = await supabase
    .from('payments')
    .select('id')
    .eq('status', 'PAID')          // CANCELLED, PARTIAL_CANCELLED 제외
    .limit(1)

  if (error) return false
  return (data ?? []).length > 0
}

// 저장된 분석 결과 조회 (결과 다시 보기)
export async function getMyReadings() {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw userError ?? new Error('로그인이 필요합니다.')

  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('user_id', user.id)          // ★ 이 줄 추가
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
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

// 본인 소유의 reading을 id로 직접 조회
export async function getReadingById(readingId: string) {
  const { data, error } = await supabase
    .from('readings')
    .select('*')
    .eq('id', readingId)
    .single()

  if (error) throw error
  return data
}
