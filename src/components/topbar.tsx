"use client";

export default function Topbar({
  onToggle,
  userName,
}: {
  onToggle: () => void;
  userName: string;
}) {
  return (
    <header className="topbar">
      <button type="button" className="topbar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
        <i className="bi bi-list" />
      </button>

      <div className="topbar-profile">
        <i className="bi bi-person-circle" />
        <span className="name">{userName}</span>
      </div>
    </header>
  );
}