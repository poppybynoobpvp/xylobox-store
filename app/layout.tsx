import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'XyloBox Store',
  description: 'ร้านค้าสำหรับเซิร์ฟเวอร์ XyloBox Minecraft',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-white">{children}</body>
    </html>
  )
}
