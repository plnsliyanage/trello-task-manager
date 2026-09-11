"use client";
import { useAuth } from "@/context/AuthContext";
import { Kanban, Plus, LogOut, ShieldCheck, User } from "lucide-react";

export default function Navbar({ onNewTask }) {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
          <Kanban className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Trello Board
            </h1>
            {user && (
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                  user.role === "admin"
                    ? "bg-purple-500/10 text-purple-700 border-purple-200"
                    : "bg-indigo-500/10 text-indigo-700 border-indigo-200"
                }`}
              >
                {user.role === "admin" ? (
                  <ShieldCheck className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
                {user.role}
              </span>
            )}
          </div>
          {user?.username && (
            <p className="text-xs text-slate-500 font-medium">
              Signed in as{" "}
              <span className="text-slate-700 font-semibold">
                @{user.username}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onNewTask}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200/80 hover:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}
