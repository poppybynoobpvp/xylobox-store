import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendDiscordNotification } from '@/lib/discord'
import { products } from '@/lib/products'
import { verifySlip } from '@/lib/easyslip'

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

  const db = supabaseAdmin()

  // Upload slip image to Supabase Storage
  const fileExt = slip.name.split('.').pop() ?? 'jpg'
  const safeName = playerName.replace(/[^a-zA-Z0-9]/g, '_')
  const fileName = `${Date.now()}-${safeName}.${fileExt}`
  const { data: uploadData, error: uploadError } = await db.storage
    .from('slips')
    .upload(fileName, slip, { contentType: slip.type })

  if (uploadError) {
    return NextResponse.json(
      { error: `Upload failed: ${uploadError.message}` },
      { status: 500 }
    )
  }

  const { data: urlData } = db.storage.from('slips').getPublicUrl(uploadData.path)
  const slipUrl = urlData.publicUrl

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
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
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
