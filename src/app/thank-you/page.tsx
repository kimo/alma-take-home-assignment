"use client";

import { ConfigProvider, Button } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { theme } from "@/lib/theme";
import Link from "next/link";

export default function ThankYou() {
  return (
    <ConfigProvider theme={theme}>
      <main className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center max-w-md">
          <CheckCircleFilled className="text-6xl text-[#6366f1] mb-6" />
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
              className="!rounded-full !px-12 !h-12 !text-base !font-medium"
            >
              Go Back to Homepage
            </Button>
          </Link>
        </div>
      </main>
    </ConfigProvider>
  );
}
