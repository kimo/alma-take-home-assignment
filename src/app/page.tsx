"use client";

import { ConfigProvider, Button } from "antd";
import { theme } from "@/lib/theme";

export default function Home() {
  return (
    <ConfigProvider theme={theme}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Alma — Lead Form</h1>
          <p className="text-gray-500 mb-4">Phase 1 setup complete. Form coming in Phase 3.</p>
          <Button type="primary" size="large">
            Submit
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
}
