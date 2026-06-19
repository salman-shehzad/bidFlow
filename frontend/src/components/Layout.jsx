import { Bell, Gavel, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const nav = [
  { to: "/auctions", label: "Auctions" },
  { to: "/buyer", label: "Buyer", role: "buyer" },
  { to: "/seller", label: "Seller", role: "seller" },
  { to: "/admin", label: "Admin", role: "admin" }
];

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/85 shadow-sm shadow-slate-900/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-ink">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-white shadow-lg shadow-teal-900/20">
              <Gavel className="h-5 w-5" />
            </span>
            BidFlow
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav
              .filter((item) => !item.role || user?.role === item.role || user?.role === "admin")
              .map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-md px-3 py-2 text-sm font-bold transition ${isActive ? "bg-teal-50 text-accent shadow-sm" : "text-slate-600 hover:bg-white hover:text-ink"}`}>
                  {item.label}
                </NavLink>
              ))}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link className="btn-secondary px-3" to="/notifications" title="Notifications"><Bell className="h-4 w-4" /></Link>
                <Link className="btn-secondary px-3" to="/profile" title="Profile"><UserRound className="h-4 w-4" /></Link>
                <button className="btn-secondary px-3" onClick={logout} title="Logout"><LogOut className="h-4 w-4" /></button>
              </>
            ) : (
              <Link className="btn-primary" to="/login"><LayoutDashboard className="h-4 w-4" /> Sign in</Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
