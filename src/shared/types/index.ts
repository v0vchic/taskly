export type CardLabel = {
  id: string;
  text: string;
  color: string;
};

export type Card = {
  id: string;
  title: string;
  description?: string;
  labels?: CardLabel[];
  dueDate?: string;
  columnId: string;
};

export type Column = {
  id: string;
  title: string;
  cardIds: string[];
};

export type Project = {
  id: string;
  title: string;
  color: string;
  columns: Column[];
  cards: Record<string, Card>;
};

export type AppState = {
  projects: Project[];
  activeProjectId: string;
};
