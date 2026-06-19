import { Heart, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api, assetUrl } from "../api/client.js";
import { createSocket } from "../api/socket.js";
import { useAuth } from "../context/AuthContext.jsx";
import { timeLeft } from "../utils/time.js";

export default function AuctionDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [payload, setPayload] = useState(null);
  const [amount, setAmount] = useState("");
  const [clock, setClock] = useState("");
  const [error, setError] = useState("");
  const socket = useMemo(() => createSocket(), []);

  useEffect(() => {
    api.get(`/auctions/${id}`).then((res) => setPayload(res.data));
  }, [id]);

  useEffect(() => {
    if (!payload?.auction) return undefined;
    const timer = setInterval(() => setClock(timeLeft(payload.auction.endTime)), 1000);
    return () => clearInterval(timer);
  }, [payload?.auction]);

  useEffect(() => {
    socket.connect();
    socket.emit("auction:join", id);
    socket.on("bid:updated", ({ auction, bid }) => {
      setPayload((current) => ({ auction, bids: [bid, ...(current?.bids || [])] }));
    });
    socket.on("auction:closed", ({ auction }) => setPayload((current) => ({ ...current, auction })));
    return () => {
      socket.emit("auction:leave", id);
      socket.disconnect();
    };
  }, [id, socket]);

  if (!payload) return <p>Loading auction...</p>;
  const { auction, bids } = payload;
  const product = auction.product;
  const minimum = auction.currentPrice + auction.bidIncrement;

  const bid = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post(`/auctions/${id}/bids`, { amount: Number(amount) });
      setPayload((current) => ({ auction: data.auction, bids: [data.bid, ...current.bids] }));
      setAmount("");
    } catch (err) {
      setError(err.response?.data?.message || "Bid failed");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="space-y-5">
        <img className="h-[420px] w-full rounded-lg object-cover shadow-2xl shadow-slate-900/10" src={assetUrl(product.images?.[0])} alt={product.title} />
        <div className="panel p-5">
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink">{product.title}</h1>
          <p className="mt-3 text-slate-600">{product.description}</p>
        </div>
      </section>
      <aside className="space-y-5">
        <div className="panel p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-500">Current bid</p>
              <p className="text-4xl font-black">${auction.currentPrice}</p>
            </div>
            <button className="btn-secondary px-3" onClick={() => api.post(`/auctions/${id}/wishlist`)} title="Wishlist"><Heart className="h-4 w-4" /></button>
          </div>
          <div className="mt-4 rounded-md bg-teal-50 p-3 text-sm font-black text-accent">{clock || timeLeft(auction.endTime)}</div>
          {error && <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <form className="mt-4 flex gap-2" onSubmit={bid}>
            <input className="input" type="number" min={minimum} placeholder={`Minimum $${minimum}`} value={amount} onChange={(e) => setAmount(e.target.value)} disabled={!user || auction.status !== "live"} />
            <button className="btn-primary" disabled={!user || auction.status !== "live"}><Send className="h-4 w-4" /></button>
          </form>
        </div>
        <div className="panel p-5">
          <h2 className="font-black">Bid History</h2>
          <div className="mt-3 space-y-3">
            {bids.map((bidItem) => (
              <div className="flex justify-between rounded-md border border-slate-100 bg-slate-50 p-3 text-sm" key={bidItem._id}>
                <span>{bidItem.bidder?.name || "Bidder"}</span>
                <strong>${bidItem.amount}</strong>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
