"use client";

import { useState } from "react";
import { Table, Input, Select, Button, Spin, App } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import type { Lead, LeadsResponse } from "@/lib/types";
import { useAppSelector } from "@/lib/redux/hooks";

const formatDate = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

async function fetchLeads(page: number, search: string, statusFilter: string): Promise<LeadsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: "13",
    search,
    status: statusFilter === "all" ? "" : statusFilter,
  });
  const res = await fetch(`/api/leads?${params}`);
  if (!res.ok) throw new Error("Failed to fetch leads");
  return res.json();
}

async function updateLeadStatus(id: string): Promise<void> {
  const res = await fetch(`/api/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "REACHED_OUT" }),
  });
  if (!res.ok) throw new Error("Failed to update status");
}

export default function LeadsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const isDark = useAppSelector((state) => state.theme.isDark);
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["leads", page, search, statusFilter],
    queryFn: () => fetchLeads(page, search, statusFilter),
  });

  const leads = data?.leads ?? [];
  const total = data?.total ?? 0;

  const statusMutation = useMutation({
    mutationFn: updateLeadStatus,
    onSuccess: () => {
      message.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: () => {
      message.error("Failed to update status");
    },
  });

  const handleStatusUpdate = (id: string) => {
    statusMutation.mutate(id);
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
      render: (date: string) => formatDate(date),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: string) => (
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
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
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdate(record.id);
            }}
          >
            Mark as Reached Out
          </Button>
        ) : (
          <span className="text-gray-400 text-sm">Reached Out</span>
        ),
    },
  ];

  const expandedRowRender = (record: Lead) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2 px-4 text-sm">
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
          <a
            href={`/api/leads/${record.id}/download`}
            className="text-blue-600 hover:underline"
          >
            {record.resumeFileName}
          </a>
        ) : (
          <span className="text-gray-400">Not uploaded</span>
        )}
      </div>
      <div className="md:col-span-2">
        <span className="text-gray-500">Message:</span>{" "}
        <span className="text-gray-900">{record.helpMessage}</span>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className={`text-2xl font-bold mb-6 ${isDark ? "text-gray-100" : "text-gray-900"}`}>Leads</h1>

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

      {/* Mobile card view */}
      <div className="lg:hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No leads found</div>
        ) : (
          <>
            <div className="space-y-3">
              {leads.map((lead) => {
                const isExpanded = expandedRowKeys.includes(lead.id);
                return (
                  <div
                    key={lead.id}
                    className={`rounded-lg border p-4 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                    onClick={() =>
                      setExpandedRowKeys(isExpanded ? [] : [lead.id])
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className={`font-medium ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                          {lead.firstName} {lead.lastName}
                        </div>
                        <div className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {lead.country}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          lead.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {lead.status === "REACHED_OUT"
                          ? "Reached Out"
                          : "Pending"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1.5">
                      {formatDate(lead.submittedAt)}
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-100 text-sm space-y-2">
                        <div>
                          <span className="text-gray-500">Email:</span>{" "}
                          <span className="text-gray-900">{lead.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">LinkedIn:</span>{" "}
                          <a
                            href={lead.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {lead.linkedIn}
                          </a>
                        </div>
                        <div>
                          <span className="text-gray-500">Visa:</span>{" "}
                          <span className="text-gray-900">
                            {lead.visaInterests.join(", ")}
                          </span>
                        </div>
                        {lead.resumeFileName && (
                          <div>
                            <span className="text-gray-500">Resume:</span>{" "}
                            <a
                              href={`/api/leads/${lead.id}/download`}
                              className="text-blue-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {lead.resumeFileName}
                            </a>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">Message:</span>{" "}
                          <span className="text-gray-900">
                            {lead.helpMessage}
                          </span>
                        </div>
                      </div>
                    )}

                    {lead.status === "PENDING" && (
                      <div className="mt-3">
                        <Button
                          size="small"
                          type="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(lead.id);
                          }}
                        >
                          Mark as Reached Out
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile pagination */}
            {total > 13 && (
              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <button
                  className="px-3 py-1.5 rounded border border-gray-200 disabled:opacity-40"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {Math.ceil(total / 13)}
                </span>
                <button
                  className="px-3 py-1.5 rounded border border-gray-200 disabled:opacity-40"
                  disabled={page >= Math.ceil(total / 13)}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block">
        <Table
          columns={columns}
          dataSource={leads}
          rowKey="id"
          loading={isLoading}
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
            pageSize: 13,
            total,
            onChange: setPage,
            showSizeChanger: false,
          }}
        />
      </div>
    </div>
  );
}
