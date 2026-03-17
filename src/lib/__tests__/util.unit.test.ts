import { getLocalizedCollectionName } from '@/lib/util/collection-name'
import { convertToLocale } from '@/lib/util/money'
import { sortProducts } from '@/lib/util/sort-products'

describe('utility helpers', () => {
  it('formats currency values with locale metadata', () => {
    const formatted = convertToLocale({ amount: 1234.5, currency_code: 'USD' })
    expect(formatted).toContain('$1,234.50')
  })

  it('returns fallback symbol for invalid amount', () => {
    expect(convertToLocale({ amount: undefined, currency_code: 'USD' })).toBe('—')
    expect(convertToLocale({ amount: Number.NaN, currency_code: 'USD' })).toBe('—')
  })

  it('falls back to title when collection translation is missing', () => {
    const result = getLocalizedCollectionName('living-room', 'Living Room', (key) => key)
    expect(result).toBe('Living Room')
  })

  it('returns translated collection name when available', () => {
    const result = getLocalizedCollectionName('living-room', 'Living Room', () => '客厅')
    expect(result).toBe('客厅')
  })

  it('sorts products by ascending price', () => {
    const products = [
      { id: '2', variants: [{ calculated_price: { calculated_amount: 300 } }] },
      { id: '1', variants: [{ calculated_price: { calculated_amount: 100 } }] },
    ] as any

    const sorted = sortProducts(products, 'price_asc' as any)
    expect(sorted.map((p: any) => p.id)).toEqual(['1', '2'])
  })
})
