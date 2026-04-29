'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { products } from '@/lib/products'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get('product') ?? ''
  const product = products.find((p) => p.id === productId)

  const [playerName, setPlayerName] = useState('')
  const [slip, setSlip] = useState<File | null>(null)
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'info' | 'pay' | 'done'>('info')

  useEffect(() => {
    if (product) {
      fetch(`/api/qr?amount=${product.price}`)
        .then((r) => r.json())
        .then((d) => setQrUrl(d.qr))
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/50">
        ไม่พบสินค้า
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!slip || !playerName.trim()) return
    setLoading(true)

    const form = new FormData()
    form.append('playerName', playerName.trim())
    form.append('productId', product!.id)
    form.append('slip', slip)

    const res = await fetch('/api/orders', { method: 'POST', body: form })
    const data = await res.json()
    setLoading(false)

    if (data.orderId) {
      router.push(`/order/${data.orderId}`)
    } else {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center gap-3">
          <a href="/" className="text-white/40 hover:text-white transition-colors text-sm">← กลับ</a>
          <span className="text-white/20">/</span>
          <span className="text-white/60 text-sm">ชำระเงิน</span>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Product Summary */}
        <div className={`rounded-2xl border border-white/10 bg-white/5 overflow-hidden mb-6`}>
          <div className={`h-1.5 w-full bg-gradient-to-r ${product.color}`} />
          <div className="p-5 flex items-center gap-4">
            <span className="text-4xl">{product.icon}</span>
            <div className="flex-1">
              <p className="text-white font-bold">{product.name}</p>
              <p className="text-white/50 text-sm">{product.nameTh}</p>
            </div>
            <span className="text-white font-bold text-xl">{product.price} THB</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1: Username */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <label className="block text-white font-semibold mb-3">
              1. Minecraft Username ของคุณ
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="เช่น Steve123"
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Step 2: QR Code */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-white font-semibold mb-3">
              2. โอนเงิน <span className="text-green-400">{product.price} บาท</span> ผ่าน PromptPay
            </p>
            <div className="flex justify-center">
              {qrUrl ? (
                <div className="bg-white rounded-2xl p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="PromptPay QR Code" className="w-56 h-56" />
                </div>
              ) : (
                <div className="w-56 h-56 bg-white/10 rounded-2xl animate-pulse" />
              )}
            </div>
            <p className="text-center text-white/40 text-sm mt-3">
              สแกน QR Code ด้วยแอปธนาคาร หรือแอป PromptPay
            </p>
          </div>

          {/* Step 3: Upload slip */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <label className="block text-white font-semibold mb-3">
              3. อัพโหลดสลิปการโอนเงิน
            </label>
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-white/40 transition-colors">
                {slip ? (
                  <div>
                    <p className="text-green-400 font-semibold">✓ {slip.name}</p>
                    <p className="text-white/40 text-sm mt-1">คลิกเพื่อเปลี่ยนไฟล์</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl mb-2">📎</p>
                    <p className="text-white/60">คลิกเพื่อเลือกรูปสลิป</p>
                    <p className="text-white/30 text-sm mt-1">PNG, JPG, JPEG</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                required
                className="hidden"
                onChange={(e) => setSlip(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !playerName.trim() || !slip}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r ${product.color} disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity`}
          >
            {loading ? 'กำลังส่ง...' : 'ยืนยันการสั่งซื้อ'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  )
}
