"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableProps } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/features/user/services/user.service";
import type { UserListItem } from "@/features/user/types/user.types";
import UserForm from "@/features/user/components/UserForm";
import PDFGenerator from "@/components/pdf/PDFGenerator";
import UserTemplate from "@/features/user/components/UserTemplate";

export default function UserList() {
  const [tableSort, setTableSort] = useState<string | undefined>("");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", { page: 0, size: 20, sort: tableSort }],
    queryFn: () => userService.list({ page: 0, size: 20, sort: tableSort }),
  });
  const [items, setItems] = useState<UserListItem[]>([]);
  const [current, setCurrent] = useState<UserListItem | null>(null);
  const [dialog, setDialog] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (data?.content) setItems(data.content);
  }, [data]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return items.filter((u) => {
      const first = (u.firstName ?? "").toLowerCase();
      const last = (u.lastName ?? "").toLowerCase();
      const combined = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim().toLowerCase();
      return (
        !term ||
        first.includes(term) ||
        last.includes(term) ||
        combined.includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.department || "").toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term) ||
        u.accountStatus.toLowerCase().includes(term)
      );
    });
  }, [items, search]);

  const handleTableChange: TableProps<UserListItem>["onChange"] = (
    _pagination,
    _filters,
    sorter,
  ) => {
    if (Array.isArray(sorter)) {
      const s = sorter[0];
      let order: "asc" | "desc" | undefined;
      if (s?.order === "ascend") order = "asc";
      else if (s?.order === "descend") order = "desc";
      const field = (s?.field as string) || undefined;
      setTableSort(order && field ? `${field},${order}` : undefined);
    } else {
      let order: "asc" | "desc" | undefined;
      if (sorter.order === "ascend") order = "asc";
      else if (sorter.order === "descend") order = "desc";
      const field = (sorter.field as string) || undefined;
      setTableSort(order && field ? `${field},${order}` : undefined);
    }
    void refetch();
  };

  const columns: ColumnsType<UserListItem> = [
    {
      title: "Nombre",
      dataIndex: "firstName",
      key: "firstName",
      sorter: true,
      sortOrder:
        tableSort && tableSort.startsWith("firstName,")
          ? tableSort.endsWith("asc")
            ? "ascend"
            : tableSort.endsWith("desc")
              ? "descend"
              : undefined
          : undefined,
    },
    {
      title: "Apellido",
      dataIndex: "lastName",
      key: "lastName",
      sorter: true,
      sortOrder:
        tableSort && tableSort.startsWith("lastName,")
          ? tableSort.endsWith("asc")
            ? "ascend"
            : tableSort.endsWith("desc")
              ? "descend"
              : undefined
          : undefined,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (val: string) => <Tag color="blue">{val}</Tag>,
    },
    {
      title: "Departamento",
      dataIndex: "department",
      key: "department",
      render: (val?: string | null) => (val ? <Tag>{val}</Tag> : <span>-</span>),
    },
    {
      title: "Estado",
      dataIndex: "accountStatus",
      key: "accountStatus",
      render: (val: string) => <Tag color={val === "ACTIVE" ? "green" : "red"}>{val}</Tag>,
    },
    {
      title: "Acciones",
      key: "acciones",
      align: "right" as const,
      render: (_: unknown, record) => (
        <Space size="small">
          <Tooltip title="Imprimir / Vista previa">
            <PDFGenerator
              template={UserTemplate}
              data={{ user: record }}
              fileName={`usuario-${`${record.firstName}-${record.lastName}`.replace(/\s+/g, "-") || record.id}.pdf`}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrent(record);
                setDialog(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Confirmar eliminación"
            okText="Eliminar"
            cancelText="Cancelar"
            onConfirm={async () => {
              try {
                await userService.remove(record.id);
                setItems((prev) => prev.filter((x) => x.id !== record.id));
              } catch {
                // noop
              }
            }}
          >
            <Tooltip title="Eliminar">
              <Button size="small" type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
            <p className="mt-1 text-sm text-gray-600">Listado y gestión de usuarios.</p>
          </div>
        </header>

        <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
          <Table
            title={() => (
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-1 items-center gap-2">
                  <Input.Search
                    allowClear
                    placeholder="Buscar por nombre, apellido, email, rol o estado"
                    className="w-full md:max-w-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setCurrent(null);
                    setDialog(true);
                  }}
                >
                  Nuevo usuario
                </Button>
              </div>
            )}
            size="small"
            rowKey="id"
            loading={isLoading}
            columns={columns}
            dataSource={filtered}
            onChange={handleTableChange}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            scroll={{ x: "max-content" }}
          />
        </div>
      </div>

      <Modal
        // title={current ? "Editar usuario" : "Nuevo usuario"}
        title={
          <div className="mb-2 text-center md:text-left">
            <div className="primary border-b-2 pb-2">
              <h2 className="text-900 mb-2 flex items-center justify-center text-2xl font-bold text-gray-900 md:justify-start">
                <CheckCircleOutlined className="text-primary mr-3 text-3xl text-blue-600" />
                {current ? `Modificar Usuario #${current.id}` : "Crear Usuario"}
              </h2>
            </div>
          </div>
        }
        open={dialog}
        onCancel={() => setDialog(false)}
        footer={null}
      >
        <UserForm
          current={current}
          onClose={() => setDialog(false)}
          onSaved={(u) => {
            setItems((prev) => {
              const exists = prev.some((x) => x.id === u.id);
              return exists ? prev.map((x) => (x.id === u.id ? u : x)) : [u, ...prev];
            });
            setDialog(false);
          }}
        />
      </Modal>
    </main>
  );
}
