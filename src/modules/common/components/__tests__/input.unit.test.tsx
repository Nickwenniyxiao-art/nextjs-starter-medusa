import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Input from '../input'

describe('Input', () => {
  it('renders label and top label', () => {
    render(<Input name='email' label='Email' topLabel='Contact' />)

    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<Input name='password' type='password' label='Password' />)

    const field = screen.getByRole('textbox', { hidden: true }) as HTMLInputElement
    expect(field.type).toBe('password')

    await user.click(screen.getByRole('button'))
    expect(field.type).toBe('text')
  })

  it('shows required marker when required', () => {
    render(<Input name='firstName' label='First name' required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })
})
