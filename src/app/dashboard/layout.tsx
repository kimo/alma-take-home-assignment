"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App, ConfigProvider, Spin } from "antd";
import { lightTheme, darkTheme } from "@/lib/theme";
import { makeStore, type AppStore } from "@/lib/redux/store";
import { useAppSelector } from "@/lib/redux/hooks";
import Sidebar from "@/components/Sidebar";

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const isDark = useAppSelector((state) => state.theme.isDark);

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

function ThemedDashboard({ children }: { children: React.ReactNode }) {
  const isDark = useAppSelector((state) => state.theme.isDark);

  return (
    <ConfigProvider theme={isDark ? darkTheme : lightTheme}>
      <App>
        <DashboardGuard>{children}</DashboardGuard>
      </App>
    </ConfigProvider>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState<AppStore>(() => makeStore());

  return (
    <SessionProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemedDashboard>{children}</ThemedDashboard>
        </QueryClientProvider>
      </Provider>
    </SessionProvider>
  );
}
