"use client";

import { useContext } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { ThemeContext } from "@/lib/theme";

export default function SettingsPage() {
  const { isDark } = useContext(ThemeContext);

  return (
    <div>
      <h1 className={`text-2xl font-bold mb-6 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
        Settings
      </h1>
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <SettingOutlined className="text-4xl mb-4" />
        <p className="text-lg">Settings coming soon</p>
      </div>
    </div>
  );
}
