import * as PortOne from '@portone/browser-sdk/v2'

export const PRICE = 990
export const STORE_ID = import.meta.env.VITE_PORTONE_STORE_ID as string
export const CHANNEL_KEY_KCP = import.meta.env.VITE_PORTONE_CHANNEL_KEY_KCP as string

export type PayMethod = 'kakao' | 'naver' | 'card'

export async function requestPayment(
  method: PayMethod,
  orderId: string,
  customerName: string,
): Promise<{ paymentId: string } | null> {
  const common = {
    storeId: STORE_ID,
    channelKey: CHANNEL_KEY_KCP,
    paymentId: orderId,
    orderName: '재회사주 상세 분석',
    totalAmount: PRICE,
    currency: 'KRW' as const,
    customer: { fullName: customerName || '고객' },
  }

  let response: Awaited<ReturnType<typeof PortOne.requestPayment>>
  if (method === 'card') {
    response = await PortOne.requestPayment({ ...common, payMethod: 'CARD' })
  } else {
    response = await PortOne.requestPayment({
      ...common,
      payMethod: 'EASY_PAY',
      easyPay: { easyPayProvider: method === 'kakao' ? 'KAKAOPAY' : 'NAVERPAY' },
    })
  }

  if (response?.code !== undefined) {
    return null
  }

  return { paymentId: orderId }
}
