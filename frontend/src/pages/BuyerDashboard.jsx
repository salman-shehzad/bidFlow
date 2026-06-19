import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";

export default function BuyerDashboard() {
  const { data = { bids: [], won: [] } } = useFetch("/auctions/buyer/dashboard", { bids: [], won: [] });
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Buyer workspace</p>
        <h1 className="section-title mt-1">Buyer Dashboard</h1>
      </div>
      <section className="panel p-5">
        <h2 className="text-xl font-black">Won Auctions</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {data.won.map((auction) => (
            <div className="rounded-md border border-slate-100 bg-slate-50 p-4" key={auction._id}>
              <p className="font-bold">{auction.product?.title}</p>
              <p className="text-sm text-slate-600">${auction.currentPrice}</p>
              <Link className="mt-3 inline-flex text-sm font-semibold text-accent" to={`/payment/${auction._id}`}>Pay now</Link>
            </div>
          ))}
        </div>
      </section>
      <section className="panel p-5">
        <h2 className="text-xl font-black">Bid History</h2>
        <div className="mt-3 space-y-3">{data.bids.map((bid) => (
          <div className="flex justify-between rounded-md border border-slate-100 bg-slate-50 p-3" key={bid._id}>
            <span>{bid.auction?.product?.title}</span><strong>${bid.amount}</strong>
          </div>
        ))}</div>
      </section>
    </div>
  );
}
