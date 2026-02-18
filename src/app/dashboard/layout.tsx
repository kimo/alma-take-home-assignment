"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, SessionProvider } from "next-auth/react";
import { ConfigProvider, Spin } from "antd";
import { theme } from "@/lib/theme";
import Sidebar from "@/components/Sidebar";

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      setChecked(true);
    }
  }, [status, router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-4 pt-16 lg:p-8">{children}</main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ConfigProvider theme={theme}>
        <DashboardGuard>{children}</DashboardGuard>
      </ConfigProvider>
    </SessionProvider>
  );
}
