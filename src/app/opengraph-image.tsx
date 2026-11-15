import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { siteConfig } from '@/config/siteConfig'

/** Default social-share image for every page that doesn't set its own (product pages use the product image). */
export const alt = `${siteConfig.websiteName} — Premium digital subscriptions in Bangladesh`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PRODUCTS = ['ChatGPT Plus', 'Gemini Pro', 'Netflix', 'YouTube Premium', 'CapCut Pro', 'VPN']

export default async function Image() {
  const logo = await readFile(join(process.cwd(), 'public', 'White.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #020617 0%, #052e2b 55%, #065f46 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={88} height={88} alt="" />
          <div style={{ fontSize: 44, fontWeight: 700 }}>{siteConfig.websiteName}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 980 }}>
            Premium digital subscriptions in Bangladesh
          </div>
          <div style={{ fontSize: 30, color: '#a7f3d0' }}>Pay with bKash · Nagad · Rocket — fast delivery & full support</div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {PRODUCTS.map((p) => (
            <div
              key={p}
              style={{
                display: 'flex',
                padding: '10px 22px',
                borderRadius: 999,
                background: 'rgba(16,185,129,0.18)',
                border: '2px solid rgba(52,211,153,0.5)',
                fontSize: 26,
                fontWeight: 600,
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
