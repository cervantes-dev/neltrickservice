import { Card } from "../ui/Card";
import { ReactNode } from "react";

type StatsCardProps = {
  title: string,
  value: string | number,
  icon?: ReactNode
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="w-full bg-white border border-brand-green/15 rounded-2xl shadow-sm p-4 sm:p-5 flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          {title}
        </p>
        <h1 className="text-2xl font-medium text-gray-800">
          {value}
        </h1>
      </div>
      <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green">
        {icon}
      </div>
    </div>

  )
}