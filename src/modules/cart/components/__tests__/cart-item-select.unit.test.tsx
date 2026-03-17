import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CartItemSelect from '../cart-item-select'

describe('CartItemSelect', () => {
  it('renders placeholder option', () => {
    render(<CartItemSelect placeholder='Select quantity' value=''>{<option value='1'>1</option>}</CartItemSelect>)
    expect(screen.getByRole('option', { name: 'Select quantity' })).toBeInTheDocument()
  })

  it('renders child options', () => {
    render(
      <CartItemSelect value='2'>
        <option value='1'>1</option>
        <option value='2'>2</option>
      </CartItemSelect>
    )

    expect(screen.getByRole('option', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '2' })).toBeInTheDocument()
  })

  it('updates selected value on change', async () => {
    const user = userEvent.setup()
    render(
      <CartItemSelect defaultValue=''>
        <option value='1'>1</option>
        <option value='2'>2</option>
      </CartItemSelect>
    )

    const select = screen.getByRole('combobox')
    await user.selectOptions(select, '2')
    expect(select).toHaveValue('2')
  })
})
