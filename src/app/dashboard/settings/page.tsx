"use client";

import { useState, useEffect, useContext } from "react";
import { Button, Input, Spin, App } from "antd";
import { SettingOutlined, SaveOutlined } from "@ant-design/icons";
import { ThemeContext } from "@/lib/theme";

const { TextArea } = Input;

export default function SettingsPage() {
  const { isDark } = useContext(ThemeContext);
  const { message } = App.useApp();
  const [schemaText, setSchemaText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/form-config")
      .then((res) => res.json())
      .then((data) => {
        setSchemaText(JSON.stringify(data, null, 2));
      })
      .catch(() => {
        message.error("Failed to load form configuration");
      })
      .finally(() => setLoading(false));
  }, [message]);

  const handleSave = async () => {
    setError(null);

    let parsed: unknown;
    try {
      parsed = JSON.parse(schemaText);
    } catch {
      setError("Invalid JSON syntax. Please fix the JSON and try again.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/form-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save configuration");
        return;
      }

      message.success("Form configuration saved");
    } catch {
      setError("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spin size="large" />
      </div>
    );
  }

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
          Edit the JSON Schema below to configure the public lead form. Changes
          to the <code className="text-xs bg-gray-100 px-1 rounded">country.enum</code> array
          will update the country dropdown options.
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
            loading={saving}
            onClick={handleSave}
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
