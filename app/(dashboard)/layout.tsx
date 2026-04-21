"use client"
import { useState } from "react"
import {Toaster} from "sileo";
import { Navbar } from "@/components/layout/admin/Navbar"
import { Sidebar } from "@/components/layout/admin/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div className="min-h-screen bg-primary flex overflow-hidden relative">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex flex-col flex-1 min-w-0 lg:ml-0">
                <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <Toaster  />
                <main className="overflow-y-auto flex-1 bg-bg-primary p-4 md:p-6">
                    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 w-full">
                        {children}
                    </div>
                </main>
            </div>

        </div>
    )
}