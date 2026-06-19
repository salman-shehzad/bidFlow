import { useState } from "react";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", address: user?.address || "" });

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.put("/users/profile", form);
    setUser(data);
    localStorage.setItem("bidflow_user", JSON.stringify(data));
  };

  return (
    <form className="mx-auto max-w-xl panel space-y-4 p-6" onSubmit={submit}>
      <h1 className="text-3xl font-black">Profile</h1>
      <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <textarea className="input min-h-28" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <button className="btn-primary">Save profile</button>
    </form>
  );
}
