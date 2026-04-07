import { AppState } from "@/shared/types";

export const initialAppState: AppState = {
  activeProjectId: "board-1",
  projects: [
    {
      id: "board-1",
      title: "My Project Board",
      color: "#6366f1",
      columns: [
        { id: "col-1", title: "Backlog",      cardIds: ["card-1", "card-2", "card-3"] },
        { id: "col-2", title: "In Progress",  cardIds: ["card-4", "card-5"] },
        { id: "col-3", title: "Review",       cardIds: ["card-6"] },
        { id: "col-4", title: "Done",         cardIds: ["card-7", "card-8"] },
      ],
      cards: {
        "card-1": { id: "card-1", title: "Research competitors",     description: "Analyze top 5 competitors", columnId: "col-1", labels: [{ id: "l1", text: "Research", color: "#6366f1" }] },
        "card-2": { id: "card-2", title: "Define project scope",                                               columnId: "col-1", labels: [{ id: "l2", text: "Planning", color: "#f59e0b" }] },
        "card-3": { id: "card-3", title: "Set up CI/CD pipeline",   description: "Configure GitHub Actions",  columnId: "col-1", labels: [{ id: "l3", text: "DevOps",   color: "#10b981" }] },
        "card-4": { id: "card-4", title: "Design system components", description: "Reusable component library",columnId: "col-2", labels: [{ id: "l4", text: "Design",   color: "#ec4899" }] },
        "card-5": { id: "card-5", title: "API integration",                                                    columnId: "col-2", labels: [{ id: "l5", text: "Backend",  color: "#8b5cf6" }] },
        "card-6": { id: "card-6", title: "User authentication flow", description: "Review OAuth2 security",   columnId: "col-3", labels: [{ id: "l6", text: "Security", color: "#ef4444" }] },
        "card-7": { id: "card-7", title: "Landing page redesign",                                              columnId: "col-4", labels: [{ id: "l7", text: "Design",   color: "#ec4899" }] },
        "card-8": { id: "card-8", title: "Database schema",                                                    columnId: "col-4", labels: [{ id: "l8", text: "Backend",  color: "#8b5cf6" }] },
      },
    },
    {
      id: "board-2",
      title: "Marketing Campaign",
      color: "#f59e0b",
      columns: [
        { id: "col-m1", title: "Ideas",       cardIds: ["card-m1", "card-m2"] },
        { id: "col-m2", title: "In Progress", cardIds: ["card-m3"] },
        { id: "col-m3", title: "Done",        cardIds: ["card-m4"] },
      ],
      cards: {
        "card-m1": { id: "card-m1", title: "Q2 social media strategy", columnId: "col-m1", labels: [{ id: "lm1", text: "Social",  color: "#f59e0b" }] },
        "card-m2": { id: "card-m2", title: "Newsletter template",       columnId: "col-m1", labels: [{ id: "lm2", text: "Content", color: "#10b981" }] },
        "card-m3": { id: "card-m3", title: "Product launch event",      description: "Plan Q2 launch event", columnId: "col-m2", labels: [{ id: "lm3", text: "Event",   color: "#6366f1" }] },
        "card-m4": { id: "card-m4", title: "Brand guidelines v2",       columnId: "col-m3", labels: [{ id: "lm4", text: "Design",  color: "#ec4899" }] },
      },
    },
    {
      id: "board-3",
      title: "Design System",
      color: "#ec4899",
      columns: [
        { id: "col-d1", title: "Planned",  cardIds: ["card-d1", "card-d2"] },
        { id: "col-d2", title: "Building", cardIds: ["card-d3"] },
        { id: "col-d3", title: "Shipped",  cardIds: [] },
      ],
      cards: {
        "card-d1": { id: "card-d1", title: "Color token system", columnId: "col-d1", labels: [{ id: "ld1", text: "Tokens",    color: "#ec4899" }] },
        "card-d2": { id: "card-d2", title: "Dark mode support",  description: "Dark variants for all components", columnId: "col-d1", labels: [{ id: "ld2", text: "Theme",     color: "#8b5cf6" }] },
        "card-d3": { id: "card-d3", title: "Button component",   columnId: "col-d2", labels: [{ id: "ld3", text: "Component", color: "#6366f1" }] },
      },
    },
  ],
};
