"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, BellRing } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { saveReminder, requestNotificationPermission } from "@/lib/notification-utils"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid" // For unique IDs

interface SetReminderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messageContent: string
  messageId: string
}

export function SetReminderDialog({ open, onOpenChange, messageContent, messageId }: SetReminderDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState("09:00") // HH:MM format
  const [preset, setPreset] = useState<string>("custom")

  const handlePresetChange = (value: string) => {
    setPreset(value)
    const now = new Date()
    let newDate = new Date(now)

    switch (value) {
      case "1h":
        newDate.setHours(now.getHours() + 1)
        break
      case "1d":
        newDate.setDate(now.getDate() + 1)
        break
      case "1w":
        newDate.setDate(now.getDate() + 7)
        break
      case "custom":
      default:
        // Keep current date/time or reset to now
        newDate = new Date()
        break
    }
    setDate(newDate)
    setTime(format(newDate, "HH:mm"))
  }

  const handleSetReminder = async () => {
    const permission = await requestNotificationPermission()
    if (permission !== "granted") {
      toast({
        title: "Notification Permission Required",
        description: "Please grant notification permission to set reminders.",
        variant: "destructive",
      })
      return
    }

    if (!date || !time) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and time for the reminder.",
        variant: "destructive",
      })
      return
    }

    const [hours, minutes] = time.split(":").map(Number)
    const reminderDateTime = new Date(date)
    reminderDateTime.setHours(hours, minutes, 0, 0)

    if (reminderDateTime.getTime() <= Date.now()) {
      toast({
        title: "Invalid Time",
        description: "Reminder time must be in the future.",
        variant: "destructive",
      })
      return
    }

    const newReminder = {
      id: uuidv4(),
      messageContent: messageContent,
      timestamp: reminderDateTime.getTime(),
      originalMessageId: messageId,
      setAt: Date.now(),
    }

    saveReminder(newReminder)
    toast({
      title: "Reminder Set!",
      description: `You'll be reminded about this insight on ${format(reminderDateTime, "PPP 'at' p")}.`,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Set a Reminder
          </DialogTitle>
          <DialogDescription>Get a notification to revisit this insight later.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="preset-time">Quick Presets</Label>
            <Select value={preset} onValueChange={handlePresetChange}>
              <SelectTrigger id="preset-time">
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Date & Time</SelectItem>
                <SelectItem value="1h">In 1 Hour</SelectItem>
                <SelectItem value="1d">In 1 Day</SelectItem>
                <SelectItem value="1w">In 1 Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {preset === "custom" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSetReminder} variant="customPrimary">
            Set Reminder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
