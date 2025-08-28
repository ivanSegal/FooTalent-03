"use client";

import { InventoryList, InventoryWarehouseList } from "@/features/inventory";

export default function InventoryPage() {
  return (
    <>
      <InventoryWarehouseList />
      <InventoryList />
    </>
  );
}
