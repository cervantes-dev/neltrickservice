"use client"
import { useState } from "react"
import { usePathname } from "next/navigation";
import { MenuOpen, Menu, Notifications } from "@mui/icons-material";
import { LogoutButton } from "@/components/actions/LogoutButton";

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/trips": "Trips",
  "/booking-record": "Booking",
  "/booking-record/create": "Create Booking",
  "/tracking": "Tracking",
  "/customers": "Customers",
  "/users": "Users",
  "/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/booking-record/")) return "Booking Details";
  if (pathname.startsWith("/shipments/")) return "Shipment Details";
  if (pathname.startsWith("/customers/")) return "Customer Details";
  return "Dashboard";
}

export function Navbar({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const notificationCount = 5;
  const avatarUrl = "";
  const userName = "John Doe";

  return (
    <header className="h-15 bg-primary border-b border-border flex items-center justify-between px-4 md:px-6 shadow-sm sticky top-0 z-30">

      {/* Left — Menu + Title */}
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <MenuOpen /> : <Menu />}
        </button>
        <span className="font-heading font-semibold text-navy">{title}</span>
      </div>

      {/* Right — Notifications + Avatar */}
      <div className="flex items-center gap-3">

        {/* Notification Bell */}
        <button className="relative p-2 rounded-full hover:bg-black/5 transition-colors">
          <span className="material-icons text-navy text-[22px]"><Notifications /></span>
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 min-w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>

        {/* Avatar + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-brand-green/30 hover:ring-brand-green transition-all flex items-center justify-center bg-brand-green"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            ) : (
              <span className="text-white font-bold text-sm">
                {userName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-border z-50">

              {/* User info */}
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-semibold text-navy truncate">{userName}</p>
              </div>

              {/* Logout */}
              {/* Logout */}
              <div className="px-2 py-1">
                <LogoutButton />
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}