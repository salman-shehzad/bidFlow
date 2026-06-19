import { api } from "../api/client.js";
import { useFetch } from "../hooks/useFetch.js";

export default function Notifications() {
  const { data = [], setData } = useFetch("/notifications", []);
  const mark = async (id) => {
    const { data: updated } = await api.patch(`/notifications/${id}/read`);
    setData(data.map((item) => (item._id === id ? updated : item)));
  };
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Notifications</h1>
      <div className="panel overflow-hidden">
        {data.map((item) => (
          <button className={`block w-full border-t p-4 text-left ${item.read ? "bg-white" : "bg-teal-50"}`} key={item._id} onClick={() => mark(item._id)}>
            <strong>{item.title}</strong>
            <p className="text-sm text-slate-600">{item.message}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
