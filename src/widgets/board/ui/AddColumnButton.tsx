"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface AddColumnButtonProps {
  onAdd: (title: string) => void;
}

export const AddColumnButton = ({ onAdd }: AddColumnButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex-shrink-0 w-72 flex items-center gap-2.5 text-sm text-white/70
          hover:text-white rounded-2xl px-4 py-3.5 transition-all hover:bg-white/10"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <Plus className="w-4 h-4" />
        Add another list
      </button>
    );
  }

  return (
    <div
      className="flex-shrink-0 w-72 rounded-2xl p-4 space-y-3"
      style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
    >
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") { setIsOpen(false); setValue(""); }
        }}
        placeholder="Column name..."
        className="w-full text-sm text-slate-800 bg-white rounded-xl px-3 py-2.5
          outline-none focus:ring-2 focus:ring-white/50 placeholder-slate-400"
      />
      <div className="flex gap-2">
        <button
          onClick={submit}
          className="flex-1 bg-white text-slate-700 text-sm font-semibold py-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Add column
        </button>
        <button
          onClick={() => { setIsOpen(false); setValue(""); }}
          className="px-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-sm"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
