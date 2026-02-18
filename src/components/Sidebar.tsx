"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TeamOutlined, SettingOutlined } from "@ant-design/icons";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Leads", icon: <TeamOutlined /> },
    { href: "/dashboard/settings", label: "Settings", icon: <SettingOutlined /> },
  ];

  return (
    <aside className="w-[220px] min-h-screen bg-[#c8d9a3] text-gray-900 flex flex-col">
      <div className="px-5 pt-6 pb-4">
        <div className="w-16">
          <img src="/alma-logo.svg" alt="alma" className="w-full h-auto" />
        </div>
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
                  ? "bg-black/10 text-gray-900 font-medium"
                  : "text-gray-700 hover:text-gray-900 hover:bg-black/5"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-black/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-black/15 flex items-center justify-center text-sm font-medium text-gray-800">
            A
          </div>
          <span className="text-sm text-gray-700">Admin</span>
        </div>
      </div>
    </aside>
  );
}
