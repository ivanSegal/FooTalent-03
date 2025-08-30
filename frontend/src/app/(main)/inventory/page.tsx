"use client";

import {
  InventoryStockList,
  InventoryWarehousesList,
  InventoryMovementList,
} from "@/features/inventory-items";
import InventoryItemsList from "@/features/inventory-items/components/InventoryItemsList";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { AppstoreOutlined, HomeOutlined, DatabaseOutlined, SwapOutlined } from "@ant-design/icons";

export default function InventoryPage() {
  const items: TabsProps["items"] = [
    { key: "items", label: "Ítems", icon: <AppstoreOutlined />, children: <InventoryItemsList /> },
    {
      key: "warehouses",
      label: "Almacenes",
      icon: <HomeOutlined />,
      children: <InventoryWarehousesList />,
    },
    { key: "stock", label: "Stocks", icon: <DatabaseOutlined />, children: <InventoryStockList /> },
    {
      key: "movements",
      label: "Movimientos",
      icon: <SwapOutlined />,
      children: <InventoryMovementList />,
    },
  ];

  return (
    <div className="p-2 md:p-8">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestión y control de ítems, almacenes, stocks y movimientos de inventario.
          </p>
        </div>
      </header>
      <Tabs defaultActiveKey="items" items={items} size="large" animated tabBarGutter={16} />
    </div>
  );
}
