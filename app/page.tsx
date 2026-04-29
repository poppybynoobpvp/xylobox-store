import Link from 'next/link'
import { products } from '@/lib/products'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">XyloBox</h1>
              <p className="text-green-400 text-xs">Store</p>
            </div>
          </div>
          <a
            href="https://xylobox.org"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            xylobox.org ↗
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-8 text-center">
        <div className="float-animation inline-block text-6xl mb-4">🌿</div>
        <h2 className="text-4xl font-bold text-white mb-2">XyloBox Store</h2>
        <p className="text-white/50 text-lg">ยินดีต้อนรับสู่ร้านค้าของ XyloBox</p>
        <p className="text-white/30 text-sm mt-1">play.xylobox.org</p>
      </div>

      {/* Products */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <h3 className="text-white/40 text-sm font-semibold uppercase tracking-widest mb-6 text-center">
          สินค้าทั้งหมด / All Products
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 hover:bg-white/8 transition-all group"
            >
              {/* Gradient top bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${product.color}`} />

              <div className="p-6">
                <div className="text-4xl mb-3">{product.icon}</div>
                <h4 className="text-white font-bold text-xl mb-1">{product.name}</h4>
                <p className="text-white/40 text-sm mb-1">{product.nameTh}</p>
                <p className="text-white/60 text-sm mb-5">{product.descriptionTh}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">
                    {product.price}{' '}
                    <span className="text-sm font-normal text-white/50">THB</span>
                  </span>
                  <Link
                    href={`/checkout?product=${product.id}`}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${product.color} hover:opacity-90 transition-opacity`}
                  >
                    ซื้อเลย
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h4 className="text-white font-semibold mb-3">📋 วิธีการสั่งซื้อ</h4>
          <ol className="text-white/60 text-sm space-y-2">
            <li>1. เลือกสินค้าและกด <strong className="text-white">ซื้อเลย</strong></li>
            <li>2. กรอก Minecraft Username ของคุณ</li>
            <li>3. โอนเงินผ่าน PromptPay ตามจำนวนที่แสดง</li>
            <li>4. อัพโหลดสลิปการโอนเงิน</li>
            <li>5. แอดมินจะตรวจสอบและส่งของให้ภายใน 24 ชั่วโมง</li>
          </ol>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-white/30 text-sm">
        XyloBox Store © 2025 • xylobox.org
      </footer>
    </div>
  )
}
