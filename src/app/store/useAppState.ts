"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AppState, Project } from "@/shared/types";
import { initialAppState } from "@/entities/project";

export const useAppState = () => {
  const [state, setState] = useState<AppState>(initialAppState);

  const activeProject = state.projects.find((p) => p.id === state.activeProjectId)!;

  const setActiveProjectId = (id: string) =>
    setState((prev) => ({ ...prev, activeProjectId: id }));

  const updateActiveProject = (updater: (p: Project) => Project) =>
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === prev.activeProjectId ? updater(p) : p
      ),
    }));

  const addProject = (title: string, color: string) => {
    const id = uuidv4();
    const project: Project = {
      id,
      title,
      color,
      columns: [
        { id: uuidv4(), title: "To Do",       cardIds: [] },
        { id: uuidv4(), title: "In Progress", cardIds: [] },
        { id: uuidv4(), title: "Done",        cardIds: [] },
      ],
      cards: {},
    };
    setState((prev) => ({
      projects: [...prev.projects, project],
      activeProjectId: id,
    }));
  };

  const renameProject = (id: string, title: string) =>
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, title } : p)),
    }));

  const deleteProject = (id: string) =>
    setState((prev) => {
      const remaining = prev.projects.filter((p) => p.id !== id);
      return {
        projects: remaining,
        activeProjectId:
          prev.activeProjectId === id ? remaining[0].id : prev.activeProjectId,
      };
    });

  return {
    state,
    activeProject,
    setActiveProjectId,
    updateActiveProject,
    addProject,
    renameProject,
    deleteProject,
  };
}
