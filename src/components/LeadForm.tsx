"use client";

import { useState, useEffect } from "react";
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
  const [countries, setCountries] = useState<string[]>([...COUNTRIES]);
  const router = useRouter();

  // Fetch config-driven country list (falls back to hardcoded COUNTRIES)
  useEffect(() => {
    fetch("/api/form-config")
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed");
        return res.json();
      })
      .then((schema) => {
        const countryEnum = schema?.properties?.country?.enum;
        if (Array.isArray(countryEnum) && countryEnum.length > 0) {
          setCountries(countryEnum);
        }
      })
      .catch(() => {});
  }, []);

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
    <div className="flex justify-center">
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      style={{ width: "100%", maxWidth: 480 }}
    >
      {/* Section 1: Personal Info */}
      <div className="mb-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "perspective(150px) rotateY(30deg)", filter: "drop-shadow(2px 4px 6px rgba(99, 102, 241, 0.4))" }}>
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Want to understand your visa options?
          </h2>
          <p className="text-gray-900 text-sm font-semibold">
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
            options={countries.map((c) => ({ value: c, label: c }))}
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
          <div className="mb-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "perspective(150px) rotateY(30deg)", filter: "drop-shadow(2px 4px 6px rgba(99, 102, 241, 0.4))" }}>
              <defs>
                <linearGradient id="dice3d" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a5b4fc"/>
                  <stop offset="30%" stopColor="#818cf8"/>
                  <stop offset="70%" stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#4338ca"/>
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="3" fill="url(#dice3d)"/>
              <rect x="2" y="2" width="10" height="20" rx="3" fill="#c7d2fe" opacity="0.2"/>
              <circle cx="7.5" cy="7.5" r="1.8" fill="white"/>
              <circle cx="16.5" cy="7.5" r="1.8" fill="white"/>
              <circle cx="12" cy="12" r="1.8" fill="white"/>
              <circle cx="7.5" cy="16.5" r="1.8" fill="white"/>
              <circle cx="16.5" cy="16.5" r="1.8" fill="white"/>
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

      {/* Section 3: How can we help */}
      <div className="mb-8">
        <div className="flex flex-col items-center text-center mb-4">
          <div className="mb-3">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "perspective(120px) rotateY(30deg) rotateX(-5deg)", filter: "drop-shadow(3px 4px 6px rgba(99, 102, 241, 0.45))" }}>
              <defs>
                <linearGradient id="heart3d" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a5b4fc"/>
                  <stop offset="25%" stopColor="#818cf8"/>
                  <stop offset="60%" stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#4338ca"/>
                </linearGradient>
              </defs>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="url(#heart3d)"/>
              <path d="M20 5.5c.8 1.2.9 2.8.4 4.2l-.6 1L14 5c1.5-1.5 4-1.8 6 .5z" fill="#c7d2fe" opacity="0.5"/>
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
            placeholder="What is your current status and when does it expire? What is your past immigration history? Are you looking for long-term permanent residency or short-term employment visa or both? Are there any timeline considerations?"
            size="large"
          />
        </Form.Item>
      </div>

      {/* Resume Upload */}
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

      {/* Submit Button */}
      <Form.Item className="text-center">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          className="!rounded-lg !px-12 !h-12 !text-base !font-medium"
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
}
