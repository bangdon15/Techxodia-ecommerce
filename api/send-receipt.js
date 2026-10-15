// Vercel Serverless Function: POST /api/send-receipt
// Dispatches official Techxodia order receipt emails via Resend or returns simulation response

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { order, resendApiKey, fromEmail } = req.body;

    if (!order || !order.customer_email) {
      return res.status(400).json({ error: 'Missing order data or customer email' });
    }

    const apiKey = resendApiKey || process.env.RESEND_API_KEY;
    const sender = fromEmail || process.env.RESEND_FROM_EMAIL || 'concierge@techxodia.com';

    // Build the Luxury HTML Receipt
    const htmlReceipt = generateReceiptHtml(order);

    // If a Resend API key is configured, send the real email via Resend API
    if (apiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: `TECHXODIA Concierge <${sender}>`,
          to: [order.customer_email],
          subject: `Techxodia Archive Order Confirmation // ${order.order_number}`,
          html: htmlReceipt,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          error: data.message || 'Failed to dispatch email via Resend',
          data,
        });
      }

      return res.status(200).json({
        success: true,
        mode: 'live_resend',
        emailId: data.id,
        sentTo: order.customer_email,
        message: `Official receipt delivered to ${order.customer_email} via Resend.`,
      });
    }

    // If no Resend key is configured yet, simulate successful receipt generation
    return res.status(200).json({
      success: true,
      mode: 'simulated',
      sentTo: order.customer_email,
      message: `Receipt generated for ${order.customer_email}. Configure Resend API key in Admin Console to dispatch live SMTP.`,
    });
  } catch (error) {
    console.error('Email receipt dispatch error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during email dispatch',
    });
  }
}

function generateReceiptHtml(order) {
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #23272F;">
          <strong style="color: #FFFFFF; font-size: 14px;">${item.name}</strong><br/>
          <span style="color: #A39B8B; font-size: 12px;">Colorway: ${item.color}</span>
          ${item.customEngraving ? `<br/><span style="color: #C86237; font-size: 11px;">Laser Engraving: "${item.customEngraving}"</span>` : ''}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #23272F; text-align: center; color: #FFFFFF; font-size: 13px;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #23272F; text-align: right; color: #FFFFFF; font-size: 14px; font-weight: 700;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A0B0D; margin: 0; padding: 24px; color: #E8E5DF; }
        .receipt-card { max-width: 600px; margin: 0 auto; background-color: #121418; border: 1px solid #262930; border-radius: 4px; overflow: hidden; }
        .header { background-color: #191B21; padding: 28px; border-bottom: 2px solid #C86237; text-align: center; }
        .brand-title { font-size: 20px; font-weight: 900; letter-spacing: 4px; color: #FFFFFF; margin: 0; text-transform: uppercase; }
        .brand-tag { font-size: 10px; letter-spacing: 2px; color: #C86237; margin-top: 4px; text-transform: uppercase; font-weight: 700; }
        .body { padding: 32px 28px; }
        .order-badge { display: inline-block; background-color: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #10B981; padding: 4px 10px; border-radius: 2px; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        .table { width: 100%; border-collapse: collapse; margin-top: 24px; }
        .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #A39B8B; }
        .total-row { display: flex; justify-content: space-between; padding: 14px 0; font-size: 18px; font-weight: 900; color: #FFFFFF; border-top: 1px solid #262930; margin-top: 12px; }
        .footer { background-color: #0F1014; padding: 20px; text-align: center; font-size: 11px; color: #727986; border-top: 1px solid #1F2228; }
      </style>
    </head>
    <body>
      <div class="receipt-card">
        <div class="header">
          <h1 class="brand-title">TECHXODIA</h1>
          <div class="brand-tag">SERIES 01 ARCHIVE // OFFICIAL PROOF OF PURCHASE</div>
        </div>
        <div class="body">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div>
              <span class="order-badge">Payment Verified // Allocation Locked</span>
              <h2 style="font-size: 18px; color: #FFFFFF; margin: 10px 0 4px 0;">Order #${order.order_number}</h2>
              <span style="font-size: 12px; color: #8C8477;">Placed: ${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 12px; color: #8C8477;">Billed To:</span><br/>
              <strong style="color: #FFFFFF; font-size: 13px;">${order.customer_name}</strong><br/>
              <span style="color: #8C8477; font-size: 12px;">${order.customer_email}</span>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr style="border-bottom: 1px solid #2A2E38; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8C8477;">
                <th style="padding-bottom: 8px;">Archival Item</th>
                <th style="padding-bottom: 8px; text-align: center;">Qty</th>
                <th style="padding-bottom: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #23272F;">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span style="color: #FFFFFF;">$${(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Complimentary Vault Shipping:</span>
              <span style="color: ${order.shipping === 0 ? '#10B981' : '#FFFFFF'};">
                ${order.shipping === 0 ? 'FREE ($0.00)' : `$${(order.shipping || 0).toFixed(2)}`}
              </span>
            </div>
            <div class="summary-row">
              <span>Payment Gateway:</span>
              <span style="color: #FFFFFF;">${order.payment_method || 'Online Payment (Stripe Verified)'}</span>
            </div>
            <div class="total-row">
              <span>TOTAL BILLED (${order.currency || 'USD'}):</span>
              <span style="color: #FFA578;">$${(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <p style="margin: 0 0 6px 0;">All items are protected under the Techxodia Lifetime Metallurgy Guarantee.</p>
          <p style="margin: 0;">For concierge inquiries or drop questions, contact concierge@techxodia.com</p>
        </div>
      </div>
    </body>
  </html>
  `;
}
