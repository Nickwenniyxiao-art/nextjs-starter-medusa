declare module "@react-email/components" {
  import type { CSSProperties, FC, ReactNode } from "react"

  type BaseProps = {
    children?: ReactNode
    style?: CSSProperties
    href?: string
    src?: string
    alt?: string
    width?: string | number
    height?: string | number
  }

  export const Html: FC<BaseProps>
  export const Head: FC<BaseProps>
  export const Preview: FC<BaseProps>
  export const Body: FC<BaseProps>
  export const Container: FC<BaseProps>
  export const Section: FC<BaseProps>
  export const Text: FC<BaseProps>
  export const Row: FC<BaseProps>
  export const Column: FC<BaseProps>
  export const Img: FC<BaseProps>
  export const Hr: FC<BaseProps>
  export const Button: FC<BaseProps>
}
