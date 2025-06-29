import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Typed hooks for Redux store
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for specific feature areas
export const useAuth = () => {
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  return {
    ...auth,
    dispatch,
  };
};

export const useUI = () => {
  const ui = useAppSelector(state => state.ui);
  const dispatch = useAppDispatch();
  
  return {
    ...ui,
    dispatch,
  };
};

export const useProjects = () => {
  const projects = useAppSelector(state => state.projects);
  const dispatch = useAppDispatch();
  
  return {
    ...projects,
    dispatch,
  };
};

export const useTasks = () => {
  const tasks = useAppSelector(state => state.tasks);
  const dispatch = useAppDispatch();
  
  return {
    ...tasks,
    dispatch,
  };
};

export const useNotifications = () => {
  const notifications = useAppSelector(state => state.notifications);
  const dispatch = useAppDispatch();
  
  return {
    ...notifications,
    dispatch,
  };
};