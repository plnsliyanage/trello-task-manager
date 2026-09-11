"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import KanbanBoard from "@/components/KanbanBoard";
import TaskModal from "@/components/TaskModal";
import { LayoutDashboard, Sparkles, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-4 text-slate-200">
        {/* Background */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        {/* Loading Card */}
        <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
            <LayoutDashboard className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-xl font-bold text-white">FlowBoard</h1>

          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
            Task Management
          </p>

          <div className="mt-7 flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
            <span className="text-sm font-semibold text-slate-200">
              Loading workspace
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Preparing your boards and tasks...
          </p>

          <div className="mx-auto mt-6 h-1 w-32 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-50 text-slate-900">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute right-[-120px] top-1/4 h-96 w-96 rounded-full bg-violet-200/25 blur-3xl" />
        <div className="absolute bottom-[-150px] left-1/3 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      {/* Navbar */}
      <div className="relative z-30">
        <Navbar onNewTask={() => setIsModalOpen(true)} />
      </div>

      {/* Main Content */}
      <main className="relative z-10 mx-auto flex w-full max-w-[1700px] flex-1 flex-col px-3 py-5 sm:px-5 sm:py-7 md:px-7 lg:px-10 lg:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            {/* Status Badge */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Workspace Active
            </div>

            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 sm:flex">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  FlowBoard
                </h1>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                  Organize your work, track progress, and keep everything moving
                  forward.
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Status */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
              <Sparkles className="h-4 w-4 text-indigo-500" />

              <span className="text-xs font-semibold text-slate-600">
                Stay productive
              </span>
            </div>
          </div>
        </div>

        {/* Kanban Board Card */}
        <div className="relative flex min-h-[500px] flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/20 sm:rounded-3xl">
          {/* Board Header */}
          <div className="flex min-h-[60px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
            <div>
              <h2 className="text-sm font-bold text-slate-800 sm:text-base">
                My Workspace
              </h2>

              <p className="hidden text-xs text-slate-400 sm:block">
                Manage and organize your tasks
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Board
              </span>
            </div>
          </div>

          {/* Kanban */}
          <div className="flex-1 overflow-hidden p-3 sm:p-5 lg:p-6">
            <KanbanBoard refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  );
}
