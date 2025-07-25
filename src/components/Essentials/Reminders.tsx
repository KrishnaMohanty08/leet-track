"use client";

import { Reminder } from "@prisma-client";
import { AlertTriangle, CalendarDays, CheckCircle, Clock } from "lucide-react";
import * as React from "react";

type ReminderStats = {
  "Total Reminders": number;
  "Upcoming Reminders": number;
  "Completed Questions": number;
  "Missed Reminders": number;
};

const iconMap: Record<
  keyof ReminderStats,
  { icon: React.ReactNode; color: string }
> = {
  "Total Reminders": {
    icon: <CalendarDays className="text-blue-500" size={19} />,
    color: "text-blue-500",
  },
  "Upcoming Reminders": {
    icon: <Clock className="text-orange-500" size={19} />,
    color: "text-orange-500",
  },
  "Completed Questions": {
    icon: <CheckCircle className="text-green-500" size={19} />,
    color: "text-green-500",
  },
  "Missed Reminders": {
    icon: <AlertTriangle className="text-red-500" size={19} />,
    color: "text-red-500",
  },
};

const Reminders = ({ reminders }: { reminders: Reminder[] }) => {
  const reminderData: ReminderStats = {
    "Total Reminders": reminders.length,
    "Upcoming Reminders": reminders.filter(
      (r) => r.reminderStatus === "UPCOMING"
    ).length,
    "Completed Questions": reminders.filter(
      (r) => r.reminderStatus === "COMPLETED"
    ).length,
    "Missed Reminders": reminders.filter(
      (r) => r.reminderStatus === "PENDING"
    ).length,
  };

  return (
    <div className="w-full  grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(reminderData).map(([label, value]) => {
        const { icon } = iconMap[label as keyof ReminderStats];
        return (
          <div
            key={label}
            className="w-full min-h-24 p-4 rounded-lg border border-[#e5e7eb] dark:border-[#818cf8] shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-[#6b7280] whitespace-nowrap">{label}</h3>
              <span className="ml-2">{icon}</span>
            </div>
            <p className="text-2xl font-semibold text-gray-800">{value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Reminders;
