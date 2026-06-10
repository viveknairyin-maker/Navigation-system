import { create } from 'zustand';
import { NavigationState, Route, FloorId } from '../types';

export const useNavigationStore = create<NavigationState>((set) => ({
  from: null,
  to: null,
  route: null,
  currentFloor: 'ground',
  currentStepIndex: 0,
  animationPhase: 'idle',

  setFrom: (id) => set({ from: id }),
  setTo: (id) => set({ to: id }),
  setRoute: (route) =>
    set({
      route,
      currentFloor: route ? route.from.floor : 'ground',
      currentStepIndex: 0,
      animationPhase: route ? 'animating' : 'idle',
    }),
  setCurrentFloor: (floor) => set({ currentFloor: floor }),
  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),

  nextStep: () =>
    set((state) => {
      if (!state.route) return {};
      const nextIndex = state.currentStepIndex + 1;
      if (nextIndex >= state.route.steps.length) {
        return { animationPhase: 'complete' };
      }
      const step = state.route.steps[nextIndex];
      return {
        currentStepIndex: nextIndex,
        currentFloor: step.floor,
        animationPhase: 'animating',
      };
    }),

  prevStep: () =>
    set((state) => {
      if (!state.route) return {};
      const prevIndex = state.currentStepIndex - 1;
      if (prevIndex < 0) return {};
      const step = state.route.steps[prevIndex];
      return {
        currentStepIndex: prevIndex,
        currentFloor: step.floor,
        animationPhase: 'animating',
      };
    }),

  reset: () =>
    set({
      from: null,
      to: null,
      route: null,
      currentFloor: 'ground',
      currentStepIndex: 0,
      animationPhase: 'idle',
    }),
}));
