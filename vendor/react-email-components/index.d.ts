import type { CSSProperties, DetailedHTMLProps, FC, HTMLAttributes, ImgHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react"

type BaseProps = {
  children?: ReactNode
  style?: CSSProperties
}

export const Html: FC<BaseProps & DetailedHTMLProps<HTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>>
export const Head: FC<BaseProps & DetailedHTMLProps<HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>>
export const Preview: FC<BaseProps & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>
export const Body: FC<BaseProps & DetailedHTMLProps<HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>>
export const Container: FC<BaseProps & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>
export const Section: FC<BaseProps & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>
export const Text: FC<BaseProps & DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>>
export const Row: FC<BaseProps & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>
export const Column: FC<BaseProps & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>
export const Img: FC<BaseProps & DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>>
export const Hr: FC<BaseProps & DetailedHTMLProps<HTMLAttributes<HTMLHRElement>, HTMLHRElement>>
export const Button: FC<BaseProps & DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>>
