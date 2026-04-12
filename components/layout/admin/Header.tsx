"use client"
import { usePathname } from "next/navigation";
import { MenuOpen, Menu } from "@mui/icons-material";
import { Notifications } from "@mui/icons-material";

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

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname); 


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

        {/* 👇 Dummy values — replace later with real data */}
        {(() => {
          const notificationCount = 5;
          const avatarUrl = "";        // empty to test initials fallback
          const userName = "John Doe";

          return (
            <>
              {/* Notification Bell */}
              <button className="relative p-2 rounded-full hover:bg-black/5 transition-colors">
                <span className="material-icons text-navy text-[22px]"><Notifications /></span>
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                )}
              </button>

              {/* Avatar */}
              <button className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-brand-green/30 hover:ring-brand-green transition-all flex items-center justify-center bg-brand-green">
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
            </>
          );
        })()}

      </div>
    </header>
  )
}