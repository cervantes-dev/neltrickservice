"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NeltrickLogo, NeltrickIcon } from "@/components/Logo"
import {
  Dashboard,
  DirectionsBoat,
  Mail,
  ManageAccounts,
  Settings,
  BookOnline,
  BarChart,
  People,
  Receipt,
  Map,
} from "@mui/icons-material";

interface SidebarProps {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
}

const navItems = [
  { href: "/dashboard",  icon: <Dashboard      sx={{ fontSize: 18 }} />, label: "Dashboard"  },
  { href: "/trips",         icon: <DirectionsBoat sx={{ fontSize: 18 }} />, label: "Trips"      },
  { href: "/booking-record",    icon: <BookOnline      sx={{ fontSize: 18 }} />, label: "Booking"    },
  { href: "/tracking",   icon: <Map   sx={{ fontSize: 18 }} />, label: "Tracking"   },
  { href: "/customers",  icon: <People          sx={{ fontSize: 18 }} />, label: "Customers"  },
  { href: "/invoices",   icon: <Receipt         sx={{ fontSize: 18 }} />, label: "Invoices"   },
  { href: "/reports",    icon: <BarChart        sx={{ fontSize: 18 }} />, label: "Reports"    },
  { href: "/inbox",      icon: <Mail            sx={{ fontSize: 18 }} />, label: "Messages"   },
  { href: "/users",      icon: <ManageAccounts  sx={{ fontSize: 18 }} />, label: "Users"      },
  { href: "/settings",   icon: <Settings        sx={{ fontSize: 18 }} />, label: "Settings"   },
];
export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={`
                fixed inset-y-0 left-0 flex flex-col
                w-60 bg-sidebar z-50
                transition-all duration-300
                ${sidebarOpen ? "translate-x-0 " : "-translate-x-full"}  
                lg:relative lg:inset-auto lg:translate-x-0
                ${sidebarOpen ? "lg:w-60" : "lg:w-16"}
        `}>

            {/* Logo lives here now */}
            <div className={`h-15 flex items-center border-b border-sidebar-border
                ${sidebarOpen ? "px-6" : "justify-center"}  // 👈 center instead of padding
                `}>
                {sidebarOpen
                    ? <NeltrickIcon width={140} height={42} />
                    : <NeltrickLogo size={40} />
                }
            </div>

            <nav className="flex flex-col gap-1 p-2 flex-1 font-body font-bold">
                {navItems.map(({ href, icon, label }) => {
                   const isActive = pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center rounded-lg text-sm transition-colors
                                ${sidebarOpen ? "gap-3 px-3" : "justify-center px-0"}  
                                ${isActive ? "bg-brand-green/20 text-brand-green" : "text-navy hover:bg-brand-green/20 hover:text-brand-green"}
                                py-2 font-medium`}
                        >
                            {/* Icon */}
                            <span className="flex items-center justify-center text-[18px]">
                                {icon}
                            </span>

                            {/* Label */}
                            {sidebarOpen && (
                                <span className="text-sm leading-5">{label}</span> // Inter, 500 weight
                            )}
                        </Link>
                    );
                })}
            </nav>

            {sidebarOpen && (
                <div className="p-4 border-t border-sidebar-border flex items-center gap-3 font-body">
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white font-medium text-sm">
                        J
                    </div>

                    {/* User Name */}
                    <p className="text-sm text-navy font-medium leading-5">John Doe</p>
                </div>
            )}

        </aside>
    )
}