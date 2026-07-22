import { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser, fetchMe, clearError, clearSuccess } from '../features/auth/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const routerNavigate = useNavigate();
  const state = useSelector((s) => s.auth);
  const { user, loading, error, success, isAuthenticated, initializing } = state;
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current && initializing) {
      fetchedRef.current = true;
      dispatch(fetchMe());
    }
  }, [dispatch, initializing]);

  const login = useCallback(async (username, password) => {
    const result = await dispatch(loginUser({ username, password }));
    if (loginUser.fulfilled.match(result)) {
      routerNavigate('/dashboard', { replace: true });
    }
    return result;
  }, [dispatch, routerNavigate]);

  const register = useCallback((data) => dispatch(registerUser(data)), [dispatch]);

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
    routerNavigate('/login', { replace: true });
  }, [dispatch, routerNavigate]);

  const navigate = useCallback((path) => {
    const to = path.startsWith('/') ? path : `/${path}`;
    routerNavigate(to);
  }, [routerNavigate]);

  const resetError = useCallback(() => dispatch(clearError()), [dispatch]);
  const resetSuccess = useCallback(() => dispatch(clearSuccess()), [dispatch]);

  return {
    user,
    loading,
    error,
    success,
    isAuthenticated,
    initializing,
    login,
    register,
    logout,
    navigate,
    resetError,
    resetSuccess,
  };
}
