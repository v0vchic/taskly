"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { PROJECT_COLORS } from "@/shared/constants";

interface AddProjectFormProps {
  onAdd: (title: string, color: string) => void;
}

export const AddProjectForm = ({ onAdd }: AddProjectFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState<string>(PROJECT_COLORS[0]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (isOpen) inputRef.current?.focus(); }, [isOpen]);

  const submit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), color);
    setTitle("");
    setColor(PROJECT_COLORS[0]);
    setIsOpen(false);
  };

  const cancel = () => { setTitle(""); setIsOpen(false); };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-2 px-2 py-2 rounded-xl
          hover:bg-white/10 text-white/40 hover:text-white/70 transition-all"
      >
        <Plus className="w-4 h-4 flex-shrink-0" />
        <span className="text-xs font-medium">New project</span>
      </button>
    );
  }

  return (
    <div className="space-y-2 px-1">
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") cancel();
        }}
        placeholder="Project name..."
        className="w-full text-xs text-white bg-white/10 border border-white/20 rounded-lg
          px-2.5 py-2 outline-none focus:border-white/40 placeholder-white/30"
      />

      <div className="flex gap-1.5 flex-wrap">
        {PROJECT_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className="w-5 h-5 rounded-full transition-transform hover:scale-110 flex-shrink-0"
            style={{
              backgroundColor: c,
              outline: color === c ? `2px solid ${c}` : "none",
              outlineOffset: "2px",
            }}
          />
        ))}
      </div>

      <div className="flex gap-1.5">
        <button
          onClick={submit}
          disabled={!title.trim()}
          className="flex-1 text-xs font-semibold py-1.5 rounded-lg transition-colors disabled:opacity-40 text-white"
          style={{ background: color }}
        >
          Create
        </button>
        <button
          onClick={cancel}
          className="px-2 text-xs text-white/40 hover:text-white/70 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
