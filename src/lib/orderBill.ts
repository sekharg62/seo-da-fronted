import { siteConfig, formatWhatsappLocalFromDigits } from '@/siteConfig'

/** Minimal order shape for a bill — satisfied by both the checkout response and /orders/track. */
export type BillOrder = {
  orderNo: string
  createdAt: string
  status?: string
  totalPrice: number | string
  paymentMethod: string
  transactionId?: string | null
  userPaymentMethodNumber?: string | null
  orderNotes?: string | null
  customer: { fullName: string; phone?: string | null; email?: string | null; whatsappNumber?: string | null }
  orderItems: { serviceName: string; quantity: number; price: number | string }[]
}

const STATUS_BADGE: Record<string, string> = {
  PENDING: 'PENDING – Awaiting Verification',
  PROCESSING: 'PROCESSING – Payment Verified',
  COMPLETED: 'COMPLETED – Delivered',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
}

/** Escape user-provided text before putting it into the bill HTML. */
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const money = (n: number | string) => `৳${Number(n).toFixed(0)}`

export function buildOrderBillHtml(o: BillOrder): string {
  const whatsappLocal = formatWhatsappLocalFromDigits(siteConfig.contact.whatsappDigits)
  const date = new Date(o.createdAt).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  const status = STATUS_BADGE[o.status ?? 'PENDING'] ?? o.status ?? 'PENDING'
  const row = (label: string, value: unknown, style = '') =>
    `<span class="label">${esc(label)}</span><span class="value"${style ? ` style="${style}"` : ''}>${esc(value)}</span>`

  const items = o.orderItems
    .map(
      (item, i) => `<tr>
        <td>${i + 1}</td>
        <td>${esc(item.serviceName)}</td>
        <td class="text-right">${esc(item.quantity)}</td>
        <td class="text-right">${money(item.price)}</td>
        <td class="text-right">${money(Number(item.price) * item.quantity)}</td>
      </tr>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Order Bill ${esc(o.orderNo)} – ${esc(siteConfig.websiteName)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111; background: #fff; padding: 40px; }
    .header { text-align: center; margin-bottom: 28px; border-bottom: 2px solid #10b981; padding-bottom: 18px; }
    .header h1 { font-size: 26px; font-weight: 800; color: #059669; letter-spacing: -0.5px; }
    .header .tagline { font-size: 12px; color: #6b7280; margin-top: 2px; }
    .header .address { font-size: 12px; color: #374151; margin-top: 6px; }
    .header .contact { font-size: 12px; color: #374151; margin-top: 2px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 6px; margin-top: 20px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 20px; font-size: 13px; }
    .info-grid .label { color: #6b7280; }
    .info-grid .value { color: #111; font-weight: 500; }
    .order-id { font-family: monospace; font-size: 11px; background: #f3f4f6; padding: 6px 10px; border-radius: 6px; color: #374151; margin-top: 6px; word-break: break-all; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    thead tr { background: #f0fdf4; }
    th { text-align: left; padding: 8px 10px; font-weight: 600; color: #059669; border-bottom: 1px solid #d1fae5; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 8px 10px; border-bottom: 1px solid #f3f4f6; color: #374151; }
    .text-right { text-align: right; }
    .total-row td { font-weight: 700; font-size: 14px; color: #059669; border-top: 2px solid #d1fae5; padding-top: 10px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; background: #fef3c7; color: #92400e; }
    .footer { margin-top: 36px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 14px; }
    @media print { body { padding: 20px; } @page { margin: 15mm; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>${esc(siteConfig.websiteName)}</h1>
    <div class="tagline">${esc(siteConfig.billing.tagline)}</div>
    <div class="address">${esc(siteConfig.billing.addressLine)}</div>
    <div class="contact">Email: ${esc(siteConfig.contact.email)} &nbsp;|&nbsp; WhatsApp: ${esc(whatsappLocal)} &nbsp;|&nbsp; Phone: ${esc(siteConfig.contact.phoneDisplay)}</div>
  </div>

  <div class="section-title">Order Information</div>
  <div class="order-id">Order ID: ${esc(o.orderNo)}</div>
  <div style="margin-top:8px;font-size:12px;color:#6b7280">
    Date: ${esc(date)} &nbsp;|&nbsp; Status: <span class="badge">${esc(status)}</span>
  </div>

  <div class="section-title">Customer Details</div>
  <div class="info-grid">
    ${row('Name', o.customer.fullName)}
    ${row('Phone', o.customer.phone ?? '—')}
    ${row('Email', o.customer.email ?? '—')}
    ${o.customer.whatsappNumber ? row('WhatsApp', o.customer.whatsappNumber) : ''}
  </div>

  <div class="section-title">Services Purchased</div>
  <table>
    <thead><tr><th>#</th><th>Service</th><th class="text-right">Qty</th><th class="text-right">Unit Price</th><th class="text-right">Subtotal</th></tr></thead>
    <tbody>
      ${items}
      <tr class="total-row"><td colspan="4" class="text-right">Total Amount Paid</td><td class="text-right">${money(o.totalPrice)}</td></tr>
    </tbody>
  </table>

  <div class="section-title">Payment Details</div>
  <div class="info-grid">
    ${row('Payment Method', String(o.paymentMethod).toUpperCase())}
    ${row('Transaction ID', o.transactionId ?? '—', 'font-family:monospace')}
    ${o.userPaymentMethodNumber ? row('Paid From', o.userPaymentMethodNumber, 'font-family:monospace') : ''}
    ${row('Amount Paid', money(o.totalPrice), 'color:#059669;font-weight:700')}
  </div>
  ${o.orderNotes ? `<div style="margin-top:10px;font-size:12px;color:#374151"><strong>Notes:</strong> ${esc(o.orderNotes)}</div>` : ''}

  <div class="footer">
    <p>Thank you for choosing ${esc(siteConfig.websiteName)}!</p>
    <p style="margin-top:4px">This is a system-generated receipt. For support, contact us via WhatsApp: ${esc(whatsappLocal)}</p>
  </div>
  <script>window.onload = function () { window.print(); }<\/script>
</body>
</html>`
}

/**
 * Opens the bill in a new window and triggers the print dialog ("Save as PDF" to download).
 * Must be called from a click handler (pop-up blockers). Returns false if the window was blocked.
 */
export function printOrderBill(order: BillOrder): boolean {
  const win = window.open('', '_blank', 'width=800,height=900')
  if (!win) return false
  win.document.write(buildOrderBillHtml(order))
  win.document.close()
  return true
}

/**
 * For bills whose data must be fetched first: opens the window synchronously inside the click
 * (so pop-up blockers allow it), shows a loading message, then writes the bill when `load` resolves.
 */
export async function printOrderBillAsync(load: () => Promise<BillOrder>): Promise<boolean> {
  const win = window.open('', '_blank', 'width=800,height=900')
  if (!win) return false
  win.document.write(
    '<!DOCTYPE html><meta charset="UTF-8"><title>Preparing bill…</title><p style="font-family:sans-serif;padding:40px;color:#374151">Preparing your bill…</p>',
  )
  try {
    const order = await load()
    win.document.open()
    win.document.write(buildOrderBillHtml(order))
    win.document.close()
    return true
  } catch (err) {
    win.document.open()
    win.document.write(
      `<!DOCTYPE html><meta charset="UTF-8"><title>Bill unavailable</title><p style="font-family:sans-serif;padding:40px;color:#b91c1c">${esc(
        err instanceof Error ? err.message : 'Could not load the bill. Please try again.',
      )}</p>`,
    )
    win.document.close()
    return false
  }
}
