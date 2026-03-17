import { render, screen } from '@testing-library/react'

import Thumbnail from '../thumbnail'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid='next-image' data-src={props.src} aria-label={props.alt} />,
}))

describe('Thumbnail', () => {
  it('renders next image when thumbnail exists', () => {
    render(<Thumbnail thumbnail='https://example.com/p.jpg' data-testid='thumb' />)
    expect(screen.getByTestId('next-image')).toHaveAttribute('data-src', 'https://example.com/p.jpg')
  })

  it('falls back to first image when thumbnail is missing', () => {
    render(<Thumbnail images={[{ url: 'https://example.com/fallback.jpg' }]} />)
    expect(screen.getByTestId('next-image')).toHaveAttribute('data-src', 'https://example.com/fallback.jpg')
  })

  it('renders placeholder when no image is provided', () => {
    const { container } = render(<Thumbnail />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
