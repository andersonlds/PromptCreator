"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react";
import { Notification, NotificationType } from "@/types/prompt";

interface ToastProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

const icons: Record<NotificationType, any> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const styles: Record<NotificationType, string> = {
  success: "border-emerald-500/50 bg-emerald-500/10 text-emerald-200 shadow-emerald-500/10",
  error: "border-rose-500/50 bg-rose-500/10 text-rose-200 shadow-rose-500/10",
  warning: "border-amber-500/50 bg-amber-500/10 text-amber-200 shadow-amber-500/10",
  info: "border-indigo-500/50 bg-indigo-500/10 text-indigo-200 shadow-indigo-500/10",
};

export default function Toast({ notifications, onClose }: ToastProps) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => {
          const Icon = icons[n.type];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              layout
              className={`pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-md shadow-2xl ${styles[n.type]}`}
            >
              <div className="mt-0.5">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-sm font-medium leading-relaxed">
                {n.message}
              </div>
              <button
                onClick={() => onClose(n.id)}
                className="mt-0.5 opacity-50 hover:opacity-100 transition-opacity"
                aria-label="Fechar notificação"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
