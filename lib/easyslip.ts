type EasySlipResult =
  | { valid: true; amount: number; receiver: string }
  | { valid: false; reason: string }

export async function verifySlip(slipFile: File, expectedAmount: number): Promise<EasySlipResult> {
  const apiKey = process.env.EASYSLIP_API_KEY
  if (!apiKey) return { valid: false, reason: 'No API key configured' }

  const form = new FormData()
  form.append('file', slipFile)

  const res = await fetch('https://developer.easyslip.com/api/v1/verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  })

  if (!res.ok) {
    return { valid: false, reason: 'Slip verification service error' }
  }

  const json = await res.json()

  if (json.status !== 200 || !json.data) {
    return { valid: false, reason: 'ไม่สามารถอ่านสลิปได้ / Could not read slip' }
  }

  const amount: number = json.data.amount?.amount ?? 0
  const receiver: string =
    json.data.receiver?.account?.value ?? json.data.receiver?.displayName ?? ''

  // Check amount matches (allow 1 baht tolerance for rounding)
  if (Math.abs(amount - expectedAmount) > 1) {
    return {
      valid: false,
      reason: `ยอดเงินไม่ตรง / Amount mismatch: สลิปแสดง ${amount} THB แต่ต้องการ ${expectedAmount} THB`,
    }
  }

  return { valid: true, amount, receiver }
}
