"use client";
import { useAuth } from "@/context/AuthContext";

export default function Navbar({ onNewTask }) {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-800">Trello Board</h1>
        {user && (
          <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded uppercase">
            Role: {user.role}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onNewTask}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
        >
          + New Task
        </button>
        <button
          onClick={logout}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
