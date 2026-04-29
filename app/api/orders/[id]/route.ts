import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = supabaseAdmin()
  const { data, error } = await db.from('orders').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const adminPass = request.headers.get('x-admin-password')
  if (adminPass !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { status } = await request.json()
  const db = supabaseAdmin()
  const { error } = await db.from('orders').update({ status }).eq('id', id)
  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  return NextResponse.json({ success: true })
}
