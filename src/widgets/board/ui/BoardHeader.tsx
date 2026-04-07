"use client";

import { useState, useRef, useEffect } from "react";
import { Project } from "@/shared/types";
import { PanelLeftOpen, PanelLeftClose, Check, X, Pencil } from "lucide-react";

interface BoardHeaderProps {
  project: Project;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onRename: (title: string) => void;
}

export const BoardHeader = ({
                              project,
                              sidebarCollapsed,
                              onToggleSidebar,
                              onRename,
                            }: BoardHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(project.title);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset title when switching projects
  // ✅ Only update state if it actually changed to prevent cascading renders
  useEffect(() => {
    if (project.title !== value) {
      setValue(project.title);
      setIsEditing(false);
    }
  }, [project.id, project.title, value]);

  // Focus input when editing
  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  // Confirm title change
  const confirm = () => {
    const trimmed = value.trim();
    if (trimmed) onRename(trimmed);
    else setValue(project.title);
    setIsEditing(false);
  };

  // Cancel editing
  const cancel = () => {
    setValue(project.title);
    setIsEditing(false);
  };

  return (
      <header
          className="flex items-center gap-3 px-4 flex-shrink-0"
          style={{
            height: "52px",
            background: "rgba(0,0,0,0.15)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
      >
        {/* Sidebar toggle */}
        <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors flex-shrink-0"
            title={sidebarCollapsed ? "Open sidebar" : "Close sidebar"}
        >
          {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
          ) : (
              <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        {/* Color accent */}
        <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: project.color }}
        />

        {/* Board title — fixed height, no layout shift */}
        <div className="flex items-center gap-2 flex-1 min-w-0" style={{ height: "32px" }}>
          {isEditing ? (
              <>
                <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirm();
                      if (e.key === "Escape") cancel();
                    }}
                    onBlur={confirm}
                    className="text-base font-bold text-white bg-white/10 border border-white/30
                rounded-lg px-2.5 h-full outline-none focus:border-white/60 min-w-0 max-w-xs"
                />
                <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      confirm();
                    }}
                    className="text-green-400 hover:text-green-300 flex-shrink-0"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      cancel();
                    }}
                    className="text-white/40 hover:text-white/70 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
          ) : (
              <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 group h-full"
              >
                <span className="text-base font-bold text-white tracking-tight">{project.title}</span>
                <Pencil className="w-3.5 h-3.5 text-white/0 group-hover:text-white/50 transition-colors" />
              </button>
          )}
        </div>
      </header>
  );
};