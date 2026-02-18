"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserOutlined, TeamOutlined, SettingOutlined } from "@ant-design/icons";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Leads", icon: <TeamOutlined /> },
    { href: "/dashboard/settings", label: "Settings", icon: <SettingOutlined /> },
  ];

  return (
    <aside className="w-[220px] min-h-screen bg-[#1a1a2e] text-white flex flex-col">
      <div className="px-5 pt-6 pb-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
          Admin View
        </p>
        <p className="text-xl font-light tracking-wide">alma</p>
      </div>

      <nav className="flex-1 px-3 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm">
            <UserOutlined />
          </div>
          <span className="text-sm text-gray-300">Admin</span>
        </div>
      </div>
    </aside>
  );
}
