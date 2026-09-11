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
      <div className="relative flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-200 overflow-hidden">
        {/* Decorative background glow elements */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center p-8 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl shadow-indigo-950/50">
          <div className="relative flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/30 mb-6">
            <LayoutDashboard className="h-8 w-8 text-white animate-pulse" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <div className="flex items-center gap-3 text-white font-semibold text-lg tracking-tight mb-2">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
            <span>Loading workspace</span>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            Preparing your boards and tasks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-slate-100/80 to-slate-200/50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Subtle ambient lighting effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl pointer-events-none" />

      <Navbar onNewTask={() => setIsModalOpen(true)} />

      <main className="flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex flex-col">
        {/* Optional decorative page header banner for an executive dashboard look */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase mb-2 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" /> Workspace Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Task Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your workflow, track progress, and organize your daily
              objectives.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-xl shadow-slate-200/50 p-4 sm:p-6 overflow-hidden">
          <KanbanBoard refreshTrigger={refreshTrigger} />
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  );
}
