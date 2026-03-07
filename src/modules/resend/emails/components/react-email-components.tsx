import type { CSSProperties, FC, PropsWithChildren } from "react"

type BaseProps = PropsWithChildren<{
  style?: CSSProperties
  href?: string
  src?: string
  alt?: string
  width?: string | number
  height?: string | number
}>

export const Html: FC<BaseProps> = ({ children }) => <html>{children}</html>
export const Head: FC<BaseProps> = ({ children }) => <head>{children}</head>
export const Preview: FC<BaseProps> = ({ children, style }) => <div style={style}>{children}</div>
export const Body: FC<BaseProps> = ({ children, style }) => <body style={style}>{children}</body>
export const Container: FC<BaseProps> = ({ children, style }) => <table style={style}>{children}</table>
export const Section: FC<BaseProps> = ({ children, style }) => <section style={style}>{children}</section>
export const Text: FC<BaseProps> = ({ children, style }) => <p style={style}>{children}</p>
export const Row: FC<BaseProps> = ({ children, style }) => <div style={style}>{children}</div>
export const Column: FC<BaseProps> = ({ children, style }) => <div style={style}>{children}</div>
export const Img: FC<BaseProps> = ({ src, alt, width, height, style }) => (
  <img src={src} alt={alt} width={width} height={height} style={style} />
)
export const Hr: FC<BaseProps> = ({ style }) => <hr style={style} />
export const Button: FC<BaseProps> = ({ children, href, style }) => (
  <a href={href} style={style}>
    {children}
  </a>
)
