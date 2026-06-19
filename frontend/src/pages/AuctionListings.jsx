import { Search } from "lucide-react";
import { useState } from "react";
import AuctionCard from "../components/AuctionCard.jsx";
import { useFetch } from "../hooks/useFetch.js";

export default function AuctionListings() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ q: "", status: "", category: "" });
  const qs = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString();
  const { data, loading } = useFetch(`/auctions?${qs}`, []);
  const auctions = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-5">
      <div className="panel flex flex-col justify-between gap-4 p-5 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Marketplace</p>
          <h1 className="section-title mt-1">Auction Listings</h1>
          <p className="text-slate-600">Search, filter, and bid on verified auctions.</p>
        </div>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setFilters({ ...filters, q: query }); }}>
          <input className="input w-64" placeholder="Search auctions" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="btn-primary"><Search className="h-4 w-4" /></button>
        </form>
      </div>
      <div className="flex flex-wrap gap-3 rounded-lg border border-white/70 bg-white/70 p-3 shadow-sm backdrop-blur">
        <select className="input max-w-48" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          <option value="live">Live</option>
          <option value="scheduled">Scheduled</option>
          <option value="closed">Closed</option>
        </select>
        <input className="input max-w-52" placeholder="Category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
      </div>
      {loading ? <p>Loading auctions...</p> : <div className="grid gap-5 md:grid-cols-3">{auctions.map((auction) => <AuctionCard key={auction._id} auction={auction} />)}</div>}
    </div>
  );
}
