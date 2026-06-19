import { CreditCard } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client.js";
import { useFetch } from "../hooks/useFetch.js";

export default function PaymentPage() {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { data } = useFetch(`/auctions/${auctionId}`, null);
  const [busy, setBusy] = useState(false);

  const pay = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { data: tx } = await api.post(`/transactions/pay/${auctionId}`);
    navigate("/payment/success", { state: tx });
  };

  return (
    <div className="mx-auto max-w-xl panel p-6">
      <h1 className="text-3xl font-black">Payment</h1>
      <p className="mt-2 text-slate-600">{data?.auction?.product?.title}</p>
      <p className="mt-4 text-4xl font-black">${data?.auction?.currentPrice || 0}</p>
      <form className="mt-6 space-y-3" onSubmit={pay}>
        <input className="input" placeholder="4242 4242 4242 4242" />
        <div className="grid grid-cols-2 gap-3"><input className="input" placeholder="MM/YY" /><input className="input" placeholder="CVC" /></div>
        <button className="btn-primary w-full" disabled={busy}><CreditCard className="h-4 w-4" /> Complete mock payment</button>
      </form>
    </div>
  );
}
