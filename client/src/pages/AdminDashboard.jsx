import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaUsers,
  FaShieldAlt,
  FaUserTie,
  FaPlus,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import {
  createUser,
  deleteUserById,
  fetchUsers,
  updateUserById,
} from "../api/users";
import { getStoredUser, notifyAuthChange } from "../api/auth";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const authUser = getStoredUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingUserId, setEditingUserId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const isAdmin = authUser?.role === "admin";

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchUsers();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    let isMounted = true;

    const initializeUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchUsers();

        if (isMounted) {
          setUsers(data.users || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeUsers();

    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((user) => user.role === "admin").length;
    const customers = users.filter((user) => user.role === "customer").length;

    return { total, admins, customers };
  }, [users]);

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    try {
      setDeletingId(userId);
      await deleteUserById(userId);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId("");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", role: "customer" });
    setEditingUserId("");
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "customer",
    });
    setError("");
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      (!editingUserId && !formData.password)
    ) {
      setError("Name, email and password are required for a new user.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (editingUserId) {
        const updated = await updateUserById(editingUserId, payload);

        const currentUser = getStoredUser();
        const currentUserId = currentUser?._id || currentUser?.id;

        if (
          currentUserId &&
          currentUserId.toString() === editingUserId.toString()
        ) {
          const nextStoredUser = {
            ...currentUser,
            ...updated.user,
            _id: updated.user?._id || updated.user?.id || currentUserId,
            id: updated.user?.id || updated.user?._id || currentUserId,
          };

          localStorage.setItem("autoclickUser", JSON.stringify(nextStoredUser));
          notifyAuthChange();
        }
      } else {
        await createUser(payload);
      }

      resetForm();
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-10 max-w-xl w-full text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-4">
            Admin access required
          </h1>
          <p className="text-gray-500 font-medium mb-6">
            Please login as an admin user to open the dashboard.
          </p>
          <Link
            to="/login"
            className="inline-flex bg-[#00adef] text-white px-8 py-3 rounded-2xl font-black no-underline"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-10 max-w-xl w-full text-center">
          <FaShieldAlt className="text-5xl text-[#00adef] mx-auto mb-4" />
          <h1 className="text-3xl font-black text-gray-900 mb-4">
            Access denied
          </h1>
          <p className="text-gray-500 font-medium mb-6">
            This dashboard is only available for admin accounts.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex bg-gray-900 text-white px-8 py-3 rounded-2xl font-black"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-[3rem] shadow-xl p-8 md:p-10 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-[#00adef] font-black uppercase tracking-[0.2em] text-sm mb-2">
                Admin dashboard
              </p>
              <h1 className="text-4xl font-black text-gray-900">
                Manage users
              </h1>
              <p className="text-gray-500 font-medium mt-2">
                Review accounts and remove users when needed.
              </p>
            </div>
            <div className="flex items-center gap-3 text-gray-700 font-black bg-gray-50 px-4 py-3 rounded-2xl">
              <FaUserTie className="text-[#00adef]" />
              {authUser.name}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-xl p-8 md:p-10 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            {editingUserId ? (
              <FaEdit className="text-[#00adef]" />
            ) : (
              <FaPlus className="text-[#00adef]" />
            )}
            <h2 className="text-2xl font-black text-gray-900">
              {editingUserId ? "Edit user" : "Create user"}
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Full name"
              className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Email"
              className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              placeholder={
                editingUserId ? "New password (optional)" : "Password"
              }
              className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none"
            >
              <option value="customer">customer</option>
              <option value="garageOwner">garageOwner</option>
              <option value="admin">admin</option>
            </select>

            {error && (
              <p className="md:col-span-2 text-red-500 font-bold">{error}</p>
            )}

            <div className="md:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#00adef] text-white px-6 py-3 rounded-2xl font-black disabled:opacity-60"
              >
                <FaSave />{" "}
                {saving
                  ? "Saving..."
                  : editingUserId
                    ? "Update user"
                    : "Create user"}
              </button>
              {editingUserId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-900 px-6 py-3 rounded-2xl font-black"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[2.5rem] shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 text-gray-500 font-bold mb-3">
              <FaUsers className="text-[#00adef]" /> Total users
            </div>
            <p className="text-4xl font-black text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-[2.5rem] shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 text-gray-500 font-bold mb-3">
              <FaShieldAlt className="text-[#00adef]" /> Admins
            </div>
            <p className="text-4xl font-black text-gray-900">{stats.admins}</p>
          </div>
          <div className="bg-white rounded-[2.5rem] shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 text-gray-500 font-bold mb-3">
              <FaUserTie className="text-[#00adef]" /> Customers
            </div>
            <p className="text-4xl font-black text-gray-900">
              {stats.customers}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Users list</h2>
              <p className="text-gray-500 font-medium">
                Delete accounts directly from the dashboard.
              </p>
            </div>
            <button
              type="button"
              onClick={loadUsers}
              className="bg-[#00adef] text-white px-5 py-3 rounded-2xl font-black"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-gray-500 font-medium">
              Loading users...
            </div>
          ) : error ? (
            <div className="p-8 text-red-500 font-bold">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-sm">
                  <tr>
                    <th className="px-8 py-4">Name</th>
                    <th className="px-8 py-4">Email</th>
                    <th className="px-8 py-4">Role</th>
                    <th className="px-8 py-4">Created</th>
                    <th className="px-8 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-8 py-5 font-black text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-8 py-5 text-gray-600">{user.email}</td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black ${user.role === "admin" ? "bg-[#00adef]/10 text-[#00adef]" : "bg-gray-100 text-gray-600"}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-gray-600">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(user)}
                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-2xl font-black"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user._id)}
                            disabled={deletingId === user._id}
                            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-2xl font-black disabled:opacity-60"
                          >
                            <FaTrash />{" "}
                            {deletingId === user._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
