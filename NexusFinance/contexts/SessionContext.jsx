import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../services/api";
import { obterToken, removerToken, salvarToken } from "../services/session";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function restaurarSessao() {
      const savedToken = await obterToken();
      if (!savedToken) {
        setCarregando(false);
        return;
      }
      try {
        const response = await apiRequest("/auth/sessao", {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        setToken(savedToken);
        setUsuario(response.usuario);
      } catch {
        await removerToken();
      } finally {
        setCarregando(false);
      }
    }
    restaurarSessao();
  }, []);

  async function iniciarSessao(newToken, user) {
    await salvarToken(newToken);
    setToken(newToken);
    setUsuario(user);
  }

  async function encerrarSessao() {
    await removerToken();
    setToken(null);
    setUsuario(null);
  }

  const value = useMemo(() => ({
    token,
    usuario,
    carregando,
    autenticado: Boolean(token),
    iniciarSessao,
    encerrarSessao,
    setUsuario,
  }), [token, usuario, carregando]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession deve ser usado dentro de SessionProvider.");
  return context;
}
