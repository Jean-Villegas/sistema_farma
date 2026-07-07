import { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, fetchMe, setView, clearError, clearSuccess } from '../features/auth/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.auth);
  const { user, loading, error, success, isAuthenticated, view, initializing } = state;
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current && initializing) {
      fetchedRef.current = true;
      dispatch(fetchMe());
    }
  }, [dispatch, initializing]);

  const login = useCallback((username, password) => dispatch(loginUser({ username, password })), [dispatch]);
  const register = useCallback((data) => dispatch(registerUser(data)), [dispatch]);
  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);
  const navigate = useCallback((v) => dispatch(setView(v)), [dispatch]);
  const resetError = useCallback(() => dispatch(clearError()), [dispatch]);
  const resetSuccess = useCallback(() => dispatch(clearSuccess()), [dispatch]);

  return { user, loading, error, success, isAuthenticated, view, initializing, login, register, logout, navigate, resetError, resetSuccess };
}
