"use client";

import Image from "next/image";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "@/lib/theme";
import LeadForm from "@/components/LeadForm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <main className="min-h-screen">
          {/* Hero Section */}
          <div
            className="relative bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: "url('/hero-bg.png')" }}
          >
            <div className="relative mx-auto pl-24 pr-6 md:px-6 py-12 md:py-16" style={{ maxWidth: 480 }}>
              <div className="mb-4 w-16 md:w-20">
                <Image src="/alma-logo.svg" alt="alma" width={80} height={24} className="w-full h-auto" />
              </div>
              <h1 className="text-black text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                Get An Assessment
                <br />
                Of Your Immigration Case
              </h1>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white py-12 px-6">
            <LeadForm />
          </div>
        </main>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
