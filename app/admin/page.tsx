'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Order = {
  id: string
  player_name: string
  product_name: string
  price: number
  status: 'pending' | 'confirmed' | 'delivered'
  slip_url: string
  created_at: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'delivered'>('pending')

  function login(e: React.FormEvent) {
    e.preventDefault()
    // Password is checked server-side when updating orders
    setAuthed(true)
    loadOrders()
  }

  async function loadOrders() {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data ?? [])
    setLoading(false)
  }

  async function updateStatus(orderId: string, status: string) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      loadOrders()
    } else {
      alert('รหัสผ่านไม่ถูกต้อง')
      setAuthed(false)
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-white text-2xl font-bold text-center mb-8">🔐 Admin Login</h1>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่าน Admin"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold transition-colors"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/10 bg-black/40 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-white font-bold">XyloBox Admin</h1>
          <button onClick={loadOrders} className="text-white/50 hover:text-white text-sm transition-colors">
            🔄 รีเฟรช
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['all', 'pending', 'confirmed', 'delivered'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/60 hover:text-white'
              }`}
            >
              {f === 'all' ? 'ทั้งหมด' : f === 'pending' ? '⏳ รอตรวจ' : f === 'confirmed' ? '✅ ยืนยัน' : '🎉 ส่งแล้ว'}
              {f !== 'all' && (
                <span className="ml-2 text-xs opacity-60">
                  {orders.filter((o) => o.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-white/40 py-20">กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-white/40 py-20">ไม่มีคำสั่งซื้อ</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <div key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap gap-4 items-start justify-between">
                  <div>
                    <p className="text-white font-bold">{order.player_name}</p>
                    <p className="text-white/60 text-sm">{order.product_name} • {order.price} THB</p>
                    <p className="text-white/30 text-xs mt-1 font-mono">{order.id}</p>
                    <p className="text-white/30 text-xs">
                      {new Date(order.created_at).toLocaleString('th-TH')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                      order.status === 'confirmed' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {order.status === 'pending' ? 'รอตรวจ' : order.status === 'confirmed' ? 'ยืนยัน' : 'ส่งแล้ว'}
                    </span>
                    <div className="flex gap-2">
                      <a
                        href={order.slip_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-xs hover:bg-white/20 transition-colors"
                      >
                        ดูสลิป
                      </a>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(order.id, 'confirmed')}
                          className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs hover:bg-blue-400 transition-colors"
                        >
                          ยืนยัน
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(order.id, 'delivered')}
                          className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs hover:bg-green-400 transition-colors"
                        >
                          ส่งแล้ว
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Slip preview */}
                <div className="mt-3">
                  <a href={order.slip_url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={order.slip_url}
                      alt="slip"
                      className="h-24 rounded-xl object-cover hover:opacity-80 transition-opacity"
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
