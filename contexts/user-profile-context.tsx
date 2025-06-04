"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type AvatarOption =
  | "default"
  | "robot"
  | "person"
  | "abstract"
  | "cat"
  | "dog"
  | "human-1" // New: Curly-haired person
  | "human-2" // New: Red-haired woman
  | "human-3" // New: White-haired man
  | "human-4" // New: Technologist woman
  | "human-5" // New: Farmer man
  | "human-6" // New: Singer woman

interface UserProfileContextType {
  nickname: string
  setNickname: (name: string) => void
  avatar: AvatarOption
  setAvatar: (option: AvatarOption) => void
  getAvatarSrc: () => string
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

const DEFAULT_NICKNAME = "You"
const DEFAULT_AVATAR: AvatarOption = "default"

// Mapping for avatar options to placeholder SVG URLs
const avatarSrcMap: Record<AvatarOption, string> = {
  default: "/placeholder.svg?height=32&width=32", // Generic placeholder
  robot: "/placeholder.svg?height=32&width=32&text=🤖",
  person: "/placeholder.svg?height=32&width=32&text=👤",
  abstract: "/placeholder.svg?height=32&width=32&text=✨",
  cat: "/placeholder.svg?height=32&width=32&text=🐱",
  dog: "/placeholder.svg?height=32&width=32&text=🐶",
  "human-1": "/placeholder.svg?height=32&width=32&text=🧑‍🦱", // Curly-haired person
  "human-2": "/placeholder.svg?height=32&width=32&text=👩‍🦰", // Red-haired woman
  "human-3": "/placeholder.svg?height=32&width=32&text=👨‍🦳", // White-haired man
  "human-4": "/placeholder.svg?height=32&width=32&text=👩‍💻", // Technologist woman
  "human-5": "/placeholder.svg?height=32&width=32&text=👨‍🌾", // Farmer man
  "human-6": "/placeholder.svg?height=32&width=32&text=👩‍🎤", // Singer woman
}

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [nickname, setNicknameState] = useState<string>(DEFAULT_NICKNAME)
  const [avatar, setAvatarState] = useState<AvatarOption>(DEFAULT_AVATAR)

  // Load from localStorage on mount
  useEffect(() => {
    const savedNickname = localStorage.getItem("overthinkr-nickname")
    const savedAvatar = localStorage.getItem("overthinkr-avatar") as AvatarOption

    if (savedNickname) setNicknameState(savedNickname)
    if (savedAvatar && avatarSrcMap[savedAvatar]) setAvatarState(savedAvatar)
  }, [])

  // Save to localStorage when values change
  const setNickname = (name: string) => {
    setNicknameState(name)
    localStorage.setItem("overthinkr-nickname", name)
  }

  const setAvatar = (option: AvatarOption) => {
    setAvatarState(option)
    localStorage.setItem("overthinkr-avatar", option)
  }

  const getAvatarSrc = () => {
    return avatarSrcMap[avatar] || avatarSrcMap.default
  }

  return (
    <UserProfileContext.Provider
      value={{
        nickname,
        setNickname,
        avatar,
        setAvatar,
        getAvatarSrc,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider")
  }
  return context
}
