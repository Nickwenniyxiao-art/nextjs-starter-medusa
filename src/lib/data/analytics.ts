"use server"

import { adminFetch } from "./admin"

export interface KpiData {
  todaySales: number
  todayOrders: number
  averageOrderValue: number
  refundRate: number
  trends: {
    sales: number
    orders: number
    aov: number
    refunds: number
  }
}

export interface SalesTrendPoint {
  date: string
  amount: number
  orders: number
}

export interface TopProduct {
  name: string
  unitsSold: number
  revenue: number
  share: number
}

export interface FunnelStage {
  stage: string
  count: number
  rate: number
}

export interface AnalyticsData {
  kpi: KpiData
  salesTrend: SalesTrendPoint[]
  topProducts: TopProduct[]
  funnel: FunnelStage[]
}

const USE_MOCK = true

function generateMockSalesTrend(days: number): SalesTrendPoint[] {
  const points: SalesTrendPoint[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    points.push({
      date: d.toISOString().split("T")[0],
      amount: Math.round(800 + Math.random() * 3000),
      orders: Math.round(2 + Math.random() * 10),
    })
  }

  return points
}

const MOCK_DATA: AnalyticsData = {
  kpi: {
    todaySales: 4520,
    todayOrders: 7,
    averageOrderValue: 645.71,
    refundRate: 2.3,
    trends: { sales: 12.5, orders: 16.7, aov: -3.2, refunds: -0.5 },
  },
  salesTrend: generateMockSalesTrend(30),
  topProducts: [
    { name: "Lind 3-Seat Sofa", unitsSold: 24, revenue: 20376, share: 18.2 },
    { name: "Berg Coffee Table", unitsSold: 31, revenue: 12369, share: 11.0 },
    { name: "Fjord Dining Table", unitsSold: 18, revenue: 16182, share: 14.5 },
    { name: "Solheim Bed Frame", unitsSold: 15, revenue: 11985, share: 10.7 },
    { name: "Kyst Bookshelf", unitsSold: 22, revenue: 8778, share: 7.8 },
    { name: "Skog Armchair", unitsSold: 19, revenue: 9481, share: 8.5 },
    { name: "Vik Floor Lamp", unitsSold: 28, revenue: 5572, share: 5.0 },
    { name: "Elv Sideboard", unitsSold: 12, revenue: 7188, share: 6.4 },
    { name: "Nord Desk", unitsSold: 14, revenue: 6986, share: 6.2 },
    { name: "Strand Outdoor Set", unitsSold: 8, revenue: 11192, share: 10.0 },
  ],
  funnel: [
    { stage: "browse", count: 3200, rate: 8.4 },
    { stage: "addToCart", count: 269, rate: 41.3 },
    { stage: "checkout", count: 111, rate: 63.1 },
    { stage: "purchase", count: 70, rate: 100 },
  ],
}

export async function getAnalyticsData(days: number = 30): Promise<AnalyticsData> {
  if (USE_MOCK) {
    return {
      ...MOCK_DATA,
      salesTrend: generateMockSalesTrend(days),
    }
  }

  // const [kpi, trend, top, funnel] = await Promise.all([
  //   adminFetch<{ data: KpiData }>("/admin/analytics/sales-summary"),
  //   adminFetch<{ data: SalesTrendPoint[] }>("/admin/analytics/sales-trend", { query: { days: String(days) } }),
  //   adminFetch<{ data: TopProduct[] }>("/admin/analytics/top-products", { query: { limit: "10" } }),
  //   adminFetch<{ data: FunnelStage[] }>("/admin/analytics/traffic"),
  // ])
  // return { kpi: kpi.data, salesTrend: trend.data, topProducts: top.data, funnel: funnel.data }

  return MOCK_DATA
}

export interface FinanceOverview {
  totalRevenue: number
  totalRefunds: number
  netRevenue: number
  stripeFees: number
}

export interface MonthlyRevenue {
  month: string
  revenue: number
  refunds: number
  net: number
}

export interface Transaction {
  orderId: string
  displayId: number
  date: string
  amount: number
  currency: string
  status: string
}

export interface FinanceData {
  overview: FinanceOverview
  monthly: MonthlyRevenue[]
  transactions: Transaction[]
  totalTransactions: number
}

const MOCK_FINANCE: FinanceData = {
  overview: {
    totalRevenue: 112480,
    totalRefunds: 3250,
    netRevenue: 109230,
    stripeFees: 3374.4,
  },
  monthly: [
    { month: "2025-10", revenue: 18200, refunds: 500, net: 17700 },
    { month: "2025-11", revenue: 22400, refunds: 800, net: 21600 },
    { month: "2025-12", revenue: 31500, refunds: 1200, net: 30300 },
    { month: "2026-01", revenue: 19800, refunds: 350, net: 19450 },
    { month: "2026-02", revenue: 15200, refunds: 250, net: 14950 },
    { month: "2026-03", revenue: 5380, refunds: 150, net: 5230 },
  ],
  transactions: Array.from({ length: 21 }, (_, i) => ({
    orderId: `order_${String(i + 1).padStart(3, "0")}`,
    displayId: i + 1,
    date: new Date(Date.now() - i * 86400000 * 2).toISOString(),
    amount: Math.round(200 + Math.random() * 2000),
    currency: "usd",
    status: i % 7 === 0 ? "refunded" : i % 5 === 0 ? "partially_refunded" : "captured",
  })),
  totalTransactions: 21,
}

export async function getFinanceData(page: number = 1, pageSize: number = 20): Promise<FinanceData> {
  if (USE_MOCK) {
    const start = (page - 1) * pageSize

    return {
      ...MOCK_FINANCE,
      transactions: MOCK_FINANCE.transactions.slice(start, start + pageSize),
    }
  }

  // const [overview, monthly, txns] = await Promise.all([
  //   adminFetch<{ data: FinanceOverview }>("/admin/finance/overview"),
  //   adminFetch<{ data: MonthlyRevenue[] }>("/admin/finance/monthly"),
  //   adminFetch<{ data: Transaction[]; count: number }>("/admin/finance/transactions", { query: { limit: String(pageSize), offset: String((page - 1) * pageSize) } }),
  // ])
  // return { overview: overview.data, monthly: monthly.data, transactions: txns.data, totalTransactions: txns.count }

  return MOCK_FINANCE
}
