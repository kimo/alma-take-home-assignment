"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, SessionProvider } from "next-auth/react";
import { App, ConfigProvider, Spin } from "antd";
import { lightTheme, darkTheme, ThemeContext } from "@/lib/theme";
import Sidebar from "@/components/Sidebar";

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main
        className={`flex-1 p-4 pt-16 lg:p-8 overflow-auto transition-colors ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false);

  return (
    <SessionProvider>
      <ThemeContext.Provider
        value={{ isDark, toggleTheme: () => setIsDark((d) => !d) }}
      >
        <ConfigProvider theme={isDark ? darkTheme : lightTheme}>
          <App>
            <DashboardGuard>{children}</DashboardGuard>
          </App>
        </ConfigProvider>
      </ThemeContext.Provider>
    </SessionProvider>
  );
}
