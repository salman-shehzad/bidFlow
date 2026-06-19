import { CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const { state } = useLocation();
  return (
    <div className="mx-auto max-w-lg panel p-8 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-accent" />
      <h1 className="mt-4 text-3xl font-black">Payment successful</h1>
      <p className="mt-2 text-slate-600">Reference: {state?.reference || "Completed"}</p>
      <Link className="btn-primary mt-6" to="/buyer">Back to dashboard</Link>
    </div>
  );
}
