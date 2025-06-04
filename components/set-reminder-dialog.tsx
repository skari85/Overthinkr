"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, BellRing } from "lucide-react" // Added BellRing for consistency
import { v4 as uuidv4 } from "uuid" // Assuming uuid is available for unique IDs

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { requestNotificationPermission, saveReminder, type Reminder } from "@/lib/notification-utils"

interface SetReminderDialogProps {
  messageId: string
  initialMessageContent: string
  children: React.ReactNode // To allow triggering from a button/icon
}

export function SetReminderDialog({ messageId, initialMessageContent, children }: SetReminderDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("09:00") // HH:MM format
  const [messageContent, setMessageContent] = useState<string>(initialMessageContent)

  useEffect(() => {
    setMessageContent(initialMessageContent)
  }, [initialMessageContent])

  const handleSaveReminder = async () => {
    if (!selectedDate || !selectedTime || !messageContent) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time and enter a message for your reminder.",
        variant: "destructive",
      })
      return
    }

    // Combine date and time
    const [hours, minutes] = selectedTime.split(":").map(Number)
    const reminderDateTime = new Date(selectedDate)
    reminderDateTime.setHours(hours, minutes, 0, 0)

    // Check if the reminder is in the past
    if (reminderDateTime.getTime() <= Date.now()) {
      toast({
        title: "Invalid Time",
        description: "Please select a future date and time for your reminder.",
        variant: "destructive",
      })
      return
    }

    // 1. Check notification permission
    const permission = Notification.permission

    if (permission === "denied") {
      toast({
        title: "Notification Permission Required",
        description:
          "Please enable browser notifications to use 'Check-in' Reminders. You can do this in your browser settings.",
        variant: "destructive",
      })
      return // Stop the process
    }

    if (permission === "default") {
      const requestedPermission = await requestNotificationPermission()
      if (requestedPermission !== "granted") {
        toast({
          title: "Notification Permission Denied",
          description: "Notification permission was not granted. 'Check-in' Reminders will not function.",
          variant: "destructive",
        })
        return // Stop the process
      }
    }

    // 2. If permission is granted, proceed to save the reminder
    const newReminder: Reminder = {
      id: uuidv4(), // Generate a unique ID
      messageContent,
      timestamp: reminderDateTime.getTime(),
      originalMessageId: messageId,
      setAt: Date.now(),
    }
    saveReminder(newReminder)
    toast({
      title: "Reminder Set!",
      description: `You'll be reminded about "${messageContent}" on ${format(reminderDateTime, "PPP at hh:mm a")}.`,
    })
    setOpen(false) // Close the dialog
    // Reset form fields for next use
    setSelectedDate(undefined)
    setSelectedTime("09:00")
    setMessageContent(initialMessageContent)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Set a Check-in Reminder
          </DialogTitle>
          <DialogDescription>Schedule a notification to remind you about this thought or insight.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Message
            </Label>
            <Textarea
              id="message"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="col-span-3"
              placeholder="What do you want to be reminded about?"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal col-span-3",
                    !selectedDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  disabled={(date) => date < new Date()} // Disable past dates
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <div className="relative col-span-3">
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full"
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveReminder}>
            Set Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
