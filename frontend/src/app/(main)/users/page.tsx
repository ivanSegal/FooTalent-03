"use client";

import React from "react";
import dynamic from "next/dynamic";

const UserList = dynamic(() => import("@/features/user/components/UserList"), { ssr: false });

export default function UsersPage() {
  return <UserList />;
}
