"use client";

import { useState, useEffect } from "react";
import { Card, CardLabel } from "@/shared/types";
import { LABEL_COLORS } from "@/shared/constants";
import { X, Trash2, Tag, AlignLeft, Calendar } from "lucide-react";

interface CardModalProps {
  card: Card;
  onClose: () => void;
  onSave: (updated: Card) => void;
  onDelete: (cardId: string) => void;
}

export const CardModal = ({ card, onClose, onSave, onDelete }: CardModalProps) => {
  const [title, setTitle]           = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [dueDate, setDueDate]       = useState(card.dueDate || "");
  const [labels, setLabels]         = useState<CardLabel[]>(card.labels || []);
  const [newLabelText, setNewLabelText] = useState("");
  const [newLabelColor, setNewLabelColor] = useState<string>(LABEL_COLORS[0]);
  const [showLabelInput, setShowLabelInput] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ ...card, title: title.trim(), description, dueDate, labels });
    onClose();
  };

  const addLabel = () => {
    if (!newLabelText.trim()) return;
    setLabels((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newLabelText.trim(), color: newLabelColor },
    ]);
    setNewLabelText("");
    setShowLabelInput(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Edit Card</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
              placeholder="Card title..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5" /> Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full text-sm text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-300 resize-none transition-shadow placeholder-slate-400"
              placeholder="Add a description..."
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full text-sm text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow"
            />
          </div>

          {/* Labels */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Labels
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {labels.map((label) => (
                <span
                  key={label.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: label.color }}
                >
                  {label.text}
                  <button onClick={() => setLabels((prev) => prev.filter((l) => l.id !== label.id))} className="hover:opacity-70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {showLabelInput ? (
              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  autoFocus
                  value={newLabelText}
                  onChange={(e) => setNewLabelText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addLabel(); }}
                  placeholder="Label text..."
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                />
                <div className="flex gap-2 flex-wrap">
                  {LABEL_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewLabelColor(color)}
                      className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color,
                        outline: newLabelColor === color ? `2px solid ${color}` : "none",
                        outlineOffset: "2px",
                      }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={addLabel} className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors">
                    Add
                  </button>
                  <button onClick={() => setShowLabelInput(false)} className="px-3 text-xs text-slate-500 hover:bg-slate-200 rounded-lg transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowLabelInput(true)} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
                + Add label
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={() => { onDelete(card.id); onClose(); }}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-xl transition-colors font-medium">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl transition-colors font-semibold"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
