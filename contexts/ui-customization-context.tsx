"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type CustomColor = string // Hex color string
export type CustomFont = "Inter" | "Roboto" | "Open Sans" | "Lato" | "Montserrat" | "Merriweather" | "Roboto Mono"

interface UICustomizationContextType {
  primaryColor: CustomColor
  setPrimaryColor: (color: CustomColor) => void
  fontFamily: CustomFont
  setFontFamily: (font: CustomFont) => void
  fontSize: number // New: Base font size in pixels
  setFontSize: (size: number) => void
  lineHeight: number // New: Line height multiplier
  setLineHeight: (height: number) => void
}

const UICustomizationContext = createContext<UICustomizationContextType | undefined>(undefined)

const DEFAULT_PRIMARY_COLOR = "#3b55ff" // Corresponds to overthinkr-500
const DEFAULT_FONT_FAMILY: CustomFont = "Inter"
const DEFAULT_FONT_SIZE = 16 // in pixels
const DEFAULT_LINE_HEIGHT = 1.5 // multiplier

export function UICustomizationProvider({ children }: { children: ReactNode }) {
  const [primaryColor, setPrimaryColorState] = useState<CustomColor>(DEFAULT_PRIMARY_COLOR)
  const [fontFamily, setFontFamilyState] = useState<CustomFont>(DEFAULT_FONT_FAMILY)
  const [fontSize, setFontSizeState] = useState<number>(DEFAULT_FONT_SIZE)
  const [lineHeight, setLineHeightState] = useState<number>(DEFAULT_LINE_HEIGHT)

  // Load from localStorage on mount
  useEffect(() => {
    const savedColor = localStorage.getItem("overthinkr-primary-color")
    const savedFont = localStorage.getItem("overthinkr-font-family") as CustomFont
    const savedFontSize = localStorage.getItem("overthinkr-font-size")
    const savedLineHeight = localStorage.getItem("overthinkr-line-height")

    if (savedColor) setPrimaryColorState(savedColor)
    if (savedFont) setFontFamilyState(savedFont)
    if (savedFontSize) setFontSizeState(Number.parseInt(savedFontSize, 10))
    if (savedLineHeight) setLineHeightState(Number.parseFloat(savedLineHeight))
  }, [])

  // Save to localStorage and apply CSS variable when color changes
  const setPrimaryColor = (color: CustomColor) => {
    setPrimaryColorState(color)
    localStorage.setItem("overthinkr-primary-color", color)
    document.documentElement.style.setProperty("--custom-primary-color", color)
  }

  // Save to localStorage and apply CSS variable when font changes
  const setFontFamily = (font: CustomFont) => {
    setFontFamilyState(font)
    localStorage.setItem("overthinkr-font-family", font)
    // This will be handled by the `app/layout.tsx` and `globals.css`
  }

  // Save to localStorage and apply CSS variable when font size changes
  const setFontSize = (size: number) => {
    setFontSizeState(size)
    localStorage.setItem("overthinkr-font-size", size.toString())
    document.documentElement.style.setProperty("--custom-font-size", `${size}px`)
  }

  // Save to localStorage and apply CSS variable when line height changes
  const setLineHeight = (height: number) => {
    setLineHeightState(height)
    localStorage.setItem("overthinkr-line-height", height.toString())
    document.documentElement.style.setProperty("--custom-line-height", height.toString())
  }

  // Apply initial CSS variables on mount
  useEffect(() => {
    document.documentElement.style.setProperty("--custom-primary-color", primaryColor)
    document.documentElement.style.setProperty("--custom-font-size", `${fontSize}px`)
    document.documentElement.style.setProperty("--custom-line-height", lineHeight.toString())
    // Font is handled by Next.js font loader and CSS variables in globals.css
  }, [primaryColor, fontFamily, fontSize, lineHeight])

  return (
    <UICustomizationContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        fontFamily,
        setFontFamily,
        fontSize,
        setFontSize,
        lineHeight,
        setLineHeight,
      }}
    >
      {children}
    </UICustomizationContext.Provider>
  )
}

export function useUICustomization() {
  const context = useContext(UICustomizationContext)
  if (context === undefined) {
    throw new Error("useUICustomization must be used within a UICustomizationProvider")
  }
  return context
}
