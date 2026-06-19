import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(form);
      navigate(user.role === "seller" ? "/seller" : "/buyer");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="mx-auto max-w-md panel overflow-hidden">
      <div className="bg-ink p-6 text-white">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-200">Join BidFlow</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-slate-300">Start buying or selling in live auction workflows.</p>
      </div>
      <div className="p-6">
      {error && <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form className="mt-5 space-y-4" onSubmit={submit}>
        <input className="input" placeholder="Enter your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Enter your email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Enter at least 10 character password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button className="btn-primary w-full">Register</button>
      </form>
      <p className="mt-4 text-sm text-slate-600">Already registered? <Link className="font-semibold text-accent" to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
