import type { CSSProperties } from "react"

type Locale = "zh" | "en"

type OrderItem = {
  name: string
  quantity: number
  price: number
}

type OrderConfirmationProps = {
  orderId: string
  orderDate: string
  items: OrderItem[]
  shippingAddress: string
  total: number
  currency: string
  locale?: Locale
}

const contentByLocale = {
  zh: {
    title: "订单确认",
    greeting: "感谢您的购买！您的订单已确认。",
    orderNo: "订单号",
    orderDate: "下单日期",
    itemList: "商品清单",
    itemName: "商品",
    itemQty: "数量",
    itemPrice: "价格",
    shippingAddress: "收货地址",
    total: "总金额",
    footer: "NordHjem · 北欧简约生活",
  },
  en: {
    title: "Order Confirmation",
    greeting: "Thank you for your purchase! Your order has been confirmed.",
    orderNo: "Order ID",
    orderDate: "Order Date",
    itemList: "Items",
    itemName: "Item",
    itemQty: "Qty",
    itemPrice: "Price",
    shippingAddress: "Shipping Address",
    total: "Total",
    footer: "NordHjem · Nordic Minimal Living",
  },
} as const

const formatCurrency = (amount: number, currency: string, locale: Locale) => {
  try {
    return new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US", {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

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
    margin: "0 0 16px",
    fontSize: "15px",
    lineHeight: 1.6,
  },
  meta: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "16px",
  },
  metaCell: {
    padding: "8px 0",
    fontSize: "14px",
    borderBottom: "1px solid #f1f5f9",
  },
  metaLabel: {
    color: "#6b7280",
    width: "120px",
    verticalAlign: "top",
  },
  sectionTitle: {
    margin: "20px 0 12px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#2C3E2D",
  },
  itemsTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  itemsHead: {
    textAlign: "left",
    color: "#6b7280",
    borderBottom: "1px solid #e5e7eb",
    padding: "8px 0",
    fontWeight: 600,
  },
  itemsCell: {
    borderBottom: "1px solid #f1f5f9",
    padding: "10px 0",
    verticalAlign: "top",
  },
  right: {
    textAlign: "right",
  },
  address: {
    margin: 0,
    padding: "12px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    lineHeight: 1.6,
    whiteSpace: "pre-line",
  },
  totalWrap: {
    marginTop: "16px",
    textAlign: "right",
    fontSize: "18px",
    fontWeight: 700,
    color: "#2C3E2D",
  },
  footer: {
    padding: "16px 24px",
    borderTop: "1px solid #f1f5f9",
    fontSize: "12px",
    color: "#6b7280",
    textAlign: "center",
  },
}

const OrderConfirmationEmail = ({
  orderId,
  orderDate,
  items,
  shippingAddress,
  total,
  currency,
  locale = "zh",
}: OrderConfirmationProps) => {
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

          <table style={styles.meta} role="presentation">
            <tbody>
              <tr>
                <td style={{ ...styles.metaCell, ...styles.metaLabel }}>{copy.orderNo}</td>
                <td style={styles.metaCell}>{orderId}</td>
              </tr>
              <tr>
                <td style={{ ...styles.metaCell, ...styles.metaLabel }}>{copy.orderDate}</td>
                <td style={styles.metaCell}>{orderDate}</td>
              </tr>
            </tbody>
          </table>

          <h2 style={styles.sectionTitle}>{copy.itemList}</h2>
          <table style={styles.itemsTable} role="presentation">
            <thead>
              <tr>
                <th style={styles.itemsHead}>{copy.itemName}</th>
                <th style={{ ...styles.itemsHead, ...styles.right }}>{copy.itemQty}</th>
                <th style={{ ...styles.itemsHead, ...styles.right }}>{copy.itemPrice}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={`${item.name}-${index}`}>
                  <td style={styles.itemsCell}>{item.name}</td>
                  <td style={{ ...styles.itemsCell, ...styles.right }}>{item.quantity}</td>
                  <td style={{ ...styles.itemsCell, ...styles.right }}>
                    {formatCurrency(item.price, currency, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={styles.sectionTitle}>{copy.shippingAddress}</h2>
          <p style={styles.address}>{shippingAddress}</p>

          <div style={styles.totalWrap}>
            {copy.total}: {formatCurrency(total, currency, locale)}
          </div>
        </div>

        <div style={styles.footer}>{copy.footer}</div>
      </div>
    </div>
  )
}

export default OrderConfirmationEmail
export type { OrderConfirmationProps, OrderItem }
