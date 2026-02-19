"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TeamOutlined, SettingOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Switch } from "antd";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { toggleTheme } from "@/lib/redux/themeSlice";

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isDark = useAppSelector((state) => state.theme.isDark);
  const dispatch = useAppDispatch();

  const navItems = [
    { href: "/dashboard", label: "Leads", icon: <TeamOutlined /> },
    { href: "/dashboard/settings", label: "Settings", icon: <SettingOutlined /> },
  ];

  const sidebarContent = (
    <>
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="w-16">
          <Image src="/alma-logo.svg" alt="alma" width={80} height={24} className="w-full h-auto" />
        </div>
        <button
          className="lg:hidden text-gray-700 text-xl"
          onClick={() => setOpen(false)}
        >
          <CloseOutlined />
        </button>
      </div>

      <nav className="flex-1 px-3 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
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

      <div className="px-5 py-3 border-t border-black/10">
        <div className="flex items-center gap-2">
          <Switch size="small" checked={isDark} onChange={() => dispatch(toggleTheme())} />
          <span className="text-xs text-gray-600">
            {isDark ? "Dark" : "Light"}
          </span>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-black/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-black/15 flex items-center justify-center text-sm font-medium text-gray-800">
            A
          </div>
          <span className="text-sm text-gray-700">Admin</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#c8d9a3] px-4 py-3 flex items-center gap-3">
        <button onClick={() => setOpen(true)} className="text-gray-900 text-lg">
          <MenuOutlined />
        </button>
        <div className="w-14">
          <Image src="/alma-logo.svg" alt="alma" width={80} height={24} className="w-full h-auto" />
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile slide-out sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-[220px] bg-[#c8d9a3] text-gray-900 flex flex-col z-50 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[220px] h-full bg-[#c8d9a3] text-gray-900 flex-col shrink-0">
        {sidebarContent}
      </aside>
    </>
  );
}
