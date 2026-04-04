// components/ui/StatsCard.tsx
import { ReactNode } from "react";

type StatsCardProps = {
    title: string
    value: string | number
    icon?: ReactNode
    iconColor?: string
    iconBg?: string
    sub?: string
    badgeColor?: "green" | "blue" | "amber" | "red"
}

const badgeStyles = {
    green: "bg-green-50 text-green-700",
    blue:  "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    red:   "bg-red-50 text-red-600",
}

export function StatsCard({ title, value, icon, iconColor, iconBg, sub, badgeColor = "green" }: StatsCardProps) {
    return (
        <div className="w-full bg-white border border-gray-100 rounded-xl p-3 sm:p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                    {title}
                </p>
                {icon && (
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg} ${iconColor}`}>
                        {icon}
                    </div>
                )}
            </div>
            <h1 className="text-xl font-medium text-gray-800 leading-none">
                {value}
            </h1>
            {sub && (
                <div className="border-t border-gray-100 pt-1.5">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeStyles[badgeColor]}`}>
                        {sub}
                    </span>
                </div>
            )}
        </div>
    )
}