"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type CustomColor = string // Hex color string
export type CustomFont = "Inter" | "Roboto" | "Open Sans" | "Lato" | "Montserrat" | "Merriweather" | "Roboto Mono"

interface UICustomizationContextType {
  primaryColor: CustomColor
  setPrimaryColor: (color: CustomColor) => void
  fontFamily: CustomFont
  setFontFamily: (font: CustomFont) => void
}

const UICustomizationContext = createContext<UICustomizationContextType | undefined>(undefined)

const DEFAULT_PRIMARY_COLOR = "#3b55ff" // Corresponds to overthinkr-500
const DEFAULT_FONT_FAMILY: CustomFont = "Inter"

export function UICustomizationProvider({ children }: { children: ReactNode }) {
  const [primaryColor, setPrimaryColorState] = useState<CustomColor>(DEFAULT_PRIMARY_COLOR)
  const [fontFamily, setFontFamilyState] = useState<CustomFont>(DEFAULT_FONT_FAMILY)

  // Load from localStorage on mount
  useEffect(() => {
    const savedColor = localStorage.getItem("overthinkr-primary-color")
    const savedFont = localStorage.getItem("overthinkr-font-family") as CustomFont

    if (savedColor) setPrimaryColorState(savedColor)
    if (savedFont) setFontFamilyState(savedFont)
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

  // Apply initial CSS variables on mount
  useEffect(() => {
    document.documentElement.style.setProperty("--custom-primary-color", primaryColor)
    // Font is handled by Next.js font loader and CSS variables in globals.css
  }, [primaryColor, fontFamily])

  return (
    <UICustomizationContext.Provider
      value={{
        primaryColor,
        setPrimaryColor,
        fontFamily,
        setFontFamily,
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
