import type { Metadata } from "next";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/assets/layout.css";
import "@/assets/table.css";
import "@/assets/modal.css";
import "@/assets/form.css";
import AppShell from "@/components/app-shell";

export const metadata: Metadata = { title: "Trialpilot", };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}