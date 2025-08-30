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
import { useMemo, useState } from "react";

export default function InventoryPage() {
  const [activeKey, setActiveKey] = useState<string>("items");
  const [ticks, setTicks] = useState<Record<string, number>>({
    items: 0,
    warehouses: 0,
    stock: 0,
    movements: 0,
  });

  const onTabChange = (key: string) => {
    setActiveKey(key);
    setTicks((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
  };

  const items: TabsProps["items"] = useMemo(
    () => [
      {
        key: "items",
        label: "Ítems",
        icon: <AppstoreOutlined />,
        children: <InventoryItemsList key={`items-${ticks.items ?? 0}`} />,
      },
      {
        key: "warehouses",
        label: "Almacenes",
        icon: <HomeOutlined />,
        children: <InventoryWarehousesList key={`warehouses-${ticks.warehouses ?? 0}`} />,
      },
      {
        key: "stock",
        label: "Stocks",
        icon: <DatabaseOutlined />,
        children: <InventoryStockList key={`stock-${ticks.stock ?? 0}`} />,
      },
      {
        key: "movements",
        label: "Movimientos",
        icon: <SwapOutlined />,
        children: <InventoryMovementList key={`movements-${ticks.movements ?? 0}`} />,
      },
    ],
    [ticks],
  );

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
      {/* Remount the active tab content by updating child key on each selection */}
      <Tabs
        activeKey={activeKey}
        onChange={onTabChange}
        items={items}
        size="large"
        animated
        tabBarGutter={16}
      />
    </div>
  );
}
