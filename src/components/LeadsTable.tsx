"use client";

import { useState, useEffect, useCallback } from "react";
import { Table, Input, Select, Button, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Lead, LeadsResponse } from "@/lib/types";

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "8",
        search,
        status: statusFilter === "all" ? "" : statusFilter,
      });
      const res = await fetch(`/api/leads?${params}`);
      const data: LeadsResponse = await res.json();
      setLeads(data.leads);
      setTotal(data.total);
    } catch {
      message.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REACHED_OUT" }),
      });
      if (res.ok) {
        message.success("Status updated");
        fetchLeads();
      }
    } catch {
      message.error("Failed to update status");
    }
  };

  const columns: ColumnsType<Lead> = [
    {
      title: "Name",
      key: "name",
      sorter: (a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Submitted",
      dataIndex: "submittedAt",
      key: "submittedAt",
      sorter: (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
      render: (date: string) =>
        new Date(date).toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <span className="text-sm">
          {status === "REACHED_OUT" ? "Reached Out" : "Pending"}
        </span>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      sorter: (a, b) => a.country.localeCompare(b.country),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.status === "PENDING" ? (
          <Button
            size="small"
            type="link"
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdate(record.id);
            }}
          >
            Mark as Reached Out
          </Button>
        ) : null,
    },
  ];

  const expandedRowRender = (record: Lead) => (
    <div className="grid grid-cols-2 gap-4 py-2 px-4 text-sm">
      <div>
        <span className="text-gray-500">Email:</span>{" "}
        <span className="text-gray-900">{record.email}</span>
      </div>
      <div>
        <span className="text-gray-500">LinkedIn:</span>{" "}
        <a
          href={record.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {record.linkedIn}
        </a>
      </div>
      <div>
        <span className="text-gray-500">Visa Interests:</span>{" "}
        <span className="text-gray-900">{record.visaInterests.join(", ")}</span>
      </div>
      <div>
        <span className="text-gray-500">Resume:</span>{" "}
        {record.resumeFileName ? (
          <span className="text-gray-900">{record.resumeFileName}</span>
        ) : (
          <span className="text-gray-400">Not uploaded</span>
        )}
      </div>
      <div className="col-span-2">
        <span className="text-gray-500">Message:</span>{" "}
        <span className="text-gray-900">{record.helpMessage}</span>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Leads</h1>

      {/* Toolbar */}
      <div className="flex gap-3 mb-4">
        <Input
          placeholder="Search"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          className="w-40"
          options={[
            { value: "all", label: "Status" },
            { value: "PENDING", label: "Pending" },
            { value: "REACHED_OUT", label: "Reached Out" },
          ]}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={leads}
        rowKey="id"
        loading={loading}
        scroll={{ x: 700 }}
        expandable={{
          expandedRowRender,
          expandedRowKeys,
          onExpand: (expanded, record) => {
            setExpandedRowKeys(expanded ? [record.id] : []);
          },
        }}
        pagination={{
          current: page,
          pageSize: 8,
          total,
          onChange: setPage,
          showSizeChanger: false,
          position: ["bottomRight"],
        }}
      />
    </div>
  );
}
