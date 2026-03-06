/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getUserMe, userLogin as apiUserLogin, userLogout as apiUserLogout, registerUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      // Skip the network call if we have no stored token (avoids a guaranteed 401)
      const storedToken = localStorage.getItem('bh_token');
      if (!storedToken) {
        setAuthLoading(false);
        return;
      }
      try {
        const me = await getUserMe();
        setUser(me);
      } catch {
        setUser(null);
        localStorage.removeItem('bh_token');
      } finally {
        setAuthLoading(false);
      }
    };
    restore();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiUserLogin(email, password);
    setUser(data.user);
    if (data.token) localStorage.setItem('bh_token', data.token);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await registerUser(name, email, password);
    setUser(data.user);
    if (data.token) localStorage.setItem('bh_token', data.token);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await apiUserLogout();
    setUser(null);
    localStorage.removeItem('bh_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
