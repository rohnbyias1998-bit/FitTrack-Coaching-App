import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ClientDetailPage from "./pages/ClientDetailPage";
import FoodSearchTest from "./components/FoodSearchTest";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Navigate to="/auth?mode=login" replace />} />
          <Route path="/signup" element={<Navigate to="/auth?mode=signup" replace />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/clients/:id" element={<ClientDetailPage />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/food-search-test" element={<FoodSearchTest />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
