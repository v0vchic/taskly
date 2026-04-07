"use client";

import { useState } from "react";
import { useAppState } from "./store";
import { Sidebar } from "@/features/sidebar";
import { BoardHeader, BoardCanvas } from "@/widgets/board";

export const App = () => {
  const {
    state,
    activeProject,
    setActiveProjectId,
    updateActiveProject,
    addProject,
    renameProject,
    deleteProject,
  } = useAppState();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const bgGradient = `linear-gradient(135deg, ${activeProject.color}bb 0%, ${activeProject.color}44 50%, #1e1b4b 100%)`;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        projects={state.projects}
        activeProjectId={state.activeProjectId}
        collapsed={sidebarCollapsed}
        onSelectProject={setActiveProjectId}
        onAddProject={addProject}
        onRenameProject={renameProject}
        onDeleteProject={deleteProject}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />

      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ background: bgGradient }}
      >
        <BoardHeader
          project={activeProject}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
          onRename={(title) => renameProject(activeProject.id, title)}
        />

        <BoardCanvas
          project={activeProject}
          onUpdateProject={updateActiveProject}
        />
      </div>
    </div>
  );
}
