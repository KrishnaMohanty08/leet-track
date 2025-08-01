"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type MonthNavigatorProps = {
  currentDate: Date;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
};

export default function MonthNavigator({
  currentDate,
  goToPreviousMonth,
  goToNextMonth,
}: MonthNavigatorProps) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousMonth}
        className="hover:bg-[#e0e7ff] dark:bg-[#6366f1] transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <span className="text-lg font-medium w-28 text-center dark:text-black">
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
      </span>

      <Button
        variant="outline"
        size="icon"
        onClick={goToNextMonth}
        className="hover:bg-[#e0e7ff] dark:bg-[#6366f1] transition-colors cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
