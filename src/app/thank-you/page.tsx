"use client";

import { ConfigProvider, Button } from "antd";

import { theme } from "@/lib/theme";
import Link from "next/link";

export default function ThankYou() {
  return (
    <ConfigProvider theme={theme}>
      <main className="min-h-screen bg-white px-6">
        <div className="flex justify-center pt-24">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "perspective(150px) rotateY(30deg)", filter: "drop-shadow(2px 4px 6px rgba(99, 102, 241, 0.4))" }}>
              <defs>
                <linearGradient id="file3d" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a5b4fc"/>
                  <stop offset="30%" stopColor="#818cf8"/>
                  <stop offset="70%" stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#4338ca"/>
                </linearGradient>
              </defs>
              <path d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" fill="url(#file3d)"/>
              <path d="M14 2l6 6h-4a2 2 0 01-2-2V2z" fill="#c7d2fe" opacity="0.6"/>
              <path d="M4 4a2 2 0 012-2h5v10L4 8V4z" fill="#c7d2fe" opacity="0.15"/>
              <circle cx="12" cy="11" r="1.3" fill="white"/>
              <rect x="10.8" y="13.5" width="2.4" height="5" rx="1.2" fill="white"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You</h1>
          <p className="text-gray-500 text-base mb-8">
            Your information was submitted to our team of immigration
            attorneys. Expect an email from{" "}
            <span className="font-medium text-gray-700">hello@tryalma.ai</span>
          </p>
          <Link href="/">
            <Button
              type="primary"
              size="large"
              className="!rounded-lg !px-12 !h-12 !text-base !font-medium"
            >
              Go Back to Homepage
            </Button>
          </Link>
        </div>
        </div>
      </main>
    </ConfigProvider>
  );
}
