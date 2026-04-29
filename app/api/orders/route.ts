import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendDiscordNotification } from '@/lib/discord'
import { products } from '@/lib/products'
import { verifySlip } from '@/lib/easyslip'

async function uploadToImgBB(arrayBuffer: ArrayBuffer, mimeType: string): Promise<string> {
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const params = new URLSearchParams({
    key: process.env.IMGBB_API_KEY ?? '',
    image: base64,
  })
  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: params,
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error?.message ?? 'ImgBB upload failed')
  return json.data.url as string
}

export async function POST(request: NextRequest) {
  const form = await request.formData()

  const playerName = form.get('playerName') as string
  const productId = form.get('productId') as string
  const slip = form.get('slip') as File

  if (!playerName || !productId || !slip) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const product = products.find((p) => p.id === productId)
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  // Verify slip before accepting order
  const verification = await verifySlip(slip, product.price)
  if (!verification.valid) {
    return NextResponse.json({ error: verification.reason }, { status: 422 })
  }

  // Upload slip to ImgBB
  let slipUrl: string
  try {
    const arrayBuffer = await slip.arrayBuffer()
    slipUrl = await uploadToImgBB(arrayBuffer, slip.type || 'image/jpeg')
  } catch (e) {
    return NextResponse.json({ error: `Slip upload failed: ${(e as Error).message}` }, { status: 500 })
  }

  const db = supabaseAdmin()

  // Auto-confirmed since slip is already verified
  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      player_name: playerName,
      product_id: productId,
      product_name: product.name,
      price: product.price,
      slip_url: slipUrl,
      status: 'confirmed',
    })
    .select()
    .single()

  if (orderError) {
    return NextResponse.json({ error: `DB error: ${orderError.message}` }, { status: 500 })
  }

  // Notify admin on Discord
  await sendDiscordNotification({
    id: order.id,
    playerName,
    productName: product.name,
    price: product.price,
    slipUrl,
  })

  return NextResponse.json({ orderId: order.id })
}
