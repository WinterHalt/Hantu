"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const isOperasiActive = pathname.startsWith("/operasi");
  const [operasiOpen, setOperasiOpen] = useState(isOperasiActive);
  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">Trialpilot</h1>
      <nav>
        {/* Home */}
        <Link href="/" className={pathname === "/" ? "active" : ""}>
          <i className="bi bi-house" />
          <span>Home</span>
        </Link>
        {/* Pendaftaran */}
        <Link href="/registration" className={pathname === "/registration" ? "active" : ""}>
          <i className="bi bi-clipboard2-plus" />
          <span>Pendaftaran</span>
        </Link>
        {/* Admin */}
        <Link href="/admin" className={pathname === "/admin" ? "active" : ""}>
          <i className="bi bi-table" />
          <span>Admin</span>
        </Link>
        {/* Farmasi */}
        <button
        type="button"
        className={`menu-parent ${isOperasiActive ? "active" : ""}`}
        onClick={() => setOperasiOpen((prev) => !prev)}
        aria-expanded={operasiOpen}
        >
          <i className="bi bi-heart-pulse" />
          <span>Operasi</span>
          <i className={`bi chevron ${operasiOpen ? "bi-chevron-up" : "bi-chevron-down"}`} />
        </button>
        {/* ? */}
        {operasiOpen && (
          <div className="submenu">
            <Link
              href="/operasi/penjadwalan"
              className={pathname === "/operasi/penjadwalan" ? "active" : ""}
            >
              <i className="bi bi-calendar-plus" />
              <span>Penjadwalan</span>
            </Link>
            <Link
              href="/operation/final"
              className={pathname === "/operasi/jadwal-final" ? "active" : ""}
            >
              <i className="bi bi-calendar-check" />
              <span>Jadwal Final</span>
            </Link>
          </div>
        )}
      </nav>
    </aside>
  );
}