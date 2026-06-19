import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "../api/client.js";
import StatCard from "../components/StatCard.jsx";
import { useFetch } from "../hooks/useFetch.js";

export default function SellerDashboard() {
  const { data, setData } = useFetch("/auctions/seller/dashboard", { auctions: [], stats: {} });
  const { data: products = [], setData: setProducts } = useFetch("/products", []);
  const [product, setProduct] = useState({ title: "", description: "", category: "", condition: "good", location: "" });
  const [auction, setAuction] = useState({ product: "", startingPrice: 50, reservePrice: 0, bidIncrement: 5, startTime: "", endTime: "" });
  const [productError, setProductError] = useState("");
  const [auctionError, setAuctionError] = useState("");

  const createProduct = async (e) => {
    e.preventDefault();
    setProductError("");
    try {
      const body = new FormData();
      Object.entries(product).forEach(([key, value]) => body.append(key, value));
      [...e.target.images.files].forEach((file) => body.append("images", file));
      const { data: created } = await api.post("/products", body);
      setProducts([created, ...products]);
      setAuction({ ...auction, product: created._id });
      setProduct({ title: "", description: "", category: "", condition: "good", location: "" });
      e.target.reset();
    } catch (err) {
      const details = err.response?.data?.errors?.map((item) => item.msg).join(" ");
      setProductError(details || err.response?.data?.message || "Product could not be saved.");
    }
  };

  const createAuction = async (e) => {
    e.preventDefault();
    setAuctionError("");
    try {
      const { data: created } = await api.post("/auctions", auction);
      setData({ ...data, auctions: [created, ...data.auctions] });
      setAuction({ product: "", startingPrice: 50, reservePrice: 0, bidIncrement: 5, startTime: "", endTime: "" });
    } catch (err) {
      const details = err.response?.data?.errors?.map((item) => item.msg).join(" ");
      setAuctionError(details || err.response?.data?.message || "Auction could not be created.");
    }
  };

  const removeAuction = async (id) => {
    await api.delete(`/auctions/${id}`);
    setData({ ...data, auctions: data.auctions.filter((item) => item._id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Seller workspace</p>
        <h1 className="section-title mt-1">Seller Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Auctions" value={data?.stats?.auctions || 0} />
        <StatCard label="Live" value={data?.stats?.active || 0} />
        <StatCard label="Revenue" value={`$${data?.stats?.revenue || 0}`} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <form className="panel space-y-3 p-5" onSubmit={createProduct}>
          <h2 className="text-xl font-black">Create Product</h2>
          {productError && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{productError}</p>}
          <input className="input" placeholder="Title" value={product.title} onChange={(e) => setProduct({ ...product, title: e.target.value })} />
          <textarea className="input min-h-28" placeholder="Description" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
          <input className="input" placeholder="Category" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} />
          <input className="input" placeholder="Location" value={product.location} onChange={(e) => setProduct({ ...product, location: e.target.value })} />
          <select className="input" value={product.condition} onChange={(e) => setProduct({ ...product, condition: e.target.value })}>
            <option value="new">New</option><option value="like-new">Like new</option><option value="good">Good</option><option value="fair">Fair</option><option value="used">Used</option>
          </select>
          <input className="input" type="file" name="images" accept="image/*" multiple />
          <button className="btn-primary"><Plus className="h-4 w-4" /> Save product</button>
        </form>
        <form className="panel space-y-3 p-5" onSubmit={createAuction}>
          <h2 className="text-xl font-black">Create Auction</h2>
          {auctionError && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{auctionError}</p>}
          <select className="input" value={auction.product} onChange={(e) => setAuction({ ...auction, product: e.target.value })}>
            <option value="">Select product</option>
            {products.map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}
          </select>
          <input className="input" type="number" placeholder="Starting price" value={auction.startingPrice} onChange={(e) => setAuction({ ...auction, startingPrice: Number(e.target.value) })} />
          <input className="input" type="number" placeholder="Reserve price" value={auction.reservePrice} onChange={(e) => setAuction({ ...auction, reservePrice: Number(e.target.value) })} />
          <input className="input" type="number" placeholder="Bid increment" value={auction.bidIncrement} onChange={(e) => setAuction({ ...auction, bidIncrement: Number(e.target.value) })} />
          <input className="input" type="datetime-local" value={auction.startTime} onChange={(e) => setAuction({ ...auction, startTime: e.target.value })} />
          <input className="input" type="datetime-local" value={auction.endTime} onChange={(e) => setAuction({ ...auction, endTime: e.target.value })} />
          <button className="btn-primary"><Plus className="h-4 w-4" /> Launch auction</button>
        </form>
      </div>
      <div className="panel overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100/80"><tr><th className="p-3">Item</th><th>Status</th><th>Current</th><th>Bids</th><th></th></tr></thead>
          <tbody>{data?.auctions?.map((item) => (
            <tr className="border-t border-slate-100" key={item._id}><td className="p-3 font-semibold">{item.product?.title}</td><td><span className="status-pill">{item.status}</span></td><td>${item.currentPrice}</td><td>{item.totalBids}</td><td><button className="btn-secondary px-3" onClick={() => removeAuction(item._id)}><Trash2 className="h-4 w-4" /></button></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
