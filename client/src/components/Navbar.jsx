import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHeadset,
  FaShoppingCart,
  FaHome,
  FaInfoCircle,
  FaChevronDown,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import { clearAuth, getStoredToken, getStoredUser } from "../api/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [nav, setNav] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authUser, setAuthUser] = useState(getStoredUser());
  const [authToken, setAuthToken] = useState(getStoredToken());

  const handleClick = () => setNav(!nav);

  useEffect(() => {
    const syncAuth = () => {
      setAuthUser(getStoredUser());
      setAuthToken(getStoredToken());
    };

    syncAuth();
    window.addEventListener("autoclick-auth-changed", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("autoclick-auth-changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const isAuthenticated = useMemo(
    () => Boolean(authToken && authUser),
    [authToken, authUser],
  );

  const isAdmin = authUser?.role === "admin";

  const handleLogout = () => {
    clearAuth();
    setProfileOpen(false);
    setNav(false);
    navigate("/");
  };

  const userInitial = authUser?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 px-6 py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* 1. Logo Section */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="bg-[#00adef] p-2 rounded-xl">
            <span className="text-white font-black text-xl">AC</span>
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tighter">
            Auto<span className="text-[#00adef]">Click</span>
          </span>
        </Link>

        {/* 2. Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          <li>
            <Link
              to="/"
              className="text-gray-700 hover:text-[#00adef] font-bold no-underline flex items-center gap-2 transition-all"
            >
              <FaHome className="text-sm" /> Accueil
            </Link>
          </li>
          <li>
            <Link
              to="/store"
              className="text-gray-700 hover:text-[#00adef] font-bold no-underline flex items-center gap-2 transition-all"
            >
              <FaShoppingCart className="text-sm" /> Boutique
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="text-gray-700 hover:text-[#00adef] font-bold no-underline flex items-center gap-2 transition-all"
            >
              <FaInfoCircle className="text-sm" /> À Propos
            </Link>
          </li>
          <li>
            <Link
              to="/support"
              className="bg-gray-50 text-gray-700 px-5 py-2.5 rounded-2xl hover:bg-[#00adef] hover:text-white font-black no-underline flex items-center gap-2 transition-all border border-gray-100"
            >
              <FaHeadset /> Équipe Support
            </Link>
          </li>
        </ul>

        {/* 3. Auth Area (Desktop) */}
        <div className="hidden md:flex items-center gap-3 relative">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-2xl font-black text-gray-800 hover:border-[#00adef] hover:text-[#00adef] transition-all"
              >
                <span className="w-9 h-9 rounded-full bg-[#00adef] text-white flex items-center justify-center">
                  <FaUserCircle className="text-lg" />
                </span>
                <span className="max-w-32 truncate">
                  {authUser?.name || "Profile"}
                </span>
                <FaChevronDown
                  className={`text-sm transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-17 w-64 bg-white border border-gray-100 shadow-2xl rounded-3xl p-3">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-black text-gray-900">{authUser?.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {authUser?.email}
                    </p>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin-dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="mt-3 w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-black text-gray-800 hover:bg-[#00adef]/10 hover:text-[#00adef] transition-all no-underline"
                    >
                      <FaTachometerAlt /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full mt-3 flex items-center gap-3 px-4 py-3 rounded-2xl text-left font-black text-red-600 hover:bg-red-50 transition-all"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 px-6 py-3 rounded-2xl font-black no-underline hover:text-[#00adef] transition-all border border-gray-200"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="bg-[#00adef] text-white px-8 py-3 rounded-2xl font-black no-underline hover:bg-black transition-all shadow-lg shadow-sky-100"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* 4. Mobile Toggle */}
        <div
          onClick={handleClick}
          className="md:hidden z-10 text-2xl text-gray-900 cursor-pointer"
        >
          {!nav ? <FaBars /> : <FaTimes />}
        </div>

        {/* 5. Mobile Menu */}
        <ul
          className={
            !nav
              ? "hidden"
              : "absolute top-0 left-0 w-full h-screen bg-white flex flex-col justify-center items-center gap-10 list-none text-2xl font-black"
          }
        >
          <li>
            <Link
              onClick={handleClick}
              to="/"
              className="text-gray-900 no-underline"
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link
              onClick={handleClick}
              to="/store"
              className="text-gray-900 no-underline"
            >
              Boutique
            </Link>
          </li>
          <li>
            <Link
              onClick={handleClick}
              to="/about"
              className="text-gray-900 no-underline"
            >
              À Propos
            </Link>
          </li>
          <li>
            <Link
              onClick={handleClick}
              to="/support"
              className="text-[#00adef] no-underline flex items-center gap-2"
            >
              <FaHeadset /> Support
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <li>
                  <Link
                    onClick={handleClick}
                    to="/admin-dashboard"
                    className="bg-[#00adef] text-white px-10 py-4 rounded-3xl no-underline flex items-center gap-2"
                  >
                    <FaTachometerAlt /> Admin Dashboard
                  </Link>
                </li>
              )}
              <li className="text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-[#00adef] text-white flex items-center justify-center text-2xl">
                    {userInitial}
                  </div>
                  <div>
                    <p className="text-gray-900 text-lg font-black">
                      {authUser?.name}
                    </p>
                    <p className="text-gray-500 text-sm font-medium">
                      {authUser?.email}
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                  }}
                  className="bg-red-600 text-white px-10 py-4 rounded-3xl no-underline flex items-center gap-2"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  onClick={handleClick}
                  to="/login"
                  className="text-gray-900 no-underline"
                >
                  Se connecter
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleClick}
                  to="/register"
                  className="bg-[#00adef] text-white px-10 py-4 rounded-3xl no-underline"
                >
                  S'inscrire
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
