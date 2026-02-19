"use client";

import { useState } from "react";
import { Button, Input, Spin, App } from "antd";
import { SettingOutlined, SaveOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/redux/hooks";

const { TextArea } = Input;

async function fetchFormConfig(): Promise<Record<string, unknown>> {
  const res = await fetch("/api/form-config");
  if (!res.ok) throw new Error("Failed to load form configuration");
  return res.json();
}

async function saveFormConfig(schema: unknown): Promise<Record<string, unknown>> {
  const res = await fetch("/api/form-config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schema),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to save configuration");
  }
  return res.json();
}

function SchemaEditor({ initialSchema }: { initialSchema: Record<string, unknown> }) {
  const isDark = useAppSelector((state) => state.theme.isDark);
  const { message } = App.useApp();
  const [schemaText, setSchemaText] = useState(() => JSON.stringify(initialSchema, null, 2));
  const [error, setError] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: saveFormConfig,
    onSuccess: () => {
      message.success("Form configuration saved");
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSave = () => {
    setError(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(schemaText);
    } catch {
      setError("Invalid JSON syntax. Please fix the JSON and try again.");
      return;
    }

    saveMutation.mutate(parsed);
  };

  return (
    <div>
      <h1
        className={`text-2xl font-bold mb-6 ${isDark ? "text-gray-100" : "text-gray-900"}`}
      >
        Settings
      </h1>

      <div
        className={`rounded-lg border p-6 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <SettingOutlined />
          <h2
            className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            Form Configuration
          </h2>
        </div>

        <p
          className={`mb-4 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          Edit the JSON Schema below to configure the public lead form.{" "}
          <span className="text-amber-600 font-medium">
            Currently, only the <code className="text-xs bg-amber-50 px-1 rounded border border-amber-200">country.enum</code> array
            is wired to the live form.
          </span>
        </p>

        <TextArea
          value={schemaText}
          onChange={(e) => {
            setSchemaText(e.target.value);
            setError(null);
          }}
          rows={20}
          className="font-mono !text-xs"
          status={error ? "error" : undefined}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-4">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saveMutation.isPending}
            onClick={handleSave}
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["form-config"],
    queryFn: fetchFormConfig,
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spin size="large" />
      </div>
    );
  }

  return <SchemaEditor initialSchema={data} />;
}
