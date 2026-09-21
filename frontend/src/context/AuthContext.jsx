import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('jp_token')));
  useEffect(() => {
    if (!localStorage.getItem('jp_token')) return;
    api.me().then(setUser).catch(() => { localStorage.removeItem('jp_token'); }).finally(() => setLoading(false));
  }, []);
  const login = async (credentials) => { const result = await api.login(credentials); localStorage.setItem('jp_token', result.token); setUser(result.user); return result; };
  const register = async (data) => { const result = await api.register(data); localStorage.setItem('jp_token', result.token); setUser(result.user); return result; };
  const logout = () => { localStorage.removeItem('jp_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
