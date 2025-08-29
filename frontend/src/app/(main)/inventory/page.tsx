"use client";

import { InventoryList, InventoryWarehouseList } from "@/features/inventory";
import Sidebar from "../sidebar/sidebar";

export default function InventoryPage() {
  return (
    <>
    <Sidebar />
      <InventoryWarehouseList />
      <InventoryList />
    </>
  );
}
