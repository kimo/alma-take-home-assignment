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
          {/* Decorative 3D shapes — right side */}
          <div className="absolute top-0 right-0 w-80 h-full">
            <div className="absolute top-6 right-12 w-40 h-40 bg-[#8aaa4f] rounded-[40%_60%_60%_40%] rotate-[-20deg] opacity-60 blur-sm" />
            <div className="absolute top-20 right-28 w-32 h-32 bg-[#a0c45a] rounded-[50%_50%_40%_60%] rotate-[15deg] opacity-50 blur-sm" />
            <div className="absolute top-2 right-48 w-24 h-24 bg-[#c0d88a] rounded-[45%_55%_50%_50%] rotate-[-10deg] opacity-40" />
          </div>

          <div className="relative max-w-2xl mx-auto px-6 py-16">
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
