import { isManual, isPaypal, isStripeLike, noDivisionCurrencies, paymentInfoMap } from '@/lib/constants'

describe('constants', () => {
  it('contains default manual payment mapping', () => {
    expect(paymentInfoMap.pp_system_default.title).toBe('Manual Payment')
  })

  it('correctly identifies provider prefixes', () => {
    expect(isStripeLike('pp_stripe_stripe')).toBe(true)
    expect(isPaypal('pp_paypal_paypal')).toBe(true)
    expect(isManual('pp_system_default')).toBe(true)
  })

  it('returns false for unrelated providers', () => {
    expect(isStripeLike('pp_paypal_paypal')).toBe(false)
    expect(isPaypal('pp_stripe_stripe')).toBe(false)
    expect(isManual('custom_provider')).toBe(false)
  })

  it('keeps non-divisible currencies list stable', () => {
    expect(noDivisionCurrencies).toEqual(expect.arrayContaining(['jpy', 'krw', 'vnd']))
  })
})
