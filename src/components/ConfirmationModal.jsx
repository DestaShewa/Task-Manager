import React from "react";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function ConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[60] p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-800 animate-slide-up">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl text-rose-600">
              <ExclamationTriangleIcon className="w-6 h-6" />
            </div>
            <button
              onClick={onCancel}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
