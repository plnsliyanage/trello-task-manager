"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Kanban,
  Plus,
  LogOut,
  ShieldCheck,
  User,
  Sparkles,
} from "lucide-react";

export default function Navbar({ onNewTask }) {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/85 px-4 py-3.5 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1700px] items-center justify-between gap-4">
        {/* Brand Section */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Logo */}
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20">
            <Kanban className="h-5 w-5" />

            {/* Small status indicator */}
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          </div>

          {/* Brand Information */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                FlowBoard
              </h1>

              {user && (
                <span
                  className={`hidden items-center gap-1 rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider sm:inline-flex ${
                    user.role === "admin"
                      ? "border-purple-200 bg-purple-50 text-purple-700"
                      : "border-indigo-200 bg-indigo-50 text-indigo-700"
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
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-indigo-400" />

                <p className="truncate text-[11px] font-medium text-slate-400 sm:text-xs">
                  Signed in as{" "}
                  <span className="font-semibold text-slate-600">
                    @{user.username}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Section */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* New Task */}
          <button
            onClick={onNewTask}
            className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg hover:shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:translate-y-0 sm:px-4 sm:text-sm"
          >
            <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            <span>New Task</span>
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="group inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 active:scale-95 sm:px-3.5 sm:text-sm"
          >
            <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
