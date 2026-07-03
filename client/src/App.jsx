import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Notification from "./components/Notification";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Store from "./pages/Store";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Sos from "./pages/Sos";

const Support = () => (
  <div className="p-20 text-center font-bold text-[#00adef]">
    Équipe Support (En construction)
  </div>
);

function App() {
  return (
    <Router>
      <Notification />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/store" element={<Store />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/sos" element={<Sos />} />
          <Route
            path="*"
            element={
              <div className="p-20 text-center font-bold text-red-500">
                404 - Page non trouvée
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;