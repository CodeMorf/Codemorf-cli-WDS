import React from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Check,
  Trash2,
  Clock
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearNotification: (id: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearNotification
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-end p-4 pt-12"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#171922] border border-[#2d3242] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-xs animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-12 px-4 bg-[#1b1e28] border-b border-[#282d3c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-cyan-400" />
            <h3 className="font-semibold text-gray-100">Notificaciones</h3>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-mono">
              {notifications.filter(n => !n.read).length} nuevas
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] text-gray-400 hover:text-cyan-300 transition-colors"
            >
              Marcar leídas
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/5">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No tienes notificaciones pendientes
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  notif.read
                    ? 'bg-[#14151c] border-[#222634] opacity-75'
                    : 'bg-[#1b1f2b] border-cyan-800/40 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-1 rounded-lg shrink-0 mt-0.5">
                    {notif.type === 'success' && <CheckCircle2 size={15} className="text-emerald-400" />}
                    {notif.type === 'warning' && <AlertTriangle size={15} className="text-amber-400" />}
                    {notif.type === 'info' && <Info size={15} className="text-sky-400" />}
                    {notif.type === 'error' && <X size={15} className="text-rose-400" />}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-200 text-xs truncate">
                      {notif.title}
                    </div>
                    <div className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
                      {notif.message}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1 font-mono">
                      <Clock size={10} />
                      <span>{notif.time}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onClearNotification(notif.id)}
                  className="text-gray-500 hover:text-rose-400 p-1 transition-colors shrink-0"
                  title="Eliminar notificación"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
