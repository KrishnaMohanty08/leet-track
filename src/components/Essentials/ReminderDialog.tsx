"use client";

import {
  createReminder,
  updateReminder,
} from "@/app/(main)/dashboard/dashboard-action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Reminder, REMINDER_STATUS } from "@prisma-client";
import { Loader2, Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

// https:\/\/leetcode\.com\/problems\/([^\/]+)
const LEETCODE_URL_MATCHER = /https:\/\/leetcode\.com\/problems\/([^\/]+)/g;

export function AddReminderModal() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [problemSlug, setProblemSlug] = useState<string>();
  const [scheduleDate, setScheduleDate] = useState<string>();
  const { execute, hasErrored, hasSucceeded, isExecuting } =
    useAction(createReminder);

  useEffect(() => {
    if (hasSucceeded) {
      toast.success("Successfully created reminder");
      setIsDialogOpen(false);
    }

    if (hasErrored) {
      toast.error("Error creating reminder");
    }
  }, [hasSucceeded, hasErrored]);

  return (
    <Dialog open={isDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between">
          <Button
            className=" bg-[#f3f4f6] cursor-pointer flex items-center gap-2 text-gray-800 shadow-md border border-[#e5e7eb]  hover:bg-[#e0e7ff] "
            onClick={() => {
              setIsDialogOpen(true);
            }}
          >
            <Plus /> Add Reminder
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Reminder</DialogTitle>
          <DialogDescription>
            Add a new reminder to your list!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="problem-link">Problem Link</Label>
            <Input
              id="problem-link"
              name="Problem Link"
              placeholder="https://leetcode.com/problems/..."
              onChange={(e) => {
                const url = e.target.value;
                if (!url) {
                  setProblemSlug(undefined);
                  return;
                }
                if (!url.match(LEETCODE_URL_MATCHER)) {
                  toast.error("Invalid problem link", {
                    duration: 1000,
                  });
                  return;
                }
                setProblemSlug(LEETCODE_URL_MATCHER.exec(url)?.[1]);
              }}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="schedule-date">Schedule Date</Label>
            <Input
              id="schedule-date"
              name="schedule-date"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="dark:[color-scheme:dark]"
              onChange={(e) => {
                const date = new Date(e.target.value);
                const yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                if (date < yesterdayDate) {
                  toast.error("Schedule date cannot be in the past");
                  setScheduleDate("");
                  return;
                }
                setScheduleDate(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={isExecuting}
            onClick={() => {
              setIsDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!problemSlug || !scheduleDate || isExecuting}
            type="submit"
            onClick={() => {
              if (problemSlug && scheduleDate) {
                execute({
                  problemSlug,
                  scheduledDate: new Date(scheduleDate),
                });
              }
            }}
          >
            {!isExecuting ? "Add" : <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditReminderModal({
  reminder,
  isDialogOpen,
  setIsDialogOpen,
  setSelectedReminder,
}: {
  reminder: Reminder;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  setSelectedReminder: Dispatch<SetStateAction<Reminder | undefined>>;
}) {
  const [problemSlug, setProblemSlug] = useState<string | undefined>(
    reminder.problemSlug,
  );
  const [scheduleDate, setScheduleDate] = useState<string | undefined>(
    reminder.scheduledDate.toISOString(),
  );
  const [reminderStatus, setReminderStatus] = useState<REMINDER_STATUS>(
    reminder.reminderStatus,
  );
  const { execute, hasErrored, hasSucceeded, isExecuting } =
    useAction(updateReminder);

  useEffect(() => {
    if (hasSucceeded) {
      toast.success("Successfully updated reminder");
      setSelectedReminder(undefined)
      setIsDialogOpen(false);
    }

    if (hasErrored) {
      toast.error("Error updating reminder");
    }
  }, [hasSucceeded, hasErrored]);

  return (
    <Dialog open={isDialogOpen}>
      <DialogContent showCloseButton={false} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Reminder</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="problem-link">Problem Link</Label>
            <Input
              id="problem-link"
              name="Problem Link"
              placeholder="https://leetcode.com/problems/..."
              defaultValue={"https://leetcode.com/problems/" + problemSlug}
              onChange={(e) => {
                const url = e.target.value;
                if (!url) {
                  setProblemSlug(undefined);
                  return;
                }
                if (!url.match(LEETCODE_URL_MATCHER)) {
                  toast.error("Invalid problem link", {
                    duration: 1000,
                  });
                  return;
                }
                setProblemSlug(LEETCODE_URL_MATCHER.exec(url)?.[1]);
              }}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="schedule-date">Schedule Date</Label>
            <Input
              min={new Date().toISOString().substring(0, 10)}
              defaultValue={scheduleDate?.substring(0, 10)}
              id="schedule-date"
              name="schedule-date"
              type="date"
              onChange={(e) => {
                const date = new Date(e.target.value);
                const yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                if (date < yesterdayDate) {
                  toast.error("Schedule date cannot be in the past");
                  setScheduleDate("");
                  return;
                }
                setScheduleDate(e.target.value);
              }}
            />
          </div>
          <div className="grid gap-3">
            {/* <Label htmlFor="reminder-status">Reminder Status</Label>
            <Input id="reminder-status" name="Problem Link" /> */}
            <Label htmlFor="reminder-status">Reminder Status</Label>
            <Select
              name="reminder-status"
              defaultValue={reminderStatus}
              autoComplete="on"
              onValueChange={(v) => {
                setReminderStatus(v as REMINDER_STATUS);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select reminder status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={isExecuting}
            onClick={() => {
              setSelectedReminder(undefined)
              setIsDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!problemSlug || !scheduleDate || isExecuting}
            type="submit"
            onClick={() => {
              if (problemSlug && scheduleDate) {
                execute({
                  reminderId: reminder.id,
                  problemSlug: problemSlug,
                  scheduledDate: new Date(scheduleDate),
                  reminderStatus: reminderStatus,
                });
              }
            }}
          >
            {!isExecuting ? "Update" : <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
