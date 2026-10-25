import Link from "next/link";
import { useRouter } from "next/router";

const LINKS = [
  { href: "/", label: "🏠 Dashboard" },
  { href: "/kebutuhan", label: "📋 Kebutuhan Acara" },
  { href: "/rab", label: "🧾 RAB" },
  { href: "/rundown", label: "⏱️ Rundown" },
  { href: "/bedah-juknis", label: "🔍 Bedah Juknis" },
  { href: "/sponsor", label: "🤝 Sponsor" },
  { href: "/kas", label: "💰 Kas Bendahara" },
];

export default function Navbar() {
  const router = useRouter();
  return (
    <div className="navbar no-print">
      <div className="navbar-title">🎭 Pentas Seni — Sistem Panitia</div>
      <div className="navbar-links">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={router.pathname === l.href ? "active" : ""}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
