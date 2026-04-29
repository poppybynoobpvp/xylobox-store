import generatePayload from 'promptpay-qr'
import QRCode from 'qrcode'

const PROMPTPAY_NUMBER = '0619105607'

export async function generatePromptPayQR(amount: number): Promise<string> {
  const payload = generatePayload(PROMPTPAY_NUMBER, { amount })
  const qrDataUrl = await QRCode.toDataURL(payload, {
    width: 300,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  })
  return qrDataUrl
}
