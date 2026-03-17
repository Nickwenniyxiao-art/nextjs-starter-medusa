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
    const { container } = render(<Input name='password' type='password' label='Password' />)

    const field = container.querySelector('input[name="password"]') as HTMLInputElement
    expect(field).toBeTruthy()
    expect(field.type).toBe('password')

    await user.click(screen.getByRole('button'))
    expect(field.type).toBe('text')
  })

  it('shows required marker when required', () => {
    render(<Input name='firstName' label='First name' required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })
})
