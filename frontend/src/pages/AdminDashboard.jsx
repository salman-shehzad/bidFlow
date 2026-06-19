import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../api/client.js";
import StatCard from "../components/StatCard.jsx";
import { useFetch } from "../hooks/useFetch.js";

export default function AdminDashboard() {
  const { data: stats = {} } = useFetch("/admin/analytics", {});
  const { data: users = [], setData: setUsers } = useFetch("/admin/users", []);
  const { data: auctions = [] } = useFetch("/admin/auctions", []);
  const chart = [
    { name: "Users", value: stats.users || 0 },
    { name: "Auctions", value: stats.auctions || 0 },
    { name: "Bids", value: stats.bids || 0 },
    { name: "Payments", value: stats.transactions || 0 }
  ];

  const toggleUser = async (user) => {
    const { data } = await api.patch(`/admin/users/${user._id}/status`, { isActive: !user.isActive });
    setUsers(users.map((item) => (item._id === data._id ? data : item)));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Platform control</p>
        <h1 className="section-title mt-1">Admin Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Users" value={stats.users || 0} />
        <StatCard label="Auctions" value={stats.auctions || 0} />
        <StatCard label="Revenue" value={`$${stats.revenue || 0}`} />
        <StatCard label="Volume" value={`$${stats.paidVolume || 0}`} />
      </div>
      <div className="panel h-80 p-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel overflow-hidden">
          <h2 className="p-4 text-xl font-black">Users</h2>
          {users.map((user) => (
            <div className="flex items-center justify-between border-t border-slate-100 p-4 text-sm" key={user._id}>
              <span>{user.name} - {user.role}</span>
              <button className="btn-secondary" onClick={() => toggleUser(user)}>{user.isActive ? "Disable" : "Enable"}</button>
            </div>
          ))}
        </section>
        <section className="panel overflow-hidden">
          <h2 className="p-4 text-xl font-black">Auctions</h2>
          {auctions.map((auction) => (
            <div className="flex justify-between border-t border-slate-100 p-4 text-sm" key={auction._id}>
              <span>{auction.product?.title || "Auction"}</span>
              <span className="status-pill">{auction.status}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
