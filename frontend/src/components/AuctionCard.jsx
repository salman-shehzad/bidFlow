import { Clock, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { assetUrl } from "../api/client.js";

export default function AuctionCard({ auction }) {
  const product = auction.product || {};
  return (
    <article className="panel group overflow-hidden transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
      <div className="relative">
        <img className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" src={assetUrl(product.images?.[0])} alt={product.title} />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black uppercase tracking-wide text-accent shadow-sm">{auction.status}</span>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">{product.category}</p>
            <h3 className="mt-1 line-clamp-2 text-lg font-black leading-tight text-ink">{product.title}</h3>
          </div>
          <Heart className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:text-ember" />
        </div>
        <div className="grid gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> {new Date(auction.endTime).toLocaleString()}</span>
          {product.location && <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-ember" /> {product.location}</span>}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500">Current bid</p>
            <p className="text-2xl font-black text-ink">${auction.currentPrice}</p>
          </div>
          <Link to={`/auctions/${auction._id}`} className="btn-primary">View</Link>
        </div>
      </div>
    </article>
  );
}
