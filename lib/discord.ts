export async function sendDiscordNotification(order: {
  id: string
  playerName: string
  productName: string
  price: number
  slipUrl: string
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [
        {
          title: '🛒 คำสั่งซื้อใหม่ / New Order',
          color: 0x22c55e,
          fields: [
            { name: 'Order ID', value: order.id, inline: true },
            { name: 'Player', value: order.playerName, inline: true },
            { name: 'Product', value: order.productName, inline: true },
            { name: 'Price', value: `${order.price} THB`, inline: true },
            { name: 'Slip ✅ ผ่านการตรวจสอบแล้ว', value: `[ดูสลิป](${order.slipUrl})`, inline: false },
          ],
          footer: { text: 'XyloBox Store • xylobox.org' },
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  })
}
