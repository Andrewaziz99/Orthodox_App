'use client';

import { useState, useEffect, useCallback } from 'react';
import { gsap } from '@/animations/gsap-config';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

// Global state for toasts
let toastListeners: ((toasts: ToastMessage[]) => void)[] = [];
let toasts: ToastMessage[] = [];

const notifyListeners = () => {
  toastListeners.forEach(listener => listener([...toasts]));
};

export const toast = {
  show: (message: string, type: ToastType = 'info', duration: number = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts.push({ id, message, type, duration });
    notifyListeners();
    
    if (duration > 0) {
      setTimeout(() => toast.hide(id), duration);
    }
  },
  success: (message: string, duration?: number) => toast.show(message, 'success', duration),
  error: (message: string, duration?: number) => toast.show(message, 'error', duration),
  info: (message: string, duration?: number) => toast.show(message, 'info', duration),
  hide: (id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    notifyListeners();
  }
};

export function ToastProvider() {
  const [activeToasts, setActiveToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastMessage[]) => {
      setActiveToasts(newToasts);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {activeToasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => toast.hide(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: ToastMessage, onClose: () => void }) {
  const itemRef = typeof window !== 'undefined' ? (el: HTMLDivElement | null) => {
    if (el) {
      gsap.fromTo(el, 
        { x: 50, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  } : null;

  const Icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  };
  const Icon = Icons[toast.type];

  return (
    <div 
      ref={itemRef}
      className={cn(
        "pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border min-w-[300px] max-w-md",
        toast.type === 'success' && "bg-emerald-50 border-emerald-100 text-emerald-800",
        toast.type === 'error' && "bg-rose-50 border-rose-100 text-rose-800",
        toast.type === 'info' && "bg-sky-50 border-sky-100 text-sky-800"
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <p className="text-[15px] font-bold flex-1">{toast.message}</p>
      <button 
        onClick={onClose}
        className="p-1 hover:bg-black/5 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 opacity-50" />
      </button>
    </div>
  );
}
