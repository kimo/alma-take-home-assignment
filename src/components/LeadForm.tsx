"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Upload,
  Button,
  message,
} from "antd";
import {
  InboxOutlined,
} from "@ant-design/icons";
import { leadFormSchema, VISA_OPTIONS, COUNTRIES } from "@/lib/schema";

const { TextArea } = Input;
const { Dragger } = Upload;

export default function LeadForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: Record<string, unknown>) => {
    // Validate with Zod
    const result = leadFormSchema.safeParse(values);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      Object.entries(errors).forEach(([field, msgs]) => {
        if (msgs && msgs.length > 0) {
          form.setFields([{ name: field, errors: msgs }]);
        }
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("firstName", result.data.firstName);
      formData.append("lastName", result.data.lastName);
      formData.append("email", result.data.email);
      formData.append("country", (values.country as string) || "");
      formData.append("linkedIn", result.data.linkedIn);
      formData.append("visaInterests", JSON.stringify(result.data.visaInterests));
      formData.append("helpMessage", result.data.helpMessage);

      // Attach file if present
      const fileList = values.resume as { fileList?: { originFileObj?: File }[] };
      if (fileList?.fileList?.[0]?.originFileObj) {
        formData.append("resume", fileList.fileList[0].originFileObj);
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        message.error(data.error || "Something went wrong");
        return;
      }

      router.push("/thank-you");
    } catch {
      message.error("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className="w-full max-w-[480px] mx-auto"
    >
      {/* Section 1: Personal Info */}
      <div className="mb-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#6366f1]/10 flex items-center justify-center mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Want to understand your visa options?
          </h2>
          <p className="text-gray-500 text-sm">
            Submit the form below and our team of experienced attorneys will
            review your information and send a preliminary assessment of your
            case based on your goals.
          </p>
        </div>

        <Form.Item
          name="firstName"
          rules={[{ required: true, message: "First name is required" }]}
        >
          <Input placeholder="First Name" size="large" />
        </Form.Item>

        <Form.Item
          name="lastName"
          rules={[{ required: true, message: "Last name is required" }]}
        >
          <Input placeholder="Last Name" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="country"
          rules={[{ required: true, message: "Country is required" }]}
        >
          <Select
            placeholder="Country of Citizenship"
            size="large"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={COUNTRIES.map((c) => ({ value: c, label: c }))}
          />
        </Form.Item>

        <Form.Item
          name="linkedIn"
          rules={[
            { required: true, message: "LinkedIn / Website URL is required" },
            { type: "url", message: "Please enter a valid URL" },
          ]}
        >
          <Input placeholder="LinkedIn / Personal Website URL" size="large" />
        </Form.Item>
      </div>

      {/* Section 2: Visa Interest */}
      <div className="mb-8">
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-[#6366f1]/10 flex items-center justify-center mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Visa categories of interest?
          </h2>
        </div>

        <Form.Item
          name="visaInterests"
          rules={[
            {
              required: true,
              message: "Please select at least one visa category",
            },
          ]}
        >
          <Checkbox.Group className="flex flex-col gap-3">
            {VISA_OPTIONS.map((visa) => (
              <Checkbox key={visa} value={visa} className="text-base">
                {visa}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </div>

      {/* Section 2.5: Resume Upload */}
      <div className="mb-8">
        <Form.Item
          name="resume"
          valuePropName="file"
        >
          <Dragger
            beforeUpload={() => false}
            maxCount={1}
            accept=".pdf,.doc,.docx"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Upload your resume / CV</p>
            <p className="ant-upload-hint">
              PDF, DOC, or DOCX files only
            </p>
          </Dragger>
        </Form.Item>
      </div>

      {/* Section 3: How can we help */}
      <div className="mb-8">
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-[#6366f1]/10 flex items-center justify-center mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            How can we help you?
          </h2>
        </div>

        <Form.Item
          name="helpMessage"
          rules={[
            { required: true, message: "Please tell us how we can help" },
          ]}
        >
          <TextArea
            rows={5}
            placeholder="What are you hoping to achieve with your immigration case?"
            size="large"
          />
        </Form.Item>
      </div>

      {/* Submit Button */}
      <Form.Item className="text-center">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          className="!rounded-full !px-12 !h-12 !text-base !font-medium"
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
