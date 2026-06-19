import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AuctionListings from "./pages/AuctionListings.jsx";
import AuctionDetails from "./pages/AuctionDetails.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="auctions" element={<AuctionListings />} />
        <Route path="auctions/:id" element={<AuctionDetails />} />
        <Route element={<ProtectedRoute roles={["seller"]} />}>
          <Route path="seller" element={<SellerDashboard />} />
        </Route>
        <Route element={<ProtectedRoute roles={["buyer"]} />}>
          <Route path="buyer" element={<BuyerDashboard />} />
        </Route>
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="payment/success" element={<PaymentSuccess />} />
          <Route path="payment/:auctionId" element={<PaymentPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
