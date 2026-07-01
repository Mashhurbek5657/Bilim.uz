import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogOut, Edit2, Save, X } from "lucide-react";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        toast.error("Iltimos avval kiring");
        navigate("/login");
        return;
      }

      const userData = JSON.parse(storedUser);
      setUser(userData);
      setEditData(userData);
    } catch (error) {
      console.error("Xato:", error);
      navigate("/login");
    }

    setLoading(false);
  }, [navigate]);

  const updateProfile = () => {
    if (!user) return;

    setUser(editData);
    localStorage.setItem("user", JSON.stringify(editData));
    setIsEditing(false);
    toast.success("✅ Profil yangilandi!");
  };

  const logout = () => {
    localStorage.clear();
    toast.success("👋 Salom!");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090B2A]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090B2A]">
        <div className="text-white text-xl">Foydalanuvchi topilmadi</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#090B2A] to-[#1a1e3f] p-4 md:p-8 mt-[40px]">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Profil</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <LogOut size={18} />
            Chiqish
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-[#10133A] border border-purple-500/40 rounded-2xl p-6 md:p-8 shadow-xl">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="text-[#A6AECD] text-sm block mb-2">Ism</label>
                  <input
                    type="text"
                    value={editData.name || ""}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full bg-[#090B2A] border border-[#273066] rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="text-[#A6AECD] text-sm block mb-2">Familiya</label>
                  <input
                    type="text"
                    value={editData.surname || ""}
                    onChange={(e) => setEditData({ ...editData, surname: e.target.value })}
                    className="w-full bg-[#090B2A] border border-[#273066] rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 transition"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="text-center border-b border-[#273066] pb-4">
                  <p className="text-[#A6AECD] text-sm">Ism</p>
                  <p className="text-white text-xl font-semibold">{user.name}</p>
                </div>

                <div className="text-center border-b border-[#273066] pb-4">
                  <p className="text-[#A6AECD] text-sm">Familiya</p>
                  <p className="text-white text-xl font-semibold">{user.surname}</p>
                </div>
              </>
            )}

            <div className="text-center border-b border-[#273066] pb-4">
              <p className="text-[#A6AECD] text-sm">Email</p>
              <p className="text-white text-lg break-all">{user.email}</p>
            </div>

            <div className="text-center border-b border-[#273066] pb-4">
              <p className="text-[#A6AECD] text-sm">Sinf</p>
              <p className="text-white text-lg font-semibold">{user.className}-sinf</p>
            </div>

            <div className="text-center bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-lg py-4">
              <p className="text-[#A6AECD] text-sm">XP Ochkolar</p>
              <p className="text-cyan-400 text-3xl font-bold">{user.xp || 0} ⭐</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            {isEditing ? (
              <>
                <button
                  onClick={updateProfile}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition font-semibold"
                >
                  <Save size={18} />
                  Saqlash
                </button>

                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData(user);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition font-semibold"
                >
                  <X size={18} />
                  Bekor qilish
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white py-3 rounded-lg transition font-semibold"
              >
                <Edit2 size={18} />
                Tahrirlash
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-[#10133A] border border-purple-500/40 rounded-lg p-4 text-center">
            <p className="text-[#A6AECD] text-xs md:text-sm">Foydalanuvchi ID</p>
            <p className="text-white font-bold text-sm md:text-lg mt-2">{user.id}</p>
          </div>

          <div className="bg-[#10133A] border border-purple-500/40 rounded-lg p-4 text-center">
            <p className="text-[#A6AECD] text-xs md:text-sm">Ro'yxatdan o'tgan</p>
            <p className="text-green-400 font-bold text-lg md:text-2xl mt-2">✅</p>
          </div>

          <div className="bg-[#10133A] border border-purple-500/40 rounded-lg p-4 text-center">
            <p className="text-[#A6AECD] text-xs md:text-sm">Status</p>
            <p className="text-green-400 font-bold text-sm md:text-lg mt-2">Faol 🟢</p>
          </div>
        </div>
      </div>
    </div>
  );
}