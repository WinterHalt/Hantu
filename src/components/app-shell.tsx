"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`shell ${collapsed ? "is-collapsed" : ""}`}>
      <Sidebar />
      <div className="shell-main">
        <Topbar onToggle={() => setCollapsed((c) => !c)} userName="Budiman Susanto" />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}