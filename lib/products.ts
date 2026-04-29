export type Product = {
  id: string
  name: string
  nameTh: string
  description: string
  descriptionTh: string
  price: number
  color: string
  icon: string
  command: string // Minecraft command to run on purchase (placeholder for RCON)
}

export const products: Product[] = [
  {
    id: 'rank-67',
    name: '67 Rank',
    nameTh: 'แรงก์ 67',
    description: 'Exclusive rank with special permissions and prefix.',
    descriptionTh: 'แรงก์พิเศษพร้อม prefix และสิทธิ์พิเศษบนเซิร์ฟเวอร์',
    price: 67,
    color: 'from-yellow-500 to-orange-500',
    icon: '👑',
    command: 'lp user {player} parent set rank-67',
  },
  {
    id: 'gear-key',
    name: 'Gear Key',
    nameTh: 'เกียร์คีย์',
    description: 'Open a gear crate and get exclusive equipment.',
    descriptionTh: 'เปิดลังเกียร์เพื่อรับอุปกรณ์สุดพิเศษ',
    price: 35,
    color: 'from-blue-500 to-cyan-500',
    icon: '⚙️',
    command: 'crates key give {player} gear 1',
  },
  {
    id: 'killeffects-key',
    name: 'Kill Effects Key',
    nameTh: 'คีลเอฟเฟกต์คีย์',
    description: 'Unlock special kill effects to show off after every kill.',
    descriptionTh: 'ปลดล็อกเอฟเฟกต์สุดเท่เมื่อคุณกำจัดศัตรู',
    price: 49,
    color: 'from-purple-500 to-pink-500',
    icon: '⚡',
    command: 'crates key give {player} killeffects 1',
  },
]
