import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import type { Project, Component, BmadTrace } from '../db/schema';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Current Project
  currentProject: Project | null;
  projects: Project[];
  
  // Component Library
  components: Component[];
  selectedComponent: Component | null;
  
  // BMAD Performance Data
  bmadTraces: BmadTrace[];
  performanceBaseline: Record<string, number>;
  
  // Loading States
  loading: {
    projects: boolean;
    components: boolean;
    traces: boolean;
  };
  
  // Error State
  error: string | null;
}

interface AppActions {
  // UI Actions
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Project Actions
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  
  // Component Actions
  setComponents: (components: Component[]) => void;
  addComponent: (component: Component) => void;
  setSelectedComponent: (component: Component | null) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  
  // BMAD Actions
  setBmadTraces: (traces: BmadTrace[]) => void;
  addBmadTrace: (trace: BmadTrace) => void;
  setPerformanceBaseline: (baseline: Record<string, number>) => void;
  
  // Loading Actions
  setLoading: (key: keyof AppState['loading'], loading: boolean) => void;
  
  // Error Actions
  setError: (error: string | null) => void;
  
  // Reset Actions
  reset: () => void;
}

const initialState: AppState = {
  sidebarOpen: true,
  theme: 'dark',
  currentProject: null,
  projects: [],
  components: [],
  selectedComponent: null,
  bmadTraces: [],
  performanceBaseline: {},
  loading: {
    projects: false,
    components: false,
    traces: false,
  },
  error: null,
};

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    immer((set) => ({
      ...initialState,
      
      // UI Actions
      setSidebarOpen: (open) => set((state) => {
        state.sidebarOpen = open;
      }),
      
      setTheme: (theme) => set((state) => {
        state.theme = theme;
      }),
      
      // Project Actions
      setCurrentProject: (project) => set((state) => {
        state.currentProject = project;
      }),
      
      setProjects: (projects) => set((state) => {
        state.projects = projects;
      }),
      
      addProject: (project) => set((state) => {
        state.projects.push(project);
      }),
      
      updateProject: (id, updates) => set((state) => {
        const index = state.projects.findIndex(p => p.id === id);
        if (index !== -1) {
          Object.assign(state.projects[index], updates);
        }
        if (state.currentProject?.id === id) {
          Object.assign(state.currentProject, updates);
        }
      }),
      
      // Component Actions
      setComponents: (components) => set((state) => {
        state.components = components;
      }),
      
      addComponent: (component) => set((state) => {
        state.components.push(component);
      }),
      
      setSelectedComponent: (component) => set((state) => {
        state.selectedComponent = component;
      }),
      
      updateComponent: (id, updates) => set((state) => {
        const index = state.components.findIndex(c => c.id === id);
        if (index !== -1) {
          Object.assign(state.components[index], updates);
        }
        if (state.selectedComponent?.id === id) {
          Object.assign(state.selectedComponent, updates);
        }
      }),
      
      // BMAD Actions
      setBmadTraces: (traces) => set((state) => {
        state.bmadTraces = traces;
      }),
      
      addBmadTrace: (trace) => set((state) => {
        state.bmadTraces.push(trace);
      }),
      
      setPerformanceBaseline: (baseline) => set((state) => {
        state.performanceBaseline = baseline;
      }),
      
      // Loading Actions
      setLoading: (key, loading) => set((state) => {
        state.loading[key] = loading;
      }),
      
      // Error Actions
      setError: (error) => set((state) => {
        state.error = error;
      }),
      
      // Reset Actions
      reset: () => set(() => ({ ...initialState })),
    })),
    {
      name: 'imo-creator-store',
    }
  )
);