import { NextRequest, NextResponse } from 'next/server'
import { generatePromptPayQR } from '@/lib/promptpay'

export async function GET(request: NextRequest) {
  const amount = Number(request.nextUrl.searchParams.get('amount'))
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }
  const qr = await generatePromptPayQR(amount)
  return NextResponse.json({ qr })
}
