import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import AuctionCard from "../components/AuctionCard.jsx";

export default function Home() {
  const { data } = useFetch("/auctions?status=live", []);
  const auctions = Array.isArray(data) ? data : [];
  return (
    <div className="space-y-10">
      <section className="grid items-center gap-8 overflow-hidden rounded-xl border border-white/70 bg-white/90 p-6 shadow-soft backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <div className="space-y-6">
          <p className="eyebrow">Realtime auction marketplace</p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-ink md:text-6xl">BidFlow</h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Discover verified listings, compete in live auctions, and manage selling workflows from one secure marketplace.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="btn-primary" to="/auctions">Browse auctions <ArrowRight className="h-4 w-4" /></Link>
            <Link className="btn-secondary" to="/register">Create account</Link>
          </div>
          <div className="grid gap-3 pt-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-teal-50 p-3 text-sm font-semibold text-slate-700"><Zap className="h-5 w-5 text-ember" /> Live bid updates</div>
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-sm font-semibold text-slate-700"><ShieldCheck className="h-5 w-5 text-accent" /> JWT-secured flows</div>
          </div>
        </div>
        <div className="relative">
          <img className="h-80 w-full rounded-lg object-cover shadow-2xl shadow-slate-900/15" src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80" alt="Auction desk" />
          <div className="absolute bottom-4 left-4 rounded-lg bg-white/95 p-4 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Live marketplace</p>
            <p className="text-2xl font-black text-ink">{auctions.length}</p>
          </div>
        </div>
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title">Live auctions</h2>
          <Link className="text-sm font-semibold text-accent" to="/auctions">View all</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">{auctions.slice(0, 3).map((auction) => <AuctionCard key={auction._id} auction={auction} />)}</div>
      </section>
    </div>
  );
}
