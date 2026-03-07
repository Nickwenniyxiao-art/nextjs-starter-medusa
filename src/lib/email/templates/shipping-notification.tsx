import type { CSSProperties } from "react"

type Locale = "zh" | "en"

type ShippingNotificationProps = {
  orderId: string
  trackingNumber: string
  trackingUrl: string
  estimatedDelivery: string
  locale?: Locale
}

const contentByLocale = {
  zh: {
    title: "订单发货通知",
    greeting: "您的订单已发货，正在前往您的收货地址。",
    orderNo: "订单号",
    trackingNo: "快递单号",
    estimatedDelivery: "预计送达",
    trackButton: "查看物流",
    hint: "若按钮无法点击，请复制以下链接到浏览器打开：",
    footer: "NordHjem · 北欧简约生活",
  },
  en: {
    title: "Shipping Notification",
    greeting: "Your order has been shipped and is on the way.",
    orderNo: "Order ID",
    trackingNo: "Tracking Number",
    estimatedDelivery: "Estimated Delivery",
    trackButton: "Track Shipment",
    hint: "If the button does not work, copy this link into your browser:",
    footer: "NordHjem · Nordic Minimal Living",
  },
} as const

const styles: Record<string, CSSProperties> = {
  page: {
    margin: 0,
    padding: "24px 0",
    backgroundColor: "#f5f6f4",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: "#1f2937",
  },
  card: {
    width: "100%",
    maxWidth: "640px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#2C3E2D",
    color: "#ffffff",
    padding: "20px 24px",
  },
  brand: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "0.3px",
  },
  title: {
    margin: "6px 0 0",
    fontSize: "14px",
    opacity: 0.9,
  },
  body: {
    padding: "24px",
  },
  greeting: {
    margin: "0 0 20px",
    fontSize: "15px",
    lineHeight: 1.6,
  },
  infoBox: {
    marginBottom: "20px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "12px 14px",
  },
  infoRow: {
    margin: "8px 0",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  label: {
    color: "#6b7280",
    marginRight: "6px",
  },
  buttonWrap: {
    textAlign: "center",
    margin: "24px 0 18px",
  },
  button: {
    display: "inline-block",
    backgroundColor: "#2C3E2D",
    color: "#ffffff",
    textDecoration: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
  },
  hint: {
    margin: "0 0 8px",
    fontSize: "12px",
    color: "#6b7280",
  },
  link: {
    fontSize: "12px",
    color: "#2C3E2D",
    wordBreak: "break-all",
  },
  footer: {
    padding: "16px 24px",
    borderTop: "1px solid #f1f5f9",
    fontSize: "12px",
    color: "#6b7280",
    textAlign: "center",
  },
}

const ShippingNotificationEmail = ({
  orderId,
  trackingNumber,
  trackingUrl,
  estimatedDelivery,
  locale = "zh",
}: ShippingNotificationProps) => {
  const copy = contentByLocale[locale]

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.brand}>NordHjem</h1>
          <p style={styles.title}>{copy.title}</p>
        </div>

        <div style={styles.body}>
          <p style={styles.greeting}>{copy.greeting}</p>

          <div style={styles.infoBox}>
            <p style={styles.infoRow}>
              <span style={styles.label}>{copy.orderNo}:</span>
              {orderId}
            </p>
            <p style={styles.infoRow}>
              <span style={styles.label}>{copy.trackingNo}:</span>
              {trackingNumber}
            </p>
            <p style={styles.infoRow}>
              <span style={styles.label}>{copy.estimatedDelivery}:</span>
              {estimatedDelivery}
            </p>
          </div>

          <div style={styles.buttonWrap}>
            <a href={trackingUrl} style={styles.button}>
              {copy.trackButton}
            </a>
          </div>

          <p style={styles.hint}>{copy.hint}</p>
          <a href={trackingUrl} style={styles.link}>
            {trackingUrl}
          </a>
        </div>

        <div style={styles.footer}>{copy.footer}</div>
      </div>
    </div>
  )
}

export default ShippingNotificationEmail
export type { ShippingNotificationProps }
