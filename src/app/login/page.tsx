"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ConfigProvider, Form, Input, Button, message } from "antd";
import { theme } from "@/lib/theme";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      message.error("Invalid credentials");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <ConfigProvider theme={theme}>
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="text-2xl font-light tracking-wide mb-2">alma</p>
            <h1 className="text-xl font-semibold text-gray-900">Sign In</h1>
          </div>

          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Email is required" }]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                className="!rounded-full !h-12"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </div>
      </main>
    </ConfigProvider>
  );
}
