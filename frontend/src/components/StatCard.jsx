export default function StatCard({ label, value }) {
  return (
    <div className="panel relative overflow-hidden p-5">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-teal-50" />
      <p className="relative text-sm font-bold text-slate-500">{label}</p>
      <p className="relative mt-2 text-3xl font-black tracking-tight text-ink">{value}</p>
    </div>
  );
}
