"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUICustomization, type CustomFont } from "@/contexts/ui-customization-context"
import { Palette } from "lucide-react"

export default function CustomizePageClient() {
  const { primaryColor, setPrimaryColor, fontFamily, setFontFamily } = useUICustomization()

  const availableFonts: CustomFont[] = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Merriweather",
    "Roboto Mono",
  ]

  return (
    <div className="container mx-auto py-6 px-4 md:py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Customize Your UI
            </CardTitle>
            <CardDescription>Personalize the look and feel of Overthinkr to your preference.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            {/* Primary Color Customization */}
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Accent Color</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-10 p-0 border-none cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1"
                  placeholder="#RRGGBB"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                This color will be used for user chat bubbles, primary buttons, and accents.
              </p>
            </div>

            {/* Font Family Customization */}
            <div className="space-y-2">
              <Label htmlFor="font-family">Font Family</Label>
              <Select value={fontFamily} onValueChange={(value: CustomFont) => setFontFamily(value)}>
                <SelectTrigger id="font-family">
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {availableFonts.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Choose a font that suits your reading preference.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
