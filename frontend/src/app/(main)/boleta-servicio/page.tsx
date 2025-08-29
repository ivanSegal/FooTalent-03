import React from "react";
import ServiceTicketList from "@/features/service-ticket/components/ServiceTicketList";
import Sidebar from "../sidebar/sidebar";

export default function ServiceTicketPage() {
  return (
    <div className="">
      <Sidebar />
      <ServiceTicketList />
    </div>
  );
}
