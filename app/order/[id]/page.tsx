'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Order = {
  id: string
  player_name: string
  product_name: string
  price: number
  status: 'pending' | 'confirmed' | 'delivered'
  slip_url: string
  created_at: string
}

const statusConfig = {
  pending: { label: 'รอตรวจสอบ', emoji: '⏳', color: 'text-yellow-400' },
  confirmed: { label: 'ยืนยันแล้ว', emoji: '✅', color: 'text-blue-400' },
  delivered: { label: 'ส่งของแล้ว', emoji: '🎉', color: 'text-green-400' },
}

export default function OrderPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((d) => { setOrder(d); setLoading(false) })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white/50">
        กำลังโหลด...
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white/50">
        ไม่พบคำสั่งซื้อ
      </div>
    )
  }

  const status = statusConfig[order.status] ?? statusConfig.pending

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
          <a href="/" className="text-white/40 hover:text-white transition-colors text-sm">← กลับหน้าหลัก</a>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{status.emoji}</div>
          <h2 className="text-white text-2xl font-bold mb-2">คำสั่งซื้อของคุณ</h2>
          <p className={`text-lg font-semibold ${status.color}`}>{status.label}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Order ID</span>
            <span className="text-white font-mono text-xs">{order.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">ผู้ซื้อ / Player</span>
            <span className="text-white">{order.player_name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">สินค้า / Product</span>
            <span className="text-white">{order.product_name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">ราคา / Price</span>
            <span className="text-white">{order.price} THB</span>
          </div>
          <div className="border-t border-white/10 pt-4">
            <p className="text-white/50 text-sm mb-2">สลิป / Slip</p>
            <a href={order.slip_url} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={order.slip_url} alt="slip" className="rounded-xl max-w-full" />
            </a>
          </div>
        </div>

        {order.status === 'pending' && (
          <div className="mt-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 p-4 text-yellow-200/80 text-sm">
            แอดมินกำลังตรวจสอบสลิปของคุณ กรุณารอสักครู่ 🙏
          </div>
        )}
        {order.status === 'delivered' && (
          <div className="mt-4 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-green-200/80 text-sm">
            ✅ ส่งของแล้ว! กรุณาเข้าสู่เซิร์ฟเวอร์ xylobox.org เพื่อรับสินค้า
          </div>
        )}
      </div>
    </div>
  )
}
