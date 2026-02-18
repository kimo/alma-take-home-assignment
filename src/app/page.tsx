"use client";

import { ConfigProvider } from "antd";
import { theme } from "@/lib/theme";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <ConfigProvider theme={theme}>
      <main className="min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-[#2d3319] via-[#3a4a1f] to-[#4a5a2a] overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
            <div className="absolute top-8 right-8 w-32 h-32 bg-[#6b8a3f] rounded-full blur-2xl" />
            <div className="absolute top-16 right-24 w-24 h-24 bg-[#8aaa4f] rounded-full blur-xl" />
            <div className="absolute top-4 right-40 w-16 h-16 bg-[#9aba5f] rounded-full blur-lg" />
          </div>

          <div className="relative max-w-2xl mx-auto px-6 py-16 text-center">
            <p className="text-[#a0b878] text-sm tracking-widest uppercase mb-2">
              Assessment
            </p>
            <p className="text-white text-lg font-light tracking-wide mb-4">
              alma
            </p>
            <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight">
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
  );
}
